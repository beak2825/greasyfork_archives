// ==UserScript==
// @name         Auto Retry for lucida.to
// @author       cracktorio
// @namespace    https://cracktorio.net/
// @version      1.1
// @description  Automatically press the retry button when something goes wrong. Mostly meant to fix error 429 but also works for other errors.
// @match        *://lucida.to/*
// @match        *://lucida.su/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/514449/Auto%20Retry%20for%20lucidato.user.js
// @updateURL https://update.greasyfork.org/scripts/514449/Auto%20Retry%20for%20lucidato.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the selector for the div that changes display
    const displayDivSelector = '#zip-error'; // Replace with the actual class of the div
    let displayDiv;
    let RetryButton;
    console.log("retry download script running");

    // Interval check function to detect display change
    setInterval(() => {
    displayDiv = document.querySelector(displayDivSelector);
    RetryButton = document.querySelector('button[data-action="retry"]');

        if (displayDiv && window.getComputedStyle(displayDiv).display !== 'none' && RetryButton) {
            console.log("Waiting 200ms to press retry button.");
            setTimeout(() => {
                RetryButton.click();
                console.log("Retry button clicked due to display change.");
            }, 200); // Wait 200ms before clicking
        }
    }, 2000); // Check every 2000 milliseconds

})();
