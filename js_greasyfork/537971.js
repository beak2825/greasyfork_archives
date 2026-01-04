// ==UserScript==
// @name         Dreadcast fix Centrale de vente
// @namespace    http://tampermonkey.net/
// @version      0.85
// @description  Handles dynamically created price input in popups on Dreadcast.
// @author       Your Name
// @match        https://www.dreadcast.net/Main*
// @match        https://www.dreadcast.net/Main/*
// @grant        GM_log
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537971/Dreadcast%20fix%20Centrale%20de%20vente.user.js
// @updateURL https://update.greasyfork.org/scripts/537971/Dreadcast%20fix%20Centrale%20de%20vente.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const inputName = 'centrale_vente_prix';
    const parentLiId = 'lb_form_centrale_vente_prix'; // We'll still use this to identify the structure

    function log(message, data) {
        const logMessage = `[DreadcastFix v0.8] ${message}`;
        console.log(logMessage, data || '');
        // GM_log(`${logMessage} ${data ? JSON.stringify(data) : ''}`);
    }

    function makeInputInteractive(inputElement, interactionType = "direct_action") {
        if (!inputElement) {
            log(`makeInputInteractive (${interactionType}): No input element.`);
            return false;
        }
        log(`makeInputInteractive (${interactionType}) for:`, inputElement.name);
        // log(`Current state: readonly=${inputElement.readOnly}, disabled=${inputElement.disabled}, value="${inputElement.value}"`);

        inputElement.style.outline = '2px solid blue'; // General "attempting" outline

        if (inputElement.disabled) {
            log('Input was disabled, enabling.');
            inputElement.disabled = false;
        }
        if (inputElement.readOnly) {
            log('Input was readonly, making writable.');
            inputElement.readOnly = false;
        }
        // Force type to text or number if it's something weird, though 'text' is usually fine.
        // if (inputElement.type !== 'text' && inputElement.type !== 'number') {
        //     log(`Input type was ${inputElement.type}, changing to text.`);
        //     inputElement.type = 'text';
        // }
        if (inputElement.inputMode !== 'numeric') {
            inputElement.inputMode = 'numeric';
            log('Set inputMode to numeric.');
        }

        // Only attempt focus if it's from a user interaction
        if (interactionType === "click" || interactionType === "touchend") {
            setTimeout(() => {
                log('Attempting programmatic focus due to user interaction...');
                inputElement.focus();

                if (document.activeElement === inputElement) {
                    log('Focus successful. Active element:', document.activeElement.name);
                    inputElement.style.outline = '2px solid limegreen';
                    if (typeof inputElement.select === 'function') {
                        inputElement.select();
                        log('Selected text in input.');
                    }
                } else {
                    log('Focus FAILED. Active element:', document.activeElement ? document.activeElement.name : 'null');
                    inputElement.style.outline = '2px solid red';
                }
            }, 50); // 50-100ms delay can be critical
        } else {
            log('Properties set via non-interaction call (e.g., observer).');
            setTimeout(() => {
                // Only remove blue outline if not focused by other means or successfully focused by us
                if (document.activeElement !== inputElement || inputElement.style.outline.includes('red')) {
                   inputElement.style.outline = '';
                }
            }, 1500);
        }
        return true;
    }

    function setupInputListeners(inputElement) {
        if (!inputElement || inputElement.dataset.gmPopupFixed === 'true') {
            // log('Input already has listeners for this instance or does not exist.');
            return;
        }
        log('Setting up DIRECT listeners for new input instance:', inputElement.name);

        // It's a new element, so no need to remove, just add.
        // Use capture phase to try and get ahead of site's own listeners on the input.
        inputElement.addEventListener('click', handleDirectInputInteraction, true);
        inputElement.addEventListener('touchend', handleDirectInputInteraction, true);

        // Add a blur listener to remove green/red outline if focus is lost
        inputElement.addEventListener('blur', () => {
            log('Input blurred, removing outline from:', inputElement.name);
            inputElement.style.outline = '';
        }, true);

        inputElement.dataset.gmPopupFixed = 'true'; // Mark this specific instance as processed
    }

    function handleDirectInputInteraction(event) {
        log(`Direct input interaction: ${event.type} on`, event.currentTarget.name);
        // Stop propagation to prevent site's listeners on THIS input (if any) from firing after us
        // or preventing default keyboard behavior.
        event.stopPropagation();
        // event.preventDefault(); // Usually too aggressive for focus, but a last resort.

        makeInputInteractive(event.currentTarget, event.type);
    }

    function scanForNewInput(nodeList) {
        for (const node of nodeList) {
            // We are interested in Element nodes, not text nodes etc.
            if (node.nodeType === Node.ELEMENT_NODE) {
                // Check if the added node itself is our target LI or contains it
                let targetLi = null;
                if (node.id === parentLiId && node.matches('li')) {
                    targetLi = node;
                } else if (typeof node.querySelector === 'function') { // Check if querySelector is available
                    targetLi = node.querySelector(`#${parentLiId}`);
                }

                if (targetLi) {
                    const newInput = targetLi.querySelector(`input[name="${inputName}"]`);
                    if (newInput && !newInput.dataset.gmPopupFixed) {
                        log('NEW price input found in added node structure:', newInput.name);
                        makeInputInteractive(newInput, "appearance_scan"); // Set properties, no immediate focus
                        setupInputListeners(newInput); // Add direct click/touch listeners
                    }
                }
            }
        }
    }

    let popupObserver;
    function initializeGlobalObserver() {
        log('Initializing Global Observer to watch for popup appearance...');

        // Observe the document body (or a more specific, stable container if known)
        const stableAncestor = document.body; // Or a more specific game container div

        if (!stableAncestor) {
            log('Could not find stable ancestor (document.body). Retrying...');
            setTimeout(initializeGlobalObserver, 1000);
            return;
        }

        popupObserver = new MutationObserver((mutationsList, obs) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // log('Nodes added to document. Scanning for new input...');
                    scanForNewInput(mutation.addedNodes);
                }
            }
        });

        log(`Starting MutationObserver on ${stableAncestor.tagName}.`);
        popupObserver.observe(stableAncestor, {
            childList: true, // Watch for direct children being added/removed
            subtree: true    // IMPORTANT: Watch for changes in all descendants
        });

        // Also, do an initial scan in case the popup is already there when the script runs
        log('Performing initial scan of document for existing input...');
        const existingLi = document.getElementById(parentLiId);
        if(existingLi) {
            const existingInput = existingLi.querySelector(`input[name="${inputName}"]`);
            if (existingInput && !existingInput.dataset.gmPopupFixed) {
                log('Found pre-existing input on load.');
                makeInputInteractive(existingInput, "initial_scan");
                setupInputListeners(existingInput);
            }
        }
    }

    // ---- Start Execution ----
    log('Script starting (Popup Aware v0.8)...');
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initializeGlobalObserver();
    } else {
        document.addEventListener('DOMContentLoaded', initializeGlobalObserver);
    }

    // Optional: Cleanup on script unload (Tampermonkey specific)
    // window.addEventListener('beforeunload', () => {
    //  if (popupObserver) {
    //      popupObserver.disconnect();
    //      log('Global Popup MutationObserver disconnected.');
    //  }
    // });
})();