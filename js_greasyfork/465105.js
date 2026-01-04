// ==UserScript==
// @name         为ChatGPT添加发送快捷键：Ctrl+Enter
// @version      1.1
// @description  Adds Ctrl+Enter shortcut for sending messages in OpenAI chat
// @match        https://chat.openai.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @author       ChopChopsticks
// @namespace https://greasyfork.org/users/1052311
// @downloadURL https://update.greasyfork.org/scripts/465105/%E4%B8%BAChatGPT%E6%B7%BB%E5%8A%A0%E5%8F%91%E9%80%81%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%9ACtrl%2BEnter.user.js
// @updateURL https://update.greasyfork.org/scripts/465105/%E4%B8%BAChatGPT%E6%B7%BB%E5%8A%A0%E5%8F%91%E9%80%81%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%9ACtrl%2BEnter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the send button
    const sendButton = document.querySelector('[data-testid="send-button"]');

    // Add event listener for keydown events on the chat input field
    document.querySelector('[data-testid="chat-input"]').addEventListener('keydown', function(event) {
        // Check if Ctrl+Enter is pressed
        if (event.ctrlKey && event.keyCode === 13) {
            // If so, prevent the default action of the Enter key (adding a newline)
            event.preventDefault();
            // Simulate a click on the send button
            sendButton.click();
        }
    });
})();
