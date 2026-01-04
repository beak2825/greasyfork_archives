// ==UserScript==
// @name         Letterboxd to RYM Search
// @version      0.5
// @description  A handy ChatGPT userscript that adds a button below the film poster on Letterboxd, allowing you to search for the same film on RateYourMusic
// @author       ChatGPT
// @namespace    https://gist.github.com/Fooftilly
// @match        https://letterboxd.com/film/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/497799/Letterboxd%20to%20RYM%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/497799/Letterboxd%20to%20RYM%20Search.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function encodeMovieTitle(title) {
    return encodeURIComponent(title);
  }

  function createRYMSearchURL(title) {
    const encodedTitle = encodeMovieTitle(title);
    return `https://rateyourmusic.com/search?searchterm=${encodedTitle}&searchtype=F`;
  }

  function addRYMSearchButton() {
    const movieTitleElement = document.querySelector('h1.headline-1');
    const filmStatsElement = document.querySelector('.film-stats');

    if (movieTitleElement && filmStatsElement) {
      const movieTitle = movieTitleElement.innerText;
      const rymSearchURL = createRYMSearchURL(movieTitle);

      const rymButton = document.createElement('a');
      rymButton.innerText = 'Search title on RYM';
      rymButton.href = rymSearchURL;
      rymButton.target = '_blank';

      // Apply styles to the button
      rymButton.style.display = 'inline-block';
      rymButton.style.margin = '10px auto';
      rymButton.style.padding = '5px 10px';
      rymButton.style.border = '1px solid #1c1c1c';
      rymButton.style.borderRadius = '4px';
      rymButton.style.fontSize = '14px';
      rymButton.style.fontWeight = '500';
      rymButton.style.textDecoration = 'none';
      rymButton.style.color = '#1c1c1c';
      rymButton.style.background = '#f5f5f5';

      // Create a new div to hold the button
      const buttonDiv = document.createElement('div');
      buttonDiv.appendChild(rymButton);

      // Apply styles to center the button within the div
      buttonDiv.style.textAlign = 'center';
      buttonDiv.style.width = '100%';

      // Append the new div below the film-stats element
      filmStatsElement.parentElement.appendChild(buttonDiv);

    } else {
      console.error('Could not find the necessary elements.');
    }
  }

  // Try adding the button after a delay to give the page more time to load
  setTimeout(addRYMSearchButton, 2000);

})();