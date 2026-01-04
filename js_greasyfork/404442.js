// ==UserScript==
// @name         MOOMOO.io UNEQUIP EQUIP MOD!!!
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Shift to unequip hat!!!
// @author       Cody Webb
// @match                 *://moomoo.io/*
// @match                 *://sandbox.moomoo.io/*
// @match                 *://dev.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404442/MOOMOOio%20UNEQUIP%20EQUIP%20MOD%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/404442/MOOMOOio%20UNEQUIP%20EQUIP%20MOD%21%21%21.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {
            case 16: storeEquip(0); break; // Shift
        }
    });

})();