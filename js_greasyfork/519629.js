// ==UserScript==
// @name         Chess.com URL Collector with Clipboard Copy, Clear List, and Copy & Clear
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Collect and filter URLs of pages visited on chess.com, provide buttons to copy, clear, and copy & clear the list, with item counter updated dynamically.
// @author       You
// @match        https://*.chess.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519629/Chesscom%20URL%20Collector%20with%20Clipboard%20Copy%2C%20Clear%20List%2C%20and%20Copy%20%20Clear.user.js
// @updateURL https://update.greasyfork.org/scripts/519629/Chesscom%20URL%20Collector%20with%20Clipboard%20Copy%2C%20Clear%20List%2C%20and%20Copy%20%20Clear.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to append URL to local storage
    function appendURL(url) {
        let urls = JSON.parse(localStorage.getItem('chess_collected_urls')) || [];
        if (!urls.includes(url)) {  // Avoid duplicate URLs
            urls.push(url);
            localStorage.setItem('chess_collected_urls', JSON.stringify(urls));
        }
    }

    // Filter URLs containing "problem"
    function getFilteredURLs() {
        let urls = JSON.parse(localStorage.getItem('chess_collected_urls')) || [];
        return urls.filter(url => url.includes('problem'));
    }

    // Function to update the item counter
    function updateCounter() {
        let counter = document.querySelector('#chess-url-counter');
        if (!counter) return;

        let filteredCount = getFilteredURLs().length;
        counter.textContent = `(${filteredCount})`;
    }

    // Function to create the copy button with a counter
    function createCopyButton() {
        if (document.querySelector('#chess-url-collector-button')) {
            return; // Button already exists
        }

        let button = document.createElement('button');
        button.id = 'chess-url-collector-button';
        button.innerHTML = 'Copy Collected URLs <span id="chess-url-counter">(0)</span>';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';

        button.addEventListener('click', () => {
            let urls = getFilteredURLs();
            let urlCount = urls.length;
            if (urlCount === 0) {
                alert('No URLs matching "problem" to copy.');
                return;
            }
            let urlsString = urls.join('\n');
            navigator.clipboard.writeText(urlsString)
                .then(() => alert(`${urlCount} URLs copied to clipboard!`))
                .catch(err => alert('Failed to copy URLs: ' + err));
        });

        document.body.appendChild(button);
        updateCounter();
    }

    // Function to create the clear button
    function createClearButton() {
        if (document.querySelector('#chess-url-clear-button')) {
            return; // Button already exists
        }

        let button = document.createElement('button');
        button.id = 'chess-url-clear-button';
        button.textContent = 'Clear Collected URLs';
        button.style.position = 'fixed';
        button.style.top = '50px';
        button.style.right = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#dc3545';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';

        button.addEventListener('click', () => {
            localStorage.removeItem('chess_collected_urls');
            alert('Collected URLs have been cleared.');
            updateCounter();
        });

        document.body.appendChild(button);
    }

    // Function to create the copy and clear button
    function createCopyAndClearButton() {
        if (document.querySelector('#chess-url-copy-clear-button')) {
            return; // Button already exists
        }

        let button = document.createElement('button');
        button.id = 'chess-url-copy-clear-button';
        button.textContent = 'Copy & Clear URLs';
        button.style.position = 'fixed';
        button.style.top = '90px';
        button.style.right = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#28a745';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';

        button.addEventListener('click', () => {
            let urls = getFilteredURLs();
            let urlCount = urls.length;
            if (urlCount === 0) {
                alert('No URLs matching "problem" to copy and clear.');
                return;
            }
            let urlsString = urls.join('\n');
            navigator.clipboard.writeText(urlsString)
                .then(() => {
                    localStorage.removeItem('chess_collected_urls');
                    alert(`${urlCount} URLs copied to clipboard and cleared.`);
                    updateCounter();
                })
                .catch(err => alert('Failed to copy URLs: ' + err));
        });

        document.body.appendChild(button);
    }

    // Function to ensure buttons are added even if the page content is dynamically loaded
    function ensureButtons() {
        createCopyButton();
        createClearButton();
        createCopyAndClearButton();

        // Observe DOM changes to handle dynamic content
        const observer = new MutationObserver(() => {
            if (!document.querySelector('#chess-url-collector-button')) {
                createCopyButton();
            }
            if (!document.querySelector('#chess-url-clear-button')) {
                createClearButton();
            }
            if (!document.querySelector('#chess-url-copy-clear-button')) {
                createCopyAndClearButton();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Ensure buttons are created and dynamically update the counter
    window.addEventListener('load', () => {
        appendURL(window.location.href); // Collect URL on page load
        ensureButtons(); // Ensure buttons are added

        // Periodically update the counter
        setInterval(updateCounter, 2000); // Update every 2 seconds
    });
})();
