// ==UserScript==
// @name         Schwarze Liste
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blacklist for Stumblechat moderators
// @author       MeKLiN
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495923/Schwarze%20Liste.user.js
// @updateURL https://update.greasyfork.org/scripts/495923/Schwarze%20Liste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store WebSocket globally
    let webSocket;

    // Store ban list in local storage
    let banList = [];

    // User map to keep track of users and their handles
    const userMap = new Map();

    // Override WebSocket constructor to intercept WebSocket creation
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        // Create WebSocket connection
        webSocket = new originalWebSocket(url, protocols);

        // Event listener for receiving messages
        webSocket.addEventListener('message', event => {
            handleWebSocketMessage(event.data);
        });

        return webSocket;
    };

    // Function to handle WebSocket messages
    function handleWebSocketMessage(message) {
        const parsedMessage = JSON.parse(message);
        console.log('Received message:', parsedMessage);
        if (parsedMessage.stumble === "join") {
            const { handle, username } = parsedMessage;
            console.log('User joined:', username);
            // Add user to user map
            userMap.set(username, handle);
            // Check if the user is banned
            if (banList.includes(username)) {
                console.log('User is banned. Triggering ban...');
                // Trigger ban for the user
                triggerBan(handle);
            }
        }
    }

    // Function to trigger ban
    function triggerBan(handle) {
        console.log(`Banning user with handle: ${handle}`);
        // Send ban message
        const banRequest = JSON.stringify({ "stumble": "ban", "handle": handle });
        webSocket.send(banRequest);
    }

    // Function to send ban requests for banned users on join
    async function sendBanRequestsOnJoin() {
        console.log('Sending ban requests for banned users on join...');
        const userList = document.querySelectorAll('.bar .username');
        userList.forEach(user => {
            const username = user.textContent.trim();
            if (banList.includes(username)) {
                const handle = user.closest('.bar').getAttribute('user-id');
                if (handle) {
                    console.log(`Banning user: ${username}`);
                    // Trigger ban for the user
                    triggerBan(handle);
                }
            }
        });
    }

    // Function to handle the file input and extract usernames
    function handleFileInput(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                banList = content.split('\n').map(username => username.trim());
                // Save updated ban list in local storage
                localStorage.setItem("banList", JSON.stringify(banList));
                console.log('Ban list loaded:', banList);
            };
            reader.readAsText(file);
        }
    }

    // Function to create load file button
    function createLoadFileButton() {
        const loadFileButton = document.createElement('input');
        loadFileButton.type = 'file';
        loadFileButton.accept = '.txt';
        loadFileButton.style.position = 'fixed';
        loadFileButton.style.top = '10px';
        loadFileButton.style.right = '150px';
        loadFileButton.style.zIndex = '1000';
        loadFileButton.addEventListener('change', handleFileInput);
        document.body.appendChild(loadFileButton);
    }

    // Function to create activate button
    function createActivateButton() {
        const activateButton = document.createElement('button');
        activateButton.textContent = 'Activate';
        activateButton.style.position = 'fixed';
        activateButton.style.top = '10px';
        activateButton.style.right = '10px';
        activateButton.style.zIndex = '1000';
        activateButton.addEventListener('click', () => {
            // Send ban requests for banned users on join
            sendBanRequestsOnJoin();
            // Hide the activate button after clicking
            activateButton.style.display = 'none';
        });
        document.body.appendChild(activateButton);
    }

    // Load ban list from local storage
    const storedBanList = localStorage.getItem("banList");
    if (storedBanList) {
        banList = JSON.parse(storedBanList);
        console.log('Ban list loaded from local storage:', banList);
    }

    // Create load file button and activate button
    createLoadFileButton();
    createActivateButton();

})();
