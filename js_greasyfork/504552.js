// ==UserScript==
// @name         Hide r/All and r/Popular Feeds on Reddit
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Hide specific elements on Reddit pages
// @author       Jackson Peters and ChatGPT
// @match        https://www.reddit.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504552/Hide%20rAll%20and%20rPopular%20Feeds%20on%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/504552/Hide%20rAll%20and%20rPopular%20Feeds%20on%20Reddit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the script should run on the current page
    function shouldApplyScript() {
        const url = window.location.href;
        // Check if the URL contains r/all or r/popular
        return url.includes('/r/all') || url.includes('/r/popular');
    }

    // Function to hide elements
    function hideElements() {
        if (!shouldApplyScript()) return; // Exit if the script should not apply

        const mainContent = document.getElementById('main-content');
        const masthead = document.querySelector('.w-full.masthead');

        if (mainContent) mainContent.style.visibility = 'hidden';
        if (masthead) masthead.style.display = 'none';
    }

    // Initialize MutationObserver
    function setupMutationObserver() {
        const observer = new MutationObserver(() => hideElements());
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial hide
        hideElements();
    }

    // Handle page changes
    function handlePageChange() {
        if (shouldApplyScript()) {
            setupMutationObserver(); // Set up observer for dynamic content
        } else {
            // Optionally add cleanup logic if needed
        }
    }

    // Set up event listeners
    window.addEventListener('popstate', handlePageChange); // Handle back/forward navigation
    document.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') handlePageChange(); // Handle link clicks
    });

    // Initial setup
    handlePageChange();

    // Optionally, use setInterval as a fallback
    setInterval(hideElements, 1000); // Check every second as a fallback

})();
