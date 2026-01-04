// ==UserScript==
// @name         YouTube Autoplay Off
// @name:tr      YouTube Otomatik Oynatma Kapat
// @version      1.6
// @author       Alyssa B. Morton
// @license      MIT
// @icon         https://www.youtube.com/favicon.ico
// @namespace    https://violentmonkey.github.io/
// @match        *://www.youtube.com/*
// @grant        none
// @description  Automatically disables autoplay on YouTube videos for a better viewing experience.
// @description:tr  YouTube videolarında otomatik oynatmayı devre dışı bırakır ve daha iyi bir izleme deneyimi sunar.
// @downloadURL https://update.greasyfork.org/scripts/515249/YouTube%20Autoplay%20Off.user.js
// @updateURL https://update.greasyfork.org/scripts/515249/YouTube%20Autoplay%20Off.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to turn off autoplay
    function turnOffAutoplay() {
        const autoplayButton = document.querySelector('.ytp-autonav-toggle-button[aria-checked="true"]');
        if (autoplayButton) {
            autoplayButton.click(); // Turn off autoplay
        }
    }

    // Function to check if autoplay is on and turn it off
    function checkAutoplay() {
        const autoplayButton = document.querySelector('.ytp-autonav-toggle-button');
        if (autoplayButton && autoplayButton.getAttribute('aria-checked') === 'true') {
            turnOffAutoplay(); // Turn off autoplay if it is on
        }
    }

    // Function to observe changes in the DOM
    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            checkAutoplay(); // Check if autoplay is on
        });

        // Start observing the body for child list changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Wait for the YouTube page to load
    window.addEventListener('load', () => {
        // Wait for an additional 60 seconds before turning off autoplay
        setTimeout(() => {
            turnOffAutoplay(); // Turn off autoplay after 60 seconds
            observeDOMChanges(); // Start observing for changes
        }, 60000); // 60000 milliseconds = 60 seconds
    });

    // Listen for the 'play' event on the video element
    document.addEventListener('play', (event) => {
        if (event.target.tagName === 'VIDEO') {
            checkAutoplay(); // Check if autoplay is on when a video starts playing
        }
    }, true);
})();
