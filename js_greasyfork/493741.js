// ==UserScript==
// @name         companion script
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  companion of the original script.
// @author       Ahmed
// @match        https://cherdak.console3.com/global/support-notification/notifications/create
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493741/companion%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/493741/companion%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForInputField(selector, callback) {
        console.log("Waiting for input field using selector:", selector); // Log the selector used
        const checkInterval = setInterval(function() {
            const inputElement = document.querySelector(selector);
            if (inputElement) {
                console.log("Input field found:", inputElement); // Log when the input field is found
                clearInterval(checkInterval);
                callback(inputElement);
            }
        }, 100); // check every 100 milliseconds
    }

    function simulateInput(inputElement, value) {
        console.log("Simulating input for element:", inputElement, "with value:", value); // Log the element and value being simulated
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        inputElement.focus();
        nativeInputValueSetter.call(inputElement, value);
        inputElement.dispatchEvent(new Event('input', {bubbles: true}));
        inputElement.dispatchEvent(new Event('change', {bubbles: true})); // some frameworks listen for change event

        // This part attempts to trigger any final events that might signal user completion
        inputElement.blur();
        inputElement.focus();
    }

    function pasteClipboardData(inputElement) {
        navigator.clipboard.readText().then(text => {
            console.log("Clipboard text retrieved:", text); // Log the text retrieved from clipboard
            if (/\d{6,}/.test(text)) { // Check if clipboard content is a number with 6 or more digits
                simulateInput(inputElement, text);
            } else {
                console.log("Clipboard content doesn't meet criteria. Not pasting."); // Log when clipboard content doesn't meet the criteria
            }
        }).catch(err => {
            console.error('Clipboard access denied:', err); // Log if there's an error accessing the clipboard
        });
    }

    window.addEventListener('load', function() {
        console.log("Window loaded, initiating script."); // Log when the window has loaded and the script initiation begins
        waitForInputField('input[name="audience.userIds"]', pasteClipboardData);
    });
})();
