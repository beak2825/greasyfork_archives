// ==UserScript==
// @name         Letterboxd to Jellyseerr Link
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Add a button to view movies on Jellyseerr from Letterboxd using the TMDB ID
// @author       freij
// @match        *://letterboxd.com/film/*
// @grant        none
// @license      
// @downloadURL https://update.greasyfork.org/scripts/546204/Letterboxd%20to%20Jellyseerr%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/546204/Letterboxd%20to%20Jellyseerr%20Link.meta.js
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

    function createJellyseerrLinkButton(tmdbId) {
        const listItem = document.createElement('li');
        const jellyseerrButton = document.createElement('a');
        jellyseerrButton.href = `http://localhost:5055/movie/${tmdbId}`;
        jellyseerrButton.target = '_blank';
        jellyseerrButton.className = 'button -action -has-icon';

        // --- Added styles for vertical alignment ---
        jellyseerrButton.style.display = 'inline-flex';
        jellyseerrButton.style.alignItems = 'center';
        // --- End of alignment styles ---

        const neutralColor = '#445566';
        const hoverColor = '#556677';
        jellyseerrButton.style.boxShadow = 'none';
        jellyseerrButton.style.textShadow = 'none';
        jellyseerrButton.style.backgroundImage = 'none';
        jellyseerrButton.style.backgroundColor = neutralColor;
        jellyseerrButton.style.borderColor = 'transparent';
        jellyseerrButton.style.color = '#9ab';

        jellyseerrButton.addEventListener('mouseover', () => {
            jellyseerrButton.style.backgroundColor = hoverColor;
        });
        jellyseerrButton.addEventListener('mouseout', () => {
            jellyseerrButton.style.backgroundColor = neutralColor;
        });

        const favicon = document.createElement('img');
        favicon.src = 'https://raw.githubusercontent.com/Fallenbagel/jellyseerr/develop/public/favicon-16x16.png';
        favicon.alt = 'Jellyseerr Logo';
        favicon.style.marginRight = '0.5em';
        favicon.style.width = '16px';
        favicon.style.height = '16px';

        const buttonText = document.createElement('span');
        buttonText.textContent = 'View on Jellyseerr';

        jellyseerrButton.appendChild(favicon);
        jellyseerrButton.appendChild(buttonText);
        listItem.appendChild(jellyseerrButton);
        return listItem;
    }

    // --- UPDATED logic to get the TMDB ID ---
    const tmdbLinkElement = document.querySelector('a[href*="themoviedb.org/movie"]');
    let tmdbId = null;

    if (tmdbLinkElement) {
        const match = tmdbLinkElement.href.match(/\/movie\/(\d+)/);
        if (match && match[1]) {
            tmdbId = match[1];
        }
    }
    // --- End of new logic ---

    const selector = ".js-actions-panel";

    function appendButtonAfterSpecifiedButtons() {
        const targetContainer = document.querySelector(selector);
        if (targetContainer && tmdbId) {
            const jellyseerrButton = createJellyseerrLinkButton(tmdbId);
            targetContainer.appendChild(jellyseerrButton);
        } else {
            console.warn('[Jellyseerr Button] Could not find TMDB ID on page.');
        }
    }

    runWhenReady(selector, appendButtonAfterSpecifiedButtons);
})();