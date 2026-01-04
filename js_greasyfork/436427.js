// ==UserScript==
// @name         Fix Editor scroll zoom sensitivity - Bonk.io
// @description  Fixes scrolling in the editor causing zoom to go ZOOOM (ie when using a trackpad)
// @author       Excigma
// @namespace    https://github.com/Excigma
// @license      GPL-3.0
// @version      0.0.2
// @match        https://bonk.io/gameframe-release.html
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/436427/Fix%20Editor%20scroll%20zoom%20sensitivity%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/436427/Fix%20Editor%20scroll%20zoom%20sensitivity%20-%20Bonkio.meta.js
// ==/UserScript==

(() => {
	const REVERSE_SCROLL = false;
	const SENSITIVITY = 0.02;

	const mapeditor_midbox_previewcontainer = document.querySelector("#mapeditor_midbox_previewcontainer");
	const classic_mid_customgame = document.getElementById("classic_mid_customgame");

	// This requires the newest version of kklee
	classic_mid_customgame.addEventListener("click", () => {
		if (!window.kklee) {
			alert("Editor scroll zoom tweaks requires kklee to be installed.\nMake sure you have kklee installed.\nIf you have it installed:\n- either kklee failed to load\n- or kklee changed its code and is no longer compatible");
		} else {
			let scroll_amount = 0;
			mapeditor_midbox_previewcontainer.addEventListener("wheel", evt => {
				scroll_amount += evt.deltaY * SENSITIVITY * (REVERSE_SCROLL ? 1 : -1);

				// Once a threshold is reached...
				if (scroll_amount > 1) {
					// Zoom in
					window.kklee.stageRenderer.scaleStage(1.25);
					window.kklee.updateRenderer();
					scroll_amount = 0;
				} else if (scroll_amount < -1) {
					// Zoom out
					window.kklee.stageRenderer.scaleStage(0.8);
					window.kklee.updateRenderer();
					scroll_amount = 0;
				}
		
				// Don't let bonk.io handle the scroll event
				evt.stopImmediatePropagation();
				evt.preventDefault();
			});
		}
	});
})();