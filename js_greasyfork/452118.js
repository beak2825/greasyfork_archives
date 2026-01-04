/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               Userscript App Core
// @name:zh-CN         用户脚本应用核心
// @name:en            Userscript App Core
// @namespace          Userscript-App
// @version            0.8
// @description        Userscript App Core For Userscript Web Apps
// @description:zh-CN  用户脚本网页应用核心
// @description:en     Userscript App Core For Userscript Web Apps
// @author             PY-DNG
// @license            MIT
// @match              http*://*/*
// @connect            *
// @grant              GM_info
// @grant              GM_addStyle
// @grant              GM_addElement
// @grant              GM_deleteValue
// @grant              GM_listValues
// @grant              GM_addValueChangeListener
// @grant              GM_removeValueChangeListener
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_log
// @grant              GM_getResourceText
// @grant              GM_getResourceURL
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @grant              GM_openInTab
// @grant              GM_xmlhttpRequest
// @grant              GM_download
// @grant              GM_getTab
// @grant              GM_saveTab
// @grant              GM_getTabs
// @grant              GM_notification
// @grant              GM_setClipboard
// @grant              GM_info
// @grant              window.onurlchange
// @grant              window.close
// @grant              window.focus
// @grant              unsafeWindow
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/452118/Userscript%20App%20Core.user.js
// @updateURL https://update.greasyfork.org/scripts/452118/Userscript%20App%20Core.meta.js
// ==/UserScript==

(function __MAIN__() {
	'use strict';

	const CONST = {
		Text: {
			SetPassword: 'View/Set Password',
			SetPasswordTip: 'Set your password: '
		}
	}

	main();
	function main() {
		const UAC = {
			grant: passFunc(GM_grant, () => GM_getValue('password', null)),
			check: pswd => pswd === GM_getValue('password', null),
			version: GM_info.script.version,
			provider: 'Userscript-Application-Core'
		};
		Object.freeze(UAC);
		Object.defineProperty(unsafeWindow, 'UAC', {
			value: UAC,
			writable: false,
			configurable: false,
			enumerable: false
		});
		unsafeWindow.dispatchEvent(new Event('uac-ready'));

		GM_registerMenuCommand(CONST.Text.SetPassword, setPass);
	}

	function setPass() {
		const newpass = prompt(CONST.Text.SetPasswordTip, GM_getValue('password', ''));
		newpass !== null && GM_setValue('password', newpass);
	}

	function passFunc(func, pswd) {
		return function() {
			const password = typeof pswd === 'function' ? pswd() : pswd;
			const correct = arguments.length !== 0 && password === arguments[arguments.length-1];

			return correct ? func.apply(this, Array.from(arguments).slice(0, arguments.length-1)) : null;
		}
	}

	function GM_grant(name) {
		const GMFuncs = {
			// Tampermonkey provides
			GM_addStyle: typeof GM_addStyle === 'function' ? GM_addStyle : null,
			GM_addElement: typeof GM_addElement === 'function' ? GM_addElement : null,
			GM_deleteValue: typeof GM_deleteValue === 'function' ? GM_deleteValue : null,
			GM_listValues: typeof GM_listValues === 'function' ? GM_listValues : null,
			GM_addValueChangeListener: typeof GM_addValueChangeListener === 'function' ? GM_addValueChangeListener : null,
			GM_removeValueChangeListener: typeof GM_removeValueChangeListener === 'function' ? GM_removeValueChangeListener : null,
			GM_setValue: typeof GM_setValue === 'function' ? GM_setValue : null,
			GM_getValue: typeof GM_getValue === 'function' ? GM_getValue : null,
			GM_log: typeof GM_log === 'function' ? GM_log : null,
			GM_getResourceText: typeof GM_getResourceText === 'function' ? GM_getResourceText : null,
			GM_getResourceURL: typeof GM_getResourceURL === 'function' ? GM_getResourceURL : null,
			GM_registerMenuCommand: typeof GM_registerMenuCommand === 'function' ? GM_registerMenuCommand : null,
			GM_unregisterMenuCommand: typeof GM_unregisterMenuCommand === 'function' ? GM_unregisterMenuCommand : null,
			GM_openInTab: typeof GM_openInTab === 'function' ? GM_openInTab : null,
			GM_xmlhttpRequest: typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null,
			GM_download: typeof GM_download === 'function' ? GM_download : null,
			GM_getTab: typeof GM_getTab === 'function' ? GM_getTab : null,
			GM_saveTab: typeof GM_saveTab === 'function' ? GM_saveTab : null,
			GM_getTabs: typeof GM_getTabs === 'function' ? GM_getTabs : null,
			GM_notification: typeof GM_notification === 'function' ? GM_notification : null,
			GM_setClipboard: typeof GM_setClipboard === 'function' ? GM_setClipboard : null,
			GM_info: typeof GM_info === 'object' ? GM_info : null,
			window: typeof window === 'object' ? window : null,
			unsafeWindow: typeof unsafeWindow === 'object' ? unsafeWindow : null,
		};
		if (GMFuncs.hasOwnProperty(name)) {
			return GMFuncs[name];
		} else {
			return null;
		}
	}
})();