// ==UserScript==
// @name        FileList gift auto-refresh
// @namespace   1upbd2ad6jlwjv0iqymz
// @match       https://filelist.io/gift.php
// @grant       none
// @version     1.0
// @description Auto-refresh FileList gift
// @run-at      document-end
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/437577/FileList%20gift%20auto-refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/437577/FileList%20gift%20auto-refresh.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// Wait 24h by default (no event or gift claimed)
	let delaySeconds = 86400;

	// Look for the delay timer.
	// Example: "You already claimed a gift in the last 24 hours! Please check back again in 23h 18m 17s."
	const text = document.evaluate("//text()[contains(., 'Please check back again in ')]", document.body, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue?.data;

	if (text) {
		const parts = text.match(/(\d{1,2})h (\d{1,2})m (\d{1,2})s/);
		if (parts?.length === 4) {
			const int = (s) => parseInt(s, 10);
			delaySeconds = int(parts[1]) * 3600 + int(parts[2]) * 60 + int(parts[3]);

			console.log("Found gift timer! Reloading in", parts[0]);
		}
	}

	// Wait an extra second for safety
	setTimeout(location.reload.bind(location), 1000 * (delaySeconds + 1));
})();
