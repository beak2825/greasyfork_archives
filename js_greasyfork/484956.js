// ==UserScript==
// @name         TestChromeUa
// @version      0.6
// @description  Block browser fingerprinting attempts.
// @author       Rotom
// @match        *://*/*
// @grant        GM.ChromeXt
// @run-at       document-start
// @noframes     false
// @license      The Unlicense
// @namespace TestChromeUa
// @downloadURL https://update.greasyfork.org/scripts/484956/TestChromeUa.user.js
// @updateURL https://update.greasyfork.org/scripts/484956/TestChromeUa.meta.js
// ==/UserScript==

customLanguage = "en-US";
customAppName = "Chrome";
customAppVersion = "120.120.120.12";
customUserAgent = "";
customDeviceMemory = 4;
customHardwareConcurrency = 4;

function switchToDesktop() {
	ChromeXt.dispatch("setUserAgent", window.location.href);
}

if (document.readyState == "loading") {
	window.addEventListener("DOMContentLoaded", switchToDesktop);
}
else {
	switchToDesktop();
}


let script = document.createElement("script");
script.textContent = "(" + (function () {
	"use strict";

	let debug = function (topOnly) {
		if (!topOnly || window === window.top) {
			// debugger;
		}
	};
	(function () {
		document.documentElement.dataset.fbscriptallow = true;
	})();
	let setValue = function (object, propertyName, value, writable) {
		if (!writable) {
			writable = false;
		}
		Object.defineProperty(object, propertyName, {
			value: value,
			writable: writable,
			enumerable: true
		});
	};

	(function () { // navigator
		// 返回随机选择的伪装方案
		let a;
		let fakeNavigator = {};
		fakeNavigator.appCodeName =
			fakeNavigator.appName = customAppName;
		fakeNavigator.appVersion = customAppVersion;
		fakeNavigator.platform =
			fakeNavigator.product =
			fakeNavigator.productSub =
			fakeNavigator.userAgent = customUserAgent;
		fakeNavigator.vendor =
			fakeNavigator.vendorSub =
			a = "";
		fakeNavigator.deviceMemory = customDeviceMemory;
		fakeNavigator.hardwareConcurrency = customHardwareConcurrency;
		fakeNavigator.maxTouchPoints =
			a = 0;
		fakeNavigator.bluetooth =
			fakeNavigator.clipboard =
			fakeNavigator.connection =
			//fakeNavigator.cookieEnabled						=
			fakeNavigator.credentials =
			fakeNavigator.doNotTrack = "false";
		fakeNavigator.geolocation =
			fakeNavigator.keyboard =
			fakeNavigator.language = customLanguage;
		fakeNavigator.languages =
			fakeNavigator.locks =
			fakeNavigator.mediaCapabilities =
			fakeNavigator.mediaDevices =
			fakeNavigator.mediaSession =
			//fakeNavigator.mimeTypes							=
			fakeNavigator.onLine =
			fakeNavigator.permissions =
			fakeNavigator.presentation =
			fakeNavigator.scheduling =
			fakeNavigator.serviceWorker =
			//fakeNavigator.storage							=
			fakeNavigator.usb =
			fakeNavigator.userActivation =
			fakeNavigator.userAgentData =
			fakeNavigator.wakeLock =
			fakeNavigator.webkitPersistentStorage =
			fakeNavigator.webkitTemporaryStorage =
			fakeNavigator.xr =
			a = {};
		//fakeNavigator.hardwareConcurrency				= 4;
		//fakeNavigator.deviceMemory						= "undefined";
		fakeNavigator.plugins = [];
		setValue(fakeNavigator.plugins, "item", function item() {
			return null;
		}, false);
		setValue(fakeNavigator.plugins, "namedItem", function namedItem() {
			return null;
		}, false);
		setValue(fakeNavigator.plugins, "refresh", function refresh() {
			return null;
		}, false);
		for (let i in window.navigator) {
			if (fakeNavigator[i] !== undefined) {
				try {
					Object.defineProperty(window.navigator, i, {
						get: function () {
							if (fakeNavigator[i] === "undefined") {
								return undefined;
							}
							return fakeNavigator[i];
						}
					});
				} catch (e) { }
			}
		}
	})();
	debug(1);
	try {
		console.log("stub");
	} catch (e) { }
}) + ")()";
document.documentElement.prepend(script);