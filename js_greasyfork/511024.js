// ==UserScript==
// @name        Simple WaitForKeyElement
// @license     Unlicense
// @namespace   1N07
// @match       *://*/*
// @version     1.0.1
// @author      1N07
// @description Library that Exports my simplified vanilla JS version of WaitForKeyElement, which is a simple async function that returns a Promise that resolves to an element by a given selector, when that element is found
// ==/UserScript==

async function WaitForKeyElement(selector, timeout) {
	return new Promise((resolve, reject) => {
		let el = document.querySelector(selector);
		if (el) {
			resolve(el);
			return;
		}
		new MutationObserver((mutationRecords, observer) => {
			el = document.querySelector(selector);
			if (el) {
				resolve(el);
				observer.disconnect();
			}
		}).observe(document.documentElement, { childList: true, subtree: true });
		if (timeout) {
			setTimeout(() => {
				reject(`WaitForKeyElement: "${selector}" timed out`);
			}, timeout);
		}
	});
}
