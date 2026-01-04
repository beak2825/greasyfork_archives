// ==UserScript==
// @name         Google Search Highlighter
// @namespace    gglSearchHighlight_kk
// @description  Highlights searched terms in results in yellow, and underlines exact matches
// @version      1.0
// @author       Kai Krause <kaikrause95@gmail.com>
// @include      http*://www.google.*/*
// @include      http*://www.google.co*.*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/406330/Google%20Search%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/406330/Google%20Search%20Highlighter.meta.js
// ==/UserScript==

let embedCSS = setInterval(() => {
	if (document.head) {
		let css = document.createElement("style");
		css.innerText = "em { background-color: #FFFF7F; color: black !important }";
		document.head.appendChild(css);
		clearInterval(embedCSS);
	}
}, 4);

setInterval(() => {
	let search = document.title;
	search = search.replace(/(imagesize|site|related|cache|inurl|filetype|-|OR).*?(?=\s|$)/g, "|split|");
	search = search.replace(/"/g, "|split|");
	search = search.split("|split|");

	search.forEach((term) => {
		term = term.trimStart().trim().toLowerCase();
		term = term.replace(/(\s\*\s|\*)/g, ".*?");
		if (!term) return;

		document.querySelectorAll("em").forEach((el) => {
			let str = el.textContent.trimStart().trim().toLowerCase();

			let isMatch = false;

			if (str === term) {
				isMatch = true;
			}
			else if (term.includes("*")) {
				let re = new RegExp(term);
				if (re.test(str)) isMatch = true;
			}

			if (isMatch) el.innerHTML = "<u>" + el.textContent + "</u>";
		});
	});
}, 50);
