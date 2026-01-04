// ==UserScript==
// @name         MooMoo.io Fly Hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds flying ability to the player
// @author       You
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509204/MooMooio%20Fly%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/509204/MooMooio%20Fly%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to enable flying
    function Z() {
        let flying = false;

        document.addEventListener('keydown', function(event) {
            if (event.key === 'z') {
                flying = !flying;
                console.log('Flying mode ' + (flying ? 'activated' : 'deactivated'));
            }
        });

        document.addEventListener('mousemove', function(event) {
            if (flying) {
                // Replace this with your own logic
                // Example: Move the player upwards
                player.y -= 5; // Adjust the value as needed
            }
        });
    }

    // Wait for the game to load
    window.onload = function() {
        Z();
    };
})();
