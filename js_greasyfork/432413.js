// ==UserScript==
// @name         WaniKani Forums: Log Out All Shortcut
// @namespace    waniKaniLogOutAllShortcut
// @version      1.1
// @description  Adds an entry "Log Out All" to the preferences dropdown menu.
// @author       Sinyaven
// @license      MIT-0
// @match        https://community.wanikani.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432413/WaniKani%20Forums%3A%20Log%20Out%20All%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/432413/WaniKani%20Forums%3A%20Log%20Out%20All%20Shortcut.meta.js
// ==/UserScript==

(function() {
	'use strict';
	/* global require, $ */
	/* eslint no-multi-spaces: off */

	let funcName = `traverseCustomWidgets`;
	let reqPath  = `discourse/widgets/widget`;
	let oldFunc  = require(reqPath)[funcName];
	require(reqPath)[funcName] = newFunc;

	function newFunc() {
		addEntry();
		oldFunc.apply(this, arguments);
	}

	function addEntry() {
		if (document.getElementById(`logoutAll`)) return;
		let logoutEntry = document.querySelector(`#quick-access-profile li.logout`);
		if (!logoutEntry) return;
		let username = document.querySelector(`#current-user button`).getAttribute(`href`).split(`/u/`)[1];
		let logoutAllEntry = logoutEntry.cloneNode(true);
		logoutAllEntry.id = `logoutAll`;
		logoutAllEntry.querySelector(`span`).textContent += ` All`;
		logoutAllEntry.addEventListener(`click`, () => $.ajax(`/u/${username}/preferences/revoke-auth-token`, {method: `POST`, headers: {[`Discourse-Logged-In`]: `true`}, success: () => location.reload()}));
		logoutEntry.after(logoutAllEntry);
	}


// helper function for logging function calls
//	function observeReq(path) {
//		let o = require(path);
//		Object.entries(o).forEach(([key, f]) => {
//			if (typeof f !== `function`) return;
//			o[key] = function() { console.log(path + `.` + key); f.apply(this, arguments); };
//		});
//	}
})();
