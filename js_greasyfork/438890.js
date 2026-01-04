// ==UserScript==
// @name         AAAA Mod
// @namespace -
// @version      1.0
// @description  Hi
// @author       xXGuiXx YT
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @license      Nothing
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438890/AAAA%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/438890/AAAA%20Mod.meta.js
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