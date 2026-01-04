// ==UserScript==
// @name            TwitterRemoveAds
// @version         1.0.2
// @description     Remove ad "tweets" in feed and premium-only menu links
// @author          shellster
// @match           *://twitter.com/*
// @run-at          document-start
// @grant           unsafeWindow
// @namespace       https://greasyfork.org/en/users/316827
// @license         GNU General Public License v3.0 or later
// @compatible      chrome 90
// @downloadURL https://update.greasyfork.org/scripts/476849/TwitterRemoveAds.user.js
// @updateURL https://update.greasyfork.org/scripts/476849/TwitterRemoveAds.meta.js
// ==/UserScript==
"use strict";
(function () {
	const win = unsafeWindow;
	const doc = win.document;
	const MutationObserver = win.MutationObserver;

	function XPathResult(xpath) {
		let return_array = []
	    let nodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let node = nodes.iterateNext();
		while (node) {
		    return_array.push(node)
		    node = nodes.iterateNext();
		}

		return return_array
	}

	function removeAd() {
		Array.from(XPathResult("//*[text() = 'Ad']/ancestor::*[self::article]")).forEach((that) => {
			that.style.display="none";
		});

    Array.from(XPathResult("//*[contains(text(),'Promoted')]/ancestor::*[@data-testid='trend']")).forEach((that) => {
			that.style.display="none";
		});

    Array.from(XPathResult("//*[contains(text(),'Grok')]/ancestor::*[@aria-label='Grok']")).forEach((that) => {
			that.style.display="none";
		});

    Array.from(XPathResult("//*[contains(text(),'Premium')]/ancestor::*[@aria-label='Premium']")).forEach((that) => {
			that.style.display="none";
		});
	}
	document.addEventListener("DOMContentLoaded", () => {
		const observer = new MutationObserver(removeAd);
		observer.observe(doc.body, { attributes: true, childList: true, subtree: true });
		removeAd();
	});
})();

