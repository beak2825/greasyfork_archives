// ==UserScript==
// @name         Letterboxd Watched & Watchlist Highlighter
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Highlights films that are marked as watched (green) or are in your watchlist (blue) on any Letterboxd page.
// @author       Gemini (based on 0x00a)
// @match        https://letterboxd.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544559/Letterboxd%20Watched%20%20Watchlist%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/544559/Letterboxd%20Watched%20%20Watchlist%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Style Configuration ---
    const WATCHED_COLOR = "#00E054"; // A bright green
    const WATCHLIST_COLOR = "#00A0E0"; // A bright blue
    const BORDER_WIDTH = "3px";

    // Inject the CSS styles for the highlights into the page
    GM_addStyle(`
        .film-poster.highlight-watched .image {
            border: ${BORDER_WIDTH} solid ${WATCHED_COLOR} !important;
            box-shadow: 0 0 12px ${WATCHED_COLOR} !important;
            border-radius: 4px; /* Match Letterboxd's rounded corners */
            box-sizing: border-box;
        }
        .film-poster.highlight-watchlist .image {
            border: ${BORDER_WIDTH} solid ${WATCHLIST_COLOR} !important;
            box-shadow: 0 0 12px ${WATCHLIST_COLOR} !important;
            border-radius: 4px; /* Match Letterboxd's rounded corners */
            box-sizing: border-box;
        }
    `);

    function highlightPosters() {
        // --- THIS IS THE ONLY LINE THAT HAS BEEN CHANGED ---
        // It now uses the correct data attribute to find watchlist films.
        const watchlistPosters = document.querySelectorAll('.film-poster[data-in-watchlist="true"]:not([data-highlighted])');

        watchlistPosters.forEach(poster => {
            poster.classList.add('highlight-watchlist');
            poster.dataset.highlighted = 'true';
        });

        // This part for watched films was already working and has NOT been changed.
        const watchedPosters = document.querySelectorAll('.film-poster:has(span.icon-watched), .film-watched .film-poster');

        watchedPosters.forEach(poster => {
            // Watched status always overrides watchlist status.
            poster.classList.remove('highlight-watchlist');
            poster.classList.add('highlight-watched');
            poster.dataset.highlighted = 'watched';
        });
    }

    // --- Dynamic Content Handling ---
    // Use a MutationObserver to detect when new content is added to the page.
    const observerCallback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // New elements were added, so we re-run the highlighter
                setTimeout(highlightPosters, 100);
                break;
            }
        }
    };

    // Create an observer and start watching the page for changes.
    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the highlighter once on initial page load.
    setTimeout(highlightPosters, 500);

})();