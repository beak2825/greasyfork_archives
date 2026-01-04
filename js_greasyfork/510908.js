// ==UserScript==
// @name         Manual Message Numbering
// @namespace    -
// @version      1.4
// @description  Numbers each message in chat and allows clearing the counter
// @author       Clawberry
// @match        https://character.ai/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510908/Manual%20Message%20Numbering.user.js
// @updateURL https://update.greasyfork.org/scripts/510908/Manual%20Message%20Numbering.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isCleared = false; // Tracks whether numbers are cleared or not

    // Function to number messages
    const numberMessage = (message, index) => {
        let numberSpan = message.querySelector('.message-number');
        if (!numberSpan) {
            numberSpan = document.createElement('span');
            numberSpan.classList.add('message-number');
            numberSpan.style.cssText = 'font-weight: bold; margin-right: 5px; color: #595959;';
            message.prepend(numberSpan);
        }
        numberSpan.textContent = `${index + 1}. `;
    };

    // Function to number all messages
    const numberAllMessages = () => {
        const messages = Array.from(document.querySelectorAll('.m-0:not(.swiper .m-0)'));
        messages.forEach(numberMessage);
    };

    // Function to clear message numbers
    const clearAllMessages = () => {
        const messages = Array.from(document.querySelectorAll('.message-number'));
        messages.forEach(span => {
            span.textContent = '';
        });
    };

    // Create the button and add event listeners
    const createButton = () => {
        const button = document.createElement('button');
        button.textContent = 'Update Message Counter';
        button.style.cssText = `
            position: fixed;
            bottom: 5px;
            right: 10px;
            z-index: 9999;
            padding: 5px 5px;
            background-color: #000;
            color: #FFF;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.7em;
        `;

        // Toggle between updating and clearing message numbers on button click
        button.addEventListener('click', () => {
            if (isCleared) {
                numberAllMessages(); // Add numbers back
                button.textContent = 'Clear Message Counter'; // Update button text
            } else {
                clearAllMessages(); // Clear numbers
                button.textContent = 'Update Message Counter'; // Update button text
            }
            isCleared = !isCleared; // Toggle state
        });

        document.body.appendChild(button);
    };

    // Observe the chat for new messages
    const observeChat = () => {
        const observer = new MutationObserver(numberAllMessages);
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            observer.observe(chatContainer, { childList: true, subtree: true });
        }
    };

    createButton();
    setTimeout(() => {
        numberAllMessages();
        observeChat();
    }, 1000);
})();