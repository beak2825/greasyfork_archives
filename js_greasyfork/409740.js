// ==UserScript==
// @name         MooMoo.io The Best Hat Macro (Discord = -vSxN#4828)
// @version      1.7
// @description  Changing hats with using hotkeys (read desc.)
// @author       -vSxN YT
// @match        *://dev.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @namespace    https://greasyfork.org/en/scripts/
// @downloadURL https://update.greasyfork.org/scripts/409740/MooMooio%20The%20Best%20Hat%20Macro%20%28Discord%20%3D%20-vSxN4828%29.user.js
// @updateURL https://update.greasyfork.org/scripts/409740/MooMooio%20The%20Best%20Hat%20Macro%20%28Discord%20%3D%20-vSxN4828%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ID_TankGear = 40;
    var ID_SoldierHelmet = 6;
    var ID_BullsHelmet = 7;
    var ID_BoosterHat = 12;
    var ID_FlipperHat = 31;
    var ID_WinterHat = 15
    var ID_SamuraiArmor = 20;
    var ID_EmpHelmet = 22;
    var ID_PlagueMask = 21;
    var ID_TurretGear = 53;
    var ID_ThiefGear = 52
    var ID_BloodThirster = 55

    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {

            case 16: storeEquip(0); break; // "Shift" to Unequip
            case 82: storeEquip(ID_BullsHelmet); break; //"R" to wear Bull Helmet
            case 70: storeEquip(ID_TankGear); break; //"F" to wear Tank Gear
            case 86: storeEquip(ID_SoldierHelmet); break; //"V" to wear Soldier Helmet
            case 89: storeEquip(ID_FlipperHat); break; //"Y" to wear Flipper Hat
            case 66: storeEquip(ID_BoosterHat); break; //"B" to wear Booster Helmet
            case 71: storeEquip(ID_WinterHat); break; //"G" to wear Winter Hat
            case 77: storeEquip(ID_SamuraiArmor); break; //"M" to wear Samurai Armor
            case 85: storeEquip(ID_EmpHelmet); break; //"U" to wear Emp Helmet
            case 90: storeEquip(ID_PlagueMask); break; //"Z" to wear Plague Mask
            case 78: storeEquip(ID_BloodThirster); break; //"N" to wear Blood Thirster
            case 72: storeEquip(ID_TurretGear); break; //"H" to wear Turret Gear
            case 74: storeEquip(ID_ThiefGear); break; // "J" to wear Thief Gear

        }
    });

})();