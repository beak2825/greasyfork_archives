// ==UserScript==
// @name         Drawaria WebSocket Endpoint Sniffer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Перехват URL WebSocket и лог пакетов для реверса протокола Drawaria.online
// @match        https://drawaria.online/*
// @run-at       document-start
// @license      barsik
// @downloadURL https://update.greasyfork.org/scripts/544142/Drawaria%20WebSocket%20Endpoint%20Sniffer.user.js
// @updateURL https://update.greasyfork.org/scripts/544142/Drawaria%20WebSocket%20Endpoint%20Sniffer.meta.js
// ==/UserScript==

(function () {
    const OriginalWS = window.WebSocket;
    window.WebSocket = function (url, protocols) {
        console.log('[📡 Drawaria WS URL]:', url);
        const ws = new OriginalWS(url, protocols);

        ws.addEventListener('message', (event) => {
            console.log('[📥 INCOMING]', event.data);
        });

        const originalSend = ws.send;
        ws.send = function (data) {
            console.log('[📤 OUTGOING]', data);
            return originalSend.call(this, data);
        };

        return ws;
    };
    window.WebSocket.prototype = OriginalWS.prototype;
})();
