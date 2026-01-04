// ==UserScript==
// @name         NoFollow Fuck those fakes
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Listen and respond to specific packets on xat.com
// @author       Tiro
// @match        https://xat.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525939/NoFollow%20Fuck%20those%20fakes.user.js
// @updateURL https://update.greasyfork.org/scripts/525939/NoFollow%20Fuck%20those%20fakes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const nativeWebSocket = window.WebSocket;
    const textDecoder = new TextDecoder('utf-8');
    const textEncoder = new TextEncoder('utf-8');
    let currentWebSocket = null;

    window.WebSocket = function(url, protocols) {
        const ws = new nativeWebSocket(url, protocols);
        currentWebSocket = ws;

        ws.addEventListener('message', function(event) {
            if (event.data instanceof ArrayBuffer) {
                const message = textDecoder.decode(new Uint8Array(event.data));
                parsePacket(message);
            } else if (typeof event.data === 'string') {
                parsePacket(event.data);
            }
        });

        const originalSend = ws.send;
        ws.send = function(data) {
            console.log('Sending:', data);
            originalSend.call(ws, data);
        };

        return ws;
    };

    function parsePacket(message) {
        // Pattern to match all <z packets
        const packetPattern = /<z([^>]+)>/g;
        let match;
        while (match = packetPattern.exec(message)) {
            processPacket(match[1]);
        }
    }

    function processPacket(packetDetails) {
        // Extract necessary parts from the packet
        const details = packetDetails.split(' ').reduce((acc, curr) => {
            const [key, value] = curr.split('=');
            acc[key] = value?.replace(/"/g, '');
            return acc;
        }, {});

        if (details.t === '/l' && details.u.endsWith('_0')) {
            sendResponsePacket(details.d, details.u.replace('_0', ''));
        }
    }

    function sendResponsePacket(destinationId, userId) {
        // Construct the response packet according to your specifications
        //const responsePacket = `<z d="${userId}" u="${destinationId}" t="/a_NF" />`;
        const responsePacket = `<z d="${userId}" u="${destinationId}" t="/a_NF" />`;
        if (currentWebSocket) {
            const encodedPacket = textEncoder.encode(responsePacket);
            currentWebSocket.send(encodedPacket);
            console.log('Response packet sent:', responsePacket);
        } else {
            console.log('No WebSocket connection available.');
        }
    }

    window.addEventListener('load', function() {
        console.log('Toon script loaded and operational.');
    });
})();
