// ==UserScript==
// @name         Twitch Custom Section Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes sections from Twitch.tv homepage based on user-defined strings in their rendered text. Gemini 2.5 Pro wrote the whole thing. Oneshot. No modifications. I'm unlikely to fix any issues.
// @author       SumOfAllN00bs
// @license      MIT
// @match        https://www.twitch.tv/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536975/Twitch%20Custom%20Section%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/536975/Twitch%20Custom%20Section%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_PREFIX = 'TwitchSectionRemover';

    // --- Configuration ---
    // Load blocked strings from storage, with a default example.
    let blockedStrings = GM_getValue('twitchBlockedStrings', ['Streamer University']);

    // --- Styling for Hidden Sections ---
    // This class will be added to sections that should be hidden.
    GM_addStyle(`
        .gm-hidden-section {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
        }
    `);

    // --- Functions to Manage Blocked Strings (via Tampermonkey Menu) ---
    function listBlockedStrings() {
        const currentList = GM_getValue('twitchBlockedStrings', []);
        console.log(`${SCRIPT_PREFIX}: Currently blocked strings:`, currentList);
        alert(`${SCRIPT_PREFIX}: Currently blocked strings:\n${currentList.join('\n') || '(No strings blocked)'}`);
    }

    function addBlockedString() {
        const newString = prompt(`${SCRIPT_PREFIX}: Enter a string to block (case-sensitive):`);
        if (newString && newString.trim() !== '') {
            let currentBlockedStrings = GM_getValue('twitchBlockedStrings', []);
            if (!currentBlockedStrings.includes(newString.trim())) {
                currentBlockedStrings.push(newString.trim());
                GM_setValue('twitchBlockedStrings', currentBlockedStrings);
                blockedStrings = currentBlockedStrings; // Update local cache
                console.log(`${SCRIPT_PREFIX}: Added '${newString.trim()}'. New list:`, currentBlockedStrings);
                alert(`${SCRIPT_PREFIX}: Added '${newString.trim()}'.`);
                checkAndRemoveSections(); // Re-run to apply the new string immediately
            } else {
                alert(`${SCRIPT_PREFIX}: String '${newString.trim()}' is already in the list.`);
            }
        }
    }

    function removeBlockedString() {
        let currentBlockedStrings = GM_getValue('twitchBlockedStrings', []);
        if (currentBlockedStrings.length === 0) {
            alert(`${SCRIPT_PREFIX}: Blocklist is currently empty.`);
            return;
        }
        const stringToRemove = prompt(`${SCRIPT_PREFIX}: Enter the exact string to remove from the blocklist:\n\nCurrently blocked:\n${currentBlockedStrings.join('\n')}`);
        if (stringToRemove && stringToRemove.trim() !== '') {
            const index = currentBlockedStrings.indexOf(stringToRemove.trim());
            if (index > -1) {
                const removed = currentBlockedStrings.splice(index, 1);
                GM_setValue('twitchBlockedStrings', currentBlockedStrings);
                blockedStrings = currentBlockedStrings; // Update local cache
                console.log(`${SCRIPT_PREFIX}: Removed '${removed[0]}'. New list:`, currentBlockedStrings);
                alert(`${SCRIPT_PREFIX}: Removed '${removed[0]}'.`);
                // Re-evaluate all sections: those that were hidden ONLY by the removed string will now be unhidden.
                checkAndRemoveSections();
            } else {
                alert(`${SCRIPT_PREFIX}: String '${stringToRemove.trim()}' not found in the list.`);
            }
        }
    }

    // Register menu commands for Tampermonkey
    GM_registerMenuCommand("List Blocked Strings", listBlockedStrings);
    GM_registerMenuCommand("Add String to Blocklist", addBlockedString);
    GM_registerMenuCommand("Remove String from Blocklist", removeBlockedString);

    // --- Core Logic to Find and Remove/Hide Elements ---
    function checkAndRemoveSections() {
        // Refresh blockedStrings from storage in case it was modified
        blockedStrings = GM_getValue('twitchBlockedStrings', []);

        // If no strings are blocked, ensure all sections previously hidden by this script are unhidden.
        if (blockedStrings.length === 0) {
            document.querySelectorAll('.gm-hidden-section').forEach(el => {
                el.classList.remove('gm-hidden-section');
            });
            return;
        }

        // Selector for the "great-grandparent" div.
        // Based on your input: "The parent of the parent of this div is this element: <div class="Layout-sc-1xcs6mc-0 cwJXDZ">"
        // This means `div.Layout-sc-1xcs6mc-0.cwJXDZ` is the great-grandparent of the text holder,
        // and the grandparent of the div-to-be-removed.
        const greatGrandParentSelector = 'div.Layout-sc-1xcs6mc-0.cwJXDZ';
        const greatGrandParents = document.querySelectorAll(greatGrandParentSelector);

        greatGrandParents.forEach(ggpElement => {
            // Iterate through children of ggpElement (these are potential GrandParents of the target sections)
            Array.from(ggpElement.children).forEach(gpElement => {
                if (gpElement.nodeType !== Node.ELEMENT_NODE) return;

                // Iterate through children of gpElement (these are the "grand-child" divs, candidates for removal)
                Array.from(gpElement.children).forEach(gcDiv => {
                    if (gcDiv.nodeType !== Node.ELEMENT_NODE) return;

                    let sectionShouldBeHidden = false;

                    // Check this gcDiv and its descendants for any of the blocked strings.
                    // Query for elements that are likely to contain primary text/titles.
                    const elementsToCheckForText = [gcDiv, ...Array.from(gcDiv.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, div[class*="title"], div[data-a-target*="title"]'))];

                    for (const textHoldingElement of elementsToCheckForText) {
                        // Ensure the element is visible (not display:none via other means) unless we hid its parent (gcDiv).
                        // If gcDiv itself is hidden, its children won't have an offsetParent.
                        if (textHoldingElement.offsetParent === null && !gcDiv.classList.contains('gm-hidden-section')) {
                            continue;
                        }

                        // Get text from direct child text nodes of the current textHoldingElement.
                        // This adheres to "rendered text of the same element".
                        let currentElementOwnText = "";
                        for (const childNode of textHoldingElement.childNodes) {
                            if (childNode.nodeType === Node.TEXT_NODE) {
                                currentElementOwnText += childNode.textContent;
                            }
                        }
                        currentElementOwnText = currentElementOwnText.replace(/\s+/g, ' ').trim(); // Normalize whitespace

                        if (currentElementOwnText) {
                            for (const blockedStr of blockedStrings) {
                                if (currentElementOwnText.includes(blockedStr)) {
                                    sectionShouldBeHidden = true;
                                    // console.log(`${SCRIPT_PREFIX}: Matched "${blockedStr}" in text "${currentElementOwnText}" of element:`, textHoldingElement);
                                    break; // Found a match for this textHoldingElement
                                }
                            }
                        }
                        if (sectionShouldBeHidden) break; // No need to check more text elements if one match already decided to hide gcDiv
                    }

                    // Apply or remove the hidden class based on the check
                    if (sectionShouldBeHidden) {
                        if (!gcDiv.classList.contains('gm-hidden-section')) {
                            // console.log(`${SCRIPT_PREFIX}: Hiding section (gcDiv):`, gcDiv);
                            gcDiv.classList.add('gm-hidden-section');
                        }
                    } else {
                        // If it was previously hidden by this script but no longer matches any current blocked string
                        if (gcDiv.classList.contains('gm-hidden-section')) {
                            // console.log(`${SCRIPT_PREFIX}: Unhiding section (gcDiv) as it no longer matches:`, gcDiv);
                            gcDiv.classList.remove('gm-hidden-section');
                        }
                    }
                });
            });
        });
    }

    // --- Utility: Debounce Function ---
    // This prevents the checkAndRemoveSections function from running too frequently during rapid DOM changes.
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const context = this;
            const later = () => {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // --- Mutation Observer ---
    // Observes changes in the DOM and triggers the removal logic.
    const debouncedSectionCheck = debounce(checkAndRemoveSections, 500); // 500ms debounce window
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            // We are interested in changes to the child list (elements added/removed)
            // and subtree modifications.
            if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                debouncedSectionCheck();
                return; // Debounced call will handle it
            }
            // if (mutation.type === 'subtree' ) { // Too frequent, childList is usually enough
            //    debouncedSectionCheck();
            //    return;
            // }
        }
    });

    // Start observing the entire document for changes.
    observer.observe(document.documentElement, {
        childList: true, // Observe direct children additions/removals
        subtree: true    // Observe all descendants as well
    });

    // --- Initial Execution ---
    // Run the check function a couple of times after the page initially loads,
    // as content might still be populating.
    setTimeout(checkAndRemoveSections, 1000); // After 1 second
    setTimeout(checkAndRemoveSections, 3000); // After 3 seconds for more dynamic content

})();