// ==UserScript==
// @name         SSC-ASN | Verifikasi (PPPK)
// @namespace    https://verifikasi-sscasn.bkn.go.id/pppk/verifikasi
// @version      0.1
// @license      MIT
// @description  Click field NIK PPPK
// @author       chm
// @match        https://verifikasi-sscasn.bkn.go.id/pppk/verifikasi
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513634/SSC-ASN%20%7C%20Verifikasi%20%28PPPK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513634/SSC-ASN%20%7C%20Verifikasi%20%28PPPK%29.meta.js
// ==/UserScript==

// waitForElement with custom interval
// Custom waitForElement with an intervalDuration parameter
const waitForElement = (selector, intervalDuration = 100) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            }
        }, intervalDuration);

        // Timeout after 10 seconds to avoid infinite waiting
        setTimeout(() => {
            clearInterval(interval);
            reject(`Element with selector "${selector}" not found after waiting.`);
        }, 10000); // 10 seconds timeout
    });
};

const waitForElements = (selector, intervalDuration = 100) => {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                clearInterval(interval);
                resolve(elements);
            }
        }, intervalDuration);

        // Timeout after 10 seconds to avoid infinite waiting
        setTimeout(() => {
            clearInterval(interval);
            reject(`Elements with selector "${selector}" not found after waiting.`);
        }, 10000); // 10 seconds timeout
    });
};

(async function () {
    'use strict';

    try {
        // Wait for NIK input field (check every 100ms)
        const nikInput = await waitForElement("#mat-chip-list-input-0", 100);
        if (nikInput) {
            nikInput.click();
        } else {
            console.error('NIK input field not found.');
        }

        // Wait for input field (check every 100ms)
        const inputField = await waitForElement("#mat-input-0", 100);
        if (inputField) {
            inputField.click();

            // Get clipboard content and paste it into the input field
            try {
                const clipboardText = await navigator.clipboard.readText();
                inputField.value = clipboardText; // Set the input field value to the clipboard text
                inputField.dispatchEvent(new Event('input')); // Trigger input event to update Angular bindings
            } catch (err) {
                console.error('Failed to read clipboard contents: ', err);
            }
        } else {
            console.error('Input field not found.');
        }

        // Wait for the "Verifikasi" button to appear (check every 1600ms)
        const verifikasiButton = await waitForElement("a.btn-light-success", 1600);
        if (verifikasiButton) {
            verifikasiButton.click();
        } else {
            console.error('"Verifikasi" button not found.');
        }

        // Wait for all elements with the class "mat-slide-toggle-bar"
        const slideToggles = await waitForElements(".mat-slide-toggle-bar", 100);
        if (slideToggles.length > 0) {
            slideToggles.forEach(function(el, index) {
                setTimeout(() => {
                    if (el) {
                        el.click();
                    }
                }, index * 100); // Delay each toggle by 100ms times its index
            });
        } else {
            console.error('No slide toggles found.');
        }

        // Wait for buttons containing the text 'Ijazah Asli'
        const ijazahButtons = await waitForElements("button.mat-tooltip-trigger", 400);
        if (ijazahButtons.length > 0) {
            ijazahButtons.forEach(function(el, index) {
                setTimeout(function() {
                    if (el.textContent.includes('Ijazah Asli')) {
                        console.log('Clicking button:', el);
                        el.click();
                    }
                }, index * 100); // Delay each click by 100ms times its index
            });
        } else {
            console.error('No "Ijazah Asli" buttons found.');
        }

        // Wait for the third button (check every 100ms)
        const thirdButton = await waitForElement("button.mat-focus-indicator:nth-child(3)", 800);
        if (thirdButton) {
            thirdButton.click();
        } else {
            console.error('Third button not found.');
        }

    } catch (error) {
        console.error('Error:', error);
    }

})();