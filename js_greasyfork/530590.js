// ==UserScript==
// @name        Bypass CDP Detection
// @namespace   http://fulicat.com
// @author      Jack.Chan (971546@qq.com)
// @version     1.0.2
// @run-at      document-start
// @match       *://*/*
// @match       file:///*
// @url         https://greasyfork.org/zh-CN/scripts/530590-bypass-cdp-detection
// @grant       none
// @description 2025/3/23 14:17:37
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530590/Bypass%20CDP%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/530590/Bypass%20CDP%20Detection.meta.js
// ==/UserScript==





;(function() {

	var originalError = Error;

	// Lock down the stack property on Error.prototype to prevent modification
	Object.defineProperty(Error.prototype, 'stack', {
		configurable: false,
		enumerable: true,
		writable: false,
		value: (function() {
			try {
				throw new originalError();
			} catch (e) {
				return e.stack;
			}
		})()
	});

	// Proxy the Error constructor to prevent any instance-specific stack modifications
	window.Error = new Proxy(originalError, {
		construct(target, args) {
			return originalError(...args);
			try {
				var instance = new target(...args);
				// Freeze the instance to prevent any modifications
				return Object.freeze(instance);
			} catch(ex) {
				console.log('// [bypass_CDP_Detection] ex:', ex);
			}
			return originalError(...args);
		}
	});


	// Override Object.defineProperty
  	var stackLookupCount = 0;
	var originalObjectDefineProperty = Object.defineProperty;
	Object.defineProperty = function defineProperty(obj, prop, descriptor) {
		if (prop === 'stack') {
			if (stackLookupCount < 10) {
				console.log('// [bypass_CDP_Detection] Object.defineProperty', stackLookupCount, String.fromCharCode(10), 'obj:', obj, String.fromCharCode(10), 'prop:', prop, String.fromCharCode(10), 'descriptor:', descriptor, String.fromCharCode(10), String.fromCharCode(10), String.fromCharCode(10) );
			} else {
				console.log('// [bypass_CDP_Detection] Object.defineProperty', 'too many times');
			}
			stackLookupCount++;
			return {};
		}
		return originalObjectDefineProperty.apply(Object, arguments);
	}
	Object.defineProperty.toString = function toString() {
		return originalObjectDefineProperty.toString();
	};


	// bypass https://kaliiiiiiiiii.github.io/brotector/
	const context = console.context;
	console.context = function() {
		return {
			...console,
			clear(){},
			log(){},
			debug(){},
		}
	};
	console.context.toString = function() {
		return context.toString();
	}


	// alert('bypass_CDP_detection injected');
})();
