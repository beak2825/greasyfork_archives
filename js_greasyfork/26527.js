// ==UserScript==
// @name         primary click secondary for karnage
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  right click(tweaked)
// @author       meatman2tasty
// @match        http://karnage.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26527/primary%20click%20secondary%20for%20karnage.user.js
// @updateURL https://update.greasyfork.org/scripts/26527/primary%20click%20secondary%20for%20karnage.meta.js
// ==/UserScript==

$("#cvs").mousedown(function(ev){
      if(ev.which == 1)
      {
  this.swapWeapon(player, 1);
 setTimeout(this.shoot(now), 1);
this.swapWeapon(player, 1);
      }
});