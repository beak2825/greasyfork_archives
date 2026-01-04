// ==UserScript==
// @name        Demonoid remove clutter
// @namespace   jxq8p6u6r9wtn2f6617i
// @match       https://demonoid.is/*
// @match       https://www.demonoid.is/*
// @match       https://dnoid.pw/*
// @match       https://www.dnoid.pw/*
// @match       https://dnoid.to/*
// @match       https://www.dnoid.to/*
// @grant       none
// @version     1.2.1
// @description Removes ads and VPN shilling on Demonoid
// @run-at      document-start
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/438758/Demonoid%20remove%20clutter.user.js
// @updateURL https://update.greasyfork.org/scripts/438758/Demonoid%20remove%20clutter.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const { HTMLUnknownElement } = window;


	function hide(element, state = true) {
		if (!element) {
			return;
		}

		element.hidden = state;
		if (state) {
			element.style.setProperty("display", "none", "important");
		} else {
			element.style.removeProperty("display");
		}
	}


	function inject(unwrap = (x)=>x, exporter = unwrap) {
		const proxyHandler = new window.Object();
		proxyHandler.apply = exporter(function (write, that, args) {
			if (args[0]?.toLowerCase?.().indexOf?.("<script") === -1) {
				return write.apply(that, args);
			}
		});

		const doc = unwrap(Document.prototype);
		doc.write = new window.Proxy(doc.write, proxyHandler);
	}


	let unsafeDoc = document;

	if (typeof globalThis.XPCNativeWrapper === "function") {
		inject(XPCNativeWrapper.unwrap, (f) => exportFunction(f, window));
		// Why is the Firefox sandbox so weird
		unsafeDoc = XPCNativeWrapper.unwrap(unsafeDoc);
	} else {
		const script = document.createElement("script");
		script.text = `"use strict";(${inject})();`;
		(document.head ?? document.documentElement).prepend(script);
		script.remove();
	}


	hide(document.documentElement);


	const sheet = new CSSStyleSheet();
	sheet.replace("#share-buttons,#downloadbox a:first-of-type,#downloadbox br:first-of-type,#rss_feed_link br,#rss_feed_link2 br,center a[href$='.php'] img[alt='']{display:none!important;}");
	// Copy to unprivileged page scope array or this won't work in Firefox
	unsafeDoc.adoptedStyleSheets = window.Array.from([sheet].concat(document.adoptedStyleSheets));



	window.addEventListener("DOMContentLoaded", () => {
		// Hide big VPN message
		let adElement = document.evaluate(".//*[contains(text(), 'Get VPN')]", document.body, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
		while (adElement && !(adElement instanceof HTMLUnknownElement)) {
			adElement = adElement.parentNode;
		}

		if (adElement?.tagName) {
			for (const ad of document.getElementsByTagName(adElement.tagName)) {
				hide(ad);
			}
		}


		// Hide big black whitelist box
		adElement = document.evaluate(".//*[contains(text(), 'Ad-Blocker')]/ancestor-or-self::table", document.body, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
		hide(adElement);


		hide(document.body.querySelector("td > hr + span")?.closest("tr")); // Sponsored Links box on torrent pages

		const btcNags = document.body.querySelectorAll("a[href^='bitcoin:']");
		for (const nag of btcNags) {
			hide(nag.closest("span, p, div.block"));
		}
	});


	window.addEventListener("DOMContentLoaded", hide.bind(null, document.documentElement, false));
})();
