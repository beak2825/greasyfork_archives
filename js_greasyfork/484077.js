// ==UserScript==
// @name         Shell Shockers Bomb Notification
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display a notification when bombs are thrown across the map or near you in Shell Shockers
// @author       Your name here
// @match        https://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484077/Shell%20Shockers%20Bomb%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/484077/Shell%20Shockers%20Bomb%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the notification message
    const message = 'Bombs have been thrown across the map or near you!';

    // Listen for bomb events
    window.socket.on('bomb', function(data) {
        // Check if the bomb is near the player
        if (data.distance < 100) {
            // Display the notification
            alert(message);
        }
    });
})();
