// ==UserScript==
// @name         Intercept IV
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Intercept WebSocket messages on StumbleChat and display them
// @author       MeKLiN
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490055/Intercept%20IV.user.js
// @updateURL https://update.greasyfork.org/scripts/490055/Intercept%20IV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code starts here
    // ==============================================================

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
    // ==============================================================

    // Function to display WebSocket messages
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

    // Function to clear messages
    function clearMessages() {
        const webSocketMessagesDiv = document.getElementById("webSocketMessages");
        if (webSocketMessagesDiv) {
            webSocketMessagesDiv.innerHTML = "";
        }
    }

    // Function to toggle compact view
    function toggleCompactView() {
        const messages = document.querySelectorAll('.message .content');
        messages.forEach(message => {
            message.classList.toggle('compact');
        });
    }

    // Create top buttons
    function createTopButtons() {
        const topButtonsDiv = document.createElement("div");
        topButtonsDiv.id = "topButtons";
        topButtonsDiv.style.position = "fixed";
        topButtonsDiv.style.top = "10px";
        topButtonsDiv.style.left = "50%";
        topButtonsDiv.style.transform = "translateX(-50%)";
        topButtonsDiv.style.zIndex = "9999";

        // Clear button
        const clearButton = document.createElement("button");
        clearButton.textContent = "Clear";
        clearButton.style.background = "black";
        clearButton.style.color = "lime";
        clearButton.style.width = "50px";
        clearButton.style.height = "20px";
        clearButton.style.margin = "0 5px";
        clearButton.addEventListener("click", clearMessages);
        topButtonsDiv.appendChild(clearButton);

        // Compact button
        const compactButton = document.createElement("button");
        compactButton.textContent = "Compact";
        compactButton.style.background = "black";
        compactButton.style.color = "lime";
        compactButton.style.width = "60px";
        compactButton.style.height = "20px";
        compactButton.style.margin = "0 5px";
        compactButton.addEventListener("click", toggleCompactView);
        topButtonsDiv.appendChild(compactButton);

        // Clear all messages button
        const clearAllButton = document.createElement("button");
        clearAllButton.textContent = "Clear All";
        clearAllButton.style.background = "black";
        clearAllButton.style.color = "lime";
        clearAllButton.style.width = "70px";
        clearAllButton.style.height = "20px";
        clearAllButton.style.margin = "0 5px";
        clearAllButton.addEventListener("click", () => {
            clearMessages();
            clearAllChatMessages();
        });
        topButtonsDiv.appendChild(clearAllButton);

        // Append top buttons div to document body
        document.body.appendChild(topButtonsDiv);
    }

    // Call the function to create top buttons
    createTopButtons();

    // ==============================================================

    // Function to clear all chat messages
    function clearAllChatMessages() {
        const chatContent = document.getElementById("chat-content");
        if (chatContent) {
            chatContent.innerHTML = "";
        }
    }

    /* Additional compacting styles */
    /* Ensure the following styles are properly appended to the end of your userscript */
    /* without breaking the existing code structure */

    /* Compact message styles */
    /*@-moz-document url-prefix("https://stumblechat.com/room/") {*/
    // Compact message styles
    const compactStyles = `
    .message .nickname ~ .content {
        display: inline-block;
        top: -7px;
        position: relative;
        margin-left: 2px;
        margin-right: 1em;
    }
    .content + .content {
        display: inline-block!important;
        margin-right: 1em;
    }
    .message .nickname ~ .content span {
        line-height: 1.5em;
    }
    `;

    // Apply compact styles to the document
    const style = document.createElement('style');
    style.textContent = compactStyles;
    document.head.appendChild(style);
    /*}*/

})();

