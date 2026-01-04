// ==UserScript==
// @name        Change Subscribe button text to Purchase on real-debrid.com
// @namespace   Violentmonkey Scripts
// @match       https://real-debrid.com/premium*
// @grant       none
// @version     1.1
// @author      Matthew Hugley
// @description Change Subscribe text to Purchase on Real Debrid 2024-04-30, 2:58:30 PM
// @license BSD 3-Clause
// @downloadURL https://update.greasyfork.org/scripts/493878/Change%20Subscribe%20button%20text%20to%20Purchase%20on%20real-debridcom.user.js
// @updateURL https://update.greasyfork.org/scripts/493878/Change%20Subscribe%20button%20text%20to%20Purchase%20on%20real-debridcom.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Select all span elements inside elements with the class 'btn_grey_more'
  let buttons = document.querySelectorAll(".btn_grey_more span");

  // Loop and check through each button
  buttons.forEach((button) => {
    // If the button text is "Subscribe", change it to "Purchase"
    if (button.textContent.trim() === "Subscribe") {
      button.textContent = "Purchase";
    }
  });
})();
