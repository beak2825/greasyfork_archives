// ==UserScript==
// @name         Hide Mug Option
// @namespace    https://www.torn.com/profiles.php?XID=1936821
// @version      1.0
// @description  Hide mug option after attack.
// @author       TheFoxMan
// @owner        Phillip_J_Fry
// @license      Apache License 2.0
// @match        https://www.torn.com/loader.php?sid=attack*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/482245/Hide%20Mug%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/482245/Hide%20Mug%20Option.meta.js
// ==/UserScript==

// Made for Phillip_J_Fry [2184575].
// DO NOT EDIT.

if (!Document.prototype.find)
	Object.defineProperties(Document.prototype, {
		find: {
			value(selector) {
				return document.querySelector(selector);
			},
			enumerable: false
		},
		findAll: {
			value(selector) {
				return document.querySelectorAll(selector);
			},
			enumerable: false
		}
	});

if (!Element.prototype.find)
	Object.defineProperties(Element.prototype, {
		find: {
			value(selector) {
				return this.querySelector(selector);
			},
			enumerable: false
		},
		findAll: {
			value(selector) {
				return this.querySelectorAll(selector);
			},
			enumerable: false
		}
	});

async function waitFor(sel, parent = document) {
	return new Promise((resolve) => {
		const intervalID = setInterval(() => {
			const el = parent.find(sel);
			if (el) {
				resolve(el);
				clearInterval(intervalID);
			}
		}, 500);
	});
}

(async () => {
	await waitFor("head");

	document.head.insertAdjacentHTML(
		"beforeend",
		`<style>
			[class*="playerArea__"] [class*="playerWindow__"] button:nth-child(2) {
				display: none;
			}
		</style>`
	);
})();