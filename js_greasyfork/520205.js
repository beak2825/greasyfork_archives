// ==UserScript==
// @name         Crunchyroll Hide Watch Again
// @version      1.0
// @author       Jacob Capper
// @description  Hides watched shows on Crunchyroll's watchlist and adds a toggleable list of hidden shows
// @match        https://www.crunchyroll.com/watchlist
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1016996
// @downloadURL https://update.greasyfork.org/scripts/520205/Crunchyroll%20Hide%20Watch%20Again.user.js
// @updateURL https://update.greasyfork.org/scripts/520205/Crunchyroll%20Hide%20Watch%20Again.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Array to store hidden shows
    let hiddenShows = [];

    // Create the UI container
    function createUI() {
        const uiContainer = document.createElement('div');
        uiContainer.id = 'watchlist-hider-ui';
        uiContainer.style.position = 'fixed';
        uiContainer.style.bottom = '10px';
        uiContainer.style.right = '10px';
        uiContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        uiContainer.style.color = '#fff';
        uiContainer.style.padding = '10px';
        uiContainer.style.borderRadius = '5px';
        uiContainer.style.fontFamily = 'Arial, sans-serif';
        uiContainer.style.fontSize = '14px';
        uiContainer.style.maxWidth = '300px';
        uiContainer.style.zIndex = '1000';
        uiContainer.innerHTML = `
            <div style="margin-bottom: 5px;">
                <strong>Hidden Shows</strong>
                <button id="toggle-hidden" style="float: right; background: #fff; color: #000; border: none; padding: 2px 5px; border-radius: 3px; cursor: pointer;">Show</button>
            </div>
            <ul id="hidden-list" style="display: none; list-style: none; padding: 0; max-height: 150px; overflow-y: auto;"></ul>
        `;
        document.body.appendChild(uiContainer);

        // Toggle button functionality
        document.getElementById('toggle-hidden').addEventListener('click', () => {
            const hiddenList = document.getElementById('hidden-list');
            const button = document.getElementById('toggle-hidden');
            if (hiddenList.style.display === 'none') {
                hiddenList.style.display = 'block';
                button.textContent = 'Hide';
            } else {
                hiddenList.style.display = 'none';
                button.textContent = 'Show';
            }
        });
    }

    // Function to add a show to the hidden list
    function addToHiddenList(title) {
        if (!hiddenShows.includes(title)) {
            hiddenShows.push(title);
            const listItem = document.createElement('li');
            listItem.textContent = title;
            document.getElementById('hidden-list').appendChild(listItem);
        }
    }

    // Function to filter and hide watched shows
    function hideWatchedShows() {
        const cards = document.querySelectorAll('div.watchlist-card--YfKgo[data-t="watch-list-card"]');
        if (!cards.length) {
            console.log('[Watchlist Hider] No cards found.');
            return;
        }

        cards.forEach((card) => {
            const subtitleElement = card.querySelector('h5.watchlist-card-subtitle--IROsU');
            const titleElement = card.querySelector('h4.watchlist-card-title__text--chGlt');
            if (subtitleElement && titleElement) {
                const subtitleText = subtitleElement.textContent || '';
                const titleText = titleElement.textContent || '';
                console.log('[Watchlist Hider] Subtitle:', subtitleText);

                if (subtitleText.includes('Watch Again')) {
                    console.log('[Watchlist Hider] Hiding card:', card);
                    card.style.display = 'none'; // Hide the card
                    addToHiddenList(titleText); // Add to the hidden list
                }
            }
        });
    }

    // Mutation observer to handle dynamic loading
    const observer = new MutationObserver(() => {
        console.log('[Watchlist Hider] DOM updated, re-filtering watched shows.');
        hideWatchedShows();
    });

    // Start observing the page for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    createUI();
    hideWatchedShows();
})();
