// ==UserScript==
// @name         Restart Ring Live View Camera
// @namespace    https://account.ring.com/
// @version      0.1
// @description  Restart live view camera media stream when reconnect button is present
// @author       You
// @match        https://account.ring.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458508/Restart%20Ring%20Live%20View%20Camera.user.js
// @updateURL https://update.greasyfork.org/scripts/458508/Restart%20Ring%20Live%20View%20Camera.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check for the reconnect button and reconnect message every 2 seconds
    setInterval(checkForReconnectButtonAndMessage, 2000);

    var reconnectMessageTimeoutId;

    function checkForReconnectButtonAndMessage() {
        try {
            var reconnectButton = document.querySelector("button[aria-label='Reconnect'][data-testid='video-error__button']");
            var reconnectMessage = document.querySelector("p:contains('Reconnecting Live View ...')");
            if (reconnectButton) {
                reconnectButton.click();
            } else if (reconnectMessage) {
                clearTimeout(reconnectMessageTimeoutId);
                reconnectMessageTimeoutId = setTimeout(refreshPage, 15000);
            }
        } catch (err) {
            console.log("Error finding reconnect button or message: " + err);
        }
    }

    function refreshPage() {
        location.reload();
    }
})();
