// ==UserScript==
// @name         WebSocket Logger and Messenger
// @version      1.0.2
// @description  Logs websockets and allows you to send messages to them
// @author       ProKameron
// @match        http://*/*
// @match        https://*/*
// @include      jackbox.tv
// @grant        none
// @license      ISC


// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/520463/WebSocket%20Logger%20and%20Messenger.user.js
// @updateURL https://update.greasyfork.org/scripts/520463/WebSocket%20Logger%20and%20Messenger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Preserve the original WebSocket constructor
    const originalWebSocket = WebSocket;

    // Attach the WebSocket instance to the global scope
    window.ws = null;

    // Wrap the WebSocket constructor
    class WrappedWebSocket extends originalWebSocket {
        constructor(...args) {
            super(...args);
            window.ws = this; // Store the WebSocket instance in the global scope
            console.log('New WebSocket created:', window.ws);

            // Log incoming messages
            this.addEventListener('message', (event) => {
                console.log('WebSocket message received:', event.data);
            });
        }
    }

    // Replace the global WebSocket with the wrapped version
    window.WebSocket = WrappedWebSocket;

})();
