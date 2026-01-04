// ==UserScript==
// @name         Reddit Search Button Next to Google Search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a Reddit search button next to Google search button
// @author       You
// @match        https://www.google.com/*
// @match        https://google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519901/Reddit%20Search%20Button%20Next%20to%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/519901/Reddit%20Search%20Button%20Next%20to%20Google%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCustomStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            .reddit-search-btn {
                background: linear-gradient(to bottom, #ff4500, #dc3545);
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-family: Arial, sans-serif;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                text-transform: uppercase;
                font-size: 14px;
                letter-spacing: 0.5px;
                height: 36px;
                display: inline-flex;
                align-items: center;
                margin-left: 10px;
                vertical-align: middle;
            }

            .reddit-search-btn:hover {
                background: linear-gradient(to bottom, #ff5610, #e84555);
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            }

            .reddit-search-btn:active {
                box-shadow: 0 1px 2px rgba(0,0,0,0.2);
            }

            .reddit-search-btn::before {
                content: "🔍 ";
                margin-right: 4px;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    function createRedditButton() {
        // Find the Google search buttons container
        const buttonsContainer = document.querySelector('div.FPdoLc, div.aajZCb');
        if (!buttonsContainer) return;

        // Check if button already exists
        if (buttonsContainer.querySelector('.reddit-search-btn')) return;

        // Create the Reddit button
        const redditButton = document.createElement('button');
        redditButton.textContent = 'Search Reddit';
        redditButton.className = 'reddit-search-btn';
        redditButton.type = 'button';

        // Add click event listener
        redditButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Get text from Google search input
            const searchInput = document.querySelector('textarea.gLFyf, input.gLFyf');
            if (searchInput && searchInput.value.trim()) {
                const redditSearchUrl = `https://www.google.com/search?q=site:reddit.com ${encodeURIComponent(searchInput.value)}`;
                window.open(redditSearchUrl, '_blank');
            }
        });

        // Add the button to the container
        const googleSearchButton = buttonsContainer.querySelector('input[value="Google Search"], button[aria-label="Google Search"]');
        if (googleSearchButton) {
            googleSearchButton.parentElement.appendChild(redditButton);
        } else {
            buttonsContainer.appendChild(redditButton);
        }
    }

    function init() {
        addCustomStyles();

        // Initial creation with a delay to ensure page is loaded
        setTimeout(createRedditButton, 1000);

        // Watch for dynamic changes
        const observer = new MutationObserver(function() {
            createRedditButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();