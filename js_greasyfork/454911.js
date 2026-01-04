/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               页面关闭确认
// @name:zh-CN         页面关闭确认
// @name:en            Confirm before closing tab
// @namespace          http://tampermonkey.net/
// @version            0.1
// @description        防止页面意外关闭
// @description:zh-CN  防止页面意外关闭
// @description:en     Prevent closing tabs accidently
// @author             PY-DNG
// @license            GPL-v3
// @match              http*://*/*
// @icon               none
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/454911/%E9%A1%B5%E9%9D%A2%E5%85%B3%E9%97%AD%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/454911/%E9%A1%B5%E9%9D%A2%E5%85%B3%E9%97%AD%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function __MAIN__() {
    'use strict';

	const CONST = {
		Text_AllLang: {
			DEFAULT: 'en',
			'en': {
				Protect_Tab: '[ ] Confirm before closing this tab',
				Protect_All: '[ ] Confirm before closing all tabs',
				Unprotect_Tab: '[✔] Confirm before closing this tab',
				Unprotect_All: '[✔] Confirm before closing all tabs',
			},
			'zh': {
				Protect_Tab: '[ ] 关闭此页面前进行确认',
				Protect_All: '[ ] 关闭全部页面均需确认',
				Unprotect_Tab: '[✔] 关闭此页面前进行确认',
				Unprotect_All: '[✔] 关闭全部页面均需确认',
			}
		}
	};
	const i18n = navigator.language.split('-')[0] || CONST.Text_AllLang.DEFAULT;
	CONST.Text = CONST.Text_AllLang[i18n];

	let id_tab, id_all;
	let protects = {
		protected: false,
		_tab: false,
		get tab() {return protects._tab;},
		set tab(v) {
			if (typeof v === 'boolean') {
				protects._tab = v;
				refresh();
			}
			return true;
		},
		get all() {return GM_getValue('all', false);},
		set all(v) {
			if (typeof v === 'boolean') {
				GM_setValue('all', v);
				refresh();
			}
			return true;
		},
	};
	//GM_addValueChangeListener('all', function(name, old_value, new_value, remote) {onclick('all');})
	refresh();

	function onclick(type) {
		debugger;
		protects[type] = !protects[type];
	}

	function refresh() {
		(protects.tab || protects.all) && !protects.protected && protect();
		!protects.tab && !protects.all && protects.protected && unprotect();

		refreshMenuCommand();
	}

	function refreshMenuCommand() {
		id_tab && GM_unregisterMenuCommand(id_tab);
		id_all && GM_unregisterMenuCommand(id_all);
		id_tab = GM_registerMenuCommand(CONST.Text[protects.tab ? 'Unprotect_Tab' : 'Protect_Tab'], onclick.bind(null, 'tab'));
		id_all = GM_registerMenuCommand(CONST.Text[protects.all ? 'Unprotect_All' : 'Protect_All'], onclick.bind(null, 'all'));
	}

	function protect() {
		unsafeWindow.addEventListener('beforeunload', onBeforeUnload);
		protects.protected = true;
	}

	function unprotect() {
		unsafeWindow.removeEventListener('beforeunload', onBeforeUnload);
		protects.protected = false;
	}

	function onBeforeUnload(event) {
		event.preventDefault();
		event.returnValue = '';
	}
})();