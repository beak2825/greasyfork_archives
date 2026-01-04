// ==UserScript==
// @name         Kagi doggo xeyes
// @namespace    http://kagi.com/
// @version      2025-12-03
// @description  Makes doggo's eyes follow the cursor.
// @author       jacobwinters
// @match        https://kagi.com/
// @match        https://kagi.com/settings/companions
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545483/Kagi%20doggo%20xeyes.user.js
// @updateURL https://update.greasyfork.org/scripts/545483/Kagi%20doggo%20xeyes.meta.js
// ==/UserScript==

// Nerd sniped by https://x.com/SambitBiswas/status/1955022904871043218

(function () {
	"use strict";
	addEventListener("mousemove", (e) => {
		for (let pupil of document.querySelectorAll(".pupil")) {
			if (!pupil.style.translate) {
				pupil.style.translate = "0";
			}
			let eye = pupil.previousElementSibling.previousElementSibling;
			let oldEyeStrokeWidth = eye.getAttribute("stroke-width");
			eye.setAttribute("stroke-width", pupil.r.baseVal.value * 2);
			let pointer = DOMPoint.fromPoint({ x: e.clientX, y: e.clientY }).matrixTransform(pupil.getScreenCTM().inverse());
			let eyeBBox = eye.getBBox();
			let baseCx = eyeBBox.x + eyeBBox.width / 2;
			let baseCy = eyeBBox.y + eyeBBox.height / 2;
			let c;
			let f = 0.5;
			for (let i = 0; i < 16; i++) {
				c = [baseCx * f + pointer.x * (1 - f), baseCy * f + pointer.y * (1 - f)];
				if (!eye.isPointInFill({ x: c[0], y: c[1] }) || eye.isPointInStroke(({ x: c[0], y: c[1] }))) {
					f += 0.25 / 2 ** i;
				} else {
					f -= 0.25 / 2 ** i;
				}
			}
			pupil.setAttribute("cx", c[0]);
			pupil.setAttribute("cy", c[1]);
			eye.setAttribute("stroke-width", oldEyeStrokeWidth);
		}
	});
})();
