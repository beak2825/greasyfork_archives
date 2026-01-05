// ==UserScript==
// @name         Auto swap karnage with toggle [r]
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Auto swaps weapons
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27720/Auto%20swap%20karnage%20with%20toggle%20%5Br%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/27720/Auto%20swap%20karnage%20with%20toggle%20%5Br%5D.meta.js
// ==/UserScript==

window.onkeydown = function() {
   if (event.keyCode === 82) {
      setInterval(function(){ 
    incWeapon(-1);    
}, 10);
   }
};