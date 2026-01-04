// ==UserScript==
// @name         Macro Fast Mass Ejector & Split (Best)✓ 2
// @namespace    https://greasyfork.org/en/users/46159-tom-burris2
// @version      0.7
// @description  Fastest Mass Ejector & Split Macro
// @author       Tom Burris
// @icon         http://bit.ly/2oT4wRk
// @match        *agar.io/*
// @grant        none
// @compatible   chrome
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/372432/Macro%20Fast%20Mass%20Ejector%20%20Split%20%28Best%29%E2%9C%93%202.user.js
// @updateURL https://update.greasyfork.org/scripts/372432/Macro%20Fast%20Mass%20Ejector%20%20Split%20%28Best%29%E2%9C%93%202.meta.js
// ==/UserScript==

(function() {
	"use strict";

	const speed = 50; // in ms
	let intervalID = null;

	addEventListener("keydown", ({key}) => {
		key = key.toLowerCase();
		if (key === "w" && intervalID === null)
			intervalID = setInterval(core.eject);
		if (key === "a") {
			core.split();
			setTimeout(core.split, speed);
		}
		if (key === "d")
			for (let n = 0; n < 4; ++n)
				setTimeout(core.split, speed * n);
		if (key === "s") {
			canvas.dispatchEvent(new MouseEvent("mousemove", {
				clientX: innerWidth / 2,
				clientY: innerHeight / 2
			}));
		}
	});
	addEventListener("keyup", ({key}) => {
		if (key.toLowerCase() === "w") {
			clearInterval(intervalID);
			intervalID = null;
		}
	});
})();
