// ==UserScript==
// https://greasyfork.org/scripts/445361-novelupdates-auto-darkmode
// @name         novelupdates auto darkmode
// @namespace    somethingthatshouldnotclashwithotherscripts
// @version      1.0
// @description  override theme selection on native browser darkmode change. Basic Idea from Reddit Auto Dark Mode
// @author       SZ
// @match        www.novelupdates.com/*
// @license      Apache-2.0
// @supportURL   https://greasyfork.org/scripts/445361-novelupdates-auto-darkmode/feedback
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/445361/novelupdates%20auto%20darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/445361/novelupdates%20auto%20darkmode.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

let defaultDarkmodeIndex = 1;
let isDarkModeActive = false;
let darkModeTheme = defaultDarkmodeIndex;
let standardTheme = 0;
(function () {
	"use strict";
	const savedDarkModeValue = GM_getValue("darkModeTheme");
	const savedStandardModeValue = GM_getValue("standardTheme");

	darkModeTheme = savedDarkModeValue ?? defaultDarkmodeIndex;
	standardTheme = savedStandardModeValue ?? standardTheme;

	let selectField = document.getElementById("wi_themes");
	const setDarkMode = (isDarkMode) => {
		isDarkModeActive = isDarkMode;
		if (selectField) {
			//in case of wrong site (not working for forum theme toggle)
			//Admins of novelupdate forum could implement https://xenvn.com/threads/th-style-switch-xenforo-2.329/
			let currentStyleIndex = selectField.selectedIndex;
			let currentStyleName = document.getElementById("wi_themes").options[
				currentStyleIndex
			].value;

			if (isDarkMode) {
				if (currentStyleIndex != darkModeTheme)
					selectField.selectedIndex = darkModeTheme;
			} else {
				if (currentStyleIndex != standardTheme)
					selectField.selectedIndex = standardTheme;
			}

			selectField.dispatchEvent(new Event("change", { bubbles: true }));
		}
	};

	const updateDarkMode = (e) => {
		setDarkMode(e.matches);
	};
	
	if (window.matchMedia) {
		// if the browser/os supports system-level color scheme
		const darkModeSetting = window.matchMedia("(prefers-color-scheme: dark)");
		setDarkMode(darkModeSetting.matches);
		darkModeSetting.addEventListener("change", updateDarkMode);
	} else {
		// otherwise use local time to decide
		let hour = new Date().getHours();
		setDarkMode(hour > 18 || hour < 8);
	}

	const setSelectedTheme = (selectedIndex) => {
		let currentStyleIndex = selectField.selectedIndex;
		if (isDarkModeActive) {
			darkModeTheme = currentStyleIndex;
			GM_setValue("darkModeTheme", darkModeTheme);
		} else {
			standardTheme = currentStyleIndex;
			GM_setValue("standardTheme", standardTheme);
		}
	};

	const changeSelectedTheme = (e) => {
		setSelectedTheme(e.matches);
	};

	selectField?.addEventListener("change", changeSelectedTheme);
	window.removeEventListener("beforeunload", changeSelectedTheme);
	window.removeEventListener("beforeunload", updateDarkMode);
})();
