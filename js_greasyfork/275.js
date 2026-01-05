// ==UserScript==
// @name        Clone Turning Page Button in nicovideo
// @name:ja     niconico ページャーを上部にも表示
// @description Also shows the pagination on the top of Nico Live search result, Lives by Category page, and Nico Video user page.
// @description:ja ニコニコ生放送の検索結果、「放送中の番組」ページ、およびニコニコ動画のユーザーページにおいて、ページャー (ページ送りボタン) を上部にも表示します。
// @namespace   http://pc12.2ch.net/test/read.cgi/streaming/1275642556/
// @version     4.0.2
// @include     http://www.nicovideo.jp/user/*/video
// @include     http://www.nicovideo.jp/user/*/video/*
// @include     http://www.nicovideo.jp/user/*/video?*
// @include     http://www.nicovideo.jp/user/*/video#*
// @include     http://www.nicovideo.jp/user/*/stamp
// @include     http://www.nicovideo.jp/user/*/stamp/*
// @include     http://www.nicovideo.jp/user/*/stamp?*
// @include     http://www.nicovideo.jp/user/*/stamp#*
// @include     http://www.nicovideo.jp/my/video
// @include     http://www.nicovideo.jp/my/video/*
// @include     http://www.nicovideo.jp/my/video?*
// @include     http://www.nicovideo.jp/my/video#*
// @include     http://www.nicovideo.jp/my/stamp
// @include     http://www.nicovideo.jp/my/stamp/*
// @include     http://www.nicovideo.jp/my/stamp?*
// @include     http://www.nicovideo.jp/my/stamp#*
// @include     http://live.nicovideo.jp/search/*
// @include     http://live.nicovideo.jp/search?*
// @include     http://live.nicovideo.jp/recent
// @include     http://live.nicovideo.jp/recent/*
// @include     http://live.nicovideo.jp/recent?*
// @include     http://live.nicovideo.jp/recent#*
// @include     http://watch.live.nicovideo.jp/search/*
// @include     http://watch.live.nicovideo.jp/search?*
// @include     https://www.nicovideo.jp/user/*/video
// @include     https://www.nicovideo.jp/user/*/video/*
// @include     https://www.nicovideo.jp/user/*/video?*
// @include     https://www.nicovideo.jp/user/*/video#*
// @include     https://www.nicovideo.jp/user/*/stamp
// @include     https://www.nicovideo.jp/user/*/stamp/*
// @include     https://www.nicovideo.jp/user/*/stamp?*
// @include     https://www.nicovideo.jp/user/*/stamp#*
// @include     https://www.nicovideo.jp/my/video
// @include     https://www.nicovideo.jp/my/video/*
// @include     https://www.nicovideo.jp/my/video?*
// @include     https://www.nicovideo.jp/my/video#*
// @include     https://www.nicovideo.jp/my/stamp
// @include     https://www.nicovideo.jp/my/stamp/*
// @include     https://www.nicovideo.jp/my/stamp?*
// @include     https://www.nicovideo.jp/my/stamp#*
// @include     https://live.nicovideo.jp/search/*
// @include     https://live.nicovideo.jp/search?*
// @include     https://live.nicovideo.jp/recent
// @include     https://live.nicovideo.jp/recent/*
// @include     https://live.nicovideo.jp/recent?*
// @include     https://live.nicovideo.jp/recent#*
// @include     https://watch.live.nicovideo.jp/search/*
// @include     https://watch.live.nicovideo.jp/search?*
// @require     https://greasyfork.org/scripts/17895/code/polyfill.js?version=114170
// @require     https://greasyfork.org/scripts/17896/code/start-script.js?version=112958
// @license     Mozilla Public License Version 2.0 (MPL 2.0); https://www.mozilla.org/MPL/2.0/
// @compatible  Firefox
// @compatible  Opera
// @compatible  Chrome
// @grant       dummy
// @run-at      document-start
// @icon        data:image/vnd.microsoft.icon;base64,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
// @author      100の人
// @homepage    https://greasyfork.org/scripts/275
// @downloadURL https://update.greasyfork.org/scripts/275/niconico%20%E3%83%9A%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC%E3%82%92%E4%B8%8A%E9%83%A8%E3%81%AB%E3%82%82%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/275/niconico%20%E3%83%9A%E3%83%BC%E3%82%B8%E3%83%A3%E3%83%BC%E3%82%92%E4%B8%8A%E9%83%A8%E3%81%AB%E3%82%82%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
'use strict';

if (location.pathname.startsWith('/search')) {
	// ニコニコ生放送 検索結果
	startScript(
		function () {
			let pager = document.getElementsByClassName('result-pager-area')[0];
			console.log(pager);
			if (pager) {
				// 41件以上ヒットしていれば
				// ページャーの複製
				document.getElementsByClassName('result-list')[0].before(pager.cloneNode(true));
			}
		},
		parent => parent.localName === 'main',
		target => target.classList.contains('search-result-context-area'),
		() => document.getElementsByClassName('search-result-context-area')[0]
	);
} else if (location.pathname.startsWith('/recent')) {
	// ニコニコ生放送 放送中の番組
	startScript(
		function () {
			clonePager();
			new MutationObserver(function (mutations) {
				if (mutations[0].addedNodes.length > 1) {
					// ページャーの複製でなければ
					clonePager();
				}
			}).observe(document.getElementById('onair_stream_list'), { childList: true });
			function clonePager() {
				document.getElementsByClassName('user-programs')[0].before(document.getElementById('pager-block').cloneNode(true));
			}
		},
		parent => parent.id === 'onair_stream_list',
		target => target.id === 'pager-block',
		() => document.getElementById('pager-block')
	);
} else if (/^\/(?:user\/[0-9]+|my)\/video(?:\/|\?|#|$)/.test(location.pathname)) {
	// ニコニコ動画 ユーザーページ 投稿動画
	startScript(
		function () {
			let pager = document.getElementsByClassName('pager')[0];
			if (pager) {
				document.head.insertAdjacentHTML('beforeend', `<style>
					.outer .pager {
						position: absolute;
						bottom: 0;
						right: 0;
					}
				</style>`);
				document.getElementsByClassName('outer')[0].append(pager.cloneNode(true));
			}
		},
		parent => parent.classList.contains('wrapper'),
		target => target.localName === 'script',
		() => document.querySelector('.wrapper > script')
	);
} else if (/^\/(?:user\/[0-9]+|my)\/stamp(?:\/|\?|#|$)/.test(location.pathname)) {
	// ニコニコ動画 ユーザーページ スタンプ帳
	document.addEventListener('load', function (event) {
		if (event.target.localName === 'script' && event.target.src.includes('jquery')) {
			let script = document.createElement('script');
			script.text = '(' + function () {
				jQuery.prototype.html = new Proxy(jQuery.prototype.html, {
					apply(target, thisArg, argumentsList) {
						var returnValue = target.apply(thisArg, argumentsList);
						if (thisArg.selector === '#stamp_list') {
							var pager = document.getElementsByClassName('pager')[0];
							if (pager) {
								thisArg[0].insertBefore(pager.parentElement.cloneNode(true), thisArg[0].firstChild);
							}
						}
						return returnValue;
					}
				});
			}.toString() + ')()';
			document.head.appendChild(script).remove();
		}
	}, true);
}

})();
