// ==UserScript==
// @name         Twitch Drops Auto Claim
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Automatically claims twitch drops
// @author       notjhoan
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466696/Twitch%20Drops%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/466696/Twitch%20Drops%20Auto%20Claim.meta.js
// ==/UserScript==

// Function to check if the required elements are present
function checkElements() {
  // Select the target element that has any of the specified attribute values
  const targetElement = document.querySelector('[data-a-target="DropsEnabled"], [data-a-target="Drops"], [data-a-target="Drop"], [data-a-target="DropsActivados"], [data-a-target="DropsActivés"], [data-a-target="DropAbilitati"], [data-a-target="DropsAktiviert"], [data-a-target="DropsВключены"], [data-a-target="Drops有効"]');

  // Check if the target element is present
  if (targetElement) {
    // Select the first button element with the specific class names
    const buttonElement = document.querySelector('button[class="ScCoreButton-sc-ocjdkq-0 ScCoreButtonPrimary-sc-ocjdkq-1 dulmVz hdAxZi"]');

    // Check if the button element is present
    if (buttonElement) {
      // Click the first button element
      buttonElement.click();

      // After 2 seconds, find and click the second button
      setTimeout(clickSecondButton, 2000);
    }
  }
}

// Function to click the second button
function clickSecondButton() {
  const secondButton = document.querySelector('button[class="ScCoreButton-sc-ocjdkq-0 ibtYyW ScButtonIcon-sc-9yap0r-0 iqxxop"][aria-label="Close"][title="Close"]');
  // Check if the second button element is present
  if (secondButton) {
    // Click the second button element
    secondButton.click();
  }
}

// Set up an interval to check for the elements every 5 seconds (5 * 1000 milliseconds)
const checkInterval = setInterval(checkElements, 5 * 1000);

// Check if the elements are already present
checkElements();
