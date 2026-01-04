// ==UserScript==
// @name        9DB Raid Finder: Disable focus detection
// @namespace   r8a4zsk8u1g04vj
// @match       https://9db.jp/pokego/data/62
// @match       https://9db.jp/pokemongo/data/9906
// @grant       none
// @version     1.0
// @description Disables focus detection on 9DB Raid Finder
// @run-at      document-start
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/435514/9DB%20Raid%20Finder%3A%20Disable%20focus%20detection.user.js
// @updateURL https://update.greasyfork.org/scripts/435514/9DB%20Raid%20Finder%3A%20Disable%20focus%20detection.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const blockEvents = (event) => {
		event.stopImmediatePropagation?.();
	};

	const options = { passive: true };
	window.addEventListener("blur",  blockEvents, options);
	window.addEventListener("focus", blockEvents, options);
})();
