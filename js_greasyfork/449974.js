// ==UserScript==
// @name         WaniKani Blur Context Sentences
// @namespace    waniKaniBlurContextSentences
// @version      1.2
// @description  Initially blurs both the context sentence and its translation. Click to unblur.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/vocabulary/*
// @match        https://www.wanikani.com/review/session
// @match        https://www.wanikani.com/lesson/session
// @match        https://www.wanikani.com/extra_study/session*
// @match        https://preview.wanikani.com/vocabulary/*
// @match        https://preview.wanikani.com/review/session
// @match        https://preview.wanikani.com/lesson/session
// @match        https://preview.wanikani.com/extra_study/session*
// @homepageURL  https://community.wanikani.com/t/3838/1504
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449974/WaniKani%20Blur%20Context%20Sentences.user.js
// @updateURL https://update.greasyfork.org/scripts/449974/WaniKani%20Blur%20Context%20Sentences.meta.js
// ==/UserScript==

(function() {
	"use strict";

	init();

	function init() {
		addClickToUnblur();
		addCss();
	}

	function addClickToUnblur() {
		document.addEventListener("click", e => {
			let paragraph = e.target;
			while (paragraph && paragraph.tagName !== "P") paragraph = paragraph.parentElement;
			if (!paragraph?.parentElement?.classList.contains("context-sentence-group") &&
				!paragraph?.parentElement?.classList.contains("subject-section__text--grouped") &&
				paragraph?.parentElement?.parentElement?.previousElementSibling?.textContent !== "Context Sentences") return;

			paragraph.classList.toggle("unblurred");
		});
	}

	function addCss() {
		let style = document.createElement("style");
		style.textContent = `
			.context-sentence-group p:not(.unblurred), .subject-section__text--grouped p:not(.unblurred), li.list-none > p.m-0.p-0:not(.unblurred) {
				filter: blur(0.3em);
			}
			.context-sentence-group p:hover:not(.unblurred), .subject-section__text--grouped p:hover:not(.unblurred), li.list-none > p.m-0.p-0:hover:not(.unblurred) {
				filter: blur(0.2em);
			}`;
		document.head.appendChild(style);
	}
})();
