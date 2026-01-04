// ==UserScript==
// @name         Simplify Fb Feed
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide the top bar on Facebook
// @author       @l1ackoder
// @match        *://www.facebook.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511647/Simplify%20Fb%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/511647/Simplify%20Fb%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide elements by their CSS selectors
    function hideElements() {
        const selectors = [
            '[aria-label="Facebook"]', // Facebook logo
            '[aria-label="Home"]', // Home icon
            '[aria-label="Friends"]', // Friends icon
            '[aria-label="Watch"]', // Video icon
            '[aria-label="Groups"]', // Group icon
            '[aria-label="Marketplace"]', // Marketplace icon
            '[aria-label="Notifications"]' // Notification icon
        ];

        selectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    // Run the function on page load
    window.addEventListener('load', hideElements);

    // Also run it whenever the page dynamically updates (like in single-page apps)
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();
