// ==UserScript==
// @name         Udemy.com Courses Auto-Checkout
// @namespace    https://www.linkedin.com/in/bernando-jr-minguita/
// @version      1.0
// @description  Automatically clicks the "Enroll now" button on Udemy payment page if available and enabled.
// @author       Bernando Jr Minguita
// @match        https://www.udemy.com/payment/checkout/express/course/*?*discountCode=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543407/Udemycom%20Courses%20Auto-Checkout.user.js
// @updateURL https://update.greasyfork.org/scripts/543407/Udemycom%20Courses%20Auto-Checkout.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 Bernando Jr Minguita

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function () {
    'use strict';

    /*** CONFIGURATION ***/
    const CLICK_DELAY_MS = 5000; // Time to wait before clicking (ms)
    const OBSERVER_TIMEOUT_MS = 20000; // Stop watching DOM after this (ms)

    // Global reference to observer for cleanup
    let observer;

    /**
     * Clicks the given button and stops the observer
     * @param {HTMLElement} button - The enroll button
     */
    function clickAndCleanup(button) {
        button.click();
        observer?.disconnect();
        console.log('[Auto-Enroll] Button clicked and observer disconnected.');
    }

    /**
     * Attempts to locate and click the "Enroll now" button
     */
    function attemptClick() {
        const xpath = `//button[contains(@class, 'checkout-button--checkout-button--button--')
                         and .//span[text()='Enroll now']]`;
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const button = result.singleNodeValue;

        if (!button) {
            console.log('[Auto-Enroll] Button not found. Waiting...');
            return;
        }

        const delayMsg = `Waiting ${CLICK_DELAY_MS / 1000}s before clicking...`;
        if (button.disabled) {
            console.log(`[Auto-Enroll] Button found but disabled. ${delayMsg}`);
            setTimeout(() => {
                button.disabled = false;
                console.log('[Auto-Enroll] Button enabled. Clicking...');
                clickAndCleanup(button);
            }, CLICK_DELAY_MS);
        } else {
            console.log(`[Auto-Enroll] Button found and enabled. ${delayMsg}`);
            setTimeout(() => clickAndCleanup(button), CLICK_DELAY_MS);
        }
    }

    /**
     * Initializes the MutationObserver to watch for DOM changes
     */
    function initObserver() {
        observer = new MutationObserver(() => attemptClick());
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        // Safety net to stop observer after fixed time
        setTimeout(() => {
            observer?.disconnect();
            console.log('[Auto-Enroll] Observer stopped after timeout.');
        }, OBSERVER_TIMEOUT_MS);
    }

    /*** MAIN EXECUTION ***/
    console.log('[Auto-Enroll] Script active.');
    attemptClick(); // Initial attempt in case button is already present
    initObserver(); // Start observing dynamic DOM changes

})();