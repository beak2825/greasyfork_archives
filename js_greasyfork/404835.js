// ==UserScript==
// @name         MOOMOO.IO HAT BUY/EQUIP!!!!!
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  .............................................
// @author       You
// @match                 *://moomoo.io/*
// @match                 *://sandbox.moomoo.io/*
// @match                 *://dev.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404835/MOOMOOIO%20HAT%20BUYEQUIP%21%21%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/404835/MOOMOOIO%20HAT%20BUYEQUIP%21%21%21%21%21.meta.js
// ==/UserScript==

(function() {
        document.addEventListener('keydown', function(e) {
            if (document.activeElement.id.toLowerCase() !== 'chatbox') {
                switch (e.keyCode) {
                    case 82: storeBuy(7); break; // R
                    case 90: storeBuy(40); break; // Z
                    case 71: storeBuy(6); break; // G
                    case 66: storeBuy(12); break; // B
                    case 89: storeBuy(31); break; // Y
                    case 78: storeBuy(15); break; // N
                    case 74: storeBuy(22); break; // J
                    case 84: storeBuy(53); break; // T
                    case 88: storeBuy(52); break; // K
                    case 72: storeBuy(26); break; // H
                    case 85: storeBuy(20); break; // U
                    case 73: storeBuy(56); break; // I
                    case 79: storeBuy(16); break; // O
                    case 76: storeBuy(31); break; // L

            }
        }});
        document.addEventListener('keydown', function(e) {
            if (document.activeElement.id.toLowerCase() !== 'chatbox') {
                switch (e.keyCode) {
                    case 16: storeEquip(0); break; // Shift
                    case 82: storeEquip(7); break; // R
                    case 90: storeEquip(40); break; // Z
                    case 71: storeEquip(6); break; // G
                    case 66: storeEquip(12); break; // B
                    case 89: storeEquip(31); break; // Y
                    case 78: storeEquip(15); break; // N
                    case 74: storeEquip(22); break; // J
                    case 84: storeEquip(53); break; // T
                    case 88: storeEquip(52); break; // K
                    case 72: storeEquip(26); break; // H
                    case 85: storeEquip(20); break; // U
                    case 73: storeEquip(56); break; // I
                    case 79: storeEquip(16); break; // O
                    case 76: storeEquip(31); break; // L
                    case 80: storeEquip(29); break; // P

            }
        }});

})();