// ==UserScript==
// @name         WaniKani Review Queue Limiter
// @namespace    reviewQueueLimiter
// @version      1.1
// @description  Allows to truncate the review/extra study queue via a text input in the top right.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/review/session
// @match        https://www.wanikani.com/extra_study/session*
// @match        https://preview.wanikani.com/review/session
// @match        https://preview.wanikani.com/extra_study/session*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441514/WaniKani%20Review%20Queue%20Limiter.user.js
// @updateURL https://update.greasyfork.org/scripts/441514/WaniKani%20Review%20Queue%20Limiter.meta.js
// ==/UserScript==

(function() {
	"use strict";
	/* global $, WaniKani */
	/* eslint no-multi-spaces: off */

	addCss();
	addInput();

	function addInput() {
		const input = document.createElement("input");
		input.type = "text";
		input.pattern = "\\d+";
		input.classList.add("popup-input");
		const count = document.getElementById("available-count");
		count.addEventListener("pointerenter", () => {
			input.style.left  = `${count.offsetLeft }px`;
			input.style.width = `${count.offsetWidth}px`;
			input.value = count.textContent.trim();
			input.style.display = "inline";
		});
		input.addEventListener("pointerout", () => {
			if (document.activeElement !== input) input.style.display = "";
		});
		input.addEventListener("blur", () => {
			input.style.display = "";
		});
		input.addEventListener("keydown", e => {
			switch (e.key) {
				case "Backspace": e.stopPropagation(); return;
				case "Enter"    : if (e.target.validity.valid) limitQueue(e.target.value); return;
			}
		});
		count.after(input);
	}

	function limitQueue(count) {
		const extraStudy = document.URL.includes("extra_study/session");
		const oldOrder = WaniKani.wanikani_compatibility_mode || extraStudy;
		const activeQueueKey = "activeQueue";
		const reviewQueueKey = extraStudy ? "practiceQueue" : "reviewQueue";
		let activeQueue = $.jStorage.get(activeQueueKey);
		let reviewQueue = $.jStorage.get(reviewQueueKey);
		const queueLength = activeQueue.length + reviewQueue.length;
		count = Math.max(count, 1);
		count = Math.min(count, queueLength);
		const deleteCount = queueLength - count;
		if (oldOrder) reviewQueue.splice(0, deleteCount); else reviewQueue.splice(-deleteCount);
		if (extraStudy) activeQueue.splice(0, activeQueue.length - count);
		$.jStorage.set(activeQueueKey, activeQueue);
		$.jStorage.set(reviewQueueKey, reviewQueue);
	}

	function addCss() {
		const style = document.createElement("style");
		style.textContent = `
		.popup-input {
			position: absolute;
			display: none;
			font: inherit;
			margin: -3px;
		}

		.popup-input:invalid {
			color: red;
		}`;
		document.head.appendChild(style);
	}
})();
