// ==UserScript==
// @name         Last.fm Auto Click PLAY ON DEVICE
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Auto clicks the PLAY ON DEVICE button so you don't have to do it manually when you are opening multiple tabs on Last.fm
// @author       dogAteTaco
// @match        *://last.fm/*
// @match        *://*.last.fm/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524607/Lastfm%20Auto%20Click%20PLAY%20ON%20DEVICE.user.js
// @updateURL https://update.greasyfork.org/scripts/524607/Lastfm%20Auto%20Click%20PLAY%20ON%20DEVICE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to attempt clicking the Play button inside the modal
    function clickPlayButton() {
        const playButton = Array.from(document.querySelectorAll('.form-group .btn-primary'))
            .find(button => button.textContent.trim() === 'Play on this device'); // Match by text content

        if (playButton && playButton.offsetParent !== null) { // Check if the button is visible
            playButton.click();
            console.log("Play button clicked.");
        } else {
            console.log("Play button not found or not visible.");
        }
    }

    // Set up a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check if the modal content has been added or changed
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                // Try to click the play button if it's visible
                clickPlayButton();
            }
        });
    });

    // Start observing changes in the body and all subtrees (inside the page)
    observer.observe(document.body, {
        childList: true, // Observe direct child additions/removals
        subtree: true // Observe all descendants of the body
    });

    // Optionally, you can try clicking the button immediately when the script loads
    clickPlayButton();
})();
