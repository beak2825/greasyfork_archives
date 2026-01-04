// ==UserScript==
// @name        Internet Roadtrip Simple Interactive Street View
// @namespace   jdranczewski.github.io
// @match       https://neal.fun/*
// @match       https://www.google.com/maps/embed/v1/streetview*
// @version     0.2.1
// @author      jdranczewski
// @description Make the ebedded Street View in the Internet Roadtrip interactive.
// @license     MIT
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/536884/Internet%20Roadtrip%20Simple%20Interactive%20Street%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/536884/Internet%20Roadtrip%20Simple%20Interactive%20Street%20View.meta.js
// ==/UserScript==

// This works together with irf.d.ts to give us type hints
/**
 * Internet Roadtrip Framework
 * @typedef {typeof import('internet-roadtrip-framework')} IRF
 */

(async function() {
	const marco = "are you neal.fun?";
	const polo = "yes I am neal.fun!";

	if (IRF.isInternetRoadtrip) {
		// Get some references
		const switchFrameOrder = (await IRF.vdom.container).methods.switchFrameOrder;
		// Changing this in preparation for the breaking changes in IRF 0.5.0
		// const refs = (await IRF.vdom.container).$refs;
		const pano0 = document.getElementById("pano0");
		const pano1 = document.getElementById("pano1");

		// Execute code AFTER a vue method executes
		(await IRF.vdom.container).state.switchFrameOrder = new Proxy(switchFrameOrder, {
			apply: (target, thisArg, args) => {
				const returnValue = Reflect.apply(target, thisArg, args);
				// Change the pointer events on the pano that's at the front
				if (1 === thisArg.currFrame) {
					pano1.style.pointerEvents = "auto"
				} else {
					pano1.style.pointerEvents = "none";
				}
				return returnValue;
			},
		});

		// Always enable pointer events for the pano that's at the back
		pano0.style.pointerEvents = "auto"

		// Listen and respond to messages from embeds
		window.addEventListener("message", (event) => {
			if (event.origin !== "https://www.google.com" || event.data !== marco) return;
			event.source.postMessage(polo, event.origin);
		});
	} else {
		// We're in Street View! Set the pano options here
		// Waiting based on Netux's implementation in the Pathfinder
		const waitForOnApiLoad = new Promise((resolve) => {
			if (unsafeWindow.onApiLoad) {
				resolve(unsafeWindow.onApiLoad);
				return;
			}
			let _onApiLoad;
			Object.defineProperty(unsafeWindow, "onApiLoad", {
				get() {
					return _onApiLoad;
				},
				set(onApiLoad) {
					_onApiLoad = onApiLoad;
					resolve(onApiLoad);
				},
				configurable: true,
				enumerable: true,
			});
    	});

		Promise.all([waitForOnApiLoad]).then(([onApiLoad]) => {
			const originalOnApiLoad = onApiLoad;
			unsafeWindow.onApiLoad = function(args) {
				const originalConstructor = unsafeWindow.google.maps.StreetViewPanorama;
				unsafeWindow.google.maps.StreetViewPanorama = function(container, opts) {
					const instance = new originalConstructor(container, opts);

					// Send a message to the parent window to verify that it is neal.fun
					window.parent.postMessage(marco, "https://neal.fun");

					// Modify options if the parent responds
					window.addEventListener("message", (event) => {
						if (event.origin !== "https://neal.fun" || event.data !== polo) return;
						instance.setOptions({ linksControl: false });
						instance.setOptions({ clickToGo: false });
					});
					return instance;
				};
				return originalOnApiLoad(args);
			};
		});
	}

})();