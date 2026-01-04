// ==UserScript==
// @name         Redirect Old Links
// @version      0.3
// @description  No more "Module Disabled"!
// @author       comp500
// @namespace    https://infra.link/
// @match        https://minecraft.curseforge.com/mc-mods/*
// @homepageURL  https://github.com/comp500/Curseforge-Userscripts/
// @supportURL   https://github.com/comp500/Curseforge-Userscripts/issues/
// @source       https://github.com/comp500/Curseforge-Userscripts/
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @connect      addons-ecs.forgesvc.net
// @downloadURL https://update.greasyfork.org/scripts/395344/Redirect%20Old%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/395344/Redirect%20Old%20Links.meta.js
// ==/UserScript==

(async function() {
	'use strict';

	let greaseMonkeyXHR = details => {
		details.method = details.method ? details.method : "GET";
		details.anonymous = true;
		details.responseType = details.responseType ? details.responseType : "arraybuffer";
		return new Promise((resolve, reject) => {
			details.onload = resolve;
			details.onerror = reject;
			GM_xmlhttpRequest(details);
		});
	};

	// Match project IDs
	let matches = location.href.match(/https:\/\/minecraft.curseforge.com\/mc-mods\/(\d+)/);
	if (matches != null && matches[1] != null) {
		location.href = "https://www.curseforge.com/projects/" + matches[1];
	} else {
		// Match slug IDs
		matches = location.href.match(/https:\/\/minecraft.curseforge.com\/mc-mods\/([a-z][\da-z\-_]{1,127})\/?$/);
		if (matches != null && matches[1] != null) {
			location.href = "https://www.curseforge.com/minecraft/mc-mods/" + matches[1];
		}
	}
})();
