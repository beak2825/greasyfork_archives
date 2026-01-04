// ==UserScript==
// @name         YouTube Rich Grid Columns Changer (Override Inline Style)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Override YouTube's inline style for rich grid columns using MutationObserver.
// @author       fargly
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534287/YouTube%20Rich%20Grid%20Columns%20Changer%20%28Override%20Inline%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534287/YouTube%20Rich%20Grid%20Columns%20Changer%20%28Override%20Inline%20Style%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Safeguard: Ensure script runs only in the top-level window ---
    // This check is crucial to prevent the script from running in sandboxed iframes.
    if (window.top !== window) {
        return; // Stop script execution immediately if in an iframe
    }

    console.log('Tampermonkey script: Running in the top-level window. Preparing to override YouTube inline styles...');

    // --- Configuration ---
    // Set your desired number of posts per row here.
    const newValue = 5; // <--- Set your desired number of posts per row

    // --- Script Logic ---
    // Function to apply the desired style override
    function applyGridColumnsOverride() {
        // Defensive check, though the initial safeguard should prevent execution in iframes
        if (window.top !== window) {
            return;
        }

        // Target the element that typically holds YouTube's inline grid styles.
        // ytd-rich-grid-renderer is the most probable element for these variables.
        const gridElement = document.querySelector('ytd-rich-grid-renderer');

        if (gridElement) {
            // Apply the style directly to the element where YouTube sets its inline styles.
            // Setting the property on the element's style object will override
            // any value set by YouTube's script for this specific property.
            gridElement.style.setProperty('--ytd-rich-grid-posts-per-row', newValue);
            // This element needed to be added to change the visual
            gridElement.style.setProperty('--ytd-rich-grid-items-per-row', newValue);
            console.log(`Tampermonkey script: Attempted to set --ytd-rich-grid-posts-per-row on ytd-rich-grid-renderer to ${newValue}`);

            // You can optionally inspect the element in the browser's developer tools
            // after the script runs to see if the style is applied. It should appear
            // within the element's style="..." attribute.

        } else {
            console.log('Tampermonkey script: Could not find the grid element (ytd-rich-grid-renderer).');
            // This might happen if the element hasn't loaded yet, or YouTube's structure changed.
        }
    }

    // --- MutationObserver to re-apply style if YouTube overrides it ---
    let observer = null; // Variable to hold the MutationObserver instance

    function setupObserver() {
        // Disconnect any existing observer before setting up a new one
        if (observer) {
            observer.disconnect();
            observer = null; // Clear the reference
        }

        const gridElement = document.querySelector('ytd-rich-grid-renderer');

        if (gridElement) {
            // Create a new MutationObserver
            observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // We are specifically watching for changes to the 'style' attribute
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        console.log('Tampermonkey script: Style attribute changed on ytd-rich-grid-renderer. Re-applying override.');
                        // Re-apply our desired style whenever the style attribute changes
                        applyGridColumnsOverride();
                    }
                });
            });

            // Start observing the target element for attribute changes
            observer.observe(gridElement, {
                attributes: true // Configure observer to watch for attribute changes
            });

             console.log('Tampermonkey script: MutationObserver set up on ytd-rich-grid-renderer.');

        } else {
            console.log('Tampermonkey script: Could not find ytd-rich-grid-renderer to set up observer.');
            // If the element isn't found immediately, the observer can't be attached.
            // We rely on the initial timeout and the yt-navigate-finish listener to find it later.
        }
    }

    // --- Execution Triggers ---

    // 1. Initial attempt after the DOM is loaded and a short delay
    window.addEventListener('DOMContentLoaded', () => {
        // Use a timeout to give YouTube's elements time to render after DOM is ready
        setTimeout(() => {
            applyGridColumnsOverride(); // Apply style initially
            setupObserver(); // Set up the observer after the element should be present
        }, 2000); // 2 second delay - adjust if needed
    });

    // 2. Re-apply style and reset observer on YouTube's internal navigation
    // This is necessary because YouTube is a Single Page Application (SPA),
    // and the ytd-rich-grid-renderer element might be replaced or updated on navigation.
    window.addEventListener('yt-navigate-finish', () => {
        console.log('Tampermonkey script: Navigation finished. Re-applying style and attempting to re-set up observer.');
        // Use a short delay after navigation to allow new elements to load
        setTimeout(() => {
             applyGridColumnsOverride(); // Re-apply style on navigation
             setupObserver(); // Re-set up observer on the potentially new element
        }, 500); // 0.5 second delay after navigation
    });


    // --- Cleanup ---
    // Disconnect the observer when the page is unloaded to prevent memory leaks.
     window.addEventListener('beforeunload', () => {
         console.log('Tampermonkey script: Cleaning up observer.');
         if (observer) {
             observer.disconnect();
         }
         // Note: Removing event listeners added with anonymous functions or inside other functions
         // in SPAs can be complex. Disconnecting the observer is the most critical cleanup here.
     });


})();
