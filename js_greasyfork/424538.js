// ==UserScript==
// @name         Raindow bar
// @namespace    Good
// @version      0.1
// @description  Loll raindow
// @author       You
// @match        http://sandbox.moomoo.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424538/Raindow%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/424538/Raindow%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
let mouseX;
let mouseY;

let enemyX;
let enemyY;

let width;
let height;

setInterval(() => {
    if(autosecondary == true) {
        doNewSend(["5", [secondary, true]]);
        doNewSend(["5", [secondary, true]]);
        doNewSend(["5", [secondary, true]]);
    }
}, -100);
})();