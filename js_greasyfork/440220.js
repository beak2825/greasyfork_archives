// ==UserScript==
// @namespace    Xortrox/UserScripts/HookXHR
// @name         UserScript XHR Hook Framework
// @version      0.1
// @description  This script is intended to work with @require only. Once required this can be used to listen for XHR events using window.UserScript.OnXHR.addEventListener((event) => {});
// @author       Xortrox
// @match        *
// @esversion:   6
// @license MIT
// ==/UserScript==

class HookXHR {
	constructor() {
		let rawSend = XMLHttpRequest.prototype.send;

		XMLHttpRequest.prototype.send = function() {
			if (!this._hooked) {
				this._hooked = true;

				this.addEventListener('readystatechange', function() {
					if (this.readyState === XMLHttpRequest.DONE) {
						setupHook(this);
					}
				}, false);
			}
			rawSend.apply(this, arguments);
		}

		function setupHook(xhr) {
			if (window.elethorGeneralPurposeOnXHR) {
				const e = new Event('UserScriptXHR');
				e.xhr = xhr;

				window.UserScript.OnXHR.dispatchEvent(e);
			}
		}
		
	}
}

if (!window.UserScript) {
	window.UserScript = {};
}

/** 
 * Can be used to listen for XHR requests
 * the event parameter will contain an xhr field which is the XMLHttpRequest.send itself
 * 
 * window.UserScript.OnXHR.addEventListener((event) => {
 * 		console.log(event.xhr);
 * });
 * */
window.UserScript.OnXHR = new EventTarget();
const hookXHR = new HookXHR();
