// ==UserScript==
// @name         Combat Idle Checker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Monster Name will display Green if you can Idle it, or Red if you cannot!
// @author       Wynzlow
// @match        https://*.melvoridle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409689/Combat%20Idle%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/409689/Combat%20Idle%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var nativeStartCombat = window.startCombat;
    window.startCombat = function(){
         if (canIdle(maxHitpoints,damageReduction,combatData.enemy.maximumStrengthRoll)){
             document.getElementById ("combat-enemy-name") .setAttribute('style', 'color:green !important');
         } else {
             document.getElementById ("combat-enemy-name") .setAttribute('style', 'color:red !important');
         }
         nativeStartCombat(...arguments);
    };
})();

function canIdle(maxHP , dmgReduction , maxHit) {
    var canIdle = maxHit * ( 1 - dmgReduction) <= maxHP *.4
    return canIdle

}

window.canIdle = canIdle