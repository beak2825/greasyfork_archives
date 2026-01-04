// ==UserScript==
// @name         Snailcat Auto DM Bot
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Automatically sends messages to a Snailcat on web browser
// @match        https://discord.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515455/Snailcat%20Auto%20DM%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/515455/Snailcat%20Auto%20DM%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script started");

    function sendMessage(content) {
        const messageInput = document.querySelector('div[contenteditable="true"][data-slate-editor="true"]');
        if (!messageInput) {
            console.error('Message input field not found. Retrying...');
            setTimeout(() => sendMessage(content), 2000);
            return;
        }

        messageInput.focus();

        // Clear existing content by selecting all and deleting
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(messageInput);
        selection.removeAllRanges();
        selection.addRange(range);

        const deleteEvent = new InputEvent('beforeinput', {
            bubbles: true,
            cancelable: true,
            inputType: 'deleteContentBackward',
        });
        messageInput.dispatchEvent(deleteEvent);

        // Insert new content using 'insertText' inputType
        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            const inputEvent = new InputEvent('beforeinput', {
                data: char,
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
            });
            messageInput.dispatchEvent(inputEvent);
        }

        // Send the message by simulating 'Enter' keydown event
        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
        });
        messageInput.dispatchEvent(enterEvent);

        console.log("Message sent:", content);
    }

    // Send both messages immediately, with retry logic if input is not available
    sendMessage('snailcat beg');
    sendMessage('snailcat daily');

    // Send "snailcat beg" every 10 minutes with an additional 10-second buffer (610,000 milliseconds)
    setInterval(() => sendMessage('snailcat beg'), 610000);

    // Send "snailcat daily" once every hour with an additional 1-minute buffer (3,600,000 milliseconds)
    setTimeout(function dailyMessage() {
        sendMessage('snailcat daily');
        setTimeout(dailyMessage, 3600000); // Schedule next daily message
    }, 3600000); // Initial delay for the first daily message after immediate send
})();
