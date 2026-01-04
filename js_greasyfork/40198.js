// ==UserScript==
// @name        reddit: /r/watchpeopledie censor bypass
// @namespace   xk265z9sx26le7jte9rtz5h8su6adofn
// @description Bypasses the Germany block on /r/watchpeopledie
// @license     MIT License
// @match       *://*.reddit.com/r/watchpeopledie/*
// @match       *://*.reddit.com//r/watchpeopledie/*
// @version     1.0
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/40198/reddit%3A%20rwatchpeopledie%20censor%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/40198/reddit%3A%20rwatchpeopledie%20censor%20bypass.meta.js
// ==/UserScript==

/* jshint bitwise: true, curly: true, eqeqeq: true, esversion: 6,
funcscope: false, futurehostile: true, latedef: true, noarg: true,
nocomma: true, nonbsp: true, nonew: true, notypeof: false,
shadow: outer, singleGroups: true, strict: true, undef: true,
unused: true, varstmt: true, browser: true */

(function () {
	"use strict";

	const prefixFrom = /^\/r\/watchpeopledie\//;
	const prefixTo   = "//r/watchpeopledie/";

	// Returns the rewritten URL, or the original URL
	// if nothing was changed.
	const rewriteURL = function (url) {
		let rewrite;

		try {
			rewrite = new URL(url);
			rewrite.pathname = rewrite.pathname.replace(prefixFrom, prefixTo);
		} catch (e) {
			return url;
		}

		return rewrite.href;
	};


	if (prefixFrom.test(location.pathname)) {
		document.documentElement.hidden = true;
		location.replace(rewriteURL(location.href));
	} else {
		// Generate random string
		let random = "";

		{
			const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
			const charCount = chars.length;

			for (let i = 0; i < 16; i++) {
				random += chars.charAt(Math.floor(Math.random() * charCount));
			}
		}

		const attribName = "data-wpdprocessed-" + random;
		const selector = "a:not([" + attribName + "]),form:not([" + attribName + "])";


		const rewriteElement = function (element) {
			let tagName = element.tagName.toUpperCase();
			let attribute;

			if (tagName === "A") {
				attribute = "href";
			} else if (tagName === "FORM") {
				attribute = "action";
			} else {
				return;
			}

			const oldURL = element[attribute];
			const newURL = rewriteURL(oldURL);

			if (newURL !== oldURL) {
				element[attribute] = newURL;
			}

			// Mark this element as done so our selector won't find it again
			if (!element.hasAttribute(attribName)) {
				element.setAttribute(attribName, "");
			}
		};


		const rewriteElementsInside = function (root) {
			for (const element of root.querySelectorAll(selector)) {
				rewriteElement(element);
			}
		};


		window.addEventListener("DOMContentLoaded", () => {
			rewriteElementsInside(document);

			new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (mutation.type === "attributes") {
						// We intentionally don't check for
						// the special attribute here.
						// This may be called on elements that
						// were already rewritten, but then
						// had their href/action changed.
						rewriteElement(mutation.target);
					} else if (mutation.addedNodes.length) {
						rewriteElementsInside(mutation.target);
					}
				}
			}).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href", "action"] });
		}, { capture: true });
	}
})();
