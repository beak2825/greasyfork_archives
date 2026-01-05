// ==UserScript==
// @name         Agar.io Mouse Controls
// @namespace    https://greasyfork.org/en/users/46159
// @version      0.6
// @description  Left-click = Split, Right-click = Feed.
// @author       Tom Burris
// @icon         http://bit.ly/2oT4wRk
// @match        *agar.io/*
// @grant        none
// @compatible   chrome
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/20686/Agario%20Mouse%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/20686/Agario%20Mouse%20Controls.meta.js
// ==/UserScript==

(function() {
	"use strict";

	const speed = 50;
	let intervalID = null;

	canvas.addEventListener("mousedown", ({button}) => {
		if (button === 0) // left click
			core.split();
		if (button === 1) // mouse wheel click
			for (let n = 0; n < 4; ++n)
				setTimeout(core.split, n * speed);
		if (button === 2) { // right click
			core.eject();
			intervalID = setInterval(core.eject, speed);
		}
	});
	addEventListener("mouseup", ({button}) => {
		if (button === 2) {
			clearInterval(intervalID);
			intervalID = null;
		}
	});
	canvas.addEventListener("mousewheel", () => {
		canvas.dispatchEvent(new MouseEvent("mousemove", {
			clientX: innerWidth / 2,
			clientY: innerHeight / 2
		}));
	});
	const prevent = event => event.preventDefault();
	canvas.addEventListener("contextmenu", prevent);
	canvas.addEventListener("drag", prevent);
})();
