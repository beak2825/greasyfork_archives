// ==UserScript==
// @name         Drawaria Chatbox Toggle
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a draggable button to toggle the visibility of the chatbox on Drawaria.online with a title.
// @match        https://drawaria.online/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @author       YouTubeDrawaria
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539541/Drawaria%20Chatbox%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/539541/Drawaria%20Chatbox%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to toggle chatbox visibility
    function toggleChatbox() {
        const chatbox = document.getElementById('chatbox_messages');
        if (chatbox) {
            if (chatbox.style.display === 'none') {
                chatbox.style.display = 'block'; // Or 'flex', 'grid', depending on its original display type
                toggleButton.innerText = 'Hide Chat';
            } else {
                chatbox.style.display = 'none';
                toggleButton.innerText = 'Show Chat';
            }
        }
    }

    // Create a container for the button and title, which will be draggable
    const container = document.createElement('div');
    container.id = 'chatboxToggleContainer';
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'flex-end'; // Aligns items to the right within the column
    container.style.cursor = 'grab'; // Indicates it's draggable
    container.style.userSelect = 'none'; // Prevent text selection during drag

    // Create the title div
    const titleDiv = document.createElement('div');
    titleDiv.id = 'chatboxToggleTitle';
    titleDiv.innerText = 'Chatbox Toggle';
    titleDiv.style.backgroundColor = '#343a40'; // Dark background for the title
    titleDiv.style.color = 'white';
    titleDiv.style.padding = '5px 10px';
    titleDiv.style.borderRadius = '5px 5px 0 0'; // Rounded top corners
    titleDiv.style.marginBottom = '-1px'; // Overlap slightly with the button border
    titleDiv.style.fontSize = '0.8em';
    titleDiv.style.whiteSpace = 'nowrap'; // Keep title on one line

    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleChatboxButton';
    toggleButton.style.padding = '8px 12px';
    toggleButton.style.backgroundColor = '#007bff';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '0 0 5px 5px'; // Rounded bottom corners
    toggleButton.style.cursor = 'pointer';
    toggleButton.textContent = 'Hide Chat'; // Initial text, assuming chat is visible by default

    // Add event listener to the button
    toggleButton.addEventListener('click', toggleChatbox);

    // Append title and button to the container
    container.appendChild(titleDiv);
    container.appendChild(toggleButton);

    // Append the container to the body
    document.body.appendChild(container);

    // Initial check for chatbox visibility to set the button text correctly
    const chatbox = document.getElementById('chatbox_messages');
    if (chatbox && chatbox.style.display === 'none') {
        toggleButton.innerText = 'Show Chat';
    }

    // Make the container draggable
    let isDragging = false;
    let offsetX, offsetY;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        container.style.cursor = 'grabbing'; // Change cursor to indicate dragging
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        container.style.left = `${newX}px`;
        container.style.top = `${newY}px`;
        container.style.right = 'auto'; // Disable right/bottom positioning when dragging via left/top
        container.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        container.style.cursor = 'grab'; // Reset cursor
    });

})();