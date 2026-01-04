// ==UserScript==
// @name         Disable Broken Deep Research Button
// @namespace    http://tampermonkey.net/
// @version      2025.07.11.2
// @description  Fixes a bug where Gemini constantly re-enables the Deep Research button by waiting for generation to complete before disabling it.
// @author       Charles Pritchard (with community fixes)
// @match        https://gemini.google.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542288/Disable%20Broken%20Deep%20Research%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/542288/Disable%20Broken%20Deep%20Research%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let userHasTakenControl = false;
    let debounceTimeout = null;

    const forceButtonOff = (button) => {
        if (button && button.classList.contains('is-selected')) {
            button.click();
        }
    };

    const whenGenerationComplete = (callback) => {
        const chatInputContainer = document.querySelector('.prompt-box-container');
        if (!chatInputContainer || chatInputContainer.querySelector('mat-icon[fonticon="send"]')) {
            callback();
            return;
        }

        const observer = new MutationObserver(() => {
            if (chatInputContainer.querySelector('mat-icon[fonticon="send"]')) {
                observer.disconnect();
                callback();
            }
        });

        observer.observe(chatInputContainer, { childList: true, subtree: true });
    };

    /**
     * Finds the current version of the button,
     * checks its state, and applies the fix if needed.
     */
    function checkAndFixState() {
        const deepResearchButton = Array.from(document.querySelectorAll('button.toolbox-drawer-item-button'))
            .find(btn => btn.querySelector('[data-mat-icon-name="travel_explore"]'));

        if (!deepResearchButton) {
            return; // Button isn't on the page right now.
        }

        // Make sure we're always listening on the *current* button for a user click.
        if (!deepResearchButton._hasListener) {
            deepResearchButton.addEventListener('click', (event) => {
                if (event.isTrusted) {
                    userHasTakenControl = true;
                }
            }, { once: true });
            deepResearchButton._hasListener = true;
        }

        // If the button is on and the user hasn't touched it, start the fix.
        if (deepResearchButton.classList.contains('is-selected') && !userHasTakenControl) {
            whenGenerationComplete(() => {
                setTimeout(() => {
                    const finalButton = Array.from(document.querySelectorAll('button.toolbox-drawer-item-button'))
                        .find(btn => btn.querySelector('[data-mat-icon-name="travel_explore"]'));
                    forceButtonOff(finalButton);
                }, 100);
            });
        }
    }

    // Use a MutationObserver on the entire document body.
    const universalObserver = new MutationObserver(() => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(checkAndFixState, 200);
    });

    // Start observing.
    universalObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run an initial check after the page loads.
    setTimeout(checkAndFixState, 1000);
})();