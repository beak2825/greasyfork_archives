// ==UserScript==
// @name         WebSocket to Text Display (Opera)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Receive WebSocket text and display it in a box
// @author       Psycho
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519638/WebSocket%20to%20Text%20Display%20%28Opera%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519638/WebSocket%20to%20Text%20Display%20%28Opera%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Same WebSocket URL
    const websocketUrl = 'wss://echo.websocket.events';  // Use the same echo server
    const ws = new WebSocket(websocketUrl);

    ws.onopen = () => console.log('WebSocket connected');
    ws.onerror = (error) => console.error('WebSocket error:', error);

    // Create the rolling text box
    let displayDiv = document.createElement('div');
    displayDiv.style = `
        position: fixed;
        z-index: 9999;
        top: 20px;
        left: 20px;
        font-family: Arial, sans-serif;
        font-size: 20px;
        color: white;
        background-color: black;
        padding: 10px;
        border-radius: 5px;
        width: 300px;
        height: 30px;
        overflow: hidden;
    `;
    document.body.appendChild(displayDiv);

    let rollingText = '               '; // Start with 15 empty spaces
    const maxDisplayLength = 15;

    // WebSocket message handling
    ws.onmessage = (event) => {
        const receivedText = event.data.trim();
        console.log('Received text:', receivedText);

        // Update rolling text with the new message
        rollingText += receivedText + ' ';
        rollingText = rollingText.slice(-maxDisplayLength); // Keep text to 15 characters

        // Display the updated text
        displayDiv.textContent = rollingText.padEnd(maxDisplayLength, ' ');
    };
})();