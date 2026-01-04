// ==UserScript==
// @name         Grundo's Cafe - Quick item search in own shop
// @version      0.1
// @description  Adds search own shop to search help bars
// @author       Skyfia
// @namespace    https://pony.fyi
// @run-at       document-start
// @match        *://www.grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480550/Grundo%27s%20Cafe%20-%20Quick%20item%20search%20in%20own%20shop.user.js
// @updateURL https://update.greasyfork.org/scripts/480550/Grundo%27s%20Cafe%20-%20Quick%20item%20search%20in%20own%20shop.meta.js
// ==/UserScript==

(function() {
	'use strict';
	
	function main() {
		// Collect all search help bars
		for (const search_help of document.querySelectorAll(".searchhelp")) {
			// Get item name from another link
			const sdb_a = search_help.querySelector("a[href^='/safetydeposit/']");
			if (!sdb_a) {
				// Something strange with this bar, skip
				return;
			}
			const sdb_params = new URLSearchParams(sdb_a.href.split("?")?.[1]);
			const name = sdb_params.get("query");
			
			// Build shop search url
			const params = new URLSearchParams();
			params.set("query", name);
			const url = `/market/?${params}`;
			
			// Build elements to add
			const a = document.createElement("a");
			a.href = url;
			a.target = "_blank";
			const img = document.createElement("img");
			img.src = "https://grundoscafe.b-cdn.net/misc/shoptill.gif";
			a.append(img);
			
			// Add link after sdb search
			sdb_a.after(a);
		}
	}
	
	switch(document.readyState) {
		case "complete":
		case "interactive":
			main();
			break;
		case "loading":
		default:
			document.addEventListener("DOMContentLoaded", main);
	}
})();