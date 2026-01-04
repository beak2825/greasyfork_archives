// ==UserScript==
// @name         Indicator
// @namespace    https://evades.io/
// @version      1.0
// @description  Indicator of mouse toggled on/off for evades.io
// @match        https://evades.io/
// @grant        none
// @license MIT
// @icon         https://media.discordapp.net/attachments/1117429086403440680/1140702670185836624/I_iamge.png?width=454&height=454
// @downloadURL https://update.greasyfork.org/scripts/473072/Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/473072/Indicator.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let clickCount = 0;
  let indicatorColor = "red";
  let indicatorElement;

  function createIndicator() {
    indicatorElement = document.createElement("div");
    indicatorElement.style.width = "17px";
    indicatorElement.style.height = "17px";
    indicatorElement.style.position = "fixed";
    indicatorElement.style.bottom = "0";
    indicatorElement.style.right = "0";
    indicatorElement.style.backgroundColor = indicatorColor;
    document.body.appendChild(indicatorElement);
  }

  function updateIndicatorColor() {
    if (clickCount % 2 === 0) {
      indicatorColor = "red";
    } else {
      indicatorColor = "green";
    }
    indicatorElement.style.backgroundColor = indicatorColor;
  }

  function handleClick() {
    clickCount++;
    updateIndicatorColor();
  }

  function addClickListener() {
    const canvasElement = document.getElementById("canvas");
    if (canvasElement) {
      canvasElement.addEventListener("click", handleClick);
    }
  }

  createIndicator();
  addClickListener();
})();