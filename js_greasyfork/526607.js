// ==UserScript==
// @name         Slack Silence Mode
// @namespace    http://tampermonkey.net/
// @version      2025-02-12
// @description  Disables all websocket connections in Slack,
// @author       You
// @match        https://app.slack.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/526607/Slack%20Silence%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/526607/Slack%20Silence%20Mode.meta.js
// ==/UserScript==

(function() {
 'use strict';

    // Store the original WebSocket constructor
    const OriginalWebSocket = window.WebSocket;

    window.WebSocket = function(url, protocols) {
        console.warn("Blocked WebSocket connection:", url);

        // Prevent the connection by returning a fake WebSocket object
        return {
            readyState: 3, // CLOSED state
            close: function() {},
            send: function() {},
            addEventListener: function() {},
            removeEventListener: function() {},
            dispatchEvent: function() { return false; }
        };
    };

    // If sites restore WebSocket, block it again
    Object.defineProperty(window, 'WebSocket', {
        configurable: false,
        enumerable: false,
        writable: false
    });

})();