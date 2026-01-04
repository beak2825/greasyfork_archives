// ==UserScript==
// @name         Mschf Plays Venmo **Live Chat**
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Add a chat interface to mschfplaysvenmo to talk to other players.
// @author       Alexander Hearn
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALpSURBVHgB7ZjNbtNAEMfHm+KvFDjzUSlFCEURFwQPwBPwFBx4C8RbcOAGT4DgjuBaaC+kyYEmh8KVlsR2mtZrZjYEpa4/Zv2RHurfpVI9G3t2Zv4zuwANDQ0NDVcZAzR5+uxJBDXy6f2O1jdtQAEMYYDdtqDVEgDkDr0y6+//hSv/hxzbOh2wXQvu97bA2bShaj68/axlX8gBYWAEXBMcjMJlk5tvSTnfvuFA7/E9cK87UAf+ZAaDvRFMfnu5NcGKgMp5TBshFr/lYuoYlP81ITaEeocMZa4tywGV8w+3VNpQOIQQYNsm1IVlX4NO97Zy4OO7L5m2LAcE7rbj2li068l5g2rM4b2rUBGv8ur563M5+vLNi6hK+zwqT2R/EkDgzVj5S3hoP/PnEMlifvAdYPbH/tcR/Ph+iB91wrLfR/uD/iEEAc8+Dj+FmBvk/fFBSglhyFtA9vTj8pQXsTjaNRDP4bIsdX6pNro1UZ+YF8SfzmAWzFUUOdTiQJkQ7X/DmlA1NGfZl5bRJMro4vTIQwULITwNWfbaDlCOkvT1dw6UZCZh5KyfHPsw3B1hAQepdtxNKHYewE5JA11rIzkDaeRIe0bQOYLWi1baeitz/SqFHLAcE7a7d1ShJe02DXpWxqxEDnZwfRRrdotzjaGGRhPnIQ58B1a+lHawzFmAhkHHrWauqryR5fWJsrNPnLX3ASpg0nquzuexdgdIfcbDX3AS8HQ+j1r6QBYknaRiMqwmk7SbJieH/WkAA+yokyM/8fnmTRe6j7aVlMbRnbW0I7DcQbttKjVJYvEcz7Qy+bKITnZpa3XRdmCwO0YJxD7Qu5sqpSb2gM6DW/8cuAg1MMvh6Xwe2g5Mjz2IIpmpItQn6rpyiVOsiFc29rLPxMUcMNKr38NLKSwBvFUwU2ed8/aBihiNDkXqovI+MMQbtdHgJwTMM/Fwb6zsufN/nMr7AF0HnuEsz9V5sidbeVZNZ25oaGhouFr8BeXeFkqaQMXMAAAAAElFTkSuQmCC
// @match        https://mschfplaysvenmo.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499176/Mschf%20Plays%20Venmo%20%2A%2ALive%20Chat%2A%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/499176/Mschf%20Plays%20Venmo%20%2A%2ALive%20Chat%2A%2A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_MESSAGES = 100; // Maximum number of messages to store
    const initialPlayers = 20000; // Initial number of players
    const startDate = new Date('2024-06-27T14:00:00'); // Start date and time of the game

    // Prompt user for their name
    let username = localStorage.getItem('chatUsername');
    if (!username) {
        username = prompt("Please enter your name:");
        localStorage.setItem('chatUsername', username);
    }

    // Create chat interface
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatContainer';
    chatContainer.innerHTML = `
      <div id="chatWindow"></div>
      <input type="text" id="chatInput" placeholder="Type a message..." />
    `;
    document.body.appendChild(chatContainer);

    // Create stats box
    const statsContainer = document.createElement('div');
    statsContainer.id = 'statsContainer';
    document.body.appendChild(statsContainer);

    // Style the chat interface and stats box
    const style = document.createElement('style');
    style.textContent = `
      #chatContainer {
        position: fixed;
        bottom: 0;
        right: 0;
        width: 300px;
        height: 200px;
        background: white;
        border: 1px solid #ccc;
        z-index: 10000;
        display: flex;
        flex-direction: column;
      }
      #chatWindow {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
      }
      #chatInput {
        border-top: 1px solid #ccc;
        padding: 10px;
      }
      .system-message {
        color: red;
        font-weight: bold;
      }
      #statsContainer {
        position: fixed;
        top: 10px;
        left: 10px;
        width: 200px;
        padding: 10px;
        background: #f0f0f0;
        border: 2px solid #000;
        font-family: 'Courier New', Courier, monospace;
        font-size: 14px;
        color: #000;
        z-index: 10000;
      }
    `;
    document.head.appendChild(style);

    // Function to append message to chat window
    function appendMessage(username, message, timestamp, isSystem = false) {
        const chatMessage = document.createElement('div');
        const timeString = new Date(timestamp).toLocaleTimeString();
        chatMessage.textContent = `${timeString} - ${username}: ${message}`;
        if (isSystem) {
            chatMessage.classList.add('system-message');
        }
        chatWindow.appendChild(chatMessage);
        chatWindow.scrollTop = chatWindow.scrollHeight;  // Scroll to bottom
    }

    // Load previous messages from localStorage (only for this user)
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    savedMessages.forEach(msg => appendMessage(msg.username, msg.message, msg.timestamp, msg.isSystem));

    // Display system message on initial load
    if (!localStorage.getItem('systemMessageDisplayed')) {
        const systemMessage = "Thanks for downloading the Live Chat Extension! This was created by Alex, if you would like to request an improvement or donate, you can Zelle or message 2402464471. Thanks, and good luck!";
        const timestamp = Date.now();
        appendMessage('System', systemMessage, timestamp, true);
        savedMessages.push({ username: 'System', message: systemMessage, timestamp, isSystem: true });
        if (savedMessages.length > MAX_MESSAGES) {
            savedMessages.shift(); // Remove the oldest message if limit exceeded
        }
        localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
        localStorage.setItem('systemMessageDisplayed', true);
    }

    // Set up BroadcastChannel
    const channel = new BroadcastChannel('chat_channel');

    chatInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const message = chatInput.value.trim();
            if (message) {
                const timestamp = Date.now();
                appendMessage(username, message, timestamp);
                chatInput.value = '';

                // Save message locally (only for this user)
                savedMessages.push({ username, message, timestamp });
                if (savedMessages.length > MAX_MESSAGES) {
                    savedMessages.shift(); // Remove the oldest message if limit exceeded
                }
                localStorage.setItem('chatMessages', JSON.stringify(savedMessages));

                // Broadcast message to others
                channel.postMessage({ username, message, timestamp });
            }
        }
    });

    // Listen for incoming messages
    channel.addEventListener('message', function(event) {
        if (event.data.username !== username) {  // Ensure you don't see your own message again
            appendMessage(event.data.username, event.data.message, event.data.timestamp);

            // Save message locally (only for this user)
            savedMessages.push({ username: event.data.username, message: event.data.message, timestamp: event.data.timestamp });
            if (savedMessages.length > MAX_MESSAGES) {
                savedMessages.shift(); // Remove the oldest message if limit exceeded
            }
            localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
        }
    });

    // Function to update stats
    function updateStats() {
        const now = new Date();
        const elapsedHours = Math.floor((now - startDate) / (1000 * 60 * 60));
        const daysElapsed = Math.floor(elapsedHours / 24);


        statsContainer.innerHTML = `
            <div>Days elapsed: ${daysElapsed}</div>
            <div>Zelle: 2402464471</div>
        `;
    }

    // Update stats every minute
    updateStats();
    setInterval(updateStats, 60000);

})();