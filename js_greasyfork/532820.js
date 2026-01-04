// ==UserScript==
// @name         DuckDuckGo on Yandex
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Replaces Bing links with DuckDuckGo on Yandex search results page and updates the link text
// @author       nnside
// @match        https://yandex.ru/search/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532820/DuckDuckGo%20on%20Yandex.user.js
// @updateURL https://update.greasyfork.org/scripts/532820/DuckDuckGo%20on%20Yandex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace links
    function replaceBingLinks() {
        // Get all link elements on the page
        const links = document.querySelectorAll('a');

        // Iterate through all links
        links.forEach(link => {
            // Check if the link contains the Bing address
            if (link.href.includes("bing.com")) {
                // Replace the link with DuckDuckGo
                const searchText = new URLSearchParams(window.location.search).get('text');
                link.href = `https://duckduckgo.com/?q=${encodeURIComponent(searchText)}`;
                link.target = '_blank';  // Open in a new tab

                // Change the link text to "DuckDuckGo"
                link.textContent = link.textContent.replace("Bing", "DuckDuckGo");
            }
        });
    }

    // Create a MutationObserver to watch for changes in the document
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            replaceBingLinks(); // Call the function each time the DOM changes
        });
    });

    // Start observing the body for child additions
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial call to replace links when the script runs
    replaceBingLinks();

})();