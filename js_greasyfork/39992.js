// ==UserScript==
// @name         reddit: sabotage event tracker
// @namespace    mz1js5x0yt0zxq1kf22z1wdn6zq2ij2g
// @version      1.3.1
// @description  Blocks the reddit event collector
// @license      MIT
// @match        https://*.reddit.com/*
// @grant        none
// @run-at       document-start
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/39992/reddit%3A%20sabotage%20event%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/39992/reddit%3A%20sabotage%20event%20tracker.meta.js
// ==/UserScript==

(function() {
	"use strict";

	const blockEventCollector = function (context = window, exporter = (f)=>f, wrapper = (x)=>x) {
		const markedXHRs = new WeakSet();

		const handlerSRH = new window.Object();
		const handlerSend = new window.Object();
		const handlerFetch = new window.Object();


		// Check for X-Signature header being set.
		// Remember this XHR and don't allow it to be sent
		handlerSRH.apply = exporter((setRequestHeader, that, args) => {
			if (args.length && !markedXHRs.has(that)) {
				const header = String(args[0]).toLowerCase();
				const config = wrapper(context.r?.config);

				if (header.startsWith("x-signature") || (config && (
					(config.signature_header && String(config.signature_header).toLowerCase() === header) ||
					(config.signature_header_v2 && String(config.signature_header_v2).toLowerCase() === header)
				))) {
					markedXHRs.add(that);
				}
			}

			return setRequestHeader.apply(that, args);
		});


		handlerSend.apply = exporter((send, that, args) => {
			if (markedXHRs.has(that)) {
				// Nope
				console.log("Canceling tracking request (XHR)");
				that.abort?.();
			} else {
				return send.apply(that, args);
			}
		});


		handlerFetch.apply = exporter((fetch, that, args) => {
			// Check Request object
			if (args[0] instanceof window.Request) {
				const headers = args[0].headers.keys();

				// Iterate with a classic for loop because
				// a for-of loop throws a DOMException.
				// Seems to be a Firefox bug
				for (let header = headers.next(); !header.done; header = headers.next()) {
					if (header.value.toLowerCase?.().startsWith("x-signature")) {
						console.log("Canceling tracking request (fetch-RQ)");
						return new window.Promise(() => {});
					}
				}
			}

			// Check additional request params
			if (typeof args[1]?.headers === "object") {
				const headers = Object.keys(args[1].headers);

				for (const header of headers) {
					if (header.toLowerCase?.().startsWith("x-signature")) {
						console.log("Canceling tracking request (fetch)");
						return new window.Promise(() => {});
					}
				}

			}

			return fetch.apply(that, args);
		});


		context.XMLHttpRequest.prototype.setRequestHeader = new window.Proxy(context.XMLHttpRequest.prototype.setRequestHeader, handlerSRH);
		context.XMLHttpRequest.prototype.send             = new window.Proxy(context.XMLHttpRequest.prototype.send,             handlerSend);
		context.fetch                                     = new window.Proxy(context.fetch,                                     handlerFetch);
	};



	// Firefox sandbox, execute directly
	if ("wrappedJSObject" in window) {
		const context = window.wrappedJSObject;
		blockEventCollector(context, (f) => exportFunction(f, window), XPCNativeWrapper);
	} else {
		// Chrome sandbox, inject as script tag
		const script = document.createElement("script");
		script.text = `"use strict";(${blockEventCollector})();"`;

		(document.head || document.documentElement).prepend(script);
		script.remove();
	}
})();
