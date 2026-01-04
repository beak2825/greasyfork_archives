// ==UserScript==
// @name         Discord RPC WebSocket Blocker
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Blocks WebSocket connections to 127.0.0.1 on ports 6463-6472 with a toggle function
// @license MIT
// @author       chatgpt
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530353/Discord%20RPC%20WebSocket%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/530353/Discord%20RPC%20WebSocket%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const OriginalWebSocket = window.WebSocket;
    let blocked = true;
    let openSockets = [];

    function isBlockedURL(addy) {
        try {
            let url;
            if (addy.startsWith("ws://") || addy.startsWith("wss://")) {
                url = new URL(addy);
            } else {
                // Handle cases where only a path is provided
                url = new URL(addy, window.location.origin);
            }
            return url.hostname === '127.0.0.1' && url.port >= 6463 && url.port <= 6472;
        } catch (e) {
            console.warn('WS: Invalid WebSocket URL, skipping block check:', addy);
            return false; // Allow connection by default if the URL is invalid
        }
    }

    window.WebSocket = function(addy, protocols) {
        console.log('WS: Trying to open connection to', addy);

        if (blocked && isBlockedURL(addy)) {
            console.log('WS: Blocked WebSocket connection to', addy);
            throw new Error('WebSocket connection blocked');
        }

        const ws = new OriginalWebSocket(addy, protocols);
        openSockets.push(ws);
        return ws;
    };

    window.WebSocket.toggle = function() {
        blocked = !blocked;
        if (blocked) {
            console.log('WS: Blocking WebSocket connections to 127.0.0.1 ports 6463-6472. Closing active sockets.');
            openSockets.forEach((socket, index) => {
                console.log("WS: Closing socket", index);
                socket.close();
            });
            openSockets = [];
        } else {
            console.log('WS: WebSocket connections to 127.0.0.1 ports 6463-6472 are now allowed.');
        }
    };

    console.log("WebSocket Blocker is active. Use `WebSocket.toggle()` in the console to enable/disable.");
})();
