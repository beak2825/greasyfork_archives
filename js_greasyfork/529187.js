// ==UserScript==
// @name         HentaiSharing-NoRedirect
// @namespace    https://github.com/HageFX-78
// @version      0.1
// @description  QoL improvements for hentai-sharing.net, mainly removes redirects
// @author       HageFX78
// @license      MIT
// @match        https://hentai-sharing.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentai-sharing.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529187/HentaiSharing-NoRedirect.user.js
// @updateURL https://update.greasyfork.org/scripts/529187/HentaiSharing-NoRedirect.meta.js
// ==/UserScript==

window.addEventListener("load", function () {
	"use strict";

	let entry = document.getElementsByClassName("entry");

	if (!pageCheck()) {
		let scrollTo = document.getElementById("main-content");
		window.scrollTo(0, scrollTo.offsetTop - 50);

		// Replace all redirects with result link
		let entryFirstDivElement = entry[0].querySelector("div");

		let links = entryFirstDivElement.querySelectorAll("a");
		links.forEach((link) => {
			let href = link.getAttribute("href");

			// Temporarily disable clicks
			link.setAttribute("data-original-href", href);
			link.setAttribute("href", "#loading");
			link.style.pointerEvents = "none";

			fetch(href)
				.then((response) => response.text())
				.then((html) => {
					let parser = new DOMParser();
					let doc = parser.parseFromString(html, "text/html");
					let result = doc
						.querySelector(".mihdan-no-external-links-content a")
						.getAttribute("href");

					link.setAttribute("href", result);
					link.style.pointerEvents = "auto";
				})
				.catch((error) => {
					console.error("Error:", error);
					link.setAttribute(
						"href",
						link.getAttribute("data-original-href")
					);
					link.style.pointerEvents = "auto";
				});
		});
	} else {
		// Listing page image to article page replacement
		Array.from(entry).forEach((entryElement) => {
			let entryFirstDivElement = entryElement.querySelector("div");
			let allHref = entryFirstDivElement.querySelectorAll("a");
			let firstHref = allHref[0];
			let lastHref = allHref[allHref.length - 1];

			firstHref.setAttribute("href", lastHref.getAttribute("href"));
		});
	}
});

function pageCheck() {
	//Check if article tag with class item-list exists
	return document.querySelector("article.item-list") !== null;
}
