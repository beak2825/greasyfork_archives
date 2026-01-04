// ==UserScript==
// @name         DeepSeek AI Chat Manager
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a movable button to delete all chats and display the count of deleted chats. Works for both mobile and PC users.
// @author       Zensnx
// @match        *://*chat.deepseek.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528712/DeepSeek%20AI%20Chat%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/528712/DeepSeek%20AI%20Chat%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the movable button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '20px';
    buttonContainer.style.right = '20px';
    buttonContainer.style.zIndex = '1000';
    buttonContainer.style.padding = '10px';
    buttonContainer.style.backgroundColor = '#f1f1f1';
    buttonContainer.style.border = '1px solid #ccc';
    buttonContainer.style.borderRadius = '5px';
    buttonContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    buttonContainer.style.cursor = 'move';

    // Create the "Open" button
    const openButton = document.createElement('button');
    openButton.innerText = 'Open';
    openButton.style.marginRight = '10px';
    openButton.style.padding = '5px 10px';
    openButton.style.backgroundColor = '#4CAF50';
    openButton.style.color = 'white';
    openButton.style.border = 'none';
    openButton.style.borderRadius = '3px';
    openButton.style.cursor = 'pointer';

    // Create the "Delete All Chats" button
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete All Chats';
    deleteButton.style.padding = '5px 10px';
    deleteButton.style.backgroundColor = '#f44336';
    deleteButton.style.color = 'white';
    deleteButton.style.border = 'none';
    deleteButton.style.borderRadius = '3px';
    deleteButton.style.cursor = 'pointer';

    // Create a counter display
    const counterDisplay = document.createElement('div');
    counterDisplay.style.marginTop = '10px';
    counterDisplay.style.fontSize = '14px';
    counterDisplay.style.color = '#333';

    // Append elements to the container
    buttonContainer.appendChild(openButton);
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(counterDisplay);

    // Add the container to the body
    document.body.appendChild(buttonContainer);

    // Make the container movable (for both mobile and PC)
    let isDragging = false;
    let offsetX, offsetY;

    // PC: Mouse events
    buttonContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - buttonContainer.getBoundingClientRect().left;
        offsetY = e.clientY - buttonContainer.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            buttonContainer.style.left = `${e.clientX - offsetX}px`;
            buttonContainer.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Mobile: Touch events
    buttonContainer.addEventListener('touchstart', (e) => {
        isDragging = true;
        const touch = e.touches[0];
        offsetX = touch.clientX - buttonContainer.getBoundingClientRect().left;
        offsetY = touch.clientY - buttonContainer.getBoundingClientRect().top;
    });

    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            buttonContainer.style.left = `${touch.clientX - offsetX}px`;
            buttonContainer.style.top = `${touch.clientY - offsetY}px`;
        }
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    // Function to delete all chats
    deleteButton.addEventListener('click', () => {
        const chatElements = document.querySelectorAll('.chat-item'); // Adjust the selector based on the actual chat element class
        const chatCount = chatElements.length;

        chatElements.forEach(chat => chat.remove());

        counterDisplay.innerText = `${chatCount} chats deleted!`;
    });

    // Open button functionality (you can customize this)
    openButton.addEventListener('click', () => {
        alert('Open button clicked!');
    });
})();