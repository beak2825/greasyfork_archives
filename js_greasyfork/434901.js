// ==UserScript==
// @name        PassThePopcorn: Bypass ptpimg proxy
// @namespace   b4bmvfubcqg434q54ozt
// @match       https://passthepopcorn.me/*
// @grant       none
// @version     1.0
// @description Bypasses the c1/c2 image proxies
// @run-at      document-start
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/434901/PassThePopcorn%3A%20Bypass%20ptpimg%20proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/434901/PassThePopcorn%3A%20Bypass%20ptpimg%20proxy.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const replaceRegex = /https:\/\/c\d\.ptpimg\.me\/.*\/(https?:\/\/)/g;

	function rewrite(text) {
		return text.replaceAll(replaceRegex, "$1");
	}


	// Correct image attributes.
	// Set to lazy loading to compensate
	// for the fact we're loading full-res images now.
	function fixImage(img) {
		if (img.dataset.style) {
			const newStyle = rewrite(img.dataset.style);

			if (newStyle !== img.dataset.style) {
				img.referrerPolicy = "same-origin";
				img.loading = "lazy";
				img.dataset.style = newStyle;
			}
		}

		const newSrc = rewrite(img.src);
		if (newSrc !== img.src) {
			img.referrerPolicy = "same-origin";
			img.loading = "lazy";
			img.src = newSrc;
		}
	}


	function fixBackground(el) {
		const newStyle = rewrite(el.style.backgroundImage);
		if (newStyle !== el.style.backgroundImage) {
			el.style.backgroundImage = newStyle;
		}
	}


	function fixImages() {
		const selectorImg = "img[src^='https://c1.ptpimg.me/'], img[data-style*='https://c1.ptpimg.me/'], img[src^='https://c2.ptpimg.me/'] img[data-style*='https://c2.ptpimg.me/']";

		for (const cover of document.querySelectorAll(selectorImg)) {
			fixImage(cover);
		}
	}


	function fixBackgrounds() {
		const selectorBG = "a[style*='https://c1.ptpimg.me/'], a[style*='https://c2.ptpimg.me/']";

		for (const cover of document.querySelectorAll(selectorBG)) {
			fixBackground(cover);
		}
	}



	// Continually monitor image loads through the capturing error event
	window.addEventListener("error", ({ target }) => {
		if (target.tagName?.toUpperCase?.() === "IMG") {
			fixImage(target);
		}
	}, { capture: true, passive: true });


	// Try to fix everything on DOM load
	window.addEventListener("DOMContentLoaded", () => {
		fixBackgrounds();
		fixImages();

		// Continually monitor background styles
		new MutationObserver(fixBackgrounds).observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ["style"]
		});
	});
})();
