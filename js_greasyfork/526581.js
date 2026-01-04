// ==UserScript==
// @name         Seltani Editor Enhancer
// @namespace    https://mkps.app/
// @version      0.1.3
// @description  Enhances the Seltani build page with monospace fonts and no spellcheck
// @tag          games
// @author       MK
// @license      MIT
// @match        *://seltani.net/*
// @icon         https://mystonline.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/526581/Seltani%20Editor%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/526581/Seltani%20Editor%20Enhancer.meta.js
// ==/UserScript==

(() => {
	"use strict";

	const STYLE = `
		.BuildPropKey, .BuildPropSubpane, .BuildPropTable td:first-child:not(:last-child) a {
			font-family: Consolas, Inconsolata, "Courier New", monospace;
		}
		.BuildPropSubpane[placeholder="Code"], .BuildPropSubpane[placeholder="Value"] {
			overflow-x: visible !important;
			white-space: nowrap;
			tab-size: 4;
		}
	`;

	function main() {
		GM_addStyle(STYLE);

		for (const element of document.querySelectorAll(".BuildPropKey, .BuildPropSubpane")) {
			unsafeWindow.$(element).trigger("autosize.resize");
		}

		forMatchingElementsForever(".BuildPropKey, .BuildPropSubpane", (element) => {
			element.setAttribute("spellcheck", false);
		});
	}

	function forMatchingElementsForever(selector, fn) {
		const observer = new MutationObserver((list) => {
			for (const mutation of list) {
				for (const addedNode of mutation.addedNodes) {
					if (addedNode.nodeType !== Node.ELEMENT_NODE) {continue;}
					for (const newNode of addedNode.querySelectorAll(selector)) {
						fn(newNode);
					}
				}
			}
		});
		observer.observe(document.body, {childList: true, subtree: true});

		for (const element of document.querySelectorAll(selector)) {
			fn(element);
		}
	}

	main();
})();
