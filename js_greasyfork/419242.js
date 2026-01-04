// ==UserScript==
// @name         Lightbulb's Rainbow Health Bar for MooMoo.io
// @version      1.0
// @description  Makes team members (and yourself) have color-changing health bars! Client-side only, others cannot see it.
// @author       Lightbulb
// @match        *://*.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/721571
// @downloadURL https://update.greasyfork.org/scripts/419242/Lightbulb%27s%20Rainbow%20Health%20Bar%20for%20MooMooio.user.js
// @updateURL https://update.greasyfork.org/scripts/419242/Lightbulb%27s%20Rainbow%20Health%20Bar%20for%20MooMooio.meta.js
// ==/UserScript==

let hue = 0;

let replaceInterval = setInterval(() => {
if (CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = ((oldFunc) => function() { if (this.fillStyle == "#8ecc51") this.fillStyle = `hsl(${hue}, 100%, 50%)`; return oldFunc.call(this, ...arguments); })(CanvasRenderingContext2D.prototype.roundRect);
  clearInterval(replaceInterval);
}}, 10);

function changeHue() {
  hue += Math.random() * 3;
}

setInterval(changeHue, 10);