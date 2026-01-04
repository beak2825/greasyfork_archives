// ==UserScript==
// @name         SteamDB Piracy Redirect Buttons
// @namespace    https://steamdb.info/
// @version      1.2.0
// @description  Adds redirect buttons to popular piracy sites on SteamDB.info app pages.
// @author       nightsman
// @license      GNU GPLv3
// @match        https://steamdb.info/app/*/
// @grant        none
// @homepageURL  https://github.com/yourusername/steamdb-piracy-redirect
// @supportURL   https://github.com/yourusername/steamdb-piracy-redirect/issues
// @downloadURL https://update.greasyfork.org/scripts/532391/SteamDB%20Piracy%20Redirect%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/532391/SteamDB%20Piracy%20Redirect%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the buttons to be added
    const redirectButtons = [
        {
            label: 'SteamRIP',
            urlPrefix: 'https://steamrip.com/?s=',
        },
        {
            label: 'GOG Games',
            urlPrefix: 'https://gog-games.to/?search=',
        },
        {
            label: 'AnkerGames',
            urlPrefix: 'https://ankergames.net/search/',
        },
        {
            label: 'Fitgirl Repacks',
            urlPrefix: 'https://fitgirl-repacks.site/?s=',
        },
        {
            label: 'Dodi Repacks',
            urlPrefix: 'https://dodi-repacks.site/?s=',
        },
    ];

    // Function to add the buttons to the page
    function addRedirectButtons() {
        // Select the game title element and the navigation links container
        const titleElement = document.querySelector('h1');
        const navLinks = document.querySelector('nav.app-links');

        // If either element is not found, exit the function
        if (!titleElement || !navLinks) {
            console.error('SteamDB Piracy Redirect: Could not find required elements.');
            return;
        }

        // Extract and clean the game title
        let gameTitle = titleElement.textContent.trim();
        // Remove non-ASCII characters from the game title for better URL compatibility
        gameTitle = gameTitle.replace(/[^\x00-\x7F]/g, '');

        // Define the CSS for the new buttons
        const buttonStyle = `
            .app-links > a.dynamic-button {
                display: inline-block;
                cursor: pointer;
                color: #67c1f5;
                background: #273b4b;
                border: 1px solid rgb(255 255 255 / 10%);
                padding: 0 10px;
                font-size: 15px;
                line-height: 30px;
                border-radius: 6px;
                margin-right: 5px; /* Added a small margin between buttons */
                text-decoration: none;
                transition: background-color 0.2s ease-in-out; /* Added transition for hover effect */
            }
            .app-links > a.dynamic-button:hover {
                background-color: #3a5b75; /* Darken background on hover */
                color: var(--link-color-hover, #0095ff);
            }
            .app-links > a:last-child {
                margin-right: 0;
            }
        `;

        // Create and append the style element to the head
        const styleElement = document.createElement('style');
        styleElement.textContent = buttonStyle;
        document.head.appendChild(styleElement);

        // Create and append each redirect button
        redirectButtons.forEach(({ label, urlPrefix, urlSuffix = '' }) => {
            const btn = document.createElement('a');
            // Encode the game title for use in URLs
            btn.href = urlPrefix + encodeURIComponent(gameTitle) + urlSuffix;
            btn.textContent = label;
            btn.target = '_blank'; // Open link in a new tab
            btn.className = 'dynamic-button';
            navLinks.appendChild(btn);
        });
    }

    // Wait for the window to fully load before adding buttons
    window.addEventListener('load', addRedirectButtons);

})();