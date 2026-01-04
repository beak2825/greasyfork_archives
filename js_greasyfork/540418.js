// ==UserScript==
// @name         Discord: Normal Home/End in textbox
// @namespace    http://yal.cc/
// @version      2025-06-21
// @description  Makes Home/End navigate to start/end of a line instead of start/end of a paragraph again
// @author       YellowAfterlife
// @match        https://discord.com/channels/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540418/Discord%3A%20Normal%20HomeEnd%20in%20textbox.user.js
// @updateURL https://update.greasyfork.org/scripts/540418/Discord%3A%20Normal%20HomeEnd%20in%20textbox.meta.js
// ==/UserScript==

(function() {
    'use strict';
	let attrMark = "yal-undo-home-end";
	let query = `div[role="textbox"]:not([${attrMark}])`;
	setInterval(() => {
		for (let tb of document.querySelectorAll(query)) {
			tb.setAttribute(attrMark, "");
			tb.addEventListener("keydown", (e) => {
				if (e.key == "Home" || e.key == "End") {
					e.stopImmediatePropagation();
				}
			});
		}
	}, 300);
})();