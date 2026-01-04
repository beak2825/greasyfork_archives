// ==UserScript==
// @name         Hide Instagram Reels and Explore Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide Instagram reels and the explore button from the webpage
// @author       AKM777
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521995/Hide%20Instagram%20Reels%20and%20Explore%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/521995/Hide%20Instagram%20Reels%20and%20Explore%20Button.meta.js
// ==/UserScript==
// @license MIT
(function () {
    'use strict';

    // Function to hide reels and explore button
    function hideElements() {
        // Hide reels in feed
        const reelPosts = document.querySelectorAll('article div div div div video'); // Video reels in feed
        reelPosts.forEach(el => {
            const parent = el.closest('article');
            if (parent) parent.style.display = 'none';
        });

        // Hide the "Reels" button
        const reelsButtons = document.querySelectorAll('a[href*="/reels/"], div[role="button"][aria-label*="Reels"]');
        reelsButtons.forEach(el => {
            el.style.display = 'none';
        });

        // Hide the "Explore" button
        const exploreButton = document.querySelector('a[href="/explore/"]'); // Explore button in navigation
        if (exploreButton) {
            exploreButton.style.display = 'none';
        }
    }

    // Observe the page for dynamic changes
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial execution
    hideElements();
})();
