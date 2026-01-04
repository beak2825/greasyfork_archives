// ==UserScript==
// @name         RyuuGames F95Zone Search Button
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Adds a button to search the game title on F95Zone from RyuuGames
// @author       FunkyJustin
// @license      MIT
// @match        https://www.ryuugames.com/*
// @grant        none
// @supportURL      https://greasyfork.org/en/scripts/497408-ryuugames-f95zone-search-button/feedback
// @downloadURL https://update.greasyfork.org/scripts/497408/RyuuGames%20F95Zone%20Search%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/497408/RyuuGames%20F95Zone%20Search%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the search button
    function addSearchButton() {
        // Get the header element with class 'td-post-title'
        let header = document.querySelector('header.td-post-title');
        if (header) {
            // Get the H1 element within the header
            let h1 = header.querySelector('h1.entry-title');
            if (h1 && !header.querySelector('.f95zone-search-button')) { // Check if the button already exists
                // Extract the game title from the H1 text
                let titleText = h1.textContent;
                let gameTitle = titleText.replace(/^\[ENG\] /, '').replace(/\s*\(RJ\d+\)\s*$/, '');

                // Create the search button
                let searchButton = document.createElement('button');
                searchButton.textContent = 'Search on F95Zone';
                searchButton.style.marginTop = '10px';
                searchButton.style.display = 'block';
                searchButton.className = 'f95zone-search-button'; // Add a class for easier identification

                // Define the search URL
                let searchUrl = 'https://f95zone.to/sam/latest_alpha/#/cat=games/page=1/search=' + encodeURIComponent(gameTitle);

                // Add event listener to the button to open the search URL in a new tab
                searchButton.addEventListener('click', function() {
                    window.open(searchUrl, '_blank');
                });

                // Insert the button after the H1 element
                h1.insertAdjacentElement('afterend', searchButton);
            }
        }
    }

    // Observe changes to the body to ensure the button is added even if content is loaded dynamically
    const observer = new MutationObserver(addSearchButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial call in case the content is already loaded
    addSearchButton();
})();
