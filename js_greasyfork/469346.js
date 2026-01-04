// ==UserScript==
// @name        Night Mode [MooMoo.IO]
// @description Night mode for MooMoo.IO.
// @version     1.0
// @author      @ihymidnight
// @namespace   https://greasyfork.org/en/users/1110675-ihymidnight
// @match       *://*.moomoo.io/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/469346/Night%20Mode%20%5BMooMooIO%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/469346/Night%20Mode%20%5BMooMooIO%5D.meta.js
// ==/UserScript==

const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;

CanvasRenderingContext2D.prototype.drawImage = function () {
  // Set the brightness of the game UI.
  const shadowVal = 60;
  const gameUI = document.querySelector("#gameCanvas");
  gameUI.style.filter = `brightness(${shadowVal}%)`;

  // Get the width and height of the image being drawn.
  const imageWidth = arguments[3] || arguments[0].width;
  const imageHeight = arguments[4] || arguments[0].height;

  // Calculate the center of the image.
  const centerX = arguments[1] + imageWidth / 2;
  const centerY = arguments[2] + imageHeight / 2;

  // Save the current state of the canvas.
  this.save();

  // Set the shadow color and blur radius.
  this.shadowColor = "rgba(204, 0, 95, 0.5)";
  this.shadowBlur = 10;

  // Draw the image with the shadow.
  originalDrawImage.apply(this, arguments);

  // Restore the canvas to its previous state.
  this.restore();

  // Reset the shadow color and blur radius.
  this.shadowColor = "transparent";
  this.shadowBlur = 0;
};
