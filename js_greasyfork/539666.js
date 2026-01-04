// ==UserScript==
// @name         Fergie.io ESP Hook
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hook WebSocket to capture player data for ESP in fergie.io
// @author       YourName
// @match        https://fergie.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539666/Fergieio%20ESP%20Hook.user.js
// @updateURL https://update.greasyfork.org/scripts/539666/Fergieio%20ESP%20Hook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const OriginalWebSocket = window.WebSocket;

    window.WebSocket = function(url, protocols) {
        const ws = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);

        ws.addEventListener('message', function(event) {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch(e) {
                return;
            }

            if (data.players) {
                console.log('Player info:', data.players);
                // store and use data for ESP here
            }
        });

        return ws;
    };

    Object.assign(window.WebSocket, OriginalWebSocket);
})();
