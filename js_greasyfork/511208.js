// ==UserScript==
// @name         Enter to Send
// @namespace    https://chatgpt.com/
// @version      1
// @description  Automatically clicks the send button when the Enter key is pressed
// @match        https://chatgpt.com/
// @grant        none
// @license      Do What You Want
// @downloadURL https://update.greasyfork.org/scripts/511208/Enter%20to%20Send.user.js
// @updateURL https://update.greasyfork.org/scripts/511208/Enter%20to%20Send.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const sendButtonSelector = "button[data-testid='send-button']";

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const sendButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim().toLowerCase() === 'send');

            if (sendButton) {
              sendButton.click()
            } else {
              const button = document.querySelector(sendButtonSelector);
              button.click()
            }

        }
    });
})();
