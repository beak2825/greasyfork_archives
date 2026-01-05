// ==UserScript==
// @name         Autoswap karnage using legit functions
// @namespace    http://tampermonkey.net/
// @version      1.88
// @description  g and f to swap
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27713/Autoswap%20karnage%20using%20legit%20functions.user.js
// @updateURL https://update.greasyfork.org/scripts/27713/Autoswap%20karnage%20using%20legit%20functions.meta.js
// ==/UserScript==

$("#gameHudContainer").mousedown(function(ev){
      while(ev.which == 3)
      {
        setTimeout(incWeapon(1),10);
      }
});