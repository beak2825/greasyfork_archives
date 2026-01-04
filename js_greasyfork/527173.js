// ==UserScript==
// @name         ZedCity-Move Scavenge Button
// @namespace    http://tampermonkey.net/
// @version      1.9.3
// @description  Move the Scavenge button next to the Go Back button on page load & click
// @author       YoYo
// @license      MIT
// @match        https://www.zed.city/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527173/ZedCity-Move%20Scavenge%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/527173/ZedCity-Move%20Scavenge%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function moveScavengeButton() {
        
        const goBackButton = document.querySelector('.q-pb-sm button.q-btn--flat');
        const scavengeButton = document.querySelector('button[data-cy="scavenge-btn"]');

        if (goBackButton && scavengeButton) {
            console.log('🔍 Go Back button and Scavenge button found. Moving Scavenge button...');

            // Ensure it doesn't get duplicated by checking if it's already moved
            if (goBackButton.nextSibling !== scavengeButton) {
                goBackButton.parentElement.insertBefore(scavengeButton, goBackButton.nextSibling);
                console.log('✅ Scavenge button successfully moved next to Go Back.');
            }
        } else {
            console.log('⚠️ Go Back or Scavenge button not found. Will check again on next click.');
        }
    }

    // Function to wait for the Scavenge button to exist, then move it
    function waitForScavengeButton() {
        const checkInterval = setInterval(() => {
            const scavengeButton = document.querySelector('button[data-cy="scavenge-btn"]');
            if (scavengeButton) {
                console.log("✅ Scavenge button detected! Moving it now...");
                moveScavengeButton();
                clearInterval(checkInterval);
            }
        }, 100); // Check every 100ms until the button appears
    }

    // Run the function on page load
    window.addEventListener('load', () => {
        console.log('🚀 Page loaded. Running initial check...');
        moveScavengeButton();
    });

    // Run the function on every click (ensures it works after clicking into "Forest", etc.)
    document.addEventListener('click', (event) => {
        console.log('🖱️ Click detected! Checking button positions...');

        // Start waiting for the Scavenge button to appear if it hasn't already
        waitForScavengeButton();
    });

})();
