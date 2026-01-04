// ==UserScript==
// @name        4chan bypass derefer link interstitial
// @namespace   b3vwq7gg90yplbelsnvz
// @match       https://boards.4chan.org/*
// @match       https://boards.4channel.org/*
// @match       https://sys.4chan.org/derefer?*
// @match       https://sys.4channel.org/derefer?*
// @grant       none
// @version     1.0.1
// @description Bypasses the derefer link interstitial for external links on 4chan
// @run-at      document-start
// @insert-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/451259/4chan%20bypass%20derefer%20link%20interstitial.user.js
// @updateURL https://update.greasyfork.org/scripts/451259/4chan%20bypass%20derefer%20link%20interstitial.meta.js
// ==/UserScript==

(function () {
	"use strict";

	if (location.hostname.startsWith("sys.4chan")) {
		// Derefer page (somehow), redirect immediately
		const real = new URL(new URLSearchParams(location.search).get("url"));

		if (real && (real.protocol === "https:" || real.protocol === "http:")) {
			const link = document.createElement("a");
			link.rel = "noopener";
			link.referrerPolicy = "no-referrer";
			// Hack fix: 4chan fucks up by double-encoding ampersands
			link.href = String(real).replaceAll("&amp;", "&");
			link.click();
		}
	} else {
		// Board page, fix linkified links
		const dereferLink = "//" + location.host.replace("boards.4chan", "sys.4chan") + "/derefer?url=";
		const derefSelector = `a.linkified[href^="${dereferLink}"]`;

		document.addEventListener("4chanParsingDone", (ev) => {
			const tid = ev.detail?.threadId;
			let context;

			if (tid) {
				context = document.getElementById(`t${tid}`);
			}

			// If we don't find the thread for some reason,
			// just scan the entire page instead idk
			if (!context) {
				context = document.body;
			}


			for (const link of context.querySelectorAll(derefSelector)) {
				let real;

				try {
					// Throws if invalid URL.
					// Use textContent instead of the url parameter
					// because that might have double encoded ampersands
					real = new URL(link.textContent);
				} catch {
					continue;
				}

				if (real.protocol === "https:" || real.protocol === "http:") {
					link.relList.add("noopener");
					link.referrerPolicy = "no-referrer";
					link.href = real;
				}
			}
		});
	}
})();
