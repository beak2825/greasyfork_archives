// ==UserScript==
// @name         right click secondary karnage
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  right click
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26626/right%20click%20secondary%20karnage.user.js
// @updateURL https://update.greasyfork.org/scripts/26626/right%20click%20secondary%20karnage.meta.js
// ==/UserScript==

$("#document").mousedown(function(ev){
      if(ev.which == 3)
      {
  incWeapon(-1);
 setTimeout(MOUSE_DOWN = 1, 10);
incWeapon(-1);
      }
});