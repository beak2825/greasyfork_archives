// ==UserScript==
// @name         Gay ass hat changer Wacked2
// @namespace    https://greasyfork.org/es/users/282883-uwu-unu
// @version      5.0
// @description  Ez hat changing
// @author       Gay ass
// @match        http://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @match        http://sandbox.moomoo.io/*
// @match        *://*.moomoo.io/*
// @connect      moomoo.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381218/Gay%20ass%20hat%20changer%20Wacked2.user.js
// @updateURL https://update.greasyfork.org/scripts/381218/Gay%20ass%20hat%20changer%20Wacked2.meta.js
// ==/UserScript==

(function() {
    'use strict';
   $('#gameName').text('boring.io')
   $('#loadingText').text('..........')
   $('#diedText').text('Pathetic.')


    var Tankgear= 40;
    var Soldier = 6;
    var Blood = 55;
    var Boost = 12;
    var Bull = 7


    document.addEventListener('keydown', function(e) {
        if (document.activeElement.id == 'chatBox') return;
        switch (e.keyCode) {
            case 16: storeEquip(0); break; // Nothing xd (0)
            case 68: storeEquip(Blood); break; // Bloodthirster (d)
            case 83: storeEquip(Tankgear); break; // Tank gear (s)
            case 89: storeEquip(Boost); break; // Booster (y)
            case 87: storeEquip(Soldier); break; // Soldier (w)
            case 66: storeEquip(Bull); break; // Bull (b)
 }
    });
})();

      document.addEventListener('keydown', function(e) {
          if (document.activeElement.id == 'chatBox') return;
        switch (e.keyCode) {
            case 16: storeBuy(0); break; // Nothing xd (0)
            case 68: storeBuy(55); break; // Bloodthirster (d)
            case 83: storeBuy(40); break; // Tank gear (s)
            case 89: storeBuy(12); break; // Booster (y)
            case 87: storeBuy(6); break; // Soldier (w)
            case 66: storeBuy(7); break; // Bull (b)
        }
          })();