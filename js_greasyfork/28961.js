// ==UserScript==
// @name         MooMoo greataxe+bow build
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Swaps to food when right clicked, 'q' switches to great axe, 'shift' switches to bow
// @author       meatman2tasty
// @match        http://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28961/MooMoo%20greataxe%2Bbow%20build.user.js
// @updateURL https://update.greasyfork.org/scripts/28961/MooMoo%20greataxe%2Bbow%20build.meta.js
// ==/UserScript==

$("#gameCanvas").mousedown(function(ev){
      if(ev.which == 3)
      {
        document.getElementById("actionBarIcon5").click();
        document.getElementById("actionBarIcon6").click();
      }
});

document.addEventListener("keydown", function(a) {
    if (a.keyCode == 16) {
 document.getElementById("actionBarIcon3").click();
    }
}, false);

document.addEventListener("keydown", function(a) {
    if (a.keyCode == 81) {
 document.getElementById("actionBarIcon1").click();
    }
}, false);


window.oncontextmenu = function () {
   return false;
};