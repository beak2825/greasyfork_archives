// ==UserScript==
// @name         ✅ Scrap.tf Full Auto-Accept Trade
// @namespace    http://tampermonkey.net/
// @version      1.50
// @description  Automatically handle trades across all Scrap.tf pages and Steam trade offers dynamically, without manual delays.
// @author       Ajinkya Rane
// @match        https://scrap.tf/*
// @match        https://steamcommunity.com/tradeoffer/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520509/%E2%9C%85%20Scraptf%20Full%20Auto-Accept%20Trade.user.js
// @updateURL https://update.greasyfork.org/scripts/520509/%E2%9C%85%20Scraptf%20Full%20Auto-Accept%20Trade.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Utility function to wait for an element to be visible and trigger a callback
    function waitForVisibleElement(selector, callback, interval = 500) {
        const checkExist = setInterval(() => {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null) {
                console.log(`[DEBUG] Element "${selector}" is visible.`);
                clearInterval(checkExist);
                callback(element);
            } else {
                console.log(`[DEBUG] Waiting for element "${selector}" to become visible...`);
            }
        }, interval);
    }

    // Function to directly trigger click events
    function performClick(element) {
        if (element) {
            try {
                console.log(`[DEBUG] Clicking on element:`, element);
                element.click(); // Use the native click method
            } catch (error) {
                console.error(`[ERROR] Failed to click on element: ${error}`);
            }
        } else {
            console.error(`[ERROR] Element not found.`);
        }
    }

    // Function to continuously attempt confirmation and acceptance
    function attemptConfirmationAndAcceptance() {
        console.log(`[DEBUG] Starting confirmation and acceptance process.`);

        const confirmSelector = '#you_notready'; // "Confirm Trade Contents" button
        const acceptSelector = '#trade_confirmbtn'; // "Accept Trade" button
        const modalSelector = '.newmodal .title_text'; // Modal with "Additional confirmation needed"

        const repeatAction = setInterval(() => {
            const modal = document.querySelector(modalSelector);
            if (modal && modal.textContent.includes("Additional confirmation needed")) {
                console.log(`[DEBUG] "Additional confirmation needed" modal detected. Closing popup.`);
                clearInterval(repeatAction);

                // Close the popup (if running in a child window)
                if (window.opener) {
                    console.log(`[DEBUG] This is a popup window. Closing it now.`);
                    window.close();
                } else {
                    console.log(`[DEBUG] Not a popup. Redirecting to a blank page.`);
                    window.location.href = "about:blank"; // Redirect as a fallback
                }
                return;
            }

            const confirmButton = document.querySelector(confirmSelector);
            if (confirmButton && confirmButton.offsetParent !== null) {
                console.log(`[DEBUG] "Confirm Trade Contents" button is visible. Clicking it.`);
                performClick(confirmButton);
            }

            const acceptButton = document.querySelector(acceptSelector);
            if (acceptButton && acceptButton.offsetParent !== null) {
                console.log(`[DEBUG] "Accept Trade" button is visible. Clicking it.`);
                performClick(acceptButton);
            }
        }, 500); // Retry every 500ms for dynamic updates
    }

    // Function to handle the "Open Trade Offer" button
    function handleOpenTradeOfferButton() {
        waitForVisibleElement('.mm-queue-trade-confirmed', (button) => {
            console.log(`[DEBUG] 'Open Trade Offer' button is visible. Clicking it.`);
            performClick(button);

            // Immediately start handling the confirmation process
            console.log(`[DEBUG] Handling the confirmation process after clicking 'Open Trade Offer'.`);
            attemptConfirmationAndAcceptance();
        });
    }

    // Detects any dynamic changes in trade item boxes and ensures they are fully loaded
    function ensureTradeItemsLoaded(callback) {
        const tradeItemContainer = document.querySelector('.trade_item_box');
        if (tradeItemContainer && tradeItemContainer.children.length > 0) {
            console.log(`[DEBUG] Trade items fully loaded.`);
            callback();
        } else {
            console.log(`[DEBUG] Waiting for trade items to load...`);
            setTimeout(() => ensureTradeItemsLoaded(callback), 500); // Retry every 500ms
        }
    }

    // Main logic for handling different pages
    if (window.location.href.includes("https://scrap.tf/")) {
        console.log(`[DEBUG] On Scrap.tf page.`);
        handleOpenTradeOfferButton(); // Handle Scrap.tf open trade offers
    } else if (window.location.href.includes("https://steamcommunity.com/tradeoffer/")) {
        console.log(`[DEBUG] On Steam trade offer page.`);
        ensureTradeItemsLoaded(() => {
            attemptConfirmationAndAcceptance(); // Start handling trade confirmation and acceptance
        });
    }
})();
