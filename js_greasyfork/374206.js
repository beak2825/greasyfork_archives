// ==UserScript==
// @name         Hat Switch Injection
// @version      0.2
// @description  ..
// @author       Creator
// @match        *://*.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/206011
// @downloadURL https://update.greasyfork.org/scripts/374206/Hat%20Switch%20Injection.user.js
// @updateURL https://update.greasyfork.org/scripts/374206/Hat%20Switch%20Injection.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var _hats = {
        "96": 3,  // Numpad 0; Hat 0/Nothing
        "97": 7,   // Numpad 1; Hat 7/Bull
        "98": 6,   // Numpad 2; Hat 6/Soldier
        "99": 20,  // Numpad 3; Hat 20/Samurai
        "100": 31, // Numpad 4; Hat 31/Fish
        "101": 10, // Numpad 5; Hat 10/Bush
        "102": 11, // Numpad 6; Hat 11/Spike
        "103": 22, // Numpad 7; Hat 22/Emp
        "104": 12, // Numpad 8; Hat 12/Speed
        "105": 40   // Numpad 9; Hat 40/Tank
    };
    var hats = Object.keys(_hats);

    document.onkeydown = function (e) {
        if (typeof storeEquip === "function") {
            var len = hats.length;
            var k = e.keyCode;
            if (_hats[k]) {
                storeBuy(_hats[k]); 
                storeEquip(_hats[k]); 
            }
        }
    }
})();