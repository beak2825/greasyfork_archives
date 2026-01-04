// ==UserScript==
// @name        Gradient health
// @namespace   -
// @match       https://sploop.io/
// @grant       none
// @version     1.0
// @license     mit
// @author      Urban Dubov
// @description 5/11/2023, 10:58:22 PM
// @downloadURL https://update.greasyfork.org/scripts/525773/Gradient%20health.user.js
// @updateURL https://update.greasyfork.org/scripts/525773/Gradient%20health.meta.js
// ==/UserScript==

const { fillRect } = CanvasRenderingContext2D.prototype;
const firstColor = "#00ff87";
const secondColor = "#60efff";

CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
  if (this.fillStyle === "#a4cc4f") {
    const gradient = this.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, firstColor);
    gradient.addColorStop(1, secondColor);
    this.fillStyle = gradient;
    fillRect.call(this, x, y, width, height);
  } else {
    fillRect.call(this, x, y, width, height);
  }
};