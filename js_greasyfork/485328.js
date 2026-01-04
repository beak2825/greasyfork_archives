// ==UserScript==
// @name         Bonk.io Chat
// @namespace    http://tampermonkey.net/
// @version      99.99
// @description  Chat with Bonk.io friends
// @author       You
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485328/Bonkio%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/485328/Bonkio%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to send a message
    function sendMessage(username, message) {
        // Implement your logic to send a message
        console.log(`Sending message to ${username}: ${message}`);
    }

    // Function to check online status
    function isUserOnline(username) {
        // Implement your logic to check if the user is online
        return true; // Replace with your actual check
    }

    // Function to create a chat button
    function createChatButton(username) {
        const button = document.createElement('button');
        button.textContent = 'Chat';
        button.addEventListener('click', () => {
            if (isUserOnline(username)) {
                const message = prompt(`Send a message to ${username}`);
                if (message) {
                    sendMessage(username, message);
                }
            } else {
                console.log(`${username} is offline right now.`);
            }
        });
        return button;
    }

    // Function to find and add chat buttons
    function addChatButtons() {
const friendList = document.querySelectorAll('.friend-list-item .name, .sideBarName'); // Adjust this selector based on Bonk.io's structure

        if (friendList) {
            friendList.forEach((friend) => {
                const username = friend.textContent.trim();
                const chatButton = createChatButton(username);
                friend.parentNode.appendChild(chatButton);
            });
        }
    }

    // Run the function once the page is fully loaded
    window.addEventListener('load', addChatButtons);

})();
