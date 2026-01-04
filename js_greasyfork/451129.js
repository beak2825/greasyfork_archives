/* eslint-disable no-multi-spaces */
/* eslint-disable no-implicit-globals */
/* eslint-disable userscripts/no-invalid-headers */
/* eslint-disable userscripts/no-invalid-grant */

// ==UserScript==
// @name               AndroidAPI
// @displayname        安卓API支持
// @namespace          Wenku8++
// @version            0.1
// @description        为轻小说文库++提供安卓API支持
// @author             PY-DNG
// @license            GPL-v3
// @regurl             NONE
// @require            https://greasyfork.org/scripts/449412-basic-functions/code/Basic%20Functions.js?version=1085783
// ==/UserScript==

(function __MAIN__() {
    'use strict';

	const AndAPI = new AndroidAPI();
	exports = AndAPI;

	// Android API set
	function AndroidAPI() {
		const AA = this;
		const DParser = new DOMParser();

		const encode = AA.encode = function(str) {
			return '&appver=1.13&request=' + btoa(str) + '&timetoken=' + (new Date().getTime());
		};

		const request = AA.request = function(details) {
			const url = details.url;
			const type = details.type || 'text';
			const callback = details.callback || function() {};
			const args = details.args || [];
			GM_xmlhttpRequest({
				method: 'POST',
				url: 'http://app.wenku8.com/android.php',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.2; unknown Build/NZH54D)'
				},
				data: encode(url),
				onload: function(e) {
					let result;
					switch (type) {
						case 'xml':
							result = DParser.parseFromString(e.responseText, 'text/xml');
							break;
						case 'text':
							result = e.responseText;
							break;
					}
					callback.apply(null, [result].concat(args));
				},
				onerror: function(e) {
					Err('Request error while requesting "' + url + '"');
				}
			});
		};

		// aid, lang, callback, args
		AA.getNovelShortInfo = function(details) {
			const aid = details.aid;
			const lang = details.lang;
			const callback = details.callback || function() {};
			const args = details.args || [];
			const url = 'action=book&do=info&aid=' + aid + '&t=' + lang;
			request({
				url: url,
				callback: callback,
				args: args,
				type: 'xml'
			});
		}

		// aid, lang, callback, args
		AA.getNovelIndex = function(details) {
			const aid = details.aid;
			const lang = details.lang;
			const callback = details.callback || function() {};
			const args = details.args || [];
			const url = 'action=book&do=list&aid=' + aid + '&t=' + lang;
			request({
				url: url,
				callback: callback,
				args: args,
				type: 'xml'
			});
		};

		// aid, cid, lang, callback, args
		AA.getNovelContent = function(details) {
			const aid = details.aid;
			const cid = details.cid;
			const lang = details.lang;
			const callback = details.callback || function() {};
			const args = details.args || [];
			const url = 'action=book&do=text&aid=' + aid + '&cid=' + cid + '&t=' + lang;
			request({
				url: url,
				callback: callback,
				args: args,
				type: 'text'
			});
		};
	}
})();