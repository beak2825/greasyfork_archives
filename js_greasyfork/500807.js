// ==UserScript==
// @name         Share Google Slides controls
// @namespace    http://lostinbrittany.dev
// @version      2024-07-15
// @description  Share Google Slides controls, useful for meetings...
// @author       Horacio Gonzalez <horacio.gonzalez@gmail.com>
// @match        https://docs.google.com/presentation/*
// @icon         https://lostinbrittany.org/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500807/Share%20Google%20Slides%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/500807/Share%20Google%20Slides%20controls.meta.js
// ==/UserScript==

/*jshint esversion: 11 */

(async function() {
    'use strict';
    
    const {html, render} = await import('https://cdn.jsdelivr.net/npm/lit-html@3.1.4/+esm');

    // Get the pathname of the current page
    const pathname = window.location.pathname;

    const slidedeck = pathname.replace('/presentation/d/','').split('/')[0];

    console.log(`Presentation Id: ${slidedeck}`);

    let generatedQRCode = await getQRCode();
    showDialog();

    async function getQRCode() {
        let resp = await fetch("https://shared-google-slides-control.cleverapps.io/qrcode", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({url:`https://shared-google-slides-control.cleverapps.io/ui/#${slidedeck}`}),
        });
        let generatedQRCode = await resp.text();
        return generatedQRCode;
    }

    function showDialog() {
        const dialog = html`<dialog id="shareDialog">
              <form method="dialog">
                <h1>Remote control URL</h1>
                <p>
                  <a href="https://shared-google-slides-control.cleverapps.io/ui/#${slidedeck}">
                    https://shared-google-slides-control.cleverapps.io/ui/#${slidedeck}
                  </a>
                </p>
                <div style="display:flex;flex-flow:row;justify-content:center;"><img src="${generatedQRCode}"></div>
                <div style="display:flex;flex-flow:row;justify-content:center;gap:2rem;">
                  <button autofocus id="copyDialog" style="padding:0.5rem;min-width:10rem">Copy</button>
                  <button id="closeDialog" style="padding:0.5rem;min-width:10rem">Close</button>
                </div>
              </form>
            </dialog>`;

        let dialogParent = document.createElement('div');
        document.body.appendChild(dialogParent);
        render(dialog, dialogParent);
        document.getElementById('shareDialog').showModal();

        const closeButton = document.getElementById("closeDialog");
        closeButton.addEventListener("click", () => {
            document.getElementById('shareDialog').close();
        });
        const copyButton = document.getElementById("copyDialog");
        copyButton.addEventListener("click", () => {
            console.log(`Link:  https://shared-google-slides-control.cleverapps.io/ui/#${slidedeck}`);
            navigator.clipboard.writeText(`https://shared-google-slides-control.cleverapps.io/ui/#${slidedeck}`);
        });
    }

    // Function to send a keyboard event
    function sendKeyboardEvent(key, code, keyCode, element = document.body) {
        const event = new KeyboardEvent('keydown', {
            key: key,
            code: code,
            keyCode: keyCode,
            charCode: keyCode,
            which: keyCode,
            bubbles: true,
            cancelable: true
        });

        element.dispatchEvent(event);
        console.log(`Sent keyboard event: ${key}`);
    }


    // URL of the WebSocket server
    const wsUrl = `wss://shared-google-slides-control.cleverapps.io/websocket/${slidedeck}`;


    let socket;
    let reconnectInterval = 1000; // Start with a 1 second delay
    const maxReconnectInterval = 30000; // Maximum delay of 30 seconds

    function connectWebSocket() {
        socket = new WebSocket(wsUrl);

        socket.addEventListener('open', function(event) {
            console.log('WebSocket connection opened:', event);
            reconnectInterval = 1000; // Reset reconnect interval on successful connection


        });

        // Event listener for receiving messages from the server
        socket.addEventListener('message', function (event) {
            console.log('Message from server:', event.data);

            switch (event.data) {
                case 'next':
                    sendKeyboardEvent('ArrowRight', 'ArrowRight', 39);
                    break;
                case 'previous':
                    sendKeyboardEvent('ArrowLeft', 'ArrowLeft', 37);
                    break;

            }
        });

        // Event listener for when the connection is closed
        socket.addEventListener('close', function (event) {
            console.log('WebSocket connection closed:', event);
            attemptReconnect();
        });

        socket.addEventListener('error', function(event) {
            console.error('WebSocket error:', event);
            socket.close(); // Close the socket on error to trigger the reconnect logic
        });
    }

    function attemptReconnect() {
        console.log(`Attempting to reconnect in ${reconnectInterval / 1000} seconds...`);
        setTimeout(function() {
            reconnectInterval = Math.min(reconnectInterval * 2, maxReconnectInterval); // Exponential backoff
            connectWebSocket();
        }, reconnectInterval);
    }

    // Initial WebSocket connection
    connectWebSocket();
})();