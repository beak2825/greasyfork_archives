// ==UserScript==
// @name         YouTube to Spotify
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a button to search YouTube video titles on Spotify
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495073/YouTube%20to%20Spotify.user.js
// @updateURL https://update.greasyfork.org/scripts/495073/YouTube%20to%20Spotify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the Spotify search button
    function createSpotifyButton() {
        // Check if the button already exists to avoid creating multiple buttons
        if (document.querySelector('#spotify-search-button')) {
            return;
        }

        // Get the title element
        const titleElement = document.querySelector('#title h1');

        // Get the actions element where the button will be added
        const actionsElement = document.querySelector('#actions');

        if (titleElement && actionsElement) {
            // Create the button element
            const button = document.createElement('button');
            button.id = 'spotify-search-button';
            button.style.marginLeft = '10px';
            button.style.padding = '5px 10px';
            button.style.backgroundColor = 'transparent';
            button.style.border = 'none';
            button.style.cursor = 'pointer';

            // Create the image element
            const img = document.createElement('img');
            img.src = 'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png';
            img.alt = 'Search on Spotify';
            img.style.width = '20px';
            img.style.height = '20px';

            // Add click event to the button
            button.addEventListener('click', () => {
                const videoTitle = titleElement.textContent.trim();
                const spotifyAppUrl = `spotify:search:${encodeURIComponent(videoTitle)}`;
                const spotifyWebUrl = `https://open.spotify.com/search/${encodeURIComponent(videoTitle)}`;

                // Attempt to open the Spotify app
                window.location.href = spotifyAppUrl;

                // Fallback to the web version after a short delay
                setTimeout(() => {
                    window.open(spotifyWebUrl, '_blank');
                }, 500);
            });

            // Append the image to the button
            button.appendChild(img);

            // Append the button to the actions element
            actionsElement.appendChild(button);
        }
    }

    // Function to observe changes in the DOM and add the button when a new video is loaded
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    createSpotifyButton();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    // Initialize the script
    function init() {
        createSpotifyButton();
        observeDOMChanges();
    }

    // Wait for the page to load completely before initializing
    window.addEventListener('load', init);
})();
