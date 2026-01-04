// ==UserScript==
// @name         NHentai Favorites Auto Remove
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Automatically removes favorite items on NHentai page
// @author       Xenon @SipofTeaTV
// @match        https://nhentai.net/favorites/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489219/NHentai%20Favorites%20Auto%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/489219/NHentai%20Favorites%20Auto%20Remove.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRemoving = false; // Flag to track if removal process is active

    // Function to click on the remove button for each favorite item with delay
    function removeFavoritesWithDelay() {
        let removeButtons = document.querySelectorAll('.remove-button');
        let totalButtons = removeButtons.length;
        let removedCount = 0;

        removeButtons.forEach((button, index) => {
            setTimeout(() => {
                button.click();
                removedCount++;

                // Update button text after all favorites have been removed
                if (removedCount === totalButtons) {
                    isRemoving = false;
                    document.getElementById('remove-button').textContent = 'Remove All Favorites Manually';
                }
            }, index * 200); // Delay between each removal: 200ms
        });
    }

    // Function to add a manual trigger button
    function addManualTriggerButton() {
        var button = document.createElement('button');
        button.id = 'remove-button';
        button.textContent = 'Clean Current Page';
        button.style.position = 'fixed';
        button.style.top = '70px';
        button.style.left = '20px';
        button.style.zIndex = '9999';
        button.style.backgroundColor = '#ed2553';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '5px';

        button.addEventListener('click', function() {
            if (!isRemoving) {
                if (confirm('Are you sure you want to remove all favorites on this page?')) {
                    removeFavoritesWithDelay();
                    isRemoving = true;
                    button.textContent = 'Removing...';
                }
            }
        });

        document.body.appendChild(button);
    }

    // Wait for the page to load before adding the manual trigger button
    window.addEventListener('load', function() {
        // Add manual trigger button
        addManualTriggerButton();
    });
})();
