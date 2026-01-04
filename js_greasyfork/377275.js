// ==UserScript==
// @name         Agar Feed Macro
// @namespace    https://agar.io/
// @version      0.1
// @description  Agar feed macro
// @author       You
// @match        https://agar.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377275/Agar%20Feed%20Macro.user.js
// @updateURL https://update.greasyfork.org/scripts/377275/Agar%20Feed%20Macro.meta.js
// ==/UserScript==

(function() {
    'use strict';
const speed = 50;
	let intervalID = null;

	canvas.addEventListener("mousedown", ({button}) => {
		if (button === 0) { // right click
			core.eject();
			intervalID = setInterval(core.eject, speed);
		}
	});
	addEventListener("mouseup", ({button}) => {
		if (button === 0) {
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