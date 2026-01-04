// ==UserScript==
// @name         Letterboxd to Jellyseerr Search
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a button to search movies on Jellyseerr from Letterboxd
// @author       doodeoo
// @match        *://letterboxd.com/film/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481284/Letterboxd%20to%20Jellyseerr%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/481284/Letterboxd%20to%20Jellyseerr%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function runWhenReady(readySelector, callback) {
        var numAttempts = 0;
        var tryNow = function() {
            var elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 34) {
                    console.warn('Giving up after 34 attempts. Could not find: ' + readySelector);
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    }

    function createJellyseerrSearchButton(movieTitle) {
        const listItem = document.createElement('li');
        const jellyseerrButton = document.createElement('a');
        jellyseerrButton.href = `http://localhost:5055/search?query=${encodeURIComponent(movieTitle)}`;
        jellyseerrButton.target = '_blank'; // Open in a new tab
        jellyseerrButton.className = 'button';
        jellyseerrButton.style.display = 'inline-flex'; // Set display to inline-flex for alignment
        jellyseerrButton.style.alignItems = 'center'; // Align items vertically

        const favicon = document.createElement('img');
        favicon.src = 'https://raw.githubusercontent.com/Fallenbagel/jellyseerr/develop/public/favicon-16x16.png';
        favicon.alt = 'Jellyseerr Logo';
        favicon.style.marginRight = '5px';
        favicon.style.width = '16px'; // Set a specific width for the favicon
        favicon.style.height = '16px'; // Set a specific height for the favicon

        jellyseerrButton.appendChild(favicon);
        jellyseerrButton.appendChild(document.createTextNode('Search in Jellyseerr'));
        listItem.appendChild(jellyseerrButton);
        return listItem;
    }

    const movieTitle = document.querySelector('h1.headline-1').textContent.trim();
    const selector = ".js-actions-panel";

    function appendButtonAfterSpecifiedButtons() {
        const targetContainer = document.querySelector(selector);
        if (targetContainer) {
            const jellyseerrButton = createJellyseerrSearchButton(movieTitle);
            targetContainer.appendChild(jellyseerrButton);
        }
    }

    runWhenReady(selector, appendButtonAfterSpecifiedButtons);
})();