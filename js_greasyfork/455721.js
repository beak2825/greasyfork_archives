
// ==UserScript==
// @name         canvas navigator
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  navigate left and right using arrow keys in canvas or even the assignments too!
// @author       icycoldveins
// @icon         none
// @grant        none
// @license     MIT
// @match      *://*.instructure.com/*
// @downloadURL https://update.greasyfork.org/scripts/455721/canvas%20navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/455721/canvas%20navigator.meta.js
// ==/UserScript==
// ==/UserScript==
(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            // Use the custom selector for previous button
            let prevButton = document.querySelector('[data-testid="previous-assignment-btn"]') ||
                             document.querySelector("[aria-label='Previous Module Item']") ||
                             document.querySelector("[aria-label='Previous Module Item - opens in new window']");
            if (prevButton) {
                prevButton.click();
            }
        }
        if (event.key === 'ArrowRight') {
            // Use the custom selector for next button
            let nextButton = document.querySelector('[data-testid="next-assignment-btn"]') ||
                             document.querySelector("[aria-label='Next Module Item']") ||
                             document.querySelector("[aria-label='Next Module Item - opens in new window']");
            if (nextButton) {
                nextButton.click();
            }
        }
        if (event.key === 's' && event.metaKey && event.shiftKey) {
            // Download the file
            let downloadButton = document.querySelector("[download='true']");
            if (downloadButton) {
                downloadButton.click();
            }
        }
    });
})();