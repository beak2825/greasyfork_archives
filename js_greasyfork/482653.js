// ==UserScript==
// @name         HideFingerprintForChromeXT
// @version      4.8
// @description  Block browser fingerprinting attempts.
// @author       Rotom
// @match        *://*/*
// @grant        GM.ChromeXt
// @run-at       document-start
// @noframes     false
// @license      The Unlicense
// @namespace https://github.com/Sam0230
// @downloadURL https://update.greasyfork.org/scripts/482653/HideFingerprintForChromeXT.user.js
// @updateURL https://update.greasyfork.org/scripts/482653/HideFingerprintForChromeXT.meta.js
// ==/UserScript==

//it works
// const ua =
// "Mozilla/5.0 (Linux; Android 6; APPLE) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/9999.0.0.0 Mobile Safari/537.36";

// function switchToDesktop() {
// 	if (
// 	navigator.userAgent == ua 
// 	// &&document.documentElement.className != "mobile-web-player"
// 	) {
		
// 	} else {
// 		// ChromeXt.dispatch("setFirstLoaded");
// 		ChromeXt.dispatch("syncData", {
// 			origin: window.location.origin,
// 			data: ua,
// 			name: "userAgent",
// 		});
// 	ChromeXt.dispatch("userAgentSpoof", window.location.href);
	
// 	}
// }

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
script.textContent = "(" + (function() {
	"use strict";
	
	let debug = function(topOnly) {
		if (!topOnly || window === window.top) {
			// debugger;
		}
	};
	(function() {
		document.documentElement.dataset.fbscriptallow = true;
	})();
	let randomChange = function(n, m) {
		if (!m) {
			m = 0.1;
		}
		return Math.round(n + ((Math.random() - 0.5) * 2 * n * 0.3));
	};
	let setValue = function(object, propertyName, value, writable) {
		if (!writable) {
			writable = false;
		}
		Object.defineProperty(object, propertyName, {
			value: value,
			writable: writable,
			enumerable: true
		});
	};
	
	(function() { // navigator
		const userAgentDataList = [
			{
			  brands: [{ brand: "Android Browser", version: "4.0" }],
			  mobile: true,
			  platform: "Linux armv7l",
			  platformVersion: "7.1.1",
			  architecture: "ARM",
			  bitness: "32",
			  formFactor: "mobile",
			  fullVersionList: ["4.0", "4.1", "4.2"],
			  model: "Nexus 5",
			  platformVersion: "7.1.1",
			  wow64: false
			},
			  {
				brands: [{ brand: "Chrome", version: "90.0.4430.212" }],
				mobile: false,
				platform: "Windows NT 10.0; Win64; x64",
				platformVersion: "10.0",
				architecture: "x86_64",
				bitness: "64",
				formFactor: "desktop",
				fullVersionList: ["90.0.4430.212", "90.0.4430.213"],
				model: "",
				platformVersion: "10.0",
				wow64: true
			  },
			  {
				brands: [{ brand: "Firefox", version: "91.0" }],
				mobile: false,
				platform: "Windows NT 10.0; Win64; x64",
				platformVersion: "10.0",
				architecture: "x86_64",
				bitness: "64",
				formFactor: "desktop",
				fullVersionList: ["91.0", "91.0.1"],
				model: "",
				platformVersion: "10.0",
				wow64: true
			  },
			  {
				brands: [{ brand: "Safari", version: "15.0" }],
				mobile: true,
				platform: "iPhone; CPU iPhone OS 15_0 like Mac OS X",
				platformVersion: "15.0",
				architecture: "ARM",
				bitness: "64",
				formFactor: "mobile",
				fullVersionList: ["15.0", "15.0.1"],
				model: "iPhone",
				platformVersion: "15.0",
				wow64: false
			  }
		  ];
		const userActivationList = [true, false];
		const languageList = ["en-US", "zh-CN", "ja-JP", "de-DE"];
		const languagesList = [["en-US", "zh-CN"], ["ja-JP"], ["de-DE"]];
		const appCodeNameList = ["Mozilla", "Netscape", "Googlebot"];
		const appNameList = ["Netscape", "Microsoft Internet Explorer", "Chrome"];
		const appVersionList = ["5.0", "11.0", "90.0"];
		const productList = ["Gecko", "Presto", "WebKit"];
		const productSubList = ["20030107", "20030203", "20210902"];
		const vendorList = ["Google Inc.", "Microsoft Corporation", "Apple Computer, Inc.","Mozilla"];
		const vendorSubList = ["", "1.0.0", "20210901"];

		// 随机选择一个伪装方案
		function getRandomItemFromArray(array) {
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
		}
		function generateRandomUserAgent() {
			var userAgent = "Mozilla/5.0 (Linux; Android ";
			
			// 生成随机的 Android 版本号
			var androidVersion = Math.floor(Math.random() * 8) + 6; // 生成 6 到 13 之间的随机整数
			userAgent += androidVersion + "; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/";
		  
			// 生成随机的 Chrome 版本号
			var chromeVersion = Math.floor(Math.random() * 21) + 100; // 生成 100 到 120 之间的随机整数
			userAgent += chromeVersion + ".0.0.0 Mobile Safari/537.36";
		  
			return userAgent;
		  }

		// 返回随机选择的伪装方案
		let a;
		let fakeNavigator = {};
			fakeNavigator.appCodeName						=getRandomItemFromArray(appCodeNameList);
			fakeNavigator.appName							=getRandomItemFromArray(appNameList);
		    fakeNavigator.appVersion =getRandomItemFromArray(appVersionList);
			fakeNavigator.platform =
			fakeNavigator.product =getRandomItemFromArray(productList);
			fakeNavigator.productSub =getRandomItemFromArray(productSubList);
			fakeNavigator.userAgent =generateRandomUserAgent();
			fakeNavigator.vendor =getRandomItemFromArray(vendorList);
			fakeNavigator.vendorSub =getRandomItemFromArray(vendorSubList);
			a = "";
		fakeNavigator.deviceMemory = Math.floor((Math.random() * 8) + 1);
		fakeNavigator.hardwareConcurrency = Math.floor((Math.random() * 8) + 1);
		fakeNavigator.maxTouchPoints =
			a = 0;
		fakeNavigator.bluetooth =
			fakeNavigator.clipboard =
			fakeNavigator.connection =
			//	fakeNavigator.cookieEnabled						=
			fakeNavigator.credentials =
			fakeNavigator.doNotTrack = "false";
		fakeNavigator.geolocation =
			fakeNavigator.keyboard =
			fakeNavigator.language = getRandomItemFromArray(languageList);
		fakeNavigator.languages = getRandomItemFromArray(languagesList);
		fakeNavigator.locks =
			fakeNavigator.mediaCapabilities =
			fakeNavigator.mediaDevices =
			fakeNavigator.mediaSession =
			//	fakeNavigator.mimeTypes							=
			fakeNavigator.onLine =
			fakeNavigator.permissions =
			fakeNavigator.presentation =
			fakeNavigator.scheduling =
			fakeNavigator.serviceWorker =
			//	fakeNavigator.storage							=
			fakeNavigator.usb =
			fakeNavigator.userActivation =getRandomItemFromArray(userActivationList);
			fakeNavigator.userAgentData =getRandomItemFromArray(userAgentDataList);
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
						get: function() {
							if (fakeNavigator[i] === "undefined") {
								return undefined;
							}
							return fakeNavigator[i];
						}
					});
				} catch (e) {}
			}
		}
	})();
	
	let debuggerHook = function(n, m) {
		try {
			let orig = window[n].prototype[m];
			let hook = function() {
				debug();
				try {
					return orig.apply(this, arguments);
				} catch (e) {}
			};
			Object.defineProperty(hook, "name", {
				value: orig.name,
				writable: false,
				enumerable: false,
				configurable: true
			});
			window[n].prototype[m] = hook;
			window[n].prototype[m].toString = orig.toString.bind(orig);
		} catch (e) {}
	};
	let debuggerHookAll = function(n) {
		try {
			for (let i in window[n].prototype) {
				try {
					if (window[n].prototype[i] instanceof Function) {
						debuggerHook(n, i);
					}
				} catch (e) {}
			}
		} catch (e) {}
	};
	debug(1);
	try {
		console.log("stub");
	} catch (e) {}
}) + ")()";
document.documentElement.prepend(script);