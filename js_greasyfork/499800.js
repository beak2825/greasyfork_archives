// ==UserScript==
// @name         Infinite Scroll Spotify Episodes
// @namespace    https://greasyfork.org/en/users/1200587-trilla-g
// @version      4.1
// @description  Automatically clicks the "Load More Episodes" button when visible on Spotify using IntersectionObserver for improved efficiency
// @author       Trilla_G
// @match        *://*.open.spotify.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499800/Infinite%20Scroll%20Spotify%20Episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/499800/Infinite%20Scroll%20Spotify%20Episodes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the selector for the button
    const buttonSelector = '.vqQmhCMZq7eUtTV7YYOQ';

    // Set up an observer to watch for the button entering the viewport
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.click();
            }
        });
    });

    // Monitor the document for the button's appearance
    function observeButton() {
        const button = document.querySelector(buttonSelector);
        if (button) {
            observer.observe(button);
        }
    }

    // Set up a MutationObserver to detect changes in the page and find the button
    const mutationObserver = new MutationObserver(observeButton);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Initial button observation
    observeButton();
})();
