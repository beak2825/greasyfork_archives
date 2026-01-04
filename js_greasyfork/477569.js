// ==UserScript==
// @name         TinyChat Chatbot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A basic chatbot for TinyChat
// @author       Your Name
// @match        https://tinychat.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477569/TinyChat%20Chatbot.user.js
// @updateURL https://update.greasyfork.org/scripts/477569/TinyChat%20Chatbot.meta.js
// ==/UserScript==
// ==UserScript==
// @name         TinyChat Chatbot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A chatbot with session control for TinyChat
// @author       Your Name
// @match        https://tinychat.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let inChatSession = false;

    // Function to send a message in the chat
    function sendMessage(message) {
        const chatInput = document.querySelector('input#inputChat');
        const sendButton = document.querySelector('button#chatButton');

        chatInput.value = message;
        sendButton.click();
    }

    // Function to start a chat session
    function startChatSession() {
        inChatSession = true;
        sendMessage("Chatbot: Chat session started.");
    }

    // Function to end a chat session
    function endChatSession() {
        inChatSession = false;
        sendMessage("Chatbot: Chat session ended.");
    }

    // Function to handle incoming messages
    function handleIncomingMessage(message) {
        // Check if the message is a command
        if (message === "!startchat" && !inChatSession) {
            startChatSession();
        } else if (message === "!endchat" && inChatSession) {
            endChatSession();
        } else if (inChatSession) {
            // Process other chatbot logic within the chat session
            // For this basic example, just echo the message
            sendMessage("Chatbot: " + message);
        }
    }

    // Listen for new messages
    const chatMessages = document.querySelector('ul#messages');
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                const newMessage = mutation.addedNodes[0].textContent.trim();
                if (newMessage) {
                    handleIncomingMessage(newMessage);
                }
            }
        });
    });

    // Start observing the chat for new messages
    observer.observe(chatMessages, { childList: true });
})();

(function() {
    'use strict';

    // Function to send a message in the chat
    function sendMessage(message) {
        var chatInput = document.querySelector('input#inputChat');
        var sendButton = document.querySelector('button#chatButton');

        chatInput.value = message;
        sendButton.click();
    }

    // Function to handle incoming messages
    function handleIncomingMessage(message) {
        // Your chatbot logic here
        // For this basic example, just echo the message
        sendMessage("Chatbot: " + message);
    }

    // Listen for new messages
    var chatMessages = document.querySelector('ul#messages');
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                var newMessage = mutation.addedNodes[0].textContent.trim();
                if (newMessage) {
                    handleIncomingMessage(newMessage);
                }
            }
        });
    });

    // Start observing the chat for new messages
    observer.observe(chatMessages, { childList: true });
})();
