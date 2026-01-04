// ==UserScript==
// @name        Google Analytics opt-out
// @namespace   zdnq5fclhrdh8lgo
// @match       *://*/*
// @grant       none
// @version     1.2
// @license     MIT
// @description Defines the Google Analytics opt-out object on every page.
// @run-at      document-start
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/434044/Google%20Analytics%20opt-out.user.js
// @updateURL https://update.greasyfork.org/scripts/434044/Google%20Analytics%20opt-out.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const defineOptout = (null, function (unwrapper = (x)=>x, exporter = (f)=>f) {
		const _gaUserPrefs = new window.Object();
		const ioo = exporter(function ioo() { return true; });


		// Define property directly if this is an Xray
		Reflect.defineProperty(unwrapper(_gaUserPrefs), "ioo", {
			enumerable: true,
			configurable: false,
			get: exporter(() => ioo),
			set: exporter(() => {})
		});

		Reflect.defineProperty(unwrapper(window), "_gaUserPrefs", {
			enumerable: false,
			configurable: false,
			get: exporter(() => _gaUserPrefs),
			set: exporter(() => {})
		});
	});


	if ("wrappedJSObject" in window) {
		// Bypass Firefox sandbox
		defineOptout(XPCNativeWrapper.unwrap, (f) => exportFunction(f, window));
	} else {
		// Inject script tag (Chrome)
		const script = document.createElement("script");
		script.text = `"use strict";(${defineOptout})();`;
		(document.head ?? document.documentElement).prepend(script);
		script.remove();
	}
})();
