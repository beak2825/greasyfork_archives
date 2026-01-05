// ==UserScript==
// @name         Autoswap right click /shoot once /not toggle
// @namespace    http://tampermonkey.net/
// @version      1.07
// @description  right click to fire secondary once
// @author       meatman2tasty
// @match        http://vertix.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29932/Autoswap%20right%20click%20shoot%20once%20not%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/29932/Autoswap%20right%20click%20shoot%20once%20not%20toggle.meta.js
// ==/UserScript==

$("#gameHudContainer").mousedown(function(ev){
      if(ev.which == 3)
      {
          window.scrollBy(0, 9); // Scroll 100px to the right
      }
});

$("#gameHudContainer").mouseup(function(ev){
      if(ev.which == 3)
      {
          window.scrollBy(0, 9); // Scroll 100px to the right
      }
});