// ==UserScript==
// @name               Userscript Runtime
// @name:zh            用户脚本运行环境
// @name:zh-CN         用户脚本运行环境
// @namespace          GM_PolyFill for Users
// @version            0.1
// @description        Try to make userscripts work on non-tempermonkey environments(e.g. X Browser, Via Browser, etc.) as well. Attention: All data that are expected to be saved in browser storage will actually NOT be saved, that means, everytime the userscript executes will act as this is the first time.
// @description:zh     尝试使其他用户脚本适配没有油猴支持的运行环境（如：X浏览器，via浏览器等等）。注意：所有的脚本存储在本地的数据都将不会被真正储存，而是会随着浏览器页面的关闭而被丢弃，也就是说，每次脚本运行时，都将如同第一次运行一样。
// @description:zh-CN  尝试使其他用户脚本适配没有油猴支持的运行环境（如：X浏览器，via浏览器等等）。注意：所有的脚本存储在本地的数据都将不会被真正储存，而是会随着浏览器页面的关闭而被丢弃，也就是说，每次脚本运行时，都将如同第一次运行一样。
// @author             PY-DNG
// @include            *
// @include            http?://*
// @include            *
// @include            http://*
// @include            https://*
// @include            file://*
// @include            file:///*
// @include            ftp://*
// @include            ftp:///*
// @icon               data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_listValue
// @grant              GM_deleteValue
// @grant              GM_xmlhttpRequest
// @grant              GM_openInTab
// @grant              GM_setClipboard
// @grant              unsafeWindow
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/433348/Userscript%20Runtime.user.js
// @updateURL https://update.greasyfork.org/scripts/433348/Userscript%20Runtime.meta.js
// ==/UserScript==

(function() {
    'use strict';

	bypassXB();
	GM_PolyFill_Once();

	// Bypass xbrowser's useless GM_functions
	function bypassXB() {
		if (typeof(mbrowser) === 'object') {
			window.unsafeWindow = window.GM_setClipboard = window.GM_openInTab = window.GM_xmlhttpRequest = window.GM_getValue = window.GM_setValue = window.GM_listValues = window.GM_deleteValue = undefined;
		}
	}

    // GM_Polyfill By PY-DNG
	// Special Edition For Userscript Users
	// 2021.07.18 - 2021.07.19, 2021.10.03 - 2021.10.03
	// Simply provides the following GM_functions using localStorage, XMLHttpRequest and window.open:
	// Returns object GM_POLYFILLED which has the following properties that shows you which GM_functions are actually polyfilled:
	// GM_setValue, GM_getValue, GM_deleteValue, GM_listValues, GM_xmlhttpRequest, GM_openInTab, GM_setClipboard, unsafeWindow(object)
	// All polyfilled GM_functions are accessable in window object/Global_Scope(only without Tempermonkey Sandboxing environment)
	// -!!!- IMPORTANT: PROVIDED GM_*FUNCTIONS WILL ONLY BE ABLE IN SINGLE USE - THAT MEANS THAT ALL DATA YOU EXPECTED TO BE STORED IN BROWSER USING GM_SETVALUE WILL ACTUALLY NOT BE STORED! GM_SETVALUE WILL JUST STORE DATA INTO A CACHE OBJECT! -!!!-
	function GM_PolyFill_Once() {
		let GM_POLYFILL_storage = {};
		const GM_POLYFILLED = {
			GM_setValue: true,
			GM_getValue: true,
			GM_deleteValue: true,
			GM_listValues: true,
			GM_xmlhttpRequest: true,
			GM_openInTab: true,
			GM_setClipboard: true,
			unsafeWindow: true,
			once: true
		}

		GM_setValue_polyfill();
		GM_getValue_polyfill();
		GM_deleteValue_polyfill();
		GM_listValues_polyfill();
		GM_xmlhttpRequest_polyfill();
		GM_openInTab_polyfill();
		GM_setClipboard_polyfill();
		unsafeWindow_polyfill();

		// GM_setValue
		function GM_setValue_polyfill() {
			typeof (GM_setValue) === 'function' ? GM_POLYFILLED.GM_setValue = false: window.GM_setValue = PF_GM_setValue;;

			function PF_GM_setValue(name, value) {
				name = String(name);
				GM_POLYFILL_storage[name] = value;
			}
		}

		// GM_getValue
		function GM_getValue_polyfill() {
			typeof (GM_getValue) === 'function' ? GM_POLYFILLED.GM_getValue = false: window.GM_getValue = PF_GM_getValue;

			function PF_GM_getValue(name, defaultValue) {
				name = String(name);
				if (GM_POLYFILL_storage.hasOwnProperty(name)) {
					return GM_POLYFILL_storage[name];
				} else {
					return defaultValue;
				}
			}
		}

		// GM_deleteValue
		function GM_deleteValue_polyfill() {
			typeof (GM_deleteValue) === 'function' ? GM_POLYFILLED.GM_deleteValue = false: window.GM_deleteValue = PF_GM_deleteValue;

			function PF_GM_deleteValue(name) {
				name = String(name);
				if (GM_POLYFILL_storage.hasOwnProperty(name)) {
					delete GM_POLYFILL_storage[name];
				}
			}
		}

		// GM_listValues
		function GM_listValues_polyfill() {
			typeof (GM_listValues) === 'function' ? GM_POLYFILLED.GM_listValues = false: window.GM_listValues = PF_GM_listValues;

			function PF_GM_listValues() {
				return Object.keys(GM_POLYFILL_storage);
			}
		}

		// unsafeWindow
		function unsafeWindow_polyfill() {
			typeof (unsafeWindow) === 'object' ? GM_POLYFILLED.unsafeWindow = false: window.unsafeWindow = window;
		}

		// GM_xmlhttpRequest
		// not supported properties of details: synchronous binary nocache revalidate context fetch
		// not supported properties of response(onload arguments[0]): finalUrl
		// ---!IMPORTANT!--- DOES NOT SUPPORT CROSS-ORIGIN REQUESTS!!!!! ---!IMPORTANT!---
		function GM_xmlhttpRequest_polyfill() {
			typeof (GM_xmlhttpRequest) === 'function' ? GM_POLYFILLED.GM_xmlhttpRequest = false: window.GM_xmlhttpRequest = PF_GM_xmlhttpRequest;

			// details.synchronous is not supported as Tempermonkey
			function PF_GM_xmlhttpRequest(details) {
				const xhr = new XMLHttpRequest();

				// open request
				const openArgs = [details.method, details.url, true];
				if (details.user && details.password) {
					openArgs.push(details.user);
					openArgs.push(details.password);
				}
				xhr.open.apply(xhr, openArgs);

				// set headers
				if (details.headers) {
					for (const key of Object.keys(details.headers)) {
						xhr.setRequestHeader(key, details.headers[key]);
					}
				}
				details.cookie ? xhr.setRequestHeader('cookie', details.cookie) : function () {};
				details.anonymous ? xhr.setRequestHeader('cookie', '') : function () {};

				// properties
				xhr.timeout = details.timeout;
				xhr.responseType = details.responseType;
				details.overrideMimeType ? xhr.overrideMimeType(details.overrideMimeType) : function () {};

				// events
				xhr.onabort = details.onabort;
				xhr.onerror = details.onerror;
				xhr.onloadstart = details.onloadstart;
				xhr.onprogress = details.onprogress;
				xhr.onreadystatechange = details.onreadystatechange;
				xhr.ontimeout = details.ontimeout;
				xhr.onload = function (e) {
					const response = {
						readyState: xhr.readyState,
						status: xhr.status,
						statusText: xhr.statusText,
						responseHeaders: xhr.getAllResponseHeaders(),
						response: xhr.response
					};
					(details.responseType === '' || details.responseType === 'text') ? (response.responseText = xhr.responseText) : function () {};
					(details.responseType === '' || details.responseType === 'document') ? (response.responseXML = xhr.responseXML) : function () {};
					details.onload(response);
				}

				// send request
				details.data ? xhr.send(details.data) : xhr.send();

				return {
					abort: xhr.abort
				};
			}
		}

		// NOTE: options(arg2) is NOT SUPPORTED! if provided, then will just be skipped.
		function GM_openInTab_polyfill() {
			typeof (GM_openInTab) === 'function' ? GM_POLYFILLED.GM_openInTab = false: window.GM_openInTab = PF_GM_openInTab;

			function PF_GM_openInTab(url) {
				window.open(url);
			}
		}

		// NOTE: needs to be called in an event handler function, and info(arg2) is NOT SUPPORTED!
		function GM_setClipboard_polyfill() {
			typeof (GM_setClipboard) === 'function' ? GM_POLYFILLED.GM_setClipboard = false: window.GM_setClipboard = PF_GM_setClipboard;

			function PF_GM_setClipboard(text) {
				// Create a new textarea for copying
				const newInput = document.createElement('textarea');
				document.body.appendChild(newInput);
				newInput.value = text;
				newInput.select();
				document.execCommand('copy');
				document.body.removeChild(newInput);
			}
		}

		window.GM_POLYFILLED = GM_POLYFILLED;
		return GM_POLYFILLED;
	}
})();