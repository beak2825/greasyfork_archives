// ==UserScript==
// @name         Twitch - Skip content warnings
// @namespace    https://twitch-tools.rootonline.de/
// @version      1.2
// @description  Automatically skip content warnings before playing a stream on Twitch
// @author       @CommanderRoot
// @match        https://www.twitch.tv/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469384/Twitch%20-%20Skip%20content%20warnings.user.js
// @updateURL https://update.greasyfork.org/scripts/469384/Twitch%20-%20Skip%20content%20warnings.meta.js
// ==/UserScript==

// Hide overlay warning in the top left when you hover over the stream
GM_addStyle('.disclosure-card{display: none !important;}');

function getCookie(name) {
	const value = '; ' + document.cookie;
	const parts = value.split('; ' + name + '=');
	if (parts.length === 2) return parts.pop().split(';').shift();
}

function getcurrentUserID() {
	const userCookie = getCookie('twilight-user');
	console.log(userCookie);
	if (typeof userCookie !== 'undefined') {
		let user = JSON.parse(decodeURIComponent(userCookie));
		if (typeof user === 'object' && typeof user['id'] !== 'undefined') {
			return user['id'].toString();
		}
	}
}

(function () {
	'use strict';

	const localStorageKey = 'content-classification-labels-acknowledged';
	const acknowledgedDuration = Date.now() + (365 * 24 * 60 * 60 * 1000); // Now + 365 days
	const acknowledgedMaxAge = Date.now() + (1 * 24 * 60 * 60 * 1000); // Now + 1 day

	try {
		// Get current setting
		let currentSetting = window.localStorage.getItem(localStorageKey);
		if (currentSetting !== null) {
			currentSetting = JSON.parse(currentSetting);
		} else {
			currentSetting = {};
		}

		const currentUserID = getcurrentUserID();

		let targetSetting = JSON.parse(JSON.stringify(currentSetting));
		if (typeof targetSetting['loggedIn'] === 'undefined') {
			targetSetting['loggedIn'] = {};
		}
		if (typeof targetSetting['loggedOut'] === 'undefined') {
			targetSetting['loggedOut'] = {
				'DrugsIntoxication': acknowledgedDuration,
				'Gambling': acknowledgedDuration,
				'MatureGame': acknowledgedDuration,
				// "Significant Profanity or Vulgarity" (selectable but doesn't trigger anything atm)
				'SexualThemes': acknowledgedDuration,
				'ViolentGraphic': acknowledgedDuration,
			};
		} else {
			if (typeof targetSetting['loggedOut']['DrugsIntoxication'] === 'undefined' || targetSetting['loggedOut']['DrugsIntoxication'] < acknowledgedMaxAge) {
				targetSetting['loggedOut']['DrugsIntoxication'] = acknowledgedDuration;
			}
			if (typeof targetSetting['loggedOut']['Gambling'] === 'undefined' || targetSetting['loggedOut']['Gambling'] < acknowledgedMaxAge) {
				targetSetting['loggedOut']['Gambling'] = acknowledgedDuration;
			}
			if (typeof targetSetting['loggedOut']['MatureGame'] === 'undefined' || targetSetting['loggedOut']['MatureGame'] < acknowledgedMaxAge) {
				targetSetting['loggedOut']['MatureGame'] = acknowledgedDuration;
			}
			if (typeof targetSetting['loggedOut']['SexualThemes'] === 'undefined' || targetSetting['loggedOut']['SexualThemes'] < acknowledgedMaxAge) {
				targetSetting['loggedOut']['SexualThemes'] = acknowledgedDuration;
			}
			if (typeof targetSetting['loggedOut']['ViolentGraphic'] === 'undefined' || targetSetting['loggedOut']['ViolentGraphic'] < acknowledgedMaxAge) {
				targetSetting['loggedOut']['ViolentGraphic'] = acknowledgedDuration;
			}
		}

		if (typeof currentUserID === 'string' && currentUserID !== '') {
			if (typeof targetSetting['loggedIn'][currentUserID] === 'undefined') {
				targetSetting['loggedIn'][currentUserID] = [];
			}
			if (!targetSetting['loggedIn'][currentUserID].includes('DrugsIntoxication')) {
				targetSetting['loggedIn'][currentUserID].push('DrugsIntoxication');
			}
			if (!targetSetting['loggedIn'][currentUserID].includes('Gambling')) {
				targetSetting['loggedIn'][currentUserID].push('Gambling');
			}
			if (!targetSetting['loggedIn'][currentUserID].includes('MatureGame')) {
				targetSetting['loggedIn'][currentUserID].push('MatureGame');
			}
			if (!targetSetting['loggedIn'][currentUserID].includes('SexualThemes')) {
				targetSetting['loggedIn'][currentUserID].push('SexualThemes');
			}
			if (!targetSetting['loggedIn'][currentUserID].includes('ViolentGraphic')) {
				targetSetting['loggedIn'][currentUserID].push('ViolentGraphic');
			}
		}

		// Set new setting
		window.localStorage.setItem(localStorageKey, JSON.stringify(targetSetting));
	} catch (e) {
		// Browser blocks localStorage access so we can't get or set any setting
		return;
	}

})();
