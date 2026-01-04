// ==UserScript==
// @name         Sun's Speed Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  I'M A DESCRIPTION OF A SCRIPT MADE BY SUN
// @author       Sun
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387785/Sun%27s%20Speed%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/387785/Sun%27s%20Speed%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

window.addEventListener("onkeydown", keyDown, true);
window.addEventListener("keydown", keyDown);

function keyDown(e) {
  switch (e.keyCode) {
    case 188:
      speedrun();
      speedrun2();
      break;
    case 189:
      spampartys();
      spampartys2();
      break;
    case 187:
      partyTags();
      break;
  }
}

// SETTINGS SHORTCUTS & CONTROLS INNERHTML
settingsHtml += "<label>";
settingsHtml += "<span>zombs.io script shortcuts & controls</span>";
settingsHtml += "<ul class=\"hud-settings-controls\">";
settingsHtml += "<li>Press '<strong><</strong>' to start speed run.</strong></li>";
settingsHtml += "<li>Press '<strong><</strong>' to stop speed run.</strong></li>";

var button9 = document.getElementById("rwp");
button9.addEventListener("click", speedrun);
button9.addEventListener("click", speedrun2);

var petrun = null;

function speedrun() {
  clearInterval(petrun);
  if (petrun !== null) {
    petrun = null;
  } else {
    petrun = setInterval(function() {
      equip = document.getElementsByClassName('hud-shop-actions-equip');
      for (var i = 0; i < equip.length; i++) {
        var pets = equip[i];
        pets.click();
      }
    }, 0); // SPEED FOR RUN
  }
}

function speedrun2() {
  var change5 = document.getElementById("rwp");
  if (change5.innerHTML == "SPEED RUN OFF") {
    change5.innerHTML = "SPEED RUN ON";
  } else {
    change5.innerHTML = "SPEED RUN OFF";
  }
}