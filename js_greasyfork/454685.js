// ==UserScript==
// @name               Website icon getter
// @name:zh-CN         网站图标获取
// @name:en            Website icon getter
// @namespace          Website-icon-getter
// @version            0.1.5
// @description        Get the icon of current tab
// @description:zh-CN  获取当前网站的图标
// @description:en     Get the icon of current tab
// @author             PY-DNG
// @license            GPL-3.0-or-later
// @match              http*://*/*
// @match              file:///*
// @require            https://update.greasyfork.org/scripts/456034/1303041/Basic%20Functions%20%28For%20userscripts%29.js
// @icon               none
// @grant              GM_registerMenuCommand
// @grant              GM_setClipboard
// @grant              GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/454685/Website%20icon%20getter.user.js
// @updateURL https://update.greasyfork.org/scripts/454685/Website%20icon%20getter.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager */

(function __MAIN__() {
    'use strict';

	const CONST = {
		Text_AllLang: {
			DEFAULT: 'en',
			'en': {
				CopyIconUrl: 'Copy icon url of current tab',
				OpenIconInNewTab: 'Open icon in new tab',
				CopyIconBase64: 'Copy icon url of current tab in Base64 format',
				DownloadIcon: 'Download icon of current tab',
				Download_FileName: 'Icon - {Host}.ico',
			},
			'zh': {
				CopyIconUrl: '复制当前标签页图标地址',
				OpenIconInNewTab: '在新标签页查看图标',
				CopyIconBase64: '复制Base64格式的当前标签页图标地址',
				DownloadIcon: '下载当前标签页图标',
				Download_FileName: 'Icon - {Host}.ico',
			}
		}
	};
	const i18n = navigator.language.split('-')[0] || CONST.Text_AllLang.DEFAULT;
	CONST.Text = CONST.Text_AllLang[i18n] || CONST.Text_AllLang[CONST.Text_AllLang.DEFAULT];

	GM_registerMenuCommand(CONST.Text.CopyIconUrl, copyIconUrl);
	GM_registerMenuCommand(CONST.Text.OpenIconInNewTab, openIcon);
	GM_registerMenuCommand(CONST.Text.CopyIconBase64, copyIconBase64);
	GM_registerMenuCommand(CONST.Text.DownloadIcon, downloadIcon);

	function downloadIcon() {
		dl_browser(getIconUrl(), replaceText(CONST.Text.Download_FileName, {'{Host}': getHost()}));
	}

	async function copyIconBase64() {
		const url = await getImageUrl(getIconUrl());
		GM_setClipboard(url, 'text');
	}

	function copyIconUrl() {
		GM_setClipboard(getIconUrl(), 'text');
	}

	function openIcon() {
		window.open(getIconUrl());
	}

	function getIconUrl() {
		const head = document.head;
		const link = $(head, 'link[rel~="icon"]');
		return link ? link.href : getHost() + 'favicon.ico';
	}

	// get host part from a url(includes '^https://', '/$')
	function getHost(url=location.href) {
		const match = location.href.match(/https?:\/\/[^\/]+\//);
		return match ? match[0] : match;
	}

	// Get a base64-formatted url of an image
	async function getImageUrl(src) {
		const blob = await get(src, 'blob');
		return toDataURL(blob);
	}

	async function toDataURL(blob) {
		return new Promise((resolve, reject) => {
			try {
				const reader = new FileReader();
				reader.onload = e => resolve(reader.result);
				reader.onerror = reject;
				reader.readAsDataURL(blob);
			} catch(err) {
				reject(err);
			}
		});
	}

	function get(url, responseType='text') {
		return new Promise((resolve, reject) => {
			try {
				GM_xmlhttpRequest({
					method: 'GET',
					url, responseType,
					onload: resp => resolve(resp.response),
					onerror: reject,
					onabort: reject,
					ontimeout: reject
				});
			} catch(err) {
				reject(err);
			}
		});
	}

	function dl_browser(url, name) {
		const a = $CrE('a');
		a.href = url;
		a.download = name;
		a.click();
	}

	// Replace model text with no mismatching of replacing replaced text
	// e.g. replaceText('aaaabbbbccccdddd', {'a': 'b', 'b': 'c', 'c': 'd', 'd': 'e'}) === 'bbbbccccddddeeee'
	//      replaceText('abcdAABBAA', {'BB': 'AA', 'AAAAAA': 'This is a trap!'}) === 'abcdAAAAAA'
	//      replaceText('abcd{AAAA}BB}', {'{AAAA}': '{BB', '{BBBB}': 'This is a trap!'}) === 'abcd{BBBB}'
	//      replaceText('abcd', {}) === 'abcd'
	/* Note:
	    replaceText will replace in sort of replacer's iterating sort
	    e.g. currently replaceText('abcdAABBAA', {'BBAA': 'TEXT', 'AABB': 'TEXT'}) === 'abcdAATEXT'
	    but remember: (As MDN Web Doc said,) Although the keys of an ordinary Object are ordered now, this was
	    not always the case, and the order is complex. As a result, it's best not to rely on property order.
	    So, don't expect replaceText will treat replacer key-values in any specific sort. Use replaceText to
	    replace irrelevance replacer keys only.
	*/
	function replaceText(text, replacer) {
		if (Object.entries(replacer).length === 0) {return text;}
		const [models, targets] = Object.entries(replacer);
		const len = models.length;
		let text_arr = [{text: text, replacable: true}];
		for (const [model, target] of Object.entries(replacer)) {
			text_arr = replace(text_arr, model, target);
		}
		return text_arr.map((text_obj) => (text_obj.text)).join('');

		function replace(text_arr, model, target) {
			const result_arr = [];
			for (const text_obj of text_arr) {
				if (text_obj.replacable) {
					const splited = text_obj.text.split(model);
					for (const part of splited) {
						result_arr.push({text: part, replacable: true});
						result_arr.push({text: target, replacable: false});
					}
					result_arr.pop();
				} else {
					result_arr.push(text_obj);
				}
			}
			return result_arr;
		}
	}
})();