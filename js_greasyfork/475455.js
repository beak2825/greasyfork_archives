// ==UserScript==
// @name         BetFury Mines Autoplay Script
// @version      0.1
// @description  Automates the BetFury Mines game with two rounds, increasing the bet after each win and decreasing the bet after each loss.
// @author       wolf 
// @match        https://betfury.io/mines
// @grant        none
// @namespace https://greasyfork.org/users/1171795
// @downloadURL https://update.greasyfork.org/scripts/475455/BetFury%20Mines%20Autoplay%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/475455/BetFury%20Mines%20Autoplay%20Script.meta.js
// ==/UserScript==

(function() {
  // Get the game elements
  const betAmountInput = document.querySelector("input[type='number'][name='betAmount']");
  const autoplayToggle = document.querySelector(".toggle--switched.default-controls__toggle-auto");
  const startAutoplayButton = document.querySelector(".button-3d_md.button-3d_red.button-3d_center.button-3d_fullwidth");

  // Set the initial bet amount
  let betAmount = 100;

  // Start the autoplay loop
  function startAutoplay() {
    // Place the bet
    betAmountInput.value = betAmount;
    betAmountInput.dispatchEvent(new Event("input"));

    // Click the start autoplay button
    startAutoplayButton.click();
  }

  // Handle a win
  function handleWin() {
    // Increase the bet amount
    betAmount *= 1.2;
  }

  // Handle a loss
  function handleLoss() {
    // Decrease the bet amount
    betAmount /= 1.2;
  }

  // Start the autoplay loop after the page has loaded
  document.addEventListener("DOMContentLoaded", function() {
    startAutoplay();
  });

  // Listen for win and loss events
  document.addEventListener("mines-win", handleWin);
  document.addEventListener("mines-loss", handleLoss);

  // Add a button to stop the autoplay loop
  const stopAutoplayButton = document.createElement("button");
  stopAutoplayButton.textContent = "Stop Autoplay";
  stopAutoplayButton.classList.add("button-3d");
  stopAutoplayButton.classList.add("button-3d_md");
  stopAutoplayButton.classList.add("button-3d_red");
  stopAutoplayButton.classList.add("button-3d_center");
  stopAutoplayButton.classList.add("button-3d_fullwidth");
  stopAutoplayButton.addEventListener("click", function() {
    autoplayToggle.click();
  });
  document.querySelector(".controls").appendChild(stopAutoplayButton);
})();
