// ==UserScript==
// @name        prettypolly.app - hold spacebar to speak
// @namespace   Violentmonkey Scripts
// @match       https://www.prettypolly.app/app
// @grant       none
// @version     1.0
// @author      Aaron Kelly
// @description 05/08/2023, 21:35:26
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473064/prettypollyapp%20-%20hold%20spacebar%20to%20speak.user.js
// @updateURL https://update.greasyfork.org/scripts/473064/prettypollyapp%20-%20hold%20spacebar%20to%20speak.meta.js
// ==/UserScript==

var button = document.getElementById("microphone-button");
var down_held = false;

document.addEventListener("keydown", function(event) {
 if (event.code === "Space") {
   if (down_held == false) {
      down_held = true;
      event.preventDefault(); // Prevent the spacebar from performing its default action
      button.click();
   }
 }
});

document.addEventListener("keyup", function(event) {
 if (event.code === "Space") {
   if (down_held == true) {
      down_held = false;
      event.preventDefault(); // Prevent the spacebar from performing its default action
      button.click();
   }
 }
});