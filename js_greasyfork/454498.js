// ==UserScript==
// @name         Twitter - Uncheck All
// @description  Twitter - Uncheck All.
// @version      0.1
// @author       to
// @namespace    https://github.com/to
// @license      MIT
// 
// @match        https://twitter.com/settings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// 
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/454498/Twitter%20-%20Uncheck%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/454498/Twitter%20-%20Uncheck%20All.meta.js
// ==/UserScript==

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

GM_registerMenuCommand('Uncheck All', () => {
	(async _ => {
		const inputs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
		for (const i of inputs) {
			if (i.checked) {
				i.click();
				await sleep(1000);
			}
		}
	})();
});
