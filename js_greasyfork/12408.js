/*
  The purpose of this script is just to provide a simple FPS counter for those
  wondering more about their browser's performance. This user script was made
  with html5 canvas games in mind.

  Author: Jonathan Cooper (github.com/drowsysaturn)
*/

// ==UserScript==
// @name         FPS Counter
// @namespace    http://github.com/drowsysaturn
// @version      0.1
// @description  FPS Counter (On greasy fork)
// @author       Jonathan Cooper
// @include      http://*/*
// @include      https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12408/FPS%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/12408/FPS%20Counter.meta.js
// ==/UserScript==

(function() {
  var UPDATE_DELAY = 700;

  var lastUpdate = 0;
  var frames = 0;

  var displayElement = document.createElement("div");
  displayElement.style.padding = "5px";
  displayElement.style.font = "16px Arial";
  displayElement.style.display = "block";
  displayElement.style.position = "fixed";
  displayElement.style.top = "0px";
  displayElement.style.left = "0px";
  displayElement.textContent = "Calculating...";
  document.body.appendChild(displayElement);

  function cssColorToRGB(color) {
    var values;

    if (color.startsWith("rgba")) {
      values = color.substring(5, color.length - 1).split(",");
    } else if (color.startsWith("rgb")) {
      values = color.substring(4, color.length - 1).split(",");
    } else if (color.startsWith("#") && color.length === 4) {
      values = [];
      values[0] = "" + parseInt("0x" + color.substr(1, 1));
      values[1] = "" + parseInt("0x" + color.substr(2, 1));
      values[2] = "" + parseInt("0x" + color.substr(3, 1));
    } else if (color.startsWith("#") && color.length === 7) {
      values = [];
      values[0] = "" + parseInt("0x" + color.substr(1, 2));
      values[1] = "" + parseInt("0x" + color.substr(3, 2));
      values[2] = "" + parseInt("0x" + color.substr(5, 2));
    } else {
      return {r : 255, g : 255, b : 255};
    }

    return {
      r : Number(values[0]),
      g : Number(values[1]),
      b : Number(values[2])
    };
  }

  function getInvertedRGB(values) {
    return "rgb(" + (255 - values.r) + "," + (255 - values.g) + ","
      + (255 - values.b) + ")";
  }

  function getOpaqueRGB(values) {
    return "rgba(" + values.r + "," + values.g + "," + values.b + ",0.7)";
  }

  function updateCounter() {
    var bgColor = getComputedStyle(document.body, null).getPropertyValue(
      "background-color");
    var bgColorValues = cssColorToRGB(bgColor);
    var textColor = getInvertedRGB(bgColorValues);
    var displayBg = getOpaqueRGB(bgColorValues);
    displayElement.style.color = textColor;
    displayElement.style.background = displayBg;

    var now = Date.now();
    var elapsed = now - lastUpdate;
    if (elapsed < UPDATE_DELAY) {
      ++frames;
    } else {
      var fps = Math.round(frames / (elapsed / 1000));
      displayElement.textContent = fps + " FPS";
      frames = 0;
      lastUpdate = now;
    }

    requestAnimationFrame(updateCounter);
  }

  lastUpdate = Date.now();
  requestAnimationFrame(updateCounter);
})();
