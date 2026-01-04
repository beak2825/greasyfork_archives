// ==UserScript==
// @name          [DTPlugin] Toggle Display
// @namespace     https://tampermonkey.net/
// @version       1.0.0
// @description   Press [ESC] to toggle DiepTool's display
// @icon          https://diep.io/favicon-96x96.png
// @author        kwScript
// @match         *://diep.io/*
// @downloadURL https://update.greasyfork.org/scripts/411542/%5BDTPlugin%5D%20Toggle%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/411542/%5BDTPlugin%5D%20Toggle%20Display.meta.js
// ==/UserScript==

window.addEventListener("load", () => {
	const gui = document.getElementsByClassName("gui-dieptool")[0];
	document.addEventListener("keydown", (event) => {
		let keyCode = (event.keyCode || event.which);
		if (keyCode == 27) {
			gui.style.display = (gui.style.display == "none" ? "block" : "none");
		}
	});
});
