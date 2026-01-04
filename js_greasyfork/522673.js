// ==UserScript==
// @name         HotMovies Search Filter (IA)
// @namespace    http://tampermonkey.net/
// @version      0.1.01
// @author       Janvier57
// @icon         https://external-content.duckduckgo.com/ip3/www.hotmovies.com.ico
// @description  Add a filter for Movies's Titles in Pornstar pages
// @match        https://www.hotmovies.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522673/HotMovies%20Search%20Filter%20%28IA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522673/HotMovies%20Search%20Filter%20%28IA%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Create the search form container
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-title-form';
  searchContainer.style.width = '100%';
  searchContainer.style.marginBottom = '10px';

  // Create the search input field
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'Search movie titles...';
  searchInput.style.width = 'calc(100% - 60px)';
  searchInput.style.padding = '5px';
  searchInput.style.border = '1px solid #ccc';
  searchInput.style.float = 'left';

  // Create the clear button
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Clear';
  clearButton.style.marginLeft = '5px';
  clearButton.style.padding = '5px';
  clearButton.style.border = '1px solid #ccc';
  clearButton.style.borderRadius = '5px';
  clearButton.style.cursor = 'pointer';
  clearButton.style.float = 'left';

  // Add event listeners to the search input and clear button
  searchInput.addEventListener('input', filterMovieTitles);
  clearButton.addEventListener('click', clearSearchInput);

  // Create the search form
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(clearButton);

  // Add the search form to the page
  const moviesContainer = document.querySelector('.container.performer-page .nav.nav-tabs ~ .row');
  moviesContainer.className = 'row-search-title-results';
  moviesContainer.insertBefore(searchContainer, moviesContainer.firstChild);

  // Add CSS to style the search form
  const style = document.createElement('style');
  style.textContent = `
    .row-search-title-results .search-title-form {
      display: inline-block !important;
      margin: 2vh 0 2vh 0 !important;
    }
    .row-search-title-results > div:has([no-match="yes"]) {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  // Function to filter movie titles
  function filterMovieTitles() {
    const searchQuery = searchInput.value.toLowerCase();
    const movieTitles = moviesContainer.querySelectorAll('.item-preview-video[itemtitle]');

    movieTitles.forEach((movieTitle) => {
      const title = movieTitle.getAttribute('itemtitle').toLowerCase();
      if (title.includes(searchQuery)) {
        movieTitle.setAttribute('match', 'yes');
        movieTitle.removeAttribute('no-match');
      } else {
        movieTitle.setAttribute('no-match', 'yes');
        movieTitle.removeAttribute('match');
      }
    });
  }

  // Function to clear the search input
  function clearSearchInput() {
    searchInput.value = '';
    filterMovieTitles();
  }
})();
