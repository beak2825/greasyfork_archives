// ==UserScript==
// @name         Copy Last Code Block on ChatGPT Without Header
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button to copy the last code block on chat.openai.com without copying the header
// @author       max5555
// @license      MIT
// @match        https://chat.openai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481521/Copy%20Last%20Code%20Block%20on%20ChatGPT%20Without%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/481521/Copy%20Last%20Code%20Block%20on%20ChatGPT%20Without%20Header.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the copy button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Last Code';
    copyButton.style.position = 'fixed';
    copyButton.style.bottom = '20px';
    copyButton.style.right = '20px';
    copyButton.style.zIndex = '1000';

    // Add the button to the body
    document.body.appendChild(copyButton);

    // Function to show notification
    function showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '50px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'lightgreen';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
        notification.style.zIndex = '1001';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, duration);
    }

    // Function to copy the last code block
    copyButton.addEventListener('click', () => {
        const codeContainers = document.querySelectorAll('pre code');
        if (codeContainers.length > 0) {
            const lastCodeContainer = codeContainers[codeContainers.length - 1];
            navigator.clipboard.writeText(lastCodeContainer.textContent).then(() => {
                showNotification('Code copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        } else {
            showNotification('No code blocks found!');
        }
    });
})();
