// ==UserScript==
// @name         MooMoo.io Hat Keybinder by CactusAWEX
// @version      1.0
// @description  Use the C,F,V and B button to equipt hats. Use shift to unequip hacks. (Use G for flipper)
// @author       CactusAWEX (Al Capone#1366)
// @match        *://dev.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://45.77.0.81/*
// @grant        none
// @namespace    https://greasyfork.org/en/scripts/
// @icon         https://vignette.wikia.nocookie.net/moom/images/7/7a/Cacti.PNG/revision/latest?cb=20170524094943
// @downloadURL https://update.greasyfork.org/scripts/370954/MooMooio%20Hat%20Keybinder%20by%20CactusAWEX.user.js
// @updateURL https://update.greasyfork.org/scripts/370954/MooMooio%20Hat%20Keybinder%20by%20CactusAWEX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ID_TankGear = 40;
    var ID_SoldierHelmet = 6;
    var ID_BullsHelmet = 7;
    var ID_BoosterHat = 12;
    var ID_FlipperHat = 31;


    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {

            case 16: storeEquip(0); break; // SHIFT
            case 70: storeEquip(ID_BullsHelmet); break; // F
            case 66: storeEquip(ID_TankGear); break; // B
            case 86: storeEquip(ID_SoldierHelmet); break; // V
            case 71: storeEquip(ID_FlipperHat); break; // G
            case 67: storeEquip(ID_BoosterHat); break; // C

        }
    });

})();