// ==UserScript==
// @name         Agar.io Arrow Keys
// @namespace    https://greasyfork.org/en/users/46159-tom-burris2
// @version      0.4
// @description  Use arrow keys to move your cell!
// @author       Tom Burris
// @icon         http://bit.ly/2oT4wRk
// @match        *agar.io/*
// @grant        none
// @compatible   chrome
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/20726/Agario%20Arrow%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/20726/Agario%20Arrow%20Keys.meta.js
// ==/UserScript==

"use strict";

let down = 0;
const change = ({keyCode, type}) => {
	let i = keyCode - 37;
	let d = type === "keydown";
	if (i >= 0 && i < 4) {
		down = down & ~(1 << i) | d << i;
		let xy = [innerWidth / 2, innerHeight / 2];
		const min = Math.min(innerWidth, innerHeight);
		for (let n = 0; n < 4; ++n) {
			xy[n & 1] += (n < 2 ? -1 : 1) * min * (down >> n & 1);
		}
		canvas.dispatchEvent(new MouseEvent("mousemove", {
			clientX: xy[0],
			clientY: xy[1]
		}));
	}
};
addEventListener("keydown", change);
addEventListener("keyup", change);
