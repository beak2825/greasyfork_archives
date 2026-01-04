// ==UserScript==
// @name         DuckDuckGo and Google Search Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove search results from DuckDuckGo and Google by URL
// @author       sedevacante
// @include      http*://www.google.*/search?*
// @match        *://duckduckgo.com/*
// @grant        none
// @license      GPLv2; http://www.gnu.org/licenses/
// @downloadURL https://update.greasyfork.org/scripts/513570/DuckDuckGo%20and%20Google%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/513570/DuckDuckGo%20and%20Google%20Search%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to load blocked URLs from localStorage
    function loadBlockedUrls() {
        return JSON.parse(localStorage.getItem('blockedUrls') || '[]');
    }

    // Function to save blocked URLs to localStorage
    function saveBlockedUrls(urls) {
        localStorage.setItem('blockedUrls', JSON.stringify(urls));
    }

    // Function to block an individual search result
    function blockResult(url, element) {
        let blockedUrls = loadBlockedUrls();
        if (!blockedUrls.includes(url)) {
            blockedUrls.push(url);
            saveBlockedUrls(blockedUrls);
        }
        element.remove(); // Completely remove the result from the page
    }

    // Function to check and remove already blocked URLs on page load
    function removeBlockedResults() {
        const blockedUrls = loadBlockedUrls();

        // DuckDuckGo logic
        const duckResults = document.querySelectorAll('ol.react-results--main li');
        duckResults.forEach((li) => {
            const link = li.querySelector('a');
            if (link && blockedUrls.includes(link.href)) {
                li.remove(); // Completely remove the result if blocked
            }
        });

        // Google logic
        const googleResults = document.querySelectorAll('div#rso div[data-ved]');
        googleResults.forEach((div) => {
            const link = div.querySelector('a');
            if (link && blockedUrls.includes(link.href)) {
                div.remove(); // Completely remove the result if blocked
            }
        });
    }

    // Function to add "X" buttons next to each search result (only if not blocked)
    function addBlockButtons() {
        const blockedUrls = loadBlockedUrls();

        // DuckDuckGo logic
        const duckResults = document.querySelectorAll('ol.react-results--main li');
        duckResults.forEach((li) => {
            const link = li.querySelector('a');
            // Only add "X" button if URL is not blocked
            if (link && !blockedUrls.includes(link.href)) {
                if (!li.querySelector('.block-btn')) {
                    const blockBtn = document.createElement('button');
                    blockBtn.textContent = 'X';
                    blockBtn.className = 'block-btn';
                    blockBtn.style.marginLeft = '10px';
                    blockBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        blockResult(link.href, li);  // Completely remove the result
                    });
                    li.appendChild(blockBtn);
                }
            }
        });

        // Google logic
        const googleResults = document.querySelectorAll('div#rso div[data-ved]');
        googleResults.forEach((div) => {
            const link = div.querySelector('a');
            // Only add "X" button if URL is not blocked
            if (link && !blockedUrls.includes(link.href)) {
                if (!div.querySelector('.block-btn')) {
                    const blockBtn = document.createElement('button');
                    blockBtn.textContent = 'X';
                    blockBtn.className = 'block-btn';
                    blockBtn.style.marginLeft = '10px';
                    blockBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        blockResult(link.href, div);  // Completely remove the result
                    });
                    div.appendChild(blockBtn);
                }
            }
        });
    }

    // Function to handle page changes (URL changes or dynamic content loads)
    function monitorPageChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                setTimeout(() => {
                    // Re-run the block and button logic on page change
                    removeBlockedResults();
                    addBlockButtons();
                }, 500);  // Delay to ensure content is loaded
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    // Initial check for blocked URLs
    removeBlockedResults();
    addBlockButtons();

    // Observer to dynamically add block buttons as new results load
    const observer = new MutationObserver((mutations) => {
        addBlockButtons();
        removeBlockedResults(); // Ensure blocked results are removed on page changes
    });

    // Observe body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Monitor URL changes and handle page navigation
    monitorPageChanges();

})();
