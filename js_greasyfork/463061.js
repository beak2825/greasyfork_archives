// ==UserScript==
// @name         SLASHER hat macro _qwerty_
// @namespace    SLASHER basic macro
// @version      3
// @description  simple qwerty *SLASHER hat macro*
// @author       | API by SLASHER moomo.io | Main work by Raf | Link: https://discord.gg/SB3DP6pp
// @require       https://greasyfork.org/scripts/456235-moomoo-js/code/MooMoojs.js?version=1144167
// @run-at       document-end
// @icon https://moomoo.io/img/favicon.png?v=1
// @match        *://sandbox.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463061/SLASHER%20hat%20macro%20_qwerty_.user.js
// @updateURL https://update.greasyfork.org/scripts/463061/SLASHER%20hat%20macro%20_qwerty_.meta.js
// ==/UserScript==

//Features:

//every hat:

//TankGear
//Soldier
//Bulls
//Booster
//Winter
//Samurai
//EmpHelmet
//Plague
//Turret
//Thief
//Blood
// and_unequip_hat_with_Shift

(function() {
    
    
    //the actuall equip script
    if (document.activeElement.id !== 'chatBox'){
        document.addEventListener('keydown', function(e) {
            switch (e.keyCode) {
                case 16: storeEquip(0); break; // Shift
                case 82: storeEquip(7); break; // R
                case 90: storeEquip(40); break; // Z
                case 71: storeEquip(6); break; // G
                case 66: storeEquip(12); break; // B
                case 89: storeEquip(58); break; // Y
                case 78: storeEquip(15); break; // N
                case 74: storeEquip(22); break; // J
                case 84: storeEquip(53); break; // T
                case 88: storeEquip(16); break; // K
                case 72: storeEquip(26); break; // H
                case 85: storeEquip(20); break; // U
                case 73: storeEquip(56); break; // I
                case 79: storeEquip(55); break; // O
                case 77: storeEquip(11); break; // M
 
        }
    });
 
}})();