// ==UserScript==
// @name         No Fingerprint
// @version      0.2
// @description  Block browser fingerprinting attempts.
// @author       Sam0230
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @noframes     false
// @license      The Unlicense
// @namespace    https://github.com/Sam0230
// @downloadURL https://update.greasyfork.org/scripts/481354/No%20Fingerprint.user.js
// @updateURL https://update.greasyfork.org/scripts/481354/No%20Fingerprint.meta.js
// ==/UserScript==



let script = document.createElement("script");
script.textContent = "(" + (function() {
	"use strict";
	let debug = function (topOnly) {
		if (!topOnly || window === window.top) {
			// debugger;
		}
	};
	(function () {
		document.documentElement.dataset.fbscriptallow = true;
	})();
	let randomChange = function (n, m) {
		if (!m) {
			m = 0.1;
		}
		return Math.round(n + ((Math.random() - 0.5) * 2 * n * 0.3));
	};
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
	(function () { // Date
		window.Date.prototype.getDate					=	window.Date.prototype.getUTCDate					;
		window.Date.prototype.getDay					=	window.Date.prototype.getUTCDay						;
		window.Date.prototype.getFullYear				=	window.Date.prototype.getUTCFullYear				;
		window.Date.prototype.getHours					=	window.Date.prototype.getUTCHours					;
		window.Date.prototype.getMilliseconds			=	window.Date.prototype.getUTCMilliseconds			;
		window.Date.prototype.getMinutes				=	window.Date.prototype.getUTCMinutes					;
		window.Date.prototype.getMonth					=	window.Date.prototype.getUTCMonth					;
		window.Date.prototype.getSeconds				=	window.Date.prototype.getUTCSeconds					;
		window.Date.prototype.getTimezoneOffset			=	function () { return 0; }							;
		window.Date.prototype.getYear					=	function () { return this.getFullYear - 1900; }		;
		window.Date.prototype.setDate					=	window.Date.prototype.setUTCDate					;
		window.Date.prototype.setFullYear				=	window.Date.prototype.setUTCFullYear				;
		window.Date.prototype.setHours					=	window.Date.prototype.setUTCHours					;
		window.Date.prototype.setMilliseconds			=	window.Date.prototype.setUTCMilliseconds			;
		window.Date.prototype.setMinutes				=	window.Date.prototype.setUTCMinutes					;
		window.Date.prototype.setMonth					=	window.Date.prototype.setUTCMonth					;
		window.Date.prototype.setSeconds				=	window.Date.prototype.setUTCSeconds					;
		window.Date.prototype.setYear					=	function (n) { return this.setFullYear(n + 1900); }	;
		window.Date.prototype.toLocaleDateString		=	function () { return ""; }							;
		window.Date.prototype.toLocaleString			=	function () { return ""; }							;
		window.Date.prototype.toLocaleTimeString		=	function () { return ""; }							;
		window.Date.prototype.toString					=	function () { return ""; }							;
		window.Date.prototype.toTimeString				=	function () { return ""; }							;
	})();
	(function () { // navigator
		let a;
		let fakeNavigator = {};
	//	fakeNavigator.appCodeName						=
	//	fakeNavigator.appName							=
	//	fakeNavigator.appVersion						=
	//	fakeNavigator.platform							=
		fakeNavigator.product							="gulugulu";
		fakeNavigator.productSub						="gulugulu";
		fakeNavigator.userAgent							='Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/535.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36';
		fakeNavigator.vendor							="gulugulu";
		fakeNavigator.vendorSub							="gulugulu";
		a = "";
		fakeNavigator.deviceMemory						=Math.floor((Math.random() * 8) + 1);
		fakeNavigator.hardwareConcurrency				=Math.floor((Math.random() * 8) + 1);
		fakeNavigator.maxTouchPoints					=
		a = 0;
		fakeNavigator.bluetooth							=
		fakeNavigator.clipboard							=
		fakeNavigator.connection						=
	//	fakeNavigator.cookieEnabled						=
		fakeNavigator.credentials						=
		fakeNavigator.doNotTrack						="false";
		fakeNavigator.geolocation						=
		fakeNavigator.keyboard							=
		fakeNavigator.language							="en-US";
		fakeNavigator.languages							="en-US";
		fakeNavigator.locks								=
		fakeNavigator.mediaCapabilities					=
		fakeNavigator.mediaDevices						=
		fakeNavigator.mediaSession						=
	//	fakeNavigator.mimeTypes							=
		fakeNavigator.onLine							=
		fakeNavigator.permissions						=
		fakeNavigator.presentation						=
		fakeNavigator.scheduling						=
		fakeNavigator.serviceWorker						=
	//	fakeNavigator.storage							=
		fakeNavigator.usb								=
		fakeNavigator.userActivation					=
		fakeNavigator.userAgentData						=
		fakeNavigator.wakeLock							=
		fakeNavigator.webkitPersistentStorage			=
		fakeNavigator.webkitTemporaryStorage			=
		fakeNavigator.xr								=
		a = {};
		//fakeNavigator.hardwareConcurrency				= 4;
		//fakeNavigator.deviceMemory						= "undefined";
		fakeNavigator.platform 							= "Win32";
		fakeNavigator.plugins							= [];
		setValue(fakeNavigator.plugins, "item",			function item() { return null; },		false);
		setValue(fakeNavigator.plugins, "namedItem",	function namedItem() { return null; },	false);
		setValue(fakeNavigator.plugins, "refresh",		function refresh() { return null; },	false);
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
				} catch (e) {}
			}
		}
	})();
	(function () { // Screen size
		let screenSize = [1920, 1080];
		screen.availWidth && setValue(screen, "availWidth", screenSize[0]);
		screen.availHeight && setValue(screen, "availHeight", screenSize[1] - 40);
		screen.availLeft && setValue(screen, "availLeft", undefined, true);
		screen.availTop && setValue(screen, "availTop", undefined, true);
		screen.width && setValue(screen, "width", screenSize[0]);
		screen.height && setValue(screen, "height", screenSize[1]);
		screen.Brightness && setValue(screen, "Brightness", randomChange(screen.Brightness));
		screen.mozBrightness && setValue(screen, "mozBrightness", randomChange(screen.mozBrightness));
		screen.left && setValue(screen, "left", undefined, true);
		screen.top && setValue(screen, "top", undefined, true);
		screen.enabled && setValue(screen, "enabled", undefined);
		screen.mozEnabled && setValue(screen, "mozEnabled", undefined);
		screen.pixelDepth && setValue(screen, "pixelDepth", 32);
		screen.colorDepth && setValue(screen, "colorDepth", 32);
	})();
	(function () { // Debugger panel size
		let n = Math.round(71.5 + (Math.random() * 15)), wChanged = false, wValue, hChanged = false, hValue;
		Object.defineProperty(window, "outerWidth", {
			get: function () {
				if (!wChanged) {
					return window.innerWidth;
				}
				return wValue;
			},
			set: function (value) {
				wChanged = true;
				wValue = value;
			}
		});
		Object.defineProperty(window, "outerHeight", {
			get: function () {
				if (!hChanged) {
					return window.innerHeight + n;
				}
				return hValue;
			},
			set: function (value) {
				hChanged = true;
				hValue = value;
			}
		});
	})();
	(function () { // AudioContext
		let origGetFloatFrequencyData = window.AnalyserNode.prototype.getFloatFrequencyData;
		window.AnalyserNode.prototype.getFloatFrequencyData = function getFloatFrequencyData(array) {
			let ret = origGetFloatFrequencyData.apply(this, arguments);
			for (let i = 0; i < array.length; i++) {
				array[i] = array[i] + Math.random() * 0.2;
			}
			return ret;
		};
		window.AnalyserNode.prototype.getFloatFrequencyData.toString = origGetFloatFrequencyData.toString.bind(origGetFloatFrequencyData);
		let origGetChannelData = window.AudioBuffer.prototype.getChannelData;
		window.AudioBuffer.prototype.getChannelData = function getChannelData() {
			let ret = origGetChannelData.apply(this, arguments);
			for (let i = 0; i < ret.length; i++) {
				ret[i] = ret[i] + Math.random() * 0.0001;
			}
			return ret;
		};
		window.AudioBuffer.prototype.getChannelData.toString = origGetChannelData.toString.bind(origGetChannelData);
	})();
	(function () { // Canvas
		let origGetContext		= HTMLCanvasElement.prototype.getContext;
		let origGetImageData	= CanvasRenderingContext2D.prototype.getImageData;
		let origReadPixels1		= WebGLRenderingContext.prototype.readPixels;
		let origReadPixels2		= WebGL2RenderingContext.prototype.readPixels;
		let origToDataURL		= HTMLCanvasElement.prototype.toDataURL;
		let origToBlob			= HTMLCanvasElement.prototype.toBlob;
		let getImageData = function getImageData() {
			let imageData = origGetImageData.apply(this, arguments);
			for (let i = 0; i < imageData.data.length; i++) {
				imageData.data[i] += Math.round((Math.random() - 0.5) * 4.9);
			}
			return imageData;
		};
		CanvasRenderingContext2D.prototype.getImageData = getImageData;
		CanvasRenderingContext2D.prototype.getImageData.toString = origGetImageData.toString.bind(origGetImageData);
		let origIsPointInPath = CanvasRenderingContext2D.prototype.isPointInPath;
		CanvasRenderingContext2D.prototype.isPointInPath = function isPointInPath() {
			return false;
		};
		CanvasRenderingContext2D.prototype.isPointInPath.toString = origIsPointInPath.toString.bind(origIsPointInPath);
		let readPixels1 = function readPixels() {
			origReadPixels1.apply(this, arguments);
			let pixels = arguments[6];
			for (let i = 0; i < pixels.length; i++) {
				pixels[i] += Math.round((Math.random() - 0.5) * 4.9);
			}
		};
		WebGLRenderingContext.prototype.readPixels = readPixels1;
		WebGLRenderingContext.prototype.readPixels.toString = origReadPixels1.toString.bind(origReadPixels1);
		let readPixels2 = function readPixels() {
			origReadPixels2.apply(this, arguments);
			let pixels = arguments[6];
			for (let i = 0; i < pixels.length; i++) {
				pixels[i] += Math.round((Math.random() - 0.5) * 4.9);
			}
		};
		WebGL2RenderingContext.prototype.readPixels = readPixels2;
		WebGL2RenderingContext.prototype.readPixels.toString = origReadPixels2.toString.bind(origReadPixels2);
		let toDataURL = function toDataURL() {
			let context = origGetContext.apply(this, ["2d"]);
			let imageData = origGetImageData.apply(context, [0, 0, this.height, this.width]), origImageData = origGetImageData.apply(context, [0, 0, this.height, this.width]), ret;
			for (let i = 0; i < imageData.data.length; i++) {
				imageData.data[i] += Math.round((Math.random() - 0.5) * 4.9);
			}
			context.putImageData(imageData, 0, 0);
			ret = origToDataURL.apply(this, arguments);
			context.putImageData(origImageData, 0, 0);
			return ret;
		};
		let hookWebGLGetParameter = function (target) {
			let random = {
				"item": function (e) {
					let rand = e.length * Math.random();
					return e[Math.floor(rand)];
				},
				"number": function (power) {
					let tmp = [];
					for (let i = 0; i < power.length; i++) {
						tmp.push(Math.pow(2, power[i]));
					}
					return random.item(tmp);
				},
				"int": function (power) {
					let tmp = [];
					for (let i = 0; i < power.length; i++) {
						let n = Math.pow(2, power[i]);
						tmp.push(new Int32Array([n, n]));
					}
					return random.item(tmp);
				},
				"float": function (power) {
					let tmp = [];
					for (let i = 0; i < power.length; i++) {
						let n = Math.pow(2, power[i]);
						tmp.push(new Float32Array([1, n]));
					}
					return random.item(tmp);
				}
			};
			let origGetParameter = target.getParameter;
			target.getParameter = function (a1) {
				if (a1 === this.STENCIL_BITS							) { return 0;																						}
				if (a1 === this.DEPTH_BITS								) { return 24;																						}
				if (a1 === this.MAX_VARYING_VECTORS						) { return 30;																						}
				if (a1 === this.VENDOR									) { return "WebKit";																				}
				if (a1 === 37445										) { return "Google Inc.";																			}
				if (a1 === this.RENDERER								) { return "WebKit WebGL";																			}
				if (a1 === this.MAX_TEXTURE_SIZE						) { return random.number([14, 15]);																	}
				if (a1 === this.MAX_VERTEX_UNIFORM_VECTORS				) { return random.number([12, 13]);																	}
				if (a1 === this.MAX_CUBE_MAP_TEXTURE_SIZE				) { return random.number([14, 15]);																	}
				if (a1 === this.MAX_RENDERBUFFER_SIZE					) { return random.number([14, 15]);																	}
				if (a1 === this.MAX_VIEWPORT_DIMS						) { return random.int([13, 14, 15]);																}
				if (a1 === this.ALPHA_BITS								) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.BLUE_BITS								) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.GREEN_BITS								) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.RED_BITS								) { return random.number([1, 2, 3, 4]);																}
				if (a1 === 34047										) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.MAX_TEXTURE_IMAGE_UNITS					) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.MAX_VERTEX_ATTRIBS						) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.MAX_VERTEX_TEXTURE_IMAGE_UNITS			) { return random.number([1, 2, 3, 4]);																}
				if (a1 === this.MAX_COMBINED_TEXTURE_IMAGE_UNITS		) { return random.number([4, 5, 6, 7, 8]);															}
				if (a1 === this.MAX_FRAGMENT_UNIFORM_VECTORS			) { return random.number([10, 11, 12, 13]);															}
				if (a1 === this.ALIASED_LINE_WIDTH_RANGE				) { return random.float([0, 10, 11, 12, 13]);														}
				if (a1 === this.ALIASED_POINT_SIZE_RANGE				) { return random.float([0, 10, 11, 12, 13]);														}
				if (a1 === 37446										) { return random.item(["Graphics", "HD Graphics", "Intel(R) HD Graphics"]);						}
				if (a1 === this.VERSION									) { return random.item(["WebGL 1.0", "WebGL 1.0 (OpenGL)", "WebGL 1.0 (OpenGL Chromium)"]);			}
				if (a1 === this.SHADING_LANGUAGE_VERSION				) { return random.item(["WebGL", "WebGL GLSL", "WebGL GLSL ES", "WebGL GLSL ES (OpenGL Chromium"]);	}					
				return origGetParameter.apply(this, arguments);
			};
			target.getParameter.toString = origGetParameter.toString.bind(origGetParameter);
		};
		hookWebGLGetParameter(WebGLRenderingContext.prototype);
		hookWebGLGetParameter(WebGL2RenderingContext.prototype);
		HTMLCanvasElement.prototype.toDataURL = toDataURL;
		HTMLCanvasElement.prototype.toDataURL.toString = origToDataURL.toString.bind(origToDataURL);
		let toBlob = function toBlob(callback, type, encoderOptions) {
			let context = origGetContext.apply(this, ["2d"]);
			let imageData = origGetImageData.apply(context, [0, 0, this.height, this.width]), imageDataOrig = origGetImageData.apply(context, [0, 0, this.height, this.width]);
			for (let i = 0; i < imageData.data.length; i++) {
				imageData.data[i] += Math.round((Math.random() - 0.5) * 4.9);
			}
			context.putImageData(imageData, 0, 0);
			return origToBlob.apply(this, [function (blob) {
				context.putImageData(imageDataOrig, 0, 0);
				callback(blob);
			}, type, encoderOptions]);
		};
		HTMLCanvasElement.prototype.toBlob = toBlob;
		HTMLCanvasElement.prototype.toBlob.toString = origToBlob.toString.bind(origToBlob);
	})();
	(function () { // Intl
		window.Intl = undefined;
	})();
	(function () { // Fonts
		let offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
		let origOffsetWidthGetter = offsetWidth.get;
		offsetWidth.get = function offsetWidth() {
			let ret = origOffsetWidthGetter.apply(this, arguments);
			if (ret != 0) {
				if (Math.random() >= 0.9) {
					ret += Math.floor((Math.random() >= 0.5 ? -1 : 1) * Math.random() + Math.random());
				}
			}
			return ret;
		};
		offsetWidth.get.toString = origOffsetWidthGetter.toString.bind(origOffsetWidthGetter);
		Object.defineProperty(HTMLElement.prototype, "offsetWidth", offsetWidth);
		let offsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
		let origOffsetHeightGetter = offsetHeight.get;
		offsetHeight.get = function offsetHeight() {
			let ret = origOffsetWidthGetter.apply(this, arguments);
			if (ret != 0) {
				if (Math.random() >= 0.9) {
					ret += Math.floor((Math.random() >= 0.5 ? -1 : 1) * Math.random() + Math.random());
				}
			}
			return ret;
		};
		offsetHeight.get.toString = origOffsetHeightGetter.toString.bind(origOffsetHeightGetter);
		Object.defineProperty(HTMLElement.prototype, "offsetHeight", offsetHeight);
	})();
	let debuggerHook = function (n, m) {
		try {
			let orig = window[n].prototype[m];
			let hook = function () {
				debug();
				try {
					return orig.apply(this, arguments);
				} catch (e) {}
			};
			Object.defineProperty(hook, "name", { value: orig.name, writable: false, enumerable: false, configurable: true });
			window[n].prototype[m] = hook;
			window[n].prototype[m].toString = orig.toString.bind(orig);
		} catch (e) {}
	};
	let debuggerHookAll = function (n) {
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
		debuggerHookAll("AudioContext");
		debuggerHookAll("BaseAudioContext");
		debuggerHookAll("OfflineAudioCompletionEvent");
		debuggerHookAll("OfflineAudioContext");
		debuggerHookAll("AudioBuffer");
		debuggerHookAll("AnalyserNode");
		debuggerHookAll("HTMLCanvasElement");
		debuggerHookAll("CanvasRenderingContext2D");
		debuggerHookAll("WebGLRenderingContext");
		debuggerHookAll("WebGL2RenderingContext");
	} catch (e) {}
}) + ")()";
document.documentElement.prepend(script);