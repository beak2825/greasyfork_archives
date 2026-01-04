// ==UserScript==
// @name         ChatGPT in Gmail-like Compose Window
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Interact with ChatGPT in a Gmail-like compose window on chat.openai.com
// @author       You
// @match        https://chat.openai.com/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/464859/ChatGPT%20in%20Gmail-like%20Compose%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/464859/ChatGPT%20in%20Gmail-like%20Compose%20Window.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the modal container
    const modalContainer = document.createElement('div');
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';

    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.style.width = '500px';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0px 0px 8px rgba(0, 0, 0, 0.3)';
    modalContainer.appendChild(modalContent);

    // Create the textarea for user input
    const inputArea = document.createElement('textarea');
    inputArea.style.width = '100%';
    inputArea.style.height = '150px';
    modalContent.appendChild(inputArea);

    // Create the response area to show ChatGPT's replies
    const responseArea = document.createElement('div');
    responseArea.style.width = '100%';
    responseArea.style.marginTop = '10px';
    responseArea.style.padding = '10px';
    responseArea.style.border = '1px solid #ccc';
    responseArea.style.backgroundColor = '#f1f3f4';
    responseArea.textContent = 'ChatGPT\'s response will appear here...';
    modalContent.appendChild(responseArea);

    // Handle user input and simulate ChatGPT's response
    inputArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const userInput = inputArea.value.trim();
            // Simulate ChatGPT's response
            const chatGptResponse = `ChatGPT: ${userInput} (simulated response)`;
            responseArea.textContent = chatGptResponse;
        }
    });

    // Append the modal to the body
    document.body.appendChild(modalContainer);

})();
