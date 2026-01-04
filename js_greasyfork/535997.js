// ==UserScript==
// @name         phisher
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  automaticly tries to catch phish
// @match        *://*.pixelplanet.fun/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535997/phisher.user.js
// @updateURL https://update.greasyfork.org/scripts/535997/phisher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ws;

    function initWebSocket() {
        ws = new WebSocket('wss://pixelplanet.fun/ws');
        ws.binaryType = 'arraybuffer';
        ws.addEventListener('open', () => {
            ws.send(new Uint8Array([81]).buffer);
            setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(new Uint8Array([81]).buffer);
                }
            }, 10000);
        });
        ws.addEventListener('close', () => {
            setTimeout(initWebSocket, 5000);
        });
        ws.addEventListener('error', () => {
            ws.close();
        });
    }

    initWebSocket();
})();
