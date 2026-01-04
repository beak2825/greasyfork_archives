// ==UserScript==
// @name         Canva Phrase Shortcut Enhancer
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Insert predefined phrases into Canva text fields by pressing keys (1, 2, 3, etc.).
// @author       Taeyang
// @match        https://www.canva.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=canva.com
// @grant        none
//// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524210/Canva%20Phrase%20Shortcut%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/524210/Canva%20Phrase%20Shortcut%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Define phrases for each command
    const phrases = {
        '1': 'Hello People.',
        '2': 'sigma.',
        '3': 'how are you ',
        '4': 'New kids of 5E',
    };

    // Insert phrase into a focused text input or create a notification
    function insertPhrase(phrase) {
        const activeElement = document.activeElement;

        // Check if the active element is a text input or text area
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
            const cursorPosition = activeElement.selectionStart;
            const currentValue = activeElement.value;

            // Insert the phrase at the cursor's position
            activeElement.value =
                currentValue.slice(0, cursorPosition) +
                phrase +
                currentValue.slice(cursorPosition);

            // Restore focus and set the cursor after the inserted text
            activeElement.focus();
            activeElement.setSelectionRange(cursorPosition + phrase.length, cursorPosition + phrase.length);
        } else {
            // Display as a floating notification if no text field is focused
            showNotification(phrase);
        }
    }

    // Display a floating notification
    function showNotification(text) {
        const notification = document.createElement('div');
        notification.innerText = text;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #00c4cc;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            animation: fadeOut 3s forwards;
        `;
        document.body.appendChild(notification);

        // Remove the notification after 3 seconds
        setTimeout(() => notification.remove(), 3000);
    }

    // Listen for keydown events
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        // Check if the pressed key matches one of the defined phrases
        if (phrases[key]) {
            insertPhrase(phrases[key]);
        }
    });

    // Add fadeOut animation for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            0% { opacity: 1; }
            100% { opacity: 0; transform: translateY(10px); }
        }
    `;
    document.head.appendChild(style);
})();