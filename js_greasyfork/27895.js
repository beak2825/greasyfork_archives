// ==UserScript==
// @name         Autoswap w/ keys
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto swaps weapons by pressing R to start and F to stop
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27895/Autoswap%20w%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/27895/Autoswap%20w%20keys.meta.js
// ==/UserScript==


window.onkeydown = function() {
   if (event.keyCode === 82) { 
    clearInterval(myVar);    
   }
};

window.onkeydown = function() {
     if (event.keyCode === 70) {
       myVar = setInterval(function(){
           setTimeout(incWeapon(1),2);
         }, 10);
     }
};