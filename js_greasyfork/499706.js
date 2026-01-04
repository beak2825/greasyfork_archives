// ==UserScript==
// @name         Shootem.io Bots
// @namespace    https://leaked.wiki/
// @version      0.1
// @description  Bots for shootem.io that follow everything you do.
// @author       Sango
// @match        https://shootem.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499706/Shootemio%20Bots.user.js
// @updateURL https://update.greasyfork.org/scripts/499706/Shootemio%20Bots.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const NUMBER_OF_BOTS = 19; // Number of mirrored WebSocket connections

    // Find the WebSocket object
    let originalWebSocket = window.WebSocket;
    // Override WebSocket constructor
    window.WebSocket = function(url, protocols) {
        // Create a new WebSocket instance
        let ws = new originalWebSocket(url, protocols);

        // Array to store mirrored WebSocket instances
        let mirrorWebSockets = [];

        // Create mirrored WebSocket instances
        for (let i = 0; i < NUMBER_OF_BOTS; i++) {
            mirrorWebSockets.push(new originalWebSocket(url));
        }

        // Function to log and mirror messages
        function logAndMirrorMessage(type, data) {
            mirrorWebSockets.forEach(mirrorWs => {
                mirrorWs.send(data);
            });

            // Decode if it's binary data
            if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
                let decoder = new TextDecoder('utf-8');
                //console.log('Decoded:', decoder.decode(data));
            }
        }

        // Intercept received messages
        ws.addEventListener('message', function(event) {
            logAndMirrorMessage('Received', event.data);
            // You can do further processing or logging here
        });

        // Intercept sent messages
        let originalSend = ws.send;
        ws.send = function(data) {
            logAndMirrorMessage('Sent', data);
            originalSend.apply(ws, arguments);
        };

        // Return the WebSocket instance
        return ws;
    };
})();
