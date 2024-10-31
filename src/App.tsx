import { useState, useEffect, useRef } from 'react';
import './App.css';

let imageUrlList: string[] = [];

function App() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const imageIndexRef = useRef(0);
  const internvalIdRef = useRef<number>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://www.reddit.com/r/aww/top/.json?t=all'
      );
      if (!response.ok) {
        setError(true);
        return;
      }

      const jsonResponse = await response.json();
      imageUrlList = jsonResponse.data.children.map(
        (kid: any) => kid.data.thumbnail
      );
      if (imageUrlList.length == 0) {
        setError(true);
        return;
      }

      setLoading(false);
      setImageUrl(imageUrlList[imageIndexRef.current]);

      internvalIdRef.current = setInterval(() => {
        displayNextImage();
      }, 3000);

      return () => clearInterval(internvalIdRef.current);
    };
    fetchData();
  }, []);

  if (loading) return <h1>Loading</h1>;
  if (error) return <h1>Image loading error</h1>;

  function displayNextImage() {
    imageIndexRef.current =
      imageIndexRef.current === imageUrlList.length - 1
        ? 0
        : imageIndexRef.current + 1;
    setImageUrl(imageUrlList[imageIndexRef.current]);
  }

  function resetAutoRotate() {
    clearInterval(internvalIdRef.current);
    internvalIdRef.current = setInterval(() => {
      displayNextImage();
    }, 3000);
  }

  function handlePrev() {
    imageIndexRef.current = imageIndexRef.current
      ? imageIndexRef.current - 1
      : imageUrlList.length - 1;
    setImageUrl(imageUrlList[imageIndexRef.current]);
    resetAutoRotate();
  }

  function handleNext() {
    displayNextImage();
    resetAutoRotate();
  }

  return (
    <>
      <div>
        <img src={imageUrl} className="logo" alt="Vite logo" />
      </div>
      <button onClick={handlePrev}>Prev</button>
      <button onClick={handleNext}>Next</button>
    </>
  );
}

export default App;
