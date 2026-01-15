// ==UserScript==
// @name         Hide Accuracy Bar
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide the Accuracy bar element
// @author       Matskye
// @match        https://marumori.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511553/Hide%20Accuracy%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/511553/Hide%20Accuracy%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the progress bar
    function hideBlueProgressBar() {
        const progressBar = document.querySelector('.progress-bar.undefined.bar-big .inner-bar[style*="background-color: var(--blue);"]');
        if (progressBar) {
            progressBar.parentElement.style.display = 'none'; // Hide the outer bar container
        }
    }

    // Function to move the user banner down and to the right
    function moveUserBanner() {
        const userBanner = document.querySelector('.user-avatar-badge.svelte-f8poj7');

        if (userBanner) {
            // Ensure the element is positioned relative or absolute
            userBanner.style.position = 'relative';

            // Move the banner down by 50% and 10% to the right
            userBanner.style.top = '50%';
            userBanner.style.left = '10%';
        }
    }

    // Function to align the text next to the user banner
    function alignUserText() {
        const userText = document.querySelector('.titles.svelte-1ihcisl');

        if (userText) {
            // Move the text down and to the right to align with the adjusted user badge
            userText.style.position = 'relative';
            userText.style.top = '50%';
            userText.style.left = '10%'; //
        }
    }

    // Initial adjustments
    hideBlueProgressBar();
    moveUserBanner();
    alignUserText();

    // Use MutationObserver to detect changes in the DOM and reapply changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            hideBlueProgressBar();
            moveUserBanner();
            alignUserText();
        });
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
