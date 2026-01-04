// ==UserScript==
// @name         Poe Ai Unlimited Messages V2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description Unlimited message limit
// @author       Viruszy
// @match        https://poe.com/chat/212ctfsvq4mi10vt5wm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487854/Poe%20Ai%20Unlimited%20Messages%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/487854/Poe%20Ai%20Unlimited%20Messages%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to provide unlimited free messages for Poe AI Web-Search Bot
    function provideFreeMessages() {
        // Define the input field for the message
        const inputField = document.querySelector('input[data-testid="message-input"]');
        if (inputField) {
            // Replace "Your unlimited free message goes here." with the desired message
            const message = "Your unlimited free message goes here.";
            // Fill the input field with the message
            inputField.value = message;
            // Trigger the input event to simulate typing
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            console.error('Message input field not found.');
        }
    }

    // Provide free messages at regular intervals (in milliseconds)
    setInterval(provideFreeMessages, 1000); // Adjust the interval as needed
})()