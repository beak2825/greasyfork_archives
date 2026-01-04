// ==UserScript==
// @name         Vape V4
// @namespace    http://7granddadpgn.github.io
// @version      2024-07-29
// @description  A browser script made to give enhancements on miniblox.io
// @author       7GrandDad
// @match        https://miniblox.io/*
// @icon         https://miniblox.io/favicon.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/525731/Vape%20V4.user.js
// @updateURL https://update.greasyfork.org/scripts/525731/Vape%20V4.meta.js
// ==/UserScript==

(function() {
	'use strict';

	async function execute(url, oldScript) {
		if (oldScript) oldScript.type = 'javascript/blocked';
		let data = await fetch("https://raw.githubusercontent.com/7GrandDadPGN/VapeForMiniblox/main/injection.js").then(e => e.text());
		if (oldScript) oldScript.type = 'module';
		eval(data.replace("scripturl", url));
	}

	// https://stackoverflow.com/questions/22141205/intercept-and-alter-a-sites-javascript-using-greasemonkey
	if(navigator.userAgent.indexOf("Firefox") != -1)
	{
		window.addEventListener("beforescriptexecute", function(e) {
			if(e.target.src.includes("https://miniblox.io/assets/index"))
			{
				e.preventDefault();
				e.stopPropagation();
				execute(e.target.src);
			}
		}, false);
	}
	else
	{
		new MutationObserver(async (mutations, observer) => {
			let oldScript = mutations
				.flatMap(e => [...e.addedNodes])
				.filter(e => e.tagName == 'SCRIPT')
				.find(e => e.src.includes("https://miniblox.io/assets/index"));

			if (oldScript) {
				observer.disconnect();
				execute(oldScript.src, oldScript);
			}
		}).observe(document, {
			childList: true,
			subtree: true,
		});
	}
})();