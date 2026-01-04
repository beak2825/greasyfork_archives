// ==UserScript==
// @name         Crosshair Cursor
// @namespace    https://github.com/No-Eul
// @version      1.0
// @description  Change the default cursor to crosshair in Diep.io
// @author       NoEul
// @license      MIT License - https://github.com/No-Eul/scripts/raw/master/LICENSE.txt
// @source       https://github.com/No-Eul/scripts
// @supportURL   https://github.com/No-Eul/scripts/issues
// @match        *://diep.io/*
// @icon         https://diep.io/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/474945/Crosshair%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/474945/Crosshair%20Cursor.meta.js
// ==/UserScript==

(() => {
	let canvas = document.getElementById("canvas");
	canvas.style.setProperty("cursor", "crosshair");
	let observer = new MutationObserver(mutations => {
		if (canvas.style.getPropertyValue("cursor") === "default")
			canvas.style.setProperty("cursor", "crosshair");
	});
	observer.observe(canvas, {attributes: true, attributeFilter: ["style"]});
})();
