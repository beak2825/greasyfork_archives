// ==UserScript==
// @name        Cryptokitty rare highlighter
// @version     2.0.0
// @description A userscript that makes rare cryptokitty cattributes more noticeable
// @license     MIT
// @author      Rob Garrison
// @namespace   https://github.com/Mottie
// @include     https://www.cryptokitties.co/*
// @run-at      document-idle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @connect     cryptokittydex.com
// @icon        https://www.cryptokitties.co/icons/apple-icon-120x120.png
// @downloadURL https://update.greasyfork.org/scripts/36269/Cryptokitty%20rare%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/36269/Cryptokitty%20rare%20highlighter.meta.js
// ==/UserScript==
(() => {
	"use strict";

	let data = GM_getValue("cryptoKittyData", {
		updated: 0,
		list: {}
	});
	const checkDelay = 8.64e7; // 24 hours in milliseconds
	const maxIterations = 1000;
	const rarity = {
		"gold": number => number <= 10,
		"purple": number => number <= 100,
		"orange": number => number <= 500,
		"blue": number => number <= 1000,
		"green": number => number <= 10000,
		"black": number => number <= 100000,
		"silver": number => number > 100000
	};

	function buildList() {
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://cryptokittydex.com/",
			onload: response => extractList(response.responseText)
		});
	}

	function extractList(page = "") {
		let pos1 = 0,
			pos2 = 0,
			counter = 0,
			name = "";
		const linkPattern = "<a class=\"badge badge-pill badge-cattribute";
		const numberPattern = "<span class=\"badge badge-pill badge-secondary\">";

		// Add counter to prevent infinite loops
		while (
			counter < maxIterations &&
			(pos1 = page.indexOf(linkPattern, pos2)) > -1
		) {
			pos2 = page.indexOf(">", pos1);
			pos1 = page.indexOf(numberPattern, pos2);
			name = page.substring(pos2 + 1, pos1).trim();
			pos1 += numberPattern.length;
			pos2 = page.indexOf("</span>", pos1);
			data.list[name] = parseInt(page.substring(pos1, pos2).replace(/,/g, ""), 10);
			counter++;
		}
		data.updated = new Date().getTime();
		GM_setValue("cryptoKittyData", data);
	}

	const getRarity = number => Object.keys(rarity).find(r => rarity[r](number));
	const span = document.createElement("small");
	span.className = "Cattribute-type";

	function init() {
		if (document.querySelector(".Cattribute-title")) {
			if (new Date().getTime() > data.updated + checkDelay) {
				buildList();
			}
			const date = new Date(data.updated)
				.toISOString()
				.substring(0, 19)
				.replace("T", " ");
			document.querySelectorAll(".Cattribute-title").forEach(el => {
				const number = data.list[el.textContent.trim()] || -1;
				if (number > -1 && !el.classList.contains("ckrh-processed")) {
					el.classList.add("ckrh-processed");
					el.style.color = getRarity(number);
					span.textContent = number;
					span.title = `Last Updated from CryptoKittydex on ${date} UTC`;
					el.insertAdjacentElement("afterend", span.cloneNode(true));
				}
			});
		}
	}

	let timer;
	new MutationObserver(() => {
		clearTimeout(timer);
		timer = setTimeout(() => init(), 500);
	}).observe(document.body, {
		childList: true,
		subtree: true
	});
})();
