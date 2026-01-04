// ==UserScript==
// @name          Twitch Auto Claim Bonus
// @icon          https://raw.githubusercontent.com/0xShutdown/Twitch-Auto-Claim-Bonus/main/icon.png
// @description   Automatically claim Twitch channel points.
// @author        SHUTDOWN
// @copyright     2024, SHUTDOWN
// @version       1.1
// @license       MIT
// @match         https://www.twitch.tv/*
// @match         https://dashboard.twitch.tv/*
// @homepage      https://github.com/0xShutdown/Twitch-Auto-Claim-Bonus
// @supportURL    https://github.com/0xShutdown/Twitch-Auto-Claim-Bonus/issues
// @grant         none
// @namespace https://greasyfork.org/users/770660
// @downloadURL https://update.greasyfork.org/scripts/426336/Twitch%20Auto%20Claim%20Bonus.user.js
// @updateURL https://update.greasyfork.org/scripts/426336/Twitch%20Auto%20Claim%20Bonus.meta.js
// ==/UserScript==

// Function to claim Twitch channel points
function claimTwitchPoints() {
  // Select all elements with the class '.community-points-summary button'
  var pointsButtons = document.querySelectorAll(".community-points-summary button");

  // Check if there are more than one button available
  if (pointsButtons.length > 1) {
    console.log('+50 Points');
    // Click the second button (index 1) to claim points
    pointsButtons[1].click();
  }
}

// Set interval to run the claimTwitchPoints function at random intervals between 7200 and 9000 milliseconds
let chestInterval = setInterval(claimTwitchPoints, Math.random() * 1800 + 7200);

// Log a message indicating that the script is enabled
console.log("[ENABLE] Twitch Auto Claim Bonus");
