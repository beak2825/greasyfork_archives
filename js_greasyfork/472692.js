// ==UserScript==
// @name         Twitch - Disable empty "Featured Clips Only" page
// @version      1.02
// @description  Automatically toggles "Featured Clips Only" off if the clips page doesn't have any featured clips.
// @author       Taizun
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/scripts/472692-twitch-always-disable-featured-clips-only
// @downloadURL https://update.greasyfork.org/scripts/472692/Twitch%20-%20Disable%20empty%20%22Featured%20Clips%20Only%22%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/472692/Twitch%20-%20Disable%20empty%20%22Featured%20Clips%20Only%22%20page.meta.js
// ==/UserScript==

// This script is no longer maintained. Please install FFZ if you'd like the same functionality.

(function() {
    'use strict';

    // Flag to track if the button has been clicked during this page navigation
    let buttonClicked = false;

    // Function to check if the SVG element exists on the page
    function svgExists() {
        const svgSrc = 'https://static-cdn.jtvnw.net/c3-vg/pinned-clips/clip.svg';
        const svgElements = document.querySelectorAll(`img[src="${svgSrc}"]`);
        const svgFound = svgElements.length > 0;

        // Reset the buttonClicked flag when SVG disappears
        if (!svgFound) {
            buttonClicked = false;
        }

        return svgFound;
    }

    // Function to click the button
    function clickButton() {
        const button = document.getElementById('featured-clips-toggle');
        if (button && !buttonClicked) {
            button.click();
            buttonClicked = true; // Set the flag to true after clicking
            console.log('Button clicked.');
        }
    }

    // Watch for changes in the DOM using MutationObserver
    const observer = new MutationObserver(function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && svgExists()) {
                clickButton();
                // The observer will keep monitoring for changes
            }
        }
    });

    // Start observing changes in the entire document
    observer.observe(document, { childList: true, subtree: true });

})();

// This script is no longer maintained. Please install FFZ if you'd like the same functionality.