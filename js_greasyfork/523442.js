// ==UserScript==
// @name         Zoom Recording Passcode Autofill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-fill Zoom recording passcode from clipboard and submit it.
// @author       ChatGPT
// @match        *://*.zoom.us/rec/*
// @grant        GM_setClipboard
// @grant        GM_getClipboard
// @grant        clipboardRead
// @downloadURL https://update.greasyfork.org/scripts/523442/Zoom%20Recording%20Passcode%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/523442/Zoom%20Recording%20Passcode%20Autofill.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Utility function to wait for an element to appear
    function waitForElement(selector, callback, interval = 500, timeout = 10000) {
        const startTime = Date.now();
        const timer = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(timer);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(timer);
                console.warn(`Element with selector "${selector}" not found within timeout.`);
            }
        }, interval);
    }

    // Read clipboard content using GM_getClipboard or navigator.clipboard
    async function getClipboardContent() {
        try {
            if (typeof GM_getClipboard === 'function') {
                return GM_getClipboard(); // Use Tampermonkey's API
            } else if (navigator.clipboard && navigator.clipboard.readText) {
                return await navigator.clipboard.readText(); // Use standard API
            } else {
                throw new Error('Clipboard API not available.');
            }
        } catch (error) {
            console.error('Error accessing clipboard:', error);
            return null;
        }
    }

    // Main logic
    waitForElement('#passcode', async (inputElement) => {
        const clipboardContent = await getClipboardContent();

        if (clipboardContent) {
            console.log('Clipboard content found:', clipboardContent);

            // Fill the input with clipboard content
            inputElement.value = clipboardContent;
            const event = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(event);

            // Wait for the button and click it
            waitForElement('#passcode_btn', (buttonElement) => {
                buttonElement.click();
            });
        } else {
            console.warn('Clipboard is empty or unavailable.');
        }
    });
})();
