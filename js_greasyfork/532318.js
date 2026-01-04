// ==UserScript==
// @name         Torn Quick Disposal
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hover over disposal methods to select, then click the *same* method button to commit the crime. Resilient selectors.
// @author       Elaine [2047176] with Gemini 2.5
// @match        https://www.torn.com/crimes.php*
// @match        https://www.torn.com/loader.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532318/Torn%20Quick%20Disposal.user.js
// @updateURL https://update.greasyfork.org/scripts/532318/Torn%20Quick%20Disposal.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const METHOD_BUTTON_SELECTOR = '[class*="methodButton___"]';
    const COMMIT_BUTTON_SELECTOR = '[class*="commitButton___"]'; // Selector for the main "Dispose" button
    const CRIME_ROW_SELECTOR = '[class*="virtualItem___"]'; // Selector for the row containing method/commit buttons
    const CRIME_OPTIONS_CONTAINER_SELECTOR = '[class*="virtualList___"]';
    const DISPOSAL_CRIME_ROOT_SELECTOR = '.crime-root.disposal-root';

    // --- State Variables ---
    let armedMethodButton = null; // Keep track of the button that has the secondary listener
    let commitTriggerListener = null; // The secondary listener function itself

    // --- Helper Function to Wait for Element ---
    function waitForElement(selector, callback, parentNode = document.body) {
        if (!parentNode || typeof parentNode.querySelector !== 'function') {
            parentNode = document.body;
            if (!parentNode) {
                 console.error("Torn Quick Disposal: document.body not available.");
                 return;
            }
        }
        const element = parentNode.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            const observer = new MutationObserver((mutations, obs) => {
                 if (!document.contains(parentNode)) {
                     parentNode = document.body;
                 }
                 if (parentNode) {
                     const targetNode = parentNode.querySelector(selector);
                     if (targetNode) {
                         obs.disconnect();
                         callback(targetNode);
                     }
                 } else {
                      console.error("Torn Quick Disposal: parentNode became null during observation.");
                      obs.disconnect();
                 }
            });
            observer.observe(parentNode || document.body, {
                 childList: true,
                 subtree: true
            });
        }
    }

    // --- Function to Trigger the Actual Commit ---
    // This function will be attached as a temporary click listener to the method button
    function triggerCommit(event) {
        event.preventDefault(); // Stop the method button's default click behavior
        event.stopPropagation(); // Stop the event from bubbling further

        const methodButton = event.currentTarget; // The method button that was clicked
        const row = methodButton.closest(CRIME_ROW_SELECTOR);

        if (row) {
            const commitButton = row.querySelector(COMMIT_BUTTON_SELECTOR);
            if (commitButton) {
                // Check if the commit button is actually enabled
                const isDisabled = commitButton.hasAttribute('disabled') || commitButton.getAttribute('aria-disabled') === 'true';

                if (!isDisabled) {
                    console.log("Torn Quick Disposal: Triggering commit button click.");
                    commitButton.click(); // Click the *real* commit button
                } else {
                    console.log("Torn Quick Disposal: Commit button is disabled.");
                }
            } else {
                 console.log("Torn Quick Disposal: Commit button not found in row.");
            }
        } else {
             console.log("Torn Quick Disposal: Row not found for method button.");
        }

        // --- Cleanup ---
        // Remove this listener immediately after it fires once
        if (methodButton && commitTriggerListener) {
             methodButton.removeEventListener('click', commitTriggerListener);
             // console.log("Torn Quick Disposal: Removed commit trigger listener.");
             armedMethodButton = null;
             commitTriggerListener = null;
        }
    }

    // --- Main Logic ---
    function initializeHoverSelectAndArm() {
        console.log("Torn Quick Disposal (v0.3): Script running.");

        waitForElement(DISPOSAL_CRIME_ROOT_SELECTOR, (disposalRoot) => {
            console.log("Torn Quick Disposal (v0.3): Disposal root found.");

            waitForElement(CRIME_OPTIONS_CONTAINER_SELECTOR, (optionsContainer) => {
                console.log("Torn Quick Disposal (v0.3): Options container found. Initializing hover listener.");

                optionsContainer.addEventListener('mouseover', (event) => {
                    const currentMethodButton = event.target.closest(METHOD_BUTTON_SELECTOR);

                    if (currentMethodButton) {
                        // --- Select the method ---
                        currentMethodButton.click(); // Initial click to select the method via hover
                        // console.log("Hover-selected:", currentMethodButton.getAttribute('aria-label'));

                        // --- Remove listener from previously armed button ---
                        if (armedMethodButton && commitTriggerListener && armedMethodButton !== currentMethodButton) {
                            armedMethodButton.removeEventListener('click', commitTriggerListener);
                             // console.log("Torn Quick Disposal: Disarmed previous method button:", armedMethodButton.getAttribute('aria-label'));
                            armedMethodButton = null;
                            commitTriggerListener = null;
                        }

                        // --- Arm the current button (if not already armed) ---
                        if (armedMethodButton !== currentMethodButton) {
                             // Use setTimeout to allow the UI to update (commit button enable) after the selection click
                            setTimeout(() => {
                                // Re-verify the button still exists in DOM before adding listener
                                if (document.contains(currentMethodButton)) {
                                    // Define the specific listener function for *this* button instance
                                    const specificTrigger = (e) => triggerCommit(e);

                                    currentMethodButton.addEventListener('click', specificTrigger);
                                    armedMethodButton = currentMethodButton;
                                    commitTriggerListener = specificTrigger; // Store the specific function reference
                                    // console.log("Torn Quick Disposal: Armed method button:", currentMethodButton.getAttribute('aria-label'));
                                } else {
                                     console.log("Torn Quick Disposal: Method button detached before listener could be added.");
                                }
                            }, 50); // Small delay (50ms) - adjust if needed
                        }
                    }
                });

                 console.log("Torn Quick Disposal (v0.3): Hover listener attached.");

                 // Optional observer for robustness
                 const listObserver = new MutationObserver((mutations) => {});
                 listObserver.observe(optionsContainer, { childList: true, subtree: true });

            }, disposalRoot);
        });
    }

    // --- Start the script ---
    initializeHoverSelectAndArm();

})();
