// ==UserScript==
// @name         Laser Shooter Mod
// @description  Allows the player to shoot lasers with a time limit
// @match        *://*/*
// @version 0.0.1.20230814222938
// @namespace https://greasyfork.org/users/1151605
// @downloadURL https://update.greasyfork.org/scripts/473080/Laser%20Shooter%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/473080/Laser%20Shooter%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const TIME_LIMIT = 60; // Time limit in seconds
    let remainingTime = TIME_LIMIT;
    let isShooting = false;

    console.log("Hold 'O' to shoot lasers!");

    function startShootingLasersOnHold() {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'o' || event.key === 'O') {
                isShooting = true;
                console.log("Shooting lasers!");
            }
        });

        document.addEventListener('keyup', function(event) {
            if (event.key === 'o' || event.key === 'O') {
                isShooting = false;
                console.log("Stopped shooting lasers!");
            }
        });
    }

    function stopShootingLasers() {
        console.log("Time's up! Stop shooting lasers!");
        isShooting = false;
    }

    // Call this function when the player dies
    function playerDied() {
        console.log("Player died! Cannot shoot lasers anymore.");
    }

    // Start shooting lasers when holding 'O'
    startShootingLasersOnHold();

    // Run the game for the specified time limit
    setTimeout(function() {
        stopShootingLasers();
    }, TIME_LIMIT * 1000);

})();