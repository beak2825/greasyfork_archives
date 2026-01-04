// ==UserScript==
// @name         ~INSTAKILL MOD~ READ DESC.
// @author       SHD/BeagleLovers1/Cocoalovers
// @version      0.5
// @description  PRESS R AND THEN E QUICKLY AND THEN HIT WITH PRIMARY THEN SWITCH TO SECONDARY
// @match        *://dev.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/1048436
// @downloadURL https://update.greasyfork.org/scripts/470616/~INSTAKILL%20MOD~%20READ%20DESC.user.js
// @updateURL https://update.greasyfork.org/scripts/470616/~INSTAKILL%20MOD~%20READ%20DESC.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //Keys
    var ID_ThiefGear = 52
    var ID_BullsHelmet = 7;
    var ID_TurretGear = 53;
    var ID_SoldierHelmet = 6;

    // Key code for the desired key (in this example, the 'r' key)
    var targetKey = 82;

    // Function to perform actions with delays
    function performActions() {
        // Action 1
storeEquip(ID_BullsHelmet);

        // Delay after Action 1 (in milliseconds)
        var delay1 = 150; // 2 seconds

        // Action 2
        setTimeout(function() {
storeEquip(ID_TurretGear);

            // Delay after Action 2 (in milliseconds)
            var delay2 = 150; // 1 second

            // Action 3
            setTimeout(function() {
storeEquip(ID_ThiefGear);

                // Delay after Action 3 (in milliseconds)
                var delay3 = 160; // 1.5 seconds

                // Action 4
                setTimeout(function() {
storeEquip(ID_TurretGear);

                    // Delay after Action 4 (in milliseconds)
                    var delay4 = 150; // 0.5 seconds

                    // Action 5
                    setTimeout(function() {
storeEquip(ID_SoldierHelmet);

                        // Delay after Action 5 (in milliseconds)
                        var delay5 = 150; // 0.8 seconds
storeEquip(ID_ThiefGear);
                        // Action 6
                        setTimeout(function() {
storeEquip(ID_SoldierHelmet);
                        }, delay5);
                    }, delay4);
                }, delay3);
            }, delay2);
        }, delay1);
    }

    // Event listener for key press
    document.addEventListener('keydown', function(event) {
        if (event.keyCode === targetKey) {
            performActions();
        }
    });
})();