// ==UserScript==
// @name        Block reddit click tracking
// @namespace   mjhcfwlmjfzg778evppa995xavvt2nmb
// @description Stops reddit from tracking your inbound and outbound clicks
// @license     MIT
// @match       *://*.reddit.com/*
// @version     1.2
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/39433/Block%20reddit%20click%20tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/39433/Block%20reddit%20click%20tracking.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const expiredDate = Date.now().toString();
	const targetLink = Symbol();


	// Capturing event listener on the outermost element.
	// Runs FIRST, before any others.
	const beforeClick = function (event) {
		let target = event.target;

		// Did we click on an element?
		if (target.nodeType === 1) {
			//  Is that element inside a link?
			target = target.closest("a");

			if (target) {
				// Stash link in the event object so that
				// the second handler doesn't have to dig
				// through the DOM with .closest() again
				event[targetLink] = target;

				if (target.dataset.hrefUrl) {
					// Remove link tracking attributes
					delete target.dataset.inboundUrl;
					delete target.dataset.outboundUrl;

					// Mark outbound link as expired so reddit code
					// does not try to use it
					if (target.dataset.outboundExpiration) {
						target.dataset.outboundExpiration = expiredDate;
					}
				}
			}
		}
	};


	// Bubbling event listener on the outermost element.
	// Runs LAST, just before the click goes through
	// (unless reddit code adds any others afterwards)
	const justBeforeClick = function (event) {
		const target = event[targetLink];

		// If reddit event handlers modified the link, change it back
		if (target && target.dataset.hrefUrl) {
			target.href = target.dataset.hrefUrl;
		}
	};


	// Mark both event listeners as passive so they
	// won't impact scroll performance
	const doCapture = { capture: true,  passive: true };
	const doBubble  = { capture: false, passive: true };

	window.addEventListener("mousedown",  beforeClick, doCapture);
	window.addEventListener("keydown",    beforeClick, doCapture);
	window.addEventListener("touchstart", beforeClick, doCapture);

	window.addEventListener("mousedown",  justBeforeClick, doBubble);
	window.addEventListener("keydown",    justBeforeClick, doBubble);
	window.addEventListener("touchstart", justBeforeClick, doBubble);


	// Patch navigator.sendBeacon() if it is available
	if (typeof unsafeWindow.Navigator.prototype.sendBeacon === "function") {
		// Firefox/Greasemonkey defines exportFunction to make
		// sandboxed functions callable by the page script.
		const exportFunction = (window.exportFunction) ? window.exportFunction : (f) => f;

		// Fake sendBeacon() function that does nothing
		Reflect.defineProperty(unsafeWindow.Navigator.prototype, "sendBeacon", {
			value: exportFunction(function sendBeacon(url) { return true; }, unsafeWindow)
		});
	}
})();
