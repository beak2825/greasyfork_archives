// ==UserScript==
// @name         Auto Delete Tweet Confirmation
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically confirm tweet deletion on X.com
// @author       wez + chatgpt
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512402/Auto%20Delete%20Tweet%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/512402/Auto%20Delete%20Tweet%20Confirmation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the confirmation button
    function clickConfirmButton() {
        const confirmButton = document.querySelector('[data-testid="confirmationSheetConfirm"]');
        if (confirmButton) {
            console.log('Confirmation button found, clicking...');
            confirmButton.click(); // Click to confirm deletion
        } else {
            console.log('Confirmation button not found.');
        }
    }

    // Create a MutationObserver to detect when the confirmation dialog appears
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Check if the confirmation dialog is in the DOM
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('[data-testid="confirmationSheetDialog"]')) {
                        console.log('Confirmation dialog detected, attempting to click confirm button...');
                        clickConfirmButton(); // Attempt to click the confirm button
                    }
                });
            }
        });
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    console.log('Auto Delete Tweet Confirmation script loaded');
})();
