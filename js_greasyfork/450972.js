/* jshint esversion: 6 */

// ==UserScript==
// @name        Wanikani Toggle Kanji Visibility
// @description Adds buttons that toggle the visibility of Kanji and their readings on the Wanikani Kanji pages
// @version     1.1
// @match       https://www.wanikani.com/kanji*
// @author      Timberpile
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @namespace https://greasyfork.org/users/955823
// @downloadURL https://update.greasyfork.org/scripts/450972/Wanikani%20Toggle%20Kanji%20Visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/450972/Wanikani%20Toggle%20Kanji%20Visibility.meta.js
// ==/UserScript==

// SETTINGS
const hideAtBeginning = true;

// CODE
(function(global) {
	'use strict';

	const buttons = [];

	function getLevels() {
		for (const e of document.getElementsByClassName("page-header__title-subtext")) {
			if (e.textContent.startsWith("LEVELS")) {
				var text = e.textContent;
				text = text.replace("LEVELS ", "");
				var vals = text.split("-");
				if (vals.length == 2) {
					return vals;
				}
			}
		}

		return [0,0];
	}

	function onToggleKanjiClick(event) {
		const button = event.target;
		const characters = button.parentElement.getElementsByClassName("character-item__characters");
		const visible = !characters[0].hasAttribute("hidden");

		if (visible) {
			for (const char of characters) {
				char.setAttribute("hidden", "true");
			}
		} else {
			for (const char of characters) {
				char.removeAttribute("hidden");
			}
		}
	}

	function onToggleReadingsClick(event) {
		const button = event.target;
		const readings = button.parentElement.getElementsByClassName("character-item__info-reading");
		const visible = !readings[0].hasAttribute("hidden");

		if (visible) {
			for (const reading of readings) {
				reading.setAttribute("hidden", "true");
			}
		} else {
			for (const reading of readings) {
				reading.removeAttribute("hidden");
			}
		}
	}

	const levels = getLevels();

	if (levels[0] <= 0) {
		console.error("Couldn't find out levels");
		return;
	}

	for (let i = levels[0]; i <= levels[1]; i++) {
		const level_anchor = document.getElementById("level-" + i);
		if (!level_anchor) {
			continue;
		}
		const level_section = level_anchor.parentElement;
		if (!level_section) {
			continue;
		}

		const kanjiButton = document.createElement("button");
		kanjiButton.textContent = "Toggle Kanji";
		kanjiButton.onclick = onToggleKanjiClick;
		buttons.push(kanjiButton);
		level_section.prepend(kanjiButton);

		const readingsButton = document.createElement("button");
		readingsButton.textContent = "Toggle Readings";
		readingsButton.onclick = onToggleReadingsClick;
		buttons.push(readingsButton);
		level_section.prepend(readingsButton);
	}

	if (hideAtBeginning) {
		for (const b of buttons) {
			b.click();
		}
	}

})(window);