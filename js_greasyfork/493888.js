// ==UserScript==
// @name         Echo Media paid unlock
// @version      2.02
// @match        https://*.echo24.cz/*
// @match        https://echo24.cz/*
// @match        https://www.echoprime.cz/*
// @match        https://echoprime.cz/*
// @match        https://www.bm24.cz/*
// @match        https://bm24.cz/*
// @run-at       document-start
// @grant        GM_info
// @grant        unsafeWindow
// @author       trumpeta
// @description  Script unlocks paid content on servers of Echo Media
// @description:cs Skript odemyká placený obsah na serverech Echo Media
// @copyright    © 2025 trumpeta
// @license      GPL-3.0-or-later
// @iconURL      https://eshop.echomedia.cz/templateAssets/images/favicon.png
// @namespace    https://greasyfork.org/users/198317
// @downloadURL https://update.greasyfork.org/scripts/493888/Echo%20Media%20paid%20unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/493888/Echo%20Media%20paid%20unlock.meta.js
// ==/UserScript==

(function patchRequests() {
	'use strict';

	const debugPrefix = '[' + GM_info.script.name + '] ';

	function patchResponse(data) {
		const channels = ['echoprime', 'echo24app', 'echo24czadvert'];
		if (data && data.uuid) channels.push('echo24czopinion');
		channels.push('echomonitorcz', 'echomonitoren'); // ukončeny
		data = Object.assign({
			displayName: 'Neznámý Uživatel',
			username: 'anonymous@gmail.com',
			badges: ['email.verified'],
			uuid: crypto.randomUUID(),
			registrationTime: (function getRandomTime(firstDate, daysBack = 0) {
				firstDate = new Date(firstDate || '2017-01-01').getTime();
				const date = new Date(firstDate + Math.floor(Math.random() * (Date.now() - daysBack * 24*60*60*1000 - firstDate)));
				return date.toISOString();
			})('2017-01-01', 90),
		}, data, { subscribed: channels.map(channel => ({ [channel]: ['paid'] })) });
		console.log(debugPrefix + 'Response successfully patched', data);
		return data;
	}

	const loggedUser = /\/loggedUser(?:\?|#|$)/i;

	if ('fetch' in unsafeWindow) {
		const fetch = Object.getOwnPropertyDescriptor(unsafeWindow, 'fetch');
		if (fetch.configurable && typeof fetch.value == 'function') {
			Object.defineProperty(unsafeWindow, 'fetch', {
				value: (resource, init) => fetch.value.call(unsafeWindow, resource, init).then(async response => {
					const url = typeof resource == 'string' ? resource : resource.url;
					if (loggedUser.test(url)) try {
						console.log(debugPrefix + 'Intercepted fetch', url);
						const data = await response.clone().json();
						return new Response(JSON.stringify(patchResponse(data)), response);
					} catch (e) { console.error(debugPrefix + 'fetch interceptor error', e) }
					return response;
				}),
				enumerable: true,
			});
			console.log(debugPrefix + 'window.fetch patched');
		} else console.warn(debugPrefix + 'Fetch not configurable');
	} else console.warn(debugPrefix + 'Fetch not present in window');

	function patchJQueryAjax($) {
		if (!$ || !$.ajax) return;
		const ajax = Object.getOwnPropertyDescriptor($, 'ajax');
		if (!ajax.configurable || typeof ajax.value != 'function') return;
		Object.defineProperty($, 'ajax', {
			value: function(a, b) {
				if (loggedUser.test(a?.url) && typeof a?.success == 'function') {
					console.log(debugPrefix + 'Intercepted ajax', a.url);
					const success = a.success;
					a.success = data => success(patchResponse(data));
				}
				return ajax.value.call(this, a, b);
			},
			enumerable: true,
		});
		console.log(debugPrefix + '$.ajax patched');
	}

	Object.defineProperty(unsafeWindow, 'jQuery', {
		set(jQuery) {
			Object.defineProperty(unsafeWindow, 'jQuery', { value: jQuery, enumerable: true });
			patchJQueryAjax(jQuery);
		},
		configurable: true,
		enumerable: true,
	});

	function addMuxDownloadLink(muxPlayer) {
		if (!(muxPlayer instanceof HTMLElement) || muxPlayer.tagName != 'MUX-PLAYER') {
			console.warn(debugPrefix, 'Invalid argument (Mux Player element expected)', muxPlayer);
			return;
		}
		muxPlayer.after(Object.assign(document.createElement('A'), {
			href: `https://stream.mux.com/${muxPlayer.getAttribute('playback-id')}.m3u8`,
			search: 'redundant_streams=true',
			target: '_blank',
			style: 'position: absolute; right: 20pt; bottom: -20pt; z-index: 10;',
			innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="1em" style="filter: drop-shadow(0 0 2pt grey);" viewBox="0 0 100.44 66.3"><path fill="#092444" d="M58.35 53.38c-1.76,-0.63 -5.97,0.63 -12.11,-2.36 -1.06,-0.52 -2.06,-1.39 -3.24,-1.55l-17.07 6.3c-6.29,1.55 -12.69,-1.55 -15.03,-7.23 -2.39,-5.78 -0.09,-12.96 5.58,-15.78 2.75,-1.38 5.58,-2.23 8.44,-3.36 2.63,-1.05 6.07,-2.46 8.76,-3.13 0.89,-1.18 10.88,-4.74 12.02,-3.06 1.37,0 2.21,0.14 3.43,0.66 0.52,0.21 2.34,1.12 2.73,1.42 4.79,3.82 6.67,10.31 4.19,15.12 -0.6,1.18 -0.71,1.75 -1.68,2.68 3.53,1.31 8.92,-1.41 12.25,-2.8 0.13,-1.7 0.44,0.36 0.43,-3.74 0,-1.25 0.11,-2.98 0.01,-4.16 -0.15,-1.76 -1.33,-4.83 -2.12,-6.41 -2.06,-4.11 -1.96,-3.98 -5.21,-7.25 -0.93,-0.94 -1.62,-0.8 -2.3,-2.02 -1.56,-0.07 -2.99,-1.61 -6.71,-2.74 -3.56,-1.08 -5.12,-0.63 -8.56,-0.84l-0.23 -0.41c-5.25,1.37 -26.26,8.87 -30.52,11.26 -9.92,5.56 -13.99,17.8 -9.73,28.31 4.3,10.62 15.72,16.16 26.79,13.23 4.72,-1.24 10.78,-3.76 15.44,-5.55 5.26,-2.02 9.85,-3.15 14.44,-6.59z"/><path fill="#FE5F00" d="M41.93 12.72l0.23 0.41c3.44,0.21 5,-0.24 8.56,0.84 3.72,1.13 5.15,2.67 6.71,2.74 5.48,-1.99 11.68,-4.68 17.16,-6.29 6.36,-1.87 12.76,2.03 15.08,7.89 2.29,5.77 -0.54,12.64 -6,15.4 -2.35,1.18 -5.94,2.48 -8.47,3.33 -2.83,0.94 -5.81,2.15 -8.58,3.25 -3.33,1.39 -8.72,4.11 -12.25,2.8 -1.1,0.37 -4.31,-1.26 -5.66,-2.19 -5.92,-4.09 -6.82,-11.62 -3.01,-17.69 -1.14,-1.68 -11.13,1.88 -12.02,3.06 0.03,0.54 -0.22,0.45 -0.3,1.31l0.02 6.33c0.12,0.84 0.31,0.55 0.41,1.55 0.31,2.99 2.95,8 4.82,9.84 0.47,0.46 4.37,4.16 4.37,4.17 1.18,0.16 2.18,1.03 3.24,1.55 6.14,2.99 10.35,1.73 12.11,2.36 5.52,-0.97 10.39,-3.19 15.63,-5.1 4.34,-1.58 11.05,-3.66 14.89,-5.87 9.8,-5.64 14.29,-17.97 9.86,-28.57 -4.4,-10.53 -15.98,-16 -26.98,-13.04 -4.63,1.25 -17.13,6.2 -22.9,8.36 -2.75,1.03 -4.44,2.17 -6.92,3.56z"/></svg>`,
			title: 'Video download direct link',
		}));
		console.log(debugPrefix + 'Download link added to Mux Player:', muxPlayer);
	}

	// const mo = new MutationObserver(function(ml, mo) {
	// 	for (let mutation of ml) for (let node of mutation.addedNodes)
	// 		if (node.nodeType == Node.ELEMENT_NODE && node.tagName == 'MUX-PLAYER') addMuxDownloadLink(node);
	// });
	// mo.observe(document, { childList: true, subtree: true });

	document.addEventListener('DOMContentLoaded', function documentEndListener(evt) {
		if (unsafeWindow.jQuery) patchJQueryAjax(unsafeWindow.jQuery);

		const muxPlayers = document.body.getElementsByTagName('MUX-PLAYER');
		for (let muxPlayer of muxPlayers) addMuxDownloadLink(muxPlayer);

		document.removeEventListener('DOMContentLoaded', documentEndListener);
	});
})();
