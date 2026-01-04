// ==UserScript==
// @name         NoEnergyRefill
// @namespace    NoEnergyWarning
// @version      0.1
// @description  Provides a warning when the energy refill button is pressed
// @author       TurtReynolds
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456317/NoEnergyRefill.user.js
// @updateURL https://update.greasyfork.org/scripts/456317/NoEnergyRefill.meta.js
// ==/UserScript==

// Get the element with the id "refill-energy-bar"
var refillButton = document.getElementById("refill-energy-bar");

// Add a click event listener to the button
refillButton.addEventListener("click", function() {
  // When the button is clicked, display an alert
  alert("Don't use an energy refill! :D");
});