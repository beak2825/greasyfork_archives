// ==UserScript==
// @name         github一键三连
// @namespace    emptycity
// @version      1.0
// @description  Adds a button for one-click triple action (Watching, Star, and Fork) on GitHub
// @author       Isaac Asimov
// @match        https://github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492434/github%E4%B8%80%E9%94%AE%E4%B8%89%E8%BF%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/492434/github%E4%B8%80%E9%94%AE%E4%B8%89%E8%BF%9E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton() {
        // Create a button element
        const button = document.createElement('button');
        button.textContent = '一键三连';
        button.style.position = 'fixed';
        button.style.top = '60px';
        button.style.right = '20px';
        button.style.zIndex = '9999';

        // Append the button to the body
        document.body.appendChild(button);

        // Add click event listener to the button
        button.addEventListener('click', performTripleAction);
    }

    function performTripleAction() {

        // Find the Watching, Star, and Fork buttons on the page
        const watchingButton = document.querySelector('summary[id="repository-details-watch-button"]');
        const forkButton = document.querySelector('a[id="fork-button"]');
        const starButton = document.querySelector('button[aria-label^="Star this repository"]');

        // Click the Star button if it exists
        if (starButton) {
            console.log('star this repository')
            starButton.click();
        }
        // Click the buttons if they exist
        if (watchingButton) {
            console.log('watch this repository');
            watchingButton.click();
        }

        if (forkButton) {
            forkButton.click();
        }
    }

    // Wait for the page to load
    window.addEventListener('load', createButton);
})();