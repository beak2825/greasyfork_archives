// ==UserScript==
// @name        High striker clicker
// @namespace   Violentmonkey Scripts
// @match       https://socketgames-kube.evoplay.games/gamepage/crash*
// @grant       none
// @version     1.1
// @author      ackxhpaez
// @license     GNU GPLv3
// @description 7/6/2024, 6:45:04 PM
// @downloadURL https://update.greasyfork.org/scripts/521746/High%20striker%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/521746/High%20striker%20clicker.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const originalConsoleLog = console.log;
  console.log = function (message) {
    originalConsoleLog.call(console, message);
    const logElement = document.createElement("div");
    logElement.textContent = message;
    logElement.style.background = "rgba(0, 0, 0, 0.7)";
    logElement.style.color = "white";
    logElement.style.padding = "5px";
    logElement.style.position = "fixed";
    logElement.style.bottom = "0";
    logElement.style.left = "0";
    logElement.style.width = "100%";
    logElement.style.zIndex = "9999";
    document.body.appendChild(logElement);
    setTimeout(() => document.body.removeChild(logElement), 5000);
  };

  let autoClicking = false;
  let observer = null;
  let overlayObserver = null;
  let toggleButton = null;
  let clickCount = 1;
  let currentClicks = 0;
  let desiredBet = 1;
  let roundCountInput = null;
  let betAmountInput = null;

 /**
   * @param {number} bet
   */
  function setBet(bet) {
    console.log("Setting bet");
    /** @type {HTMLInputElement?} */
    const betSelector = document.querySelector("#manualBet");
    if (betSelector) {
      const setBetValue = () => {
        betSelector.value = bet.toString();
        betSelector.dispatchEvent(new Event("input", { bubbles: true }));
        betSelector.dispatchEvent(new Event("change", { bubbles: true }));
      };

      // Attempt to set the bet value several times to ensure it sticks
      const interval = setInterval(() => {
        setBetValue();
        if (parseFloat(betSelector.value) === bet) {
          clearInterval(interval);
        }
      }, 100);
      setTimeout(() => clearInterval(interval), 2000); // Stop trying after 2 seconds
    }
  }

  // Function to click the appropriate button
  function clickPlayButton() {
    const button = document.querySelector(".button.button_big");
    if (button) {
      const buttonText = button.textContent?.trim().toLowerCase();
      if (buttonText === "play the next round" || buttonText === "play now") {
        setBet(desiredBet);
        button.click();
        console.log(`Clicked button with text: ${buttonText}`);
        currentClicks++;
        roundCountInput.value = clickCount - currentClicks;
        if (currentClicks >= clickCount) {
          currentClicks = 0;
          toggleAutoClicking();
        }
      } else {
        console.log(`Button text is: ${buttonText}. No action taken.`);
      }
    } else {
      console.log("Button not found");
    }
  }

  // Function to monitor the button for changes
  function monitorButton() {
    const button = document.querySelector(".button.button_big");
    if (button) {
      observer = new MutationObserver(() => {
        if (autoClicking) {
          clickPlayButton();
        }
      });
      observer.observe(button, { childList: true, subtree: true });
      console.log("Started monitoring the button for changes");
    } else {
      console.log("Button not found for monitoring");
    }
  }

  // Function to wait for the button to be rendered
  function waitToRenderToggleButton() {
    const button = document.querySelector(".button.button_big");
    if (button) {
      createToggleButton();
    } else {
      console.log("Waiting for button to be rendered...");
      setTimeout(waitToRenderToggleButton, 500);
    }
  }

  // Function to toggle auto-clicking
  function toggleAutoClicking() {
    console.log("Toggle button clicked");
    autoClicking = !autoClicking;
    console.log(`autoclicking is now: ${autoClicking}`);
    if (autoClicking) {
      toggleButton.textContent = "Stop";
      toggleButton.style.backgroundColor = "#dc3545";
      roundCountInput.disabled = true;
      betAmountInput.disabled = true;
      clickPlayButton();
      monitorButton();
    } else {
      if (observer) {
        observer.disconnect();
      }
      roundCountInput.disabled = false;
      betAmountInput.disabled = false;
      toggleButton.textContent = "Start";
      toggleButton.style.backgroundColor = "#28a745";
    }
  }

  function createToggleButton() {
    if (!toggleButton) {
      // Create the container div
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.bottom = "10px";
      container.style.right = "10px";
      container.style.zIndex = "1000";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.alignItems = "flex-end";
      container.style.gap = "10px"; // Add some space between elements
      document.body.appendChild(container);

      // Create input field for bet amount
      betAmountInput = document.createElement("input");
      betAmountInput.type = "number";
      betAmountInput.id = "betAmountInput";
      betAmountInput.value = desiredBet.toString();
      betAmountInput.style.padding = "5px";
      betAmountInput.style.color = "black";
      betAmountInput.style.width = "100px";
      betAmountInput.addEventListener("change", () => {
        desiredBet = parseInt(betAmountInput.value, 10);
      });
      container.appendChild(betAmountInput);

      // Create label for bet amount input
      const betLabel = document.createElement("label");
      betLabel.textContent = "Bet Amount:";
      betLabel.style.fontSize = "14px";
      betLabel.style.color = "white"; // Set text color to white
      betLabel.style.textAlign = "left";
      container.insertBefore(betLabel, betAmountInput);

      // Create input field for number of clicks
      roundCountInput = document.createElement("input");
      roundCountInput.type = "number";
      roundCountInput.id = "clickCountInput";
      roundCountInput.value = clickCount.toString();
      roundCountInput.style.padding = "5px";
      roundCountInput.style.color = "black";
      roundCountInput.style.width = "100px";
      roundCountInput.addEventListener("change", () => {
        clickCount = parseInt(roundCountInput.value, 10);
      });
      container.appendChild(roundCountInput);

      // Create label for number of clicks input
      const roundLabel = document.createElement("label");
      roundLabel.textContent = "Number of Rounds:";
      roundLabel.style.fontSize = "14px";
      roundLabel.style.color = "white"; // Set text color to white
      roundLabel.style.textAlign = "left";
      container.insertBefore(roundLabel, roundCountInput);

      // Create toggle button
      toggleButton = document.createElement("button");
      toggleButton.id = "toggleButton";
      toggleButton.textContent = "Start";
      toggleButton.style.padding = "10px 20px";
      toggleButton.style.backgroundColor = "#28a745";
      toggleButton.style.color = "white";
      toggleButton.style.border = "none";
      toggleButton.style.borderRadius = "5px";
      toggleButton.style.cursor = "pointer";
      toggleButton.addEventListener("click", toggleAutoClicking);
      container.appendChild(toggleButton);
    }
  }

  // Monitor for the overlay element indicating connection issues
  function monitorOverlay() {
    const overlay = document.querySelector(".overlay .overlay__text");
    if (overlayObserver == null) {
      overlayObserver = new MutationObserver(() => {
        const overlay = document.querySelector(".overlay .overlay__text");
        if (overlay && overlay.textContent.includes("Connecting")) {
          if (autoClicking) {
            console.log("Overlay detected, stopping auto-clicking");
            autoClicking = false;
            if (observer) observer.disconnect();
            toggleButton.textContent = "Resume";
            toggleButton.style.backgroundColor = "#ffc107"; // Change color to yellow
            roundCountInput.disabled = false;
            betAmountInput.disabled = false;
          }
        } else {
          if (!autoClicking && toggleButton.textContent === "Resume") {
            console.log("Overlay gone, resuming auto-clicking");
            autoClicking = true;
            toggleButton.textContent = "Stop";
            toggleButton.style.backgroundColor = "#dc3545"; // Change color back to red
            roundCountInput.disabled = true;
            betAmountInput.disabled = true;
            waitForPlayButtonAndClick();
            monitorButton();
          }
        }
      });
    }

    const config = { childList: true, subtree: true };
    if (overlay != null) {
      overlayObserver.observe(overlay.parentNode, config);
    } else {
      overlayObserver.observe(document.body, config);
    }
  }

  function waitForPlayButtonAndClick() {
    const button = document.querySelector(".button.button_big");
    if (button && (button.textContent?.trim().toLowerCase() === "play the next round" || button.textContent?.trim().toLowerCase() === "play now")) {
      clickPlayButton();
    } else {
      console.log("Waiting for play button to be available...");
      setTimeout(waitForPlayButtonAndClick, 500);
    }
  }

  waitToRenderToggleButton();
  monitorOverlay();
})();
