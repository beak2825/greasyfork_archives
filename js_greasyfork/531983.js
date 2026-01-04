// ==UserScript==
// @name         Torn Disposal Quick Crime
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Clicks the commit button immediately after selecting a method on the Torn Disposal Crime page.
// @author       Elaine [2047176] and Gemini 2.5 Pro (experimental)
// @match        https://www.torn.com/loader.php?sid=crimes*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531983/Torn%20Disposal%20Quick%20Crime.user.js
// @updateURL https://update.greasyfork.org/scripts/531983/Torn%20Disposal%20Quick%20Crime.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CLICK_DELAY_MS = 100; // Delay in milliseconds before the commit button is clicked. Adjust if necessary.
    const DEBUG_MODE = false; // Set to true for console output for debugging
    // --- End Configuration ---

    function log(...args) {
        if (DEBUG_MODE) {
            console.log('[Torn Disposal Quick Crime]', ...args);
        }
    }

    function handleMethodClick(event) {
        // Find the clicked method button (or its parent element)
        const methodButton = event.target.closest('button.methodButton___lCgpf');

        if (methodButton) {
            log('Method button clicked:', methodButton.getAttribute('aria-label'));

            // Find the parent container element for the entire crime option
            // This contains both the method buttons and the commit button
            const crimeOptionWrapper = methodButton.closest('.crimeOptionWrapper___IOnLO');

            if (!crimeOptionWrapper) {
                log('Error: Could not find the parent container (.crimeOptionWrapper___IOnLO).');
                return;
            }

            log('Parent container found:', crimeOptionWrapper);

            // Short delay to ensure Torn has selected the method
            // and potentially updated/enabled the commit button.
            setTimeout(() => {
                // Find the commit button *within* the specific container of this crime option
                const commitButton = crimeOptionWrapper.querySelector('button.commit-button.commitButton___NYsg8');

                if (commitButton) {
                    log('Commit button found:', commitButton);

                    // Check if the button is clickable (not disabled)
                    if (!commitButton.disabled && !commitButton.classList.contains('disabled')) {
                        log('Clicking commit button...');
                        commitButton.click();
                    } else {
                        log('Commit button is disabled.');
                    }
                } else {
                    log('Error: Could not find the commit button (.commit-button.commitButton___NYsg8).');
                }
            }, CLICK_DELAY_MS);
        }
    }

    // --- Initialization and Observation ---
    let listenerAttached = false;
    let disposalRootElement = null;

    log('Script started. Waiting for Disposal Crime elements...');

    const observer = new MutationObserver((mutationsList, observer) => {
        // Check if the Disposal section is present
        const currentDisposalRoot = document.querySelector('div.crime-root.disposal-root');

        if (currentDisposalRoot && !listenerAttached) {
            log('Disposal Crime section found. Adding event listener.');
            disposalRootElement = currentDisposalRoot;
            // Event Delegation: Attach listener to the container that catches clicks on method buttons
            disposalRootElement.addEventListener('click', handleMethodClick);
            listenerAttached = true;
            log('Event listener added.');
            // Optional: Stop observation if only needed once
            // observer.disconnect();
        } else if (!currentDisposalRoot && listenerAttached) {
            // If the Disposal section disappears (e.g., switching to another crime), remove the listener
            log('Disposal Crime section no longer found. Removing event listener.');
            if (disposalRootElement) {
                disposalRootElement.removeEventListener('click', handleMethodClick);
            }
            listenerAttached = false;
            disposalRootElement = null;
        }

        // Additional safety check: Sometimes classes or attributes change,
        // without the root being removed. Re-check if the listener is still where it should be.
        if (currentDisposalRoot && listenerAttached && !disposalRootElement) {
             log('Warning: Listener was attached, but root element reference was lost. Attempting to reconnect.');
             if (disposalRootElement) disposalRootElement.removeEventListener('click', handleMethodClick); // Ensure old listeners are removed
             disposalRootElement = currentDisposalRoot;
             disposalRootElement.addEventListener('click', handleMethodClick);
             log('Event listener reconnected.');
        }
    });

    // Observe the addition/removal of elements in the main part of the page
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

     // Initial check in case the page is already loaded when the script executes
     const initialDisposalRoot = document.querySelector('div.crime-root.disposal-root');
        if (initialDisposalRoot && !listenerAttached) {
            log('Disposal Crime section found on initial load. Adding event listener.');
            disposalRootElement = initialDisposalRoot;
            disposalRootElement.addEventListener('click', handleMethodClick);
            listenerAttached = true;
             log('Event listener added initially.');
        }

})();