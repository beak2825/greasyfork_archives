// ==UserScript==
// @name         Intercept 3
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Intercept WebSocket messages on StumbleChat and display them
// @author       MeKLiN
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485924/Intercept%203.user.js
// @updateURL https://update.greasyfork.org/scripts/485924/Intercept%203.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a function to display WebSocket messages
    function displayWebSocketMessage(message) {
        const webSocketMessagesDiv = document.getElementById("webSocketMessages");
        if (webSocketMessagesDiv) {
            webSocketMessagesDiv.innerHTML += message + "<br>";
            webSocketMessagesDiv.scrollTop = webSocketMessagesDiv.scrollHeight;
        }
    }

    // Override WebSocket constructor to intercept WebSocket creation
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        console.log('WebSocket URL:', url);

        // Call original WebSocket constructor
        const ws = new originalWebSocket(url, protocols);

        // Event listener for receiving messages
        ws.addEventListener('message', event => {
            displayWebSocketMessage(event.data);
        });

        return ws;
    };

    // Method to create the div for displaying WebSocket messages
    function createWebSocketMessagesDiv() {
        const div = document.createElement("div");
        div.id = "webSocketMessages";
        div.style.position = "relative";
        div.style.height = "25%";
        div.style.paddingLeft = "2px";
        div.style.willChange = "transform";
        div.style.boxSizing = "border-box";
        div.style.overflowX = "hidden";
        div.style.overflowY = "auto";
        div.style.color = "#ffffff"; // Set font color to white
        div.style.padding = "10px"; // Example padding
        div.style.zIndex = "2"; // Set a higher z-index value

        // Additional styles for specific scenarios
        div.style.display = "flex";
        div.style.flexDirection = "column";
        div.style.justifyContent = "flex-end";
        div.style.fontSize = "12px";

        div.style.whiteSpace = "normal"; // Allow text to wrap within the container
        div.style.wordWrap = "break-word"; // Allow long words to break and wrap

        // Locate and append custom div the chat-position div
        const chatPositionDiv = document.getElementById("chat-position");
        if (chatPositionDiv) {
            chatPositionDiv.appendChild(div);
        } else {
            // If chat-position div not found, append to document body
            document.body.appendChild(div);
        }
    }
    // Call the function to create the WebSocket messages div
    createWebSocketMessagesDiv();
})();