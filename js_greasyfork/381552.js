// ==UserScript==
// @name         Gay ass hat changer Wacked3
// @namespace    https://greasyfork.org/es/users/282883-uwu-unu
// @version      1.1
// @description  Ez hat changing
// @author       Gay ass
// @match        http://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @match        http://sandbox.moomoo.io/*
// @match        *://*.moomoo.io/*
// @connect      moomoo.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381552/Gay%20ass%20hat%20changer%20Wacked3.user.js
// @updateURL https://update.greasyfork.org/scripts/381552/Gay%20ass%20hat%20changer%20Wacked3.meta.js
// ==/UserScript==

(function() {
    'use strict';
   $('#gameName').text('boring.io')
   $('#loadingText').text('..........')
   $('#diedText').text('Pathetic.')

 var Soldier = 6
 var Tank = 40
 var Spike = 11
 var Blood = 55
 var Boost = 12
 var Turret = 53
 var Bull = 7
 var Emp = 22
 var Flipper = 31
 var Samurai = 20


    document.addEventListener('keydown', function(wack) {
        if (document.activeElement.id == 'chatBox') return;
        switch (wack.keyCode) {
            case 87: storeEquip(Soldier); break;
            case 83: storeEquip(Tank); break;
            case 65: storeEquip(Spike); break;
            case 68: storeEquip(Blood); break;
            case 73: storeEquip(Boost); break;
            case 66: storeEquip(Turret); break;
            case 86: storeEquip(Bull); break;
            case 78: storeEquip(Emp); break;
            case 77: storeEquip(Samurai); break;
            case 89: storeEquip(Flipper); break;
 }
    });
        document.addEventListener('keydown', function(wack) {
        if (document.activeElement.id == 'chatBox') return;
        switch (wack.keyCode) {
            case 87: storeBuy(Soldier); break;
            case 83: storeBuy(Tank); break;
            case 65: storeBuy(Spike); break;
            case 68: storeBuy(Blood); break;
            case 73: storeBuy(Boost); break;
            case 66: storeBuy(Turret); break;
            case 86: storeBuy(Bull); break;
            case 78: storeBuy(Emp); break;
            case 77: storeBuy(Samurai); break;
            case 89: storeBuy(Flipper); break;
 }
    });
          })();