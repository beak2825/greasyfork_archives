// ==UserScript==
// @name         Reddit Search Button Next to Google a
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a Reddit search button next to Google search button
// @author       You
// @match        https://www.google.com/*
// @match        https://google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521438/Reddit%20Search%20Button%20Next%20to%20Google%20a.user.js
// @updateURL https://update.greasyfork.org/scripts/521438/Reddit%20Search%20Button%20Next%20to%20Google%20a.meta.js
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
                padding: 8px 8px;
                border-radius: 15px;
                font-family: Arial, sans-serif;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                text-transform: uppercase;
                font-size: 14px;
                letter-spacing: 0.5px;
                height: 40px;
                display: inline-flex;
                align-items: center;
                margin-left: 10px;
                vertical-align: up;
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

            .search-icons-container {
                display: inline-block;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    function createRedditButton() {
        // Find the Google search button
        const googleSearchButton = document.querySelector('button.HZVG1b.Tg7LZd');
        if (!googleSearchButton) return;

        // Check if button already exists
        if (googleSearchButton.nextElementSibling && googleSearchButton.nextElementSibling.classList.contains('reddit-search-btn')) return;

        // Create the Reddit button
        const redditButton = document.createElement('button');
        redditButton.textContent = 'Reddit';
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

        // Wrap the Google search button in a container if it doesn't already exist
        if (!googleSearchButton.parentElement.classList.contains('search-icons-container')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'search-icons-container';
            googleSearchButton.parentNode.insertBefore(wrapper, googleSearchButton);
            wrapper.appendChild(googleSearchButton);
        }

        // Add the Reddit button to the container
        const searchIconsContainer = googleSearchButton.parentElement;
        if (searchIconsContainer) {
            searchIconsContainer.appendChild(redditButton);
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