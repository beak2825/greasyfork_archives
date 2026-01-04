// ==UserScript==
// @name         Adds IMDb and YouTube icons
// @namespace    http://yournamespace.example.com
// @version      0.1
// @description  Adds IMDb ratings and YouTube trailers to Netflix movie cards, and uses a local cache to limit requests
// @author       Dunamis
// @match        https://www.netflix.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520843/Adds%20IMDb%20and%20YouTube%20icons.user.js
// @updateURL https://update.greasyfork.org/scripts/520843/Adds%20IMDb%20and%20YouTube%20icons.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  // Function to fetch IMDb rating for a movie title from the OMDb API
  const getMovieDetails = async (title, element, type) => {
    const cacheKey = `${type}_${title}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
      const { imdbRating, titleUrl } = JSON.parse(cachedData);
      createIcons(imdbRating, titleUrl, element);
    } else {
      try {
        const omdbApiKey = 'b37957d4'; // Consider storing your API key in a more secure way.
        const searchUrl = `https://www.omdbapi.com/?apikey=${omdbApiKey}&type=movie&t=${encodeURIComponent(title)}`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.Response === 'False' || !data.imdbRating || !data.imdbID) return;

        const imdbRating = data.imdbRating;
        const titleUrl = `https://www.imdb.com/title/${data.imdbID}`;

        createIcons(imdbRating, titleUrl, element);

        const dataToCache = { imdbRating, titleUrl };
        localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    }

    function createIcons(imdbRating, titleUrl, element) {
      var movieInfoContainer = element.querySelector('.movie-info-container');
      if (!movieInfoContainer) {
        movieInfoContainer = document.createElement('div');
        movieInfoContainer.classList.add('movie-info-container');
        element.insertBefore(movieInfoContainer, element.firstChild);
      } else {
        // Clear existing icons
        while (movieInfoContainer.firstChild) {
          movieInfoContainer.removeChild(movieInfoContainer.firstChild);
        }
      }

      // IMDb Icon
      const imdbIconElement = document.createElement('a');
      imdbIconElement.href = titleUrl;
      imdbIconElement.target = '_blank';

      const imdbIconImg = document.createElement('img');
      imdbIconImg.src = 'https://i.ibb.co/qnMBLjv/icons8-imdb-32.png'; // Consider hosting these images yourself or finding a more reliable source.
      imdbIconImg.alt = 'IMDb Icon';

      imdbIconElement.appendChild(imdbIconImg);

      // IMDb Ratings
      const imdbRatingElement = document.createElement('div');
      imdbRatingElement.classList.add('rating', 'imdb-rating');
      imdbRatingElement.textContent = imdbRating;

      // Create a container for the icons and ratings
      const ratingsContainer = document.createElement('div');
      ratingsContainer.classList.add('ratings-container');
      ratingsContainer.appendChild(imdbIconElement);
      ratingsContainer.appendChild(imdbRatingElement);

      movieInfoContainer.appendChild(ratingsContainer);

      // YouTube Trailer
      const youtubeLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        title
      )}+trailer`;
      const trailerLinkElement = document.createElement('a');
      trailerLinkElement.href = youtubeLink;
      trailerLinkElement.target = '_blank';

      const youtubeIconElement = document.createElement('img');
      youtubeIconElement.src = 'https://i.ibb.co/yp85pwx/icons8-youtube-32.png'; // Consider hosting these images yourself or finding a more reliable source.
      youtubeIconElement.alt = 'YouTube Icon';

      trailerLinkElement.appendChild(youtubeIconElement);
      movieInfoContainer.appendChild(trailerLinkElement);
    }
  }

  // Function to process movie covers and add ratings and trailers
  async function processMovieCovers() {
    const movieCovers = document.querySelectorAll('.slider-item:not(.processed)');

    const promises = Array.from(movieCovers).map(async (movieCover) => {
      const titleElements = Array.from(movieCover.querySelectorAll('.fallback-text'));

      if (titleElements.length > 0) {
        for (const titleEl of titleElements) {
          const title = titleEl ? titleEl.textContent : '';

          if (title) {
            const type = movieCover.closest('.row-with-extra-padding') ? 'series' : 'movie';

            await getMovieDetails(title, movieCover, type);
          }
        }
      }

      movieCover.classList.add('processed');
    });

    await Promise.all(promises);
  }

  // Observe changes in the document and process new movie covers when added
  let timeoutId;

  const observerCallback = (mutationsList, observer) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          processMovieCovers();
        }
      }
    }, 500); // delay in milliseconds
  };

  const observer = new MutationObserver(observerCallback);

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial processing of existing movie covers
  processMovieCovers();

  // Add custom styles to display ratings and YouTube icon on movie cards
  GM_addStyle(`
  .movie-info-container {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    padding: 4px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 14px;
  }
  .movie-info-container a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
  }
  .movie-info-container .ratings-container {
    display: flex;
    align-items: center;
  }
  .movie-info-container .ratings-container .rating {
    margin-left: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`);

})();
