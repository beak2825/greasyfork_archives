// ==UserScript==
// @name IMDb Multi-Search Buttons
// @namespace http://tampermonkey.net/
// @version 2.2
// @description Add buttons on IMDb pages to search on Cineby, P-Stream, SFlix, and Aether
// @author FunkyJustin 
// @match https://www.imdb.com/title/*
// @match https://www.cineby.app/search
// @match https://www.cineby.gd/search
// @grant GM_setValue
// @grant GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528697/IMDb%20Multi-Search%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/528697/IMDb%20Multi-Search%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname.includes('imdb.com')) {
        function addSearchButtons() {
            const titleElement = document.querySelector('h1');
            if (!titleElement) return;

            const titleText = titleElement.textContent.trim();

            // Query Formatting
            const hyphenQuery = titleText.replace(/\s+/g, '-');
            const encodedQuery = encodeURIComponent(titleText); // For Aether (%20)

            // URLs
            const cinebyURL = 'https://www.cineby.gd/search';
            const pstreamURL = 'https://pstream.mov/browse/' + hyphenQuery;
            const sflixURL = 'https://sflix2.to/search/' + hyphenQuery;
            const aetherURL = 'https://aether.mom/browse/' + encodedQuery;

            const container = document.createElement('div');
            container.style.cssText = 'display:flex; flex-wrap:wrap; gap:8px; margin-bottom:8px; position:relative;';

            function createSearchButton(text, url, onClick) {
                const btn = document.createElement('button');
                btn.textContent = text;
                btn.style.cssText = 'background-color:#f5c518; color:#000; border:none; padding:6px 12px; font-size:14px; font-weight:bold; border-radius:4px; cursor:pointer;';

                btn.addEventListener('click', onClick || (() => {
                    window.open(url, '_blank');
                }));
                return btn;
            }

            // Buttons
            const cinebyButton = createSearchButton('Cineby', cinebyURL, () => {
                GM_setValue('movieTitle', titleText);
                window.open(cinebyURL, '_blank');
            });

            const pstreamButton = createSearchButton('P-Stream', pstreamURL);
            const sflixButton = createSearchButton('SFlix', sflixURL);
            const aetherButton = createSearchButton('Aether', aetherURL);

            container.appendChild(cinebyButton);
            container.appendChild(pstreamButton);
            container.appendChild(sflixButton);
            container.appendChild(aetherButton);

            titleElement.parentNode.insertBefore(container, titleElement);
        }
        window.addEventListener('load', addSearchButtons);
    }

    // Cineby Auto-fill Logic (Works on .app and .gd)
    if (window.location.hostname.includes('cineby')) {
        function autoFillSearch() {
            let titleText = GM_getValue('movieTitle', '');
            if (!titleText) return;

            const performSearch = (title) => {
                const searchInput = document.querySelector('input[type="search"], input[type="text"], input[placeholder*="search" i]');
                if (searchInput) {
                    searchInput.value = title;
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    GM_setValue('movieTitle', ''); // Clear after use
                }
            };

            // Initial attempt + short delay for React/SPA rendering
            setTimeout(() => performSearch(titleText), 500);
        }
        window.addEventListener('load', autoFillSearch);
    }
})();