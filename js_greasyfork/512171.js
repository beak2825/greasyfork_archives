// ==UserScript==
// @name         Keep Grepolis Active
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Prevents Grepolis from going idle in the background by periodically sending a request to the server.
// @author       Nyxia
// @match        *://*.grepolis.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512171/Keep%20Grepolis%20Active.user.js
// @updateURL https://update.greasyfork.org/scripts/512171/Keep%20Grepolis%20Active.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the interval (in milliseconds) for how often to send a request. 5 minutes = 300000 ms
    const interval = 300000;

    // Function to send a small request to keep the session active
    function keepSessionActive() {
        // This simulates a minor action, like retrieving a small amount of game data
        console.log("Keeping Grepolis session active...");
        $.ajax({
            url: '/game/player', // Endpoint to simulate a request (this can be adjusted)
            success: function(data) {
                console.log("Session kept active.");
            },
            error: function(err) {
                console.log("Error keeping session active: ", err);
            }
        });
    }

    // Set the interval to run the function periodically
    setInterval(keepSessionActive, interval);
})();
