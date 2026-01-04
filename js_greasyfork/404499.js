// ==UserScript==
// @name         MOOMOO.io BASIC HAT MACRO
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Use this mod to switch hats with the press of a key!
// @author       Cody Webb
// @match                 *://moomoo.io/*
// @match                 *://sandbox.moomoo.io/*
// @match                 *://dev.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404499/MOOMOOio%20BASIC%20HAT%20MACRO.user.js
// @updateURL https://update.greasyfork.org/scripts/404499/MOOMOOio%20BASIC%20HAT%20MACRO.meta.js
// ==/UserScript==

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