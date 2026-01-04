// ==UserScript==
// @name         IMDb Multi-Search Buttons
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add buttons on IMDb pages to search the movie/series title on different sites
// @match        https://www.imdb.com/title/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528697/IMDb%20Multi-Search%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/528697/IMDb%20Multi-Search%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSearchButtons() {
        // Find the movie/series title (the first h1)
        const titleElement = document.querySelector('h1');
        if (!titleElement) {
            console.log("IMDb title element not found.");
            return;
        }

        // Get the title text and trim spaces
        const titleText = titleElement.textContent.trim();

        // Prepare the search strings
        // For Moviebox, replace spaces with '+'
        const movieboxQuery = titleText.replace(/\s+/g, '+');
        // For SFlix, replace spaces with '-' based on the provided URL format
        const sflixQuery = titleText.replace(/\s+/g, '-');

        // Construct the URLs
        const movieboxURL = 'https://moviebox.ng/web/searchResult?keyword=' + movieboxQuery;
        const sflixURL    = 'https://sflix2.to/search/' + sflixQuery;

        // Create a container to hold the buttons (so they appear side-by-side nicely)
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '8px';
        container.style.marginBottom = '8px';

        // Helper function to create styled buttons
        function createSearchButton(text, url) {
            const btn = document.createElement('button');
            btn.textContent = text;
            // IMDb color scheme
            btn.style.backgroundColor = '#f5c518';
            btn.style.color = '#000';
            btn.style.border = 'none';
            btn.style.padding = '6px 12px';
            btn.style.fontSize = '14px';
            btn.style.fontWeight = 'bold';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';

            btn.addEventListener('click', () => {
                window.open(url, '_blank');
            });

            return btn;
        }

        // Create the two buttons
        const movieboxButton = createSearchButton('Search on Moviebox', movieboxURL);
        const sflixButton    = createSearchButton('Search on SFlix', sflixURL);

        // Append them to the container
        container.appendChild(movieboxButton);
        container.appendChild(sflixButton);

        // Insert the container ABOVE the title
        titleElement.parentNode.insertBefore(container, titleElement);
    }

    // Wait for the DOM to be fully loaded
    window.addEventListener('load', addSearchButtons);
})();
