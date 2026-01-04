// ==UserScript==
// @name        NitroPay anti-anti adblock
// @namespace   rj3stxkkh9r62bqucfy0
// @match       https://www.leekduck.com/*
// @match       https://tiermaker.com/*
// @grant       none
// @version     1.0
// @description Neuters NitroPay anti-adblock code
// @run-at      document-start
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/435334/NitroPay%20anti-anti%20adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/435334/NitroPay%20anti-anti%20adblock.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const hookCustomEvent = (null, function (wrap = (x)=>x, unwrap = (x)=>x, exporter = (f)=>f) {
		const constructObject = wrap(unwrap(window.Reflect).construct);

		const proxyHandler = new window.Object();
		proxyHandler.construct = exporter((customEvent, args, proto) => {
			const [type, options] = args;
			if (type === "np.detect" && options?.detail?.blocking) {
				options.detail.blocking = false;
			}

			return constructObject(customEvent, args, proto);
		});

		const context = unwrap(window);
		context.CustomEvent = new window.Proxy(context.CustomEvent, proxyHandler);
	});

	if (typeof XPCNativeWrapper === "function") {
		hookCustomEvent(XPCNativeWrapper, XPCNativeWrapper.unwrap, (f) => exportFunction(f, window));
	} else {
		const script = document.createElement("script");
		script.text = `"use strict";(${hookCustomEvent})();`;
		(document.head ?? document.documentElement).prepend(script);
		script.remove();
	}
})();
