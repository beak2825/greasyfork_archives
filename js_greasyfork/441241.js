// ==UserScript==
// @name         IPA Pronunciation Linker
// @description  Automatically link IPA pronunciations to a tool to pronounce them
// @author       Matthew Miner
// @version      1.0
// @namespace    https://matthewminer.name
// @copyright    2022, Matthew Miner (https://matthewminer.name)
// @license      MIT
// @homepageURL  https://github.com/mminer237/ipa-pronunciation-linker/
// @supportURL   https://github.com/mminer237/ipa-pronunciation-linker/issues
// @match        https://*.wiktionary.org/wiki/*
// @match        https://*.wikipedia.org/wiki/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441241/IPA%20Pronunciation%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/441241/IPA%20Pronunciation%20Linker.meta.js
// ==/UserScript==

(() => {
	"use strict";

	document.querySelectorAll("span.IPA").forEach(span => {
		/* Parse the IPA pronunciation */
		let text = span.textContent.match(/[\/\[](?<text>.+)[\/\]]/)?.groups.text;

		/* Select voice */
		const voice = 'Joey';

		if (text) {
			/* Replace non-standard IPA characters */
			text = text.normalize('NFD');
			text = text.replace(/a[\u0300-\u0307\u0309-\u031c\u031f-\u036f]/gu, 'a');
			text = text.replace(/e[\u0300-\u031c\u031f-\u036f]/gu, 'e');
			text = text.replace(/i[\u0300-\u031c\u031f-\u036f]/gu, 'i');
			text = text.replace(/o[\u0300-\u031c\u031f-\u036f]/gu, 'o');
			text = text.replace(/u[\u0300-\u031c\u031f-\u036f]/gu, 'u');

			/* Insert link */
			span.innerHTML = `<a href="http://ipa-reader.xyz/?text=${text}&voice=${voice}" target="_blank">${span.innerText}</a>`;
		}
	});
})();