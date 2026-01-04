// ==UserScript==
// @name         Move Painter with Middle Mouse Button
// @namespace    http://tampermonkey.com/
// @version      1.1
// @description  Allows you to drag the Painter with the Middle Mouse Button
// @author       MTP3
// @license      0BSD
// @match        *://manyland.com/*
// @icon         http://manyland.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428532/Move%20Painter%20with%20Middle%20Mouse%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/428532/Move%20Painter%20with%20Middle%20Mouse%20Button.meta.js
// ==/UserScript==

// don't worry about all the warnings
// tampermonkey couldn't possibly know about some of the things manyland defines

let replacePainter = () => {
	if (ig.game.painter.movable)
	{
		//ig.game.sounds.success.play();
		return;
	}

	let teleportElement = (element, x, y) => {
		if (!element)
			return;

		jQuery(element).css("left", x + "px");
		jQuery(element).css("top", y + "px");
	};

	let offsetElement = (element, x, y) => {
		if (!element)
			return;

		let pos = jQuery(element).position();

		teleportElement(element, x + pos.left, y + pos.top);
	};

	ig.game.painter.updateCursorPos = (e) => {
		if (!ig.game.painter.isRunning)
			ig.game.painter.moving = false;

		if (!ig.game.painter.moving)
			return;

		let painter = ig.game.painter;

		let pos = jQuery(ig.game.painter.canvas).position();
		let x = e.movementX;
		let y = e.movementY;

		offsetElement(ig.game.painter.canvas, x, y);
		offsetElement($(".painterInputBox")[0], x, y);

		ig.game.painter.oldMouseX = e.offsetX;
		ig.game.painter.oldMouseY = e.offsetY;
	};

	document.addEventListener('mousemove', ig.game.painter.updateCursorPos);

	document.addEventListener('mousedown', (e) => {
		if (e.button == 1)
			ig.game.painter.moving = true;
	});

	document.addEventListener('mouseup', (e) => {
		if (e.button == 1)
			ig.game.painter.moving = false;
	});

	ig.game.painter.movable = true;

	//ig.game.sounds.success.play();
};

// A loader I have to have here so tampermonkey doesn't not load my script
// and/or crash manyland by accident
(() => {
	let loading = setInterval(() => {
		if      (typeof ig === "undefined") return;
        else if (typeof ig.game === "undefined") return;
        else if (typeof ig.game.painter === "undefined") return;

        clearInterval(loading);
		replacePainter();
    }, 250);
})();
