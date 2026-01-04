// ==UserScript==
// @name        9DB Raid Finder: Fix focus detection
// @namespace   m43v6blcjzeaiq6oh9
// @match       https://9db.jp/pokego/data/62
// @match       https://9db.jp/pokemongo/data/9906
// @grant       none
// @version     1.0
// @description Fixes the focus detection on the 9DB Pokémon GO Raid Finder
// @run-at      document-start
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/435380/9DB%20Raid%20Finder%3A%20Fix%20focus%20detection.user.js
// @updateURL https://update.greasyfork.org/scripts/435380/9DB%20Raid%20Finder%3A%20Fix%20focus%20detection.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const { CustomEvent } = window, { WeakSet } = globalThis;

	// Block blur/focus events on window,
	// except the fake ones we create
	const whitelistedEvents = new WeakSet();
	const filterEvents = (event) => {
		// .delete() returns true if the element was actually removed
		if (!whitelistedEvents.delete(event)) {
			event.stopImmediatePropagation?.();
		}
	};

	window.addEventListener("blur",  filterEvents, { passive: true });
	window.addEventListener("focus", filterEvents, { passive: true });

	// Convert visibility events to blur/focus events
	window.addEventListener("visibilitychange", function () {
		const fakeEvent = new CustomEvent((document.visibilityState === "hidden") ? "blur" : "focus");

		whitelistedEvents.add(fakeEvent);
		this.dispatchEvent(fakeEvent);
	});
})();
