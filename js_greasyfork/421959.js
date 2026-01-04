// ==UserScript==
// @name         WaniKani Old Mnemonics
// @namespace    oldmnemonics
// @version      1.28
// @description  Adds the old mnemonics to the lessons, reviews and item pages.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @resource     csvResource https://raw.githubusercontent.com/tofugu/wanikani-deprecated-content/master/deprecated_subject_data.csv
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1673042
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/421959/WaniKani%20Old%20Mnemonics.user.js
// @updateURL https://update.greasyfork.org/scripts/421959/WaniKani%20Old%20Mnemonics.meta.js
// ==/UserScript==

(function() {
	"use strict";
	/* global $, wkItemInfo */
	/* eslint no-multi-spaces: "off" */

	let csv = "";

	function init() {
		csv = GM_getResourceText("csvResource");

		wkItemInfo                                            .forType("radical").under("meaning")                    .append("Old Name Mnemonic"   , o => oldMnemonicSection(o.id, "meaning", o.on === "itemPage" ? "aside" : "blockquote"));
		wkItemInfo.on("lesson"                               ).forType("kanji"  ).under("meaning")                    .append("Old Meaning Mnemonic", o => oldMnemonicSection(o.id, "meaning",                                 "blockquote"));
		wkItemInfo.on("itemPage,lessonQuiz,review,extraStudy").forType("kanji"  ).under("reading").spoiling("meaning").append("Old Meaning Mnemonic", o => oldMnemonicSection(o.id, "meaning", o.on === "itemPage" ? "aside" : "blockquote"));
		wkItemInfo                                            .forType("kanji"  ).under("reading")                    .append("Old Reading Mnemonic", o => oldMnemonicSection(o.id, "reading", o.on === "itemPage" ? "aside" : "blockquote"));
	}

	function oldMnemonicSection(subjectId, mnemonicType, hintBoxTag) {
		let lineStartIdx = csv.indexOf("\n" + subjectId.toString() + ",");
		if (lineStartIdx < 0) return null;

		let line = parseCsvLine(csv, lineStartIdx);

		let mnemonic = null;
		switch (mnemonicType) {
			case "meaning": mnemonic = line.slice(4, 6); break;
			case "reading": mnemonic = line.slice(7, 9); break;
		}
		if (!mnemonic) return null;

		let paragraph = mnemonicTextToParagraphs(mnemonic[1]);
		let pHint     = mnemonicTextToParagraphs(mnemonic[0]);

		if (paragraph.length === 0) return null;

		let sMnemonic = document.createElement("section");
		sMnemonic.classList.add("mnemonic-content");
		paragraph.forEach(p => p.classList.add("subject-section__text"));
		paragraph.forEach(p => sMnemonic.appendChild(p));

		if (pHint.length > 0) {
			let bHint = document.createElement(hintBoxTag);
			let hHint = document.createElement("h3");
			let iHint = document.createElement("i");
			let tHint = document.createTextNode(" HINT");
			bHint.classList.add("additional-info", "subject-hint");
			hHint.classList.add("subject-hint__title");
			iHint.classList.add("fa", "fa-solid", "fa-question-circle",  "fa-circle-question", "subject-hint__title-icon");
			hHint.appendChild(iHint);
			hHint.appendChild(tHint);
			bHint.appendChild(hHint);
			pHint.forEach(p => bHint.appendChild(p));
			sMnemonic.appendChild(bHint);
		}
		return sMnemonic;
	}

	function parseCsvLine(csv, lineStartIdx) {
		let quotation = false;
		let line = [""];
		for (let i = lineStartIdx + 1; i < csv.length; i++) {
			let c = csv[i]; // this is safe because the csv does not contain surrogate pairs
			if (c === "\n" && !quotation) break;
			switch (c) {
				case `"`: quotation = !quotation; if (quotation && csv[i - 1] === `"`) line[line.length - 1] += c; break;
				case `,`: if (!quotation) { line.push(""); break; } // otherwise fall through
				default : line[line.length - 1] += c;
			}
		}
		return line;
	}

	function mnemonicTextToParagraphs(text) {
		if (!text) return [];

		let parts = text.split("\n");
		return parts.map(mnemonicTextToParagraph);
	}

	function mnemonicTextToParagraph(text) {
		let nodes = mnemonicTextToNodeList(text);
		return nodes.reduce((p, n) => { p.appendChild(n); return p; }, document.createElement("p"));
	}

	function mnemonicTextToNodeList(text) {
		let parts = text.split(/\[([^\]]*)\](.*?)\[\/\1\]/); // assumption: nested tags are always of different types, e.g. NOT: [ja][ja]...[/ja][/ja]
		parts = parts.   map((p, i) => i % 3 !== 1 ? p : [p, parts[i + 1]]);
		parts = parts.filter((p, i) => i % 3 !== 2);
		let nodes = parts.map((p, i) => {
			switch (i % 2) {
				case 0: return document.createTextNode(p);
				case 1: {
					let span = document.createElement("span");
					if (p[0] === "ja") {
						span.lang = "ja";
					} else {
						span.classList.add(`${p[0]}-highlight`, `highlight-${p[0]}`);
						//span.rel = "tooltip";
						span.dataset.originalTitle = p[0];
					}
					mnemonicTextToNodeList(p[1]).forEach(n => span.appendChild(n));
					return span;
				}
			}
		});
		return nodes;
	}

	init();
})();
