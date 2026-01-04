// ==UserScript==
// @name         Moomoo.io WebSocket URL
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Obtén la URL del servidor WebSocket en Moomoo.io
// @author       Your Name
// @match        https://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470225/Moomooio%20WebSocket%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/470225/Moomooio%20WebSocket%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Intercepta el WebSocket y muestra la URL en la consola
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
        console.log('WebSocket URL:', url);
        return new originalWebSocket(url, protocols);
    };
})();
