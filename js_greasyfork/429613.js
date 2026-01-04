/* eslint-disable no-multi-spaces */
// ==UserScript==
// @name         GM_Polyfill
// @namespace    GM_Polyfill
// @version      0.3
// @description  Provide GM_functions in non-ScriptManager-environment
// @author       PY-DNG
// @match        *
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADF0lEQVRYhe2XQU/bSBTHPbKRKtkmkpESbdVLcgwC4dtKjZDPFZgv0OTEN+h3gPNe+AIIBIccUeC0VrVa0khslDYgpSr1arUoPeaWxYz928OOaTY4hGVL2wMjvdu8937zxs/zf5r2vS1gBTgAhny5NQQOgdXbEj8BtgGCIOi5rtsyTXMghEDTtHuZEALTNAdLS0utIAh6CmYbeJIFsJ0kifR9/1gIkdw36S0wie/7x0mSSGA7q+z4vn/8pROPm+/7x6oSK6MAB0EQ9B7i5FmVUNdxMAowdF239dDJU3NdtwUMRwEwTXPwtQBM0xwA/Avg/3zt97gGbgB8reSpPQI8AjwC3BnAMIxLy7IGhmFc3TW4rutRLpcbGIbx170BSqXSu0aj0Y3jWAJEURTt7u62C4XC+0lB8/l8b39/vx1FUQQQx7E8Ojrqlkql9n8CqFarzSRJAN4Aa8AzoAacSSllpVJpjgesVCpNKaUEzoCXwFP1yv4CsL6+3roTQLlcPlHP5RagayNLiZa6lFLm8/le6lMoFN6r5PVxsQHowE8ACwsLJ1MBOp3OR+D1ePIxiLO9vb3fUp+dnZ0ToJepdD5D/Nztdn9P35xMANu2P6nTP88KNLL/ZRRFka7rkWEYV+rOa1N8fgSwbbs/EcBxnFP+EZCZpx/Z/wNALpcbWJY1UNDPpvjowHBubu40E0AIwezs7IUKtjgl2Focx3JmZubSMIxL1SlrU3wWASzL+iPzOU4VcBiGfaA+5SRvDg8Pu5r6BhqNRld1zMTKAfUwDPupUh4HuJZknuc1VRVeTUi+lSQJxWKxkwIUi8W3qm1vdI7yewXgeV5T07Il2bUoFUKwsbHRUhB1VTodeK66g1qtduM/UK1WU/DXaq+ufOsAm5ubLSHERFH6Aj7LciEEy8vLzfPz8z9V0CFAp9P5WC6XT8aTpzY/P99ut9sfRn3CMOx7ntdM2y9TliuIG4OJEALbti8cxzk1TbM/KfG4WZb1yXGcU9u2L9LEQohkdXX118zBRAE82Gjmuu700WwE5KGG0wNuG06/1fobtnrEdKhuQ44AAAAASUVORK5CYII=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setClipboard
// ==/UserScript==

// GM_Polyfill By PY-DNG
// 2021.07.18 - 2021.07.19
// Simply provides the following GM_functions using localStorage, XMLHttpRequest and window.open:
// Returns object GM_POLYFILLED which has the following properties that shows you which GM_functions are actually polyfilled:
// GM_setValue, GM_getValue, GM_deleteValue, GM_listValues, GM_xmlhttpRequest, GM_openInTab, GM_setClipboard, unsafeWindow(object)
// All polyfilled GM_functions are accessable in window object/Global_Scope(only without Tempermonkey Sandboxing environment)
function GM_PolyFill(name = 'default') {
	const GM_POLYFILL_KEY_STORAGE = 'GM_STORAGE_POLYFILL';
	let GM_POLYFILL_storage;
	const GM_POLYFILLED = {
		GM_setValue: true,
		GM_getValue: true,
		GM_deleteValue: true,
		GM_listValues: true,
		GM_xmlhttpRequest: true,
		GM_openInTab: true,
		GM_setClipboard: true,
		unsafeWindow: true
	}
	
	// Ignore GM_PolyFill_Once
	window.GM_POLYFILLED && window.GM_POLYFILLED.once && (window.unsafeWindow = window.GM_setClipboard = window.GM_openInTab = window.GM_xmlhttpRequest = window.GM_getValue = window.GM_setValue = window.GM_listValues = window.GM_deleteValue = undefined);

	GM_setValue_polyfill();
	GM_getValue_polyfill();
	GM_deleteValue_polyfill();
	GM_listValues_polyfill();
	GM_xmlhttpRequest_polyfill();
	GM_openInTab_polyfill();
	GM_setClipboard_polyfill();
	unsafeWindow_polyfill();

	function GM_POLYFILL_getStorage() {
		let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
		gstorage = gstorage ? JSON.parse(gstorage) : {};
		let storage = gstorage[name] ? gstorage[name] : {};
		return storage;
	}

	function GM_POLYFILL_saveStorage() {
		let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
		gstorage = gstorage ? JSON.parse(gstorage) : {};
		gstorage[name] = GM_POLYFILL_storage;
		localStorage.setItem(GM_POLYFILL_KEY_STORAGE, JSON.stringify(gstorage));
	}

	// GM_setValue
	function GM_setValue_polyfill() {
		typeof (GM_setValue) === 'function' ? GM_POLYFILLED.GM_setValue = false: window.GM_setValue = PF_GM_setValue;;

		function PF_GM_setValue(name, value) {
			GM_POLYFILL_storage = GM_POLYFILL_getStorage();
			name = String(name);
			GM_POLYFILL_storage[name] = value;
			GM_POLYFILL_saveStorage();
		}
	}

	// GM_getValue
	function GM_getValue_polyfill() {
		typeof (GM_getValue) === 'function' ? GM_POLYFILLED.GM_getValue = false: window.GM_getValue = PF_GM_getValue;

		function PF_GM_getValue(name, defaultValue) {
			GM_POLYFILL_storage = GM_POLYFILL_getStorage();
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
			GM_POLYFILL_storage = GM_POLYFILL_getStorage();
			name = String(name);
			if (GM_POLYFILL_storage.hasOwnProperty(name)) {
				delete GM_POLYFILL_storage[name];
				GM_POLYFILL_saveStorage();
			}
		}
	}

	// GM_listValues
	function GM_listValues_polyfill() {
		typeof (GM_listValues) === 'function' ? GM_POLYFILLED.GM_listValues = false: window.GM_listValues = PF_GM_listValues;

		function PF_GM_listValues() {
			GM_POLYFILL_storage = GM_POLYFILL_getStorage();
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

	return GM_POLYFILLED;
}