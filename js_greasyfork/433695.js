// ==UserScript==
// @name        ProBoards hide adblock message
// @namespace   proboards
// @description Hides anti-adblock message
// @match       https://*.proboards.com/*
// @version     1.2
// @grant       none
// @run-at      document-start
// @inject-into content
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/433695/ProBoards%20hide%20adblock%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/433695/ProBoards%20hide%20adblock%20message.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const defineVar = (null, function (context = window, exporter = (f) => f) {
		Reflect.defineProperty(context, "runAntiAdBlock", {
			configurable: false,
			enumerable: true,
			get: exporter(() => 0),
			set: exporter(() => {})
		});
	});

	if ("wrappedJSObject" in window) {
		// Bypass Firefox sandbox and define directly
		const context = window.wrappedJSObject;
		defineVar(context, (f) => exportFunction(f, context));
	} else {
		// Inject into page (only works in Chrome if CSP blocks us)
		const script = document.createElement("script");
		script.text = `"use strict";(${defineVar})();`;
		(document.head ?? document.documentElement).prepend(script);
		script.remove();
	}
})();
