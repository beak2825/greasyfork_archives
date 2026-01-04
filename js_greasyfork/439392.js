// ==UserScript==
// @name        Wordle save file helper
// @namespace   il0x89mvb33pzor0fqyj
// @description Allows to you export and import your Wordle save data
// @match       https://www.nytimes.com/games/wordle/*
// @grant       GM.registerMenuCommand
// @grant       GM.setClipboard
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @version     1.3
// @run-at      document-start
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/439392/Wordle%20save%20file%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/439392/Wordle%20save%20file%20helper.meta.js
// ==/UserScript==

(function () {
	"use strict";


	function getLocalStorageAsString() {
		const result = Object.create(null);

		for (let i = 0, l = localStorage.length; i < l; ++i) {
			const key = localStorage.key(i);
			if (key.startsWith("nyt-wordle-")) {
				result[key.substring(11)] = localStorage.getItem(key);
			}
		}

		return JSON.stringify(result);
	}


	function importLocalStorageFromString(data) {
		try {
			data = JSON.parse(data);
		} catch (e) {
			return false;
		}

		for (let [k, v] of Object.entries(data)) {
			if (!k.startsWith("nyt-wordle-")) {
				k = `nyt-wordle-${k}`;
			}
			localStorage.setItem(k, v);
		}
		return true;
	}


	async function autoSave() {
		const savedata = await GM.getValue("autosave");

		if (savedata) {
			const playedSave = JSON.parse(JSON.parse(savedata).statistics).gamesPlayed;
			const playedActual = JSON.parse(localStorage.getItem("nyt-wordle-statistics")).gamesPlayed;
			if (playedActual < playedSave) {
				return;
			}
		}

		// No save data, or number of games is equal/higher
		GM.setValue("autosave", getLocalStorageAsString());
	}


	// Save every minute while the tab is active,
	// and when it gains/loses focus
	let saveInterval;

	function onFocus() {
		clearInterval(saveInterval);
		autoSave();
		saveInterval = setInterval(autoSave, 60000);
	}

	function onBlur() {
		clearInterval(saveInterval);
		autoSave();
	}


	window.addEventListener("focus", onFocus);
	window.addEventListener("blur", onBlur);


	GM.registerMenuCommand("Export Wordle save data", () => {
		GM.setClipboard(btoa(getLocalStorageAsString()));
		alert("Save data copied to clipboard.");
	});


	GM.registerMenuCommand("Import Wordle save data", () => {
		const imported = prompt("Paste save data here:");

		if (imported && importLocalStorageFromString(atob(imported))) {
			alert("Import successful!");
			location.reload();
		}
	});


	GM.registerMenuCommand("Restore latest autosave", async () => {
		const savedata = await GM.getValue("autosave");

		if (savedata) {
			const playedSave = JSON.parse(JSON.parse(savedata).statistics).gamesPlayed;

			if (confirm(`The autosave has ${playedSave} games on record. Really restore it?`) && importLocalStorageFromString(savedata)) {
				alert("Restore successful!");
				location.reload();
			}
		}
	});


	GM.registerMenuCommand("Delete autosave", () => {
		if (confirm("Really DELETE the stored autosave?")) {
			// Disable autosaving on this page load
			window.removeEventListener("focus", onFocus);
			window.removeEventListener("blur", onBlur);
			clearInterval(saveInterval);

			GM.deleteValue("autosave");

			alert("Autosave cleared.");
		}
	});
})();
