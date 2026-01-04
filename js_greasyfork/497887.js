// ==UserScript==
// @name        IMDb to 豆瓣
// @namespace   Violentmonkey Scripts
// @match       *://*.imdb.com/title/*
// @match       *://movie.douban.com/subject_search?search_text=*
// @match       *://www.justwatch.com/*
// @author      xuintl
// @license     MIT
// @grant       none
// @version     1.4
// @description Adds a link to jump to Douban page using IMDb ID and automatically clicks on the first result. Also adds a link to search Douban for the current movie or show on JustWatch.
// @downloadURL https://update.greasyfork.org/scripts/497887/IMDb%20to%20%E8%B1%86%E7%93%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/497887/IMDb%20to%20%E8%B1%86%E7%93%A3.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Function to create and insert the Douban button on IMDb
  function addDoubanButtonIMDb() {
    // Extract the IMDb ID from the URL
    const imdbIdMatch = window.location.pathname.match(/title\/(tt\d+)/);
    if (imdbIdMatch && imdbIdMatch[1]) {
      const imdbId = imdbIdMatch[1];

      // Construct the Douban URL using the IMDb ID
      const doubanUrl = `https://movie.douban.com/subject_search?search_text=${imdbId}&cat=1002`;

      // Create a new button element
      const doubanButton = document.createElement('a');
      doubanButton.href = doubanUrl;
      doubanButton.textContent = 'Douban';
      doubanButton.target = '_blank';
      doubanButton.style = 'padding: 2px 6px; background-color: #00a680; color: white; border-radius: 3px; text-decoration: none; font-size: 14px; margin-left: 10px;';

      // Find the element to insert the button next to (e.g., next to the title)
      const titleElement = document.querySelector('h1');

      // Insert the button into the page
      if (titleElement) {
        titleElement.parentElement.appendChild(doubanButton);
      }
    }
  }

  // Function to click the first search result on Douban
  function clickFirstResultDouban() {
    // Wait for the DOM to fully load
    window.addEventListener('load', function() {
      // Select the first search result link
      const firstResult = document.querySelector('.title a');

      if (firstResult) {
        // Navigate to the first result link
        window.location.href = firstResult.href;
      }
    });
  }

  // Function to create and insert the Douban button on JustWatch
  function addDoubanButtonJustWatch() {
    // Get the title element from the JustWatch page
    const titleElement = document.querySelector('.title-block h1');

    if (titleElement && !document.querySelector('#doubanButton')) {
      // Extract the movie/show title
      const title = titleElement.textContent.trim();

      // Construct the Douban search URL
      const doubanSearchUrl = `https://www.douban.com/search?q=${encodeURIComponent(title)}&cat=1002`;

      // Create a new button element
      const doubanButton = document.createElement('a');
      doubanButton.href = doubanSearchUrl;
      doubanButton.id = 'doubanButton';
      doubanButton.textContent = 'Douban';
      doubanButton.target = '_blank';
      doubanButton.style = 'padding: 2px 6px; background-color: #00a680; color: white; border-radius: 3px; text-decoration: none; font-size: 14px; margin-left: 10px;';

      // Find the rating info container to insert the button next to the icons
      const ratingInfoContainer = document.querySelector('.detail-infos__value .jw-scoring-listing__rating');

      // Insert the button into the page
      if (ratingInfoContainer) {
        ratingInfoContainer.parentElement.appendChild(doubanButton);
      }
    }
  }

  // Create a MutationObserver to watch for changes in the DOM on JustWatch
  const observer = new MutationObserver(() => {
    addDoubanButtonJustWatch();
  });

  // Start observing the body for changes on JustWatch
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial call to add the button in case the title is already loaded
  window.addEventListener('load', addDoubanButtonJustWatch);

  // Determine if we are on IMDb, Douban, or JustWatch
  if (window.location.hostname.includes('imdb.com')) {
    // Wait for the DOM to fully load before running the script
    window.addEventListener('load', addDoubanButtonIMDb);
  } else if (window.location.hostname.includes('douban.com') && window.location.search.includes('search_text=tt')) {
    // Only execute on Douban when search_text includes an IMDb ID pattern
    clickFirstResultDouban();
  } else if (window.location.hostname.includes('justwatch.com')) {
    // Start observing the body for changes on JustWatch
    observer.observe(document.body, { childList: true, subtree: true });
    // Initial call to add the button in case the title is already loaded
    window.addEventListener('load', addDoubanButtonJustWatch);
  }
})();
