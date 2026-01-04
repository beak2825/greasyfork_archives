// ==UserScript==
// @name         IMDb Search - Filter by Date (IA)
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  Filter movies by year on IMDB search results
// @author       You
// @match        https://*.imdb.com/find/?q=*
// @match        https://www.imdb.com/fr*/find/?q=*
// @icon         https://icons.duckduckgo.com/ip2/imdb.com.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522729/IMDb%20Search%20-%20Filter%20by%20Date%20%28IA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522729/IMDb%20Search%20-%20Filter%20by%20Date%20%28IA%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Create the filter button
  const filterButton = document.createElement('button');
  filterButton.textContent = 'Filter by date';

  // Add up and down arrows to the button
  const upArrow = document.createElement('span');
  upArrow.textContent = '▲';
  upArrow.style.borderRadius = '100%';
  upArrow.style.border = '1px solid #ccc';
  upArrow.style.padding = '2px';
  upArrow.style.margin = '0 10px 0 10px';
  upArrow.style.cursor = 'pointer';

  const downArrow = document.createElement('span');
  downArrow.textContent = '▼';
  downArrow.style.borderRadius = '100%';
  downArrow.style.border = '1px solid #ccc';
  downArrow.style.padding = '2px';
  downArrow.style.margin = '0 10px 0 10px';
  downArrow.style.cursor = 'pointer';

  filterButton.appendChild(upArrow);
  filterButton.appendChild(downArrow);

  // Add the filter button to the page
  const listContainer = document.querySelector('section[data-testid="find-results-section-title"] ul.ipc-metadata-list.ipc-metadata-list--dividers-after');
  listContainer.parentNode.insertBefore(filterButton, listContainer);

  // Function to extract the year from a movie item
  function extractYear(movieItem) {
    const yearSpan = movieItem.querySelector('section[data-testid="find-results-section-title"] .cli-title-metadata span.cli-title-metadata-item:first-of-type');
    if (yearSpan) {
      const yearText = yearSpan.textContent;
      if (yearText.includes('–')) {
        const years = yearText.split('–').map(year => parseInt(year));
        return { start: years[0], end: years[1] };
      } else {
        return parseInt(yearText);
      }
    } else {
      return null;
    }
  }

  // Function to reorder movies by year
  function reorderMovies(ascending) {
    const movieItems = document.querySelectorAll('section[data-testid="find-results-section-title"] ul.ipc-metadata-list.ipc-metadata-list--dividers-after li.ipc-metadata-list-summary-item');
    const sortedMovieItems = Array.from(movieItems).sort((a, b) => {
      const yearA = extractYear(a);
      const yearB = extractYear(b);
      if (yearA && yearB) {
        if (typeof yearA === 'object' && typeof yearB === 'object') {
          return (yearA.start - yearB.start) * (ascending ? 1 : -1);
        } else if (typeof yearA === 'object') {
          return (yearA.start - yearB) * (ascending ? 1 : -1);
        } else if (typeof yearB === 'object') {
          return (yearA - yearB.start) * (ascending ? 1 : -1);
        } else {
          return (yearA - yearB) * (ascending ? 1 : -1);
        }
      } else if (yearA) {
        return -1;
      } else if (yearB) {
        return 1;
      } else {
        return 0;
      }
    });
    sortedMovieItems.forEach(movieItem => {
      listContainer.appendChild(movieItem);
    });
  }

  // Add event listeners to the filter button and arrows
  let ascending = true;
  filterButton.addEventListener('click', () => {
    reorderMovies(ascending);
  });
  upArrow.addEventListener('click', () => {
    ascending = true;
    upArrow.style.background = 'green';
    upArrow.style.color = 'white';
    downArrow.style.background = '';
    downArrow.style.color = '';
    reorderMovies(ascending);
  });
  downArrow.addEventListener('click', () => {
    ascending = false;
    downArrow.style.background = 'green';
    downArrow.style.color = 'white';
    upArrow.style.background = '';
    upArrow.style.color = '';
    reorderMovies(ascending);
  });
})();
