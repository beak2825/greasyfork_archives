// ==UserScript==
// @name         Character.ai Enhancements
// @namespace    https://greasyfork.org/en/scripts/
// @version      1.0
// @description  Adds various enhancements to Character.ai
// @author       Your Name
// @match        https://character.ai/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/498702/Characterai%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/498702/Characterai%20Enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the current site is Character.ai
    if (window.location.hostname !== 'character.ai') {
        return;
    }

    // Create a draggable button
    const button = document.createElement('button');
    button.innerText = 'Enhancements';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '10000';
    button.style.cursor = 'grab';

    // Add draggable functionality
    let isDragging = false;
    let offsetX, offsetY;

    button.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - button.offsetLeft;
        offsetY = e.clientY - button.offsetTop;
        button.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            button.style.left = (e.clientX - offsetX) + 'px';
            button.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        button.style.cursor = 'grab';
    });

    document.body.appendChild(button);

    // Function to get the user token
    function getUserToken() {
        const token = localStorage.getItem('auth_token'); // Example: Fetching from localStorage
        if (token) {
            alert(`User token: ${token}`);
        } else {
            alert('User token not found!');
        }
    }

    // Function to add memory editor
    function addMemoryEditor() {
        const memoryEditor = prompt('Enter new memory data:', 'Default memory data');
        if (memoryEditor !== null) {
            // Example: Save to localStorage (Implement the actual logic here)
            localStorage.setItem('memory_data', memoryEditor);
            alert('Memory data updated!');
        }
    }

    // Function to save chat
    function saveChat() {
        const chatHistory = document.querySelectorAll('.chat-message'); // Adjust the selector as needed
        const chatData = Array.from(chatHistory).map(msg => msg.innerText).join('\n');
        localStorage.setItem('saved_chat', chatData);
        alert('Chat history saved!');
    }

    // Function to download chat
    function downloadChat() {
        const chatHistory = document.querySelectorAll('.chat-message'); // Adjust the selector as needed
        const chatData = Array.from(chatHistory).map(msg => msg.innerText).join('\n');
        const blob = new Blob([chatData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chat_history.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Function to customize text color
    function customizeTextColor() {
        const color = prompt('Enter text color (e.g., red, #ff0000):', '#000000');
        if (color) {
            const chatMessages = document.querySelectorAll('.chat-message'); // Adjust the selector as needed
            chatMessages.forEach(msg => {
                msg.style.color = color;
            });
            alert('Text color updated!');
        }
    }

    // Event listener for button click
    button.addEventListener('click', function() {
        const options = ['Get User Token', 'Edit Memory', 'Save Chat', 'Download Chat', 'Customize Text Color'];
        const choice = prompt(`Choose an option:\n${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`);
        switch (choice) {
            case '1':
                getUserToken();
                break;
            case '2':
                addMemoryEditor();
                break;
            case '3':
                saveChat();
                break;
            case '4':
                downloadChat();
                break;
            case '5':
                customizeTextColor();
                break;
            default:
                alert('Invalid choice!');
        }
    });

})();
