/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

// ==UserScript==
// @name               ic2api
// @namespace          PY-DNG userscripts
// @version            0.1
// @description        虽然作者懒得写描述，但是他至少记得添加过一个默认描述……
// @author             PY-DNG
// @license            GPL-3.0-or-later
// ==/UserScript==

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager */

let IC2API = (function __MAIN__() {
    'use strict';

	return {
		phoneSeatReserve: {
			duration() {
				return get('ic-web/phoneSeatReserve/duration');
			},
			reserve(duration) {
				return post('ic-web/phoneSeatReserve/duration', JSON.stringify({ duration }));
			}
		},
		seatMenu() {
			return get('ic-web/seatMenu');
		},
		reserve(roomIds, resvDates, sysKind) {
			return get('ic-web/reserve', { roomIds, resvDates, sysKind });
		},
	};

	function get(url, params) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url: toAbsURL(url, params),
				headers: { 'Token': getToken() || '' },
				responseType: 'json',
				onload: res => {
					const data = res.response;
					res.status === 200 && data.code === 0 ? resolve(data) : reject(data);
				},
				onerror: err => {
					reject(err);
				}
			});
		});
	}

	function post(url, data) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: 'POST',
				url: toAbsURL(url),
				headers: { 'Token': getToken() || '' },
				responseType: 'json',
				data,
				onload: res => {
					const data = res.response;
					res.status === 200 && data.code === 0 ? resolve(data) : reject(data);
				},
				onerror: err => {
					reject(err);
				}
			});
		});
	}

	function getToken() {
		const storage = sessionStorage.getItem("userInfo");
		const userInfo = storage ? JSON.parse(storage) : {}
		return userInfo.token;
	}

	function toAbsURL(pathname, searchOptions) {
		return new URL(pathname, `${location.protocol}//${location.host}`).href + (searchOptions ? `?${toSearch(searchOptions)}` : '');
	}

	function toSearch(options) {
		return new URLSearchParams(options).toString()
	}
})();