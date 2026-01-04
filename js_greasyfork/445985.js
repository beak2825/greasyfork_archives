/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               中国大学MOOC反检测
// @name:zh-CN         中国大学MOOC反检测
// @name:en            iCourse163 Anti-detect
// @namespace          iCourse163-Anti-detect
// @version            0.1
// @description        防止中国大学MOOC页面检测模拟点击类插件/脚本（目前已发现的检测只有检测模拟点击类的）
// @description:zh-CN  防止中国大学MOOC页面检测模拟点击类插件/脚本（目前已发现的检测只有检测模拟点击类的）
// @description:en     Prevent plugins(e.g. userscripts) being detected by 1course163 while simulating clicks on webpage
// @author             PY-DNG
// @license            WTFPL - See https://www.wtfpl.net/
// @match              http*://www.icourse163.org/*
// @icon               https://pic.jitudisk.com/public/2022/06/04/59e467b286dcb.png
// @grant              none
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/445985/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%E5%8F%8D%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/445985/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%E5%8F%8D%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

/**
 * Copyright © 2022 PY-DNG <NO EMAIL HERE>
 * This work is free. You can redistribute it and/or modify it under the
 * terms of the Do What The Fuck You Want To Public License, Version 2,
 * as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.
**/

/**
 * This program is free software. It comes without any warranty, to
 * the extent permitted by applicable law. You can redistribute it
 * and/or modify it under the terms of the Do What The Fuck You Want
 * To Public License, Version 2, as published by Sam Hocevar. See
 * http://www.wtfpl.net/ for more details.
**/

(function(window, document) {
	/* Protect.js by PY-DNG */
	/* !IMPORTANT! MAKE SURE THIS CODE IS EXECUTED BEFORE WINDOW ONLOAD !IMPORTANT! */

	try {
		// Unpolluted resources
		const iframe = document.createElement('iframe');
		iframe.srcdoc = '<html></html>';
		iframe.style.position = 'fixed';
		iframe.style.width = iframe.style.height = '0';
		(document.body ? document.body : document.head).appendChild(iframe);
		const UNPOLLUTED = new Proxy({}, {
			get: function(target, property, receiver) {
				switch (property) {
					case 'iframe': return iframe;
					default: {
						let value = iframe;
						for (const prop of property.split(/[\.\/]/)) {
							value = value[prop];
						}
						return value;
					}
				}
			}
		});

		// Protect addEventListener & removeEventListener
		defineProperty(Node.prototype, 'addEventListener', addEventListener);
		defineProperty(Node.prototype, 'removeEventListener', UNPOLLUTED['contentWindow.EventTarget.prototype.removeEventListener']);
		for (const func of ['createElement', 'createElementNS', 'querySelector', 'querySelectorAll', 'getElementById', 'getElementsByClassName', 'getElementsByName', 'getElementsByTagName', 'getElementsByTagNameNS']) {
			hookAPIFunc(func);
		}

		// Protect root & root-like elements
		for (const elm of [document.querySelector('#g-body'), document.documentElement, document, window]) {
			const addEventListener = UNPOLLUTED['contentWindow.EventTarget.prototype.addEventListener'];
			typeof elm === 'object' && elm !== null && hookElm(elm);
		}

		function hookAPIFunc(funcName) {
			for (const api of ['Document', 'Element']) {
				const API = window[api];
				const proto = API.prototype;
				proto.hasOwnProperty(funcName) && defineProperty(proto, funcName, function() {
					let value = UNPOLLUTED['contentWindow.'+api+'.prototype.'+funcName].apply(this, Array.from(arguments));

					if (value instanceof NodeList) {
						value = Array.prototype.map.call(value, (elm) => (hookElm(elm)));
						value.item = (i) => (i < value.length ? value[i] : null);
					} else if (value instanceof EventTarget) {
						value = hookElm(value);
					}
					return value;
				});
			}
		}

		function hookElm(elm) {
			defineProperty(elm, 'addEventListener', addEventListener);
			defineProperty(elm, 'removeEventListener', UNPOLLUTED['contentWindow.EventTarget.prototype.removeEventListener']);
			return elm;
		}

		function defineProperty(obj, prop, value) {
			// Check repeat
			if (obj._protected && obj._protected[prop] && obj[prop].toString() === value.toString()) {
				return false;
			}

			// Define property
			define(obj, prop, value, true);

			// Prevent repeat
			!obj._protected && define(obj, '_protected', {}, false);
			define(obj._protected, prop, true, true);

			return true;

			function define(obj, prop, value, enumerable) {
				Object.defineProperty(obj, prop, {
					value: value,
					writable: false,
					configurable: false,
					enumerable: enumerable
				});
			}
		}

		function addEventListener(type, listener) {
			const banlist = ['function(a5){if(', 'function(a6){a6'];
			for (const bancode of banlist) {
				if (type === 'click' && listener.toString().startsWith(bancode)) {
					return;
				}
			}
			return UNPOLLUTED['contentWindow.EventTarget.prototype.addEventListener'].apply(this, Array.from(arguments));
		}

		function toString(o) {
			return UNPOLLUTED['contentWindow.Object.prototype.toString'].call(o);
		}
	} catch (err) {
		throw err;
		debugger;
	}
}).apply(null, typeof unsafeWindow === 'object' ? [unsafeWindow, unsafeWindow.document] : [window, document]);