// ==UserScript==
// @name          Agar FPS Counter
// @description   Adds an fps counter to the upper left of the screen
// @include       *agar.io/*
// @grant         none
// @run-at        document-end
// @version       1.0
// @author        Tom Burris
// @namespace     https://greasyfork.org/en/users/46159
// @icon          http://bit.ly/2oT4wRk
// @compatible    chrome
// @downloadURL https://update.greasyfork.org/scripts/372657/Agar%20FPS%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/372657/Agar%20FPS%20Counter.meta.js
// ==/UserScript==

"use strict";

const hsl = hue => `hsl(${hue},100%,50%)`;

// ** FPS
let fpsBox = document.createElement("div");
fpsBox.style = `
	position: absolute;
	top: 0px;
	left: 0px;
	color: white;
	background: black;
	font-family: 'Ubuntu', monospace;
	font-weight: 400;
`;
document.body.appendChild(fpsBox);
let frames = 0;
setInterval(() => {
	fpsBox.textContent = "fps: " + frames;
	fpsBox.style.color = hsl(frames * 2);
	frames = 0;
}, 1E3);
const clearRectOld = CanvasRenderingContext2D.prototype.clearRect;
CanvasRenderingContext2D.prototype.clearRect = function() {
	if (this.canvas === window.canvas) {
		++frames;
	}
	return clearRectOld.apply(this, arguments);
};
