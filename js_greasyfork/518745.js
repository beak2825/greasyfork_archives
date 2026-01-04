// ==UserScript==
// @name         Disable DRC Audio on YouTube (SPA fix)
// @name:en      Disable DRC Audio on YouTube (SPA fix)
// @author       The0x539 (forked from Adri)
// @namespace    Violentmonkey Scripts
// @match        https://www.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @grant        none
// @version      0.2.1
// @description  Disables DRC Audio (Stable Volume) on YouTube (Working as of November 2024)
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/518745/Disable%20DRC%20Audio%20on%20YouTube%20%28SPA%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518745/Disable%20DRC%20Audio%20on%20YouTube%20%28SPA%20fix%29.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

function waitForElement(selector) {
	return new Promise((resolve, reject) => {
		let element = document.querySelector(selector);
		if (element) {
			resolve(element);
			return;
		}

		const observer = new MutationObserver(mutations => {
			const element = document.querySelector(selector);
			if (element) {
				observer.disconnect();
				resolve(element);
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}

async function disableDRC() {
	const menuButton = await waitForElement('.ytp-settings-button');

	menuButton.click();
	menuButton.click();

	const drcMenuItem = await waitForElement('.ytp-drc-menu-item:not([aria-disabled])');

	if (drcMenuItem.getAttribute('aria-checked') === 'true') {
		drcMenuItem.click();
		console.log('Disabled DRC Audio');
	} else {
		console.log('DRC Audio is already disabled');
	}
}

disableDRC().catch(error => console.error('Error:', error));

