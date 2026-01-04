// ==UserScript==
// @name         NoCasinoRefill
// @namespace    NoCasinoWarning
// @version      1.1
// @description  Provides a warning when the Casino refill button is pressed
// @author       StevenSeale
// @match        https://www.torn.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475223/NoCasinoRefill.user.js
// @updateURL https://update.greasyfork.org/scripts/475223/NoCasinoRefill.meta.js
// ==/UserScript==

// Get the element with the id "refill-casino-tokens"
var refillButton = document.getElementById("refill-Casino-tokens");

// Add a click event listener to the button
refillButton.addEventListener("click", function() {
  // When the button is clicked, display an alert
  alert("Beware Instant Mug After Casino refill!");
});