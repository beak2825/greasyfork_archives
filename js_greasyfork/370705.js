// ==UserScript==
// @name         moomoo.io Hat Changer (Discord = 𐌋𐌆𐌋 🔥ṨΔᐯΔǤ€🔥#210)
// @version      1.3
// @description  Changing hats using the keyboard
// @author       𐌋𐌆𐌋 🔥ṨΔᐯΔǤ€🔥#210 discord
// @match        *://dev.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://45.77.0.81/*
// @grant        none
// @namespace    https://greasyfork.org/en/scripts/
// @downloadURL https://update.greasyfork.org/scripts/370705/moomooio%20Hat%20Changer%20%28Discord%20%3D%20%F0%90%8C%8B%F0%90%8C%86%F0%90%8C%8B%20%F0%9F%94%A5%E1%B9%A8%CE%94%E1%90%AF%CE%94%C7%A4%E2%82%AC%F0%9F%94%A5210%29.user.js
// @updateURL https://update.greasyfork.org/scripts/370705/moomooio%20Hat%20Changer%20%28Discord%20%3D%20%F0%90%8C%8B%F0%90%8C%86%F0%90%8C%8B%20%F0%9F%94%A5%E1%B9%A8%CE%94%E1%90%AF%CE%94%C7%A4%E2%82%AC%F0%9F%94%A5210%29.meta.js
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

            case 16: storeEquip(0); break; // "Shift" to Unequip
            case 86: storeEquip(ID_BullsHelmet); break; //"V" to wear Bull Helmet
            case 70: storeEquip(ID_TankGear); break; //"F" to wear Tank Gear
            case 71: storeEquip(ID_SoldierHelmet); break; //"G" to wear Soldier Helmet
            case 89: storeEquip(ID_FlipperHat); break; //"Y" to wear Flipper Hat
            case 66: storeEquip(ID_BoosterHat); break; // "B" to wear Booster Helmet

        }
    });

})();