// ==UserScript==
// @name         Autoswap right click
// @namespace    http://tampermonkey.net/
// @version      1.44
// @description  right click hold
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28070/Autoswap%20right%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/28070/Autoswap%20right%20click.meta.js
// ==/UserScript==

$("#gameHudContainer").mousedown(function(ev){
      if(ev.which == 3)
      {
        myVar = setInterval(function(){
           incWeapon(-1);
         }, 10);
      }
});

$("#gameHudContainer").mouseup(function(ev){
      if(ev.which == 3)
      {
        clearInterval(myVar); 
      }
});

window.onkeydown = function() {
   if (event.keyCode === 82) { 
    clearInterval(myVar);    
   }
};