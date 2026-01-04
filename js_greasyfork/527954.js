// ==UserScript==
// @name        GAS Web Apps - Warning Bar Remover
// @license MIT 
// @namespace   Violentmonkey Scripts
// @match       https://script.google.com/macros*
// @grant       none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version     1.1
// @author      Bilbosaggings[2323763] | BillyBourbon
// @description 2/20/2025, 4:21:38 AM Removes the pesky warning bar from a GAS Web App
// @downloadURL https://update.greasyfork.org/scripts/527954/GAS%20Web%20Apps%20-%20Warning%20Bar%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/527954/GAS%20Web%20Apps%20-%20Warning%20Bar%20Remover.meta.js
// ==/UserScript==
(function (){
  console.log("Removing Warning Bar");
  window.addEventListener("load", () => {
  const warningBar = document.querySelector(".warning-bar");
  if (warningBar) {
    warningBar.remove();
    console.log("Removed Warning Bar");
  }
  });
})()