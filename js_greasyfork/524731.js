// ==UserScript==
// @name         Cavegame Join Notification
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Notify when someone joins Cavegame with a blue box message
// @author       DevzGod
// @match        *://cavegame.io/*
// @grant        Heath
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524731/Cavegame%20Join%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/524731/Cavegame%20Join%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a notification box
    function createNotification(message) {
        // Create the notification container
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(0, 0, 255, 0.8)'; // Blue color
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        notification.textContent = message;

        // Append to the body
        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Simulate a join event (you'll need to hook into the game's API or WebSocket for real events)
    function simulateJoinEvent(playerName) {
        createNotification(`${playerName} have Loged into CaveHAX by Dev`);
    }

    // Example: Simulate someone joining after 2 seconds
    setTimeout(() => {
        simulateJoinEvent('You');
    }, 2000);

    // Hook into the game's actual events if possible
    // For example, if the game has a WebSocket connection:
    /*
    const socket = new WebSocket('wss://example-game-socket');
    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'playerJoin') {
            createNotification(`${data.playerName} has joined the game!`);
        }
    });
    */
})();
