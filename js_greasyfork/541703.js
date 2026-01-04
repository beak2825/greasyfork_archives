// ==UserScript==
// @name         ChatGPT Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enhances ChatGPT by bypassing some limitations
// @author       Benjamin Herasme
// @match        *://chat.openai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541703/ChatGPT%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/541703/ChatGPT%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to send a message to ChatGPT
    function sendMessage(message) {
        const textArea = document.querySelector('[placeholder="Send a message..."]');
        if (textArea) {
            textArea.value = message;
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            textArea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
        }
    }

    // Function to handle the response and continue the conversation
    function handleResponse(response) {
        const responseText = response.querySelector('.markdown').innerText;
        console.log('ChatGPT Response:', responseText);

        // Check if the response indicates a limitation (e.g., rate limiting)
        if (responseText.includes('Please try again later') || responseText.includes('Rate limit exceeded')) {
            setTimeout(() => {
                sendMessage('Continue...');
            }, 5000); // Wait for 5 seconds before sending the next message
        } else {
            // Continue the conversation if no limitations are detected
            setTimeout(() => {
                sendMessage('Continue...');
            }, 1000); // Wait for 1 second before sending the next message
        }
    }

    // Observe for new responses from ChatGPT
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('markdown')) {
                        handleResponse(node);
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Start the conversation
    sendMessage('Hello, ChatGPT! Let\'s have a conversation.');
})();