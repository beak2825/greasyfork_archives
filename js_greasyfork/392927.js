// ==UserScript==
// @name        Twitter Middle Clicks
// @name:en     X/Twitter Middle Clicks
// @name:ja     X/Twitter 中クリック
// @description This script makes it possible to open a quoted post, a trend, a link in post input form, an input complement, or an image on the image dialog into a new tab by middle click.
// @description:ja 引用されたポスト、トレンド、ポスト本文入力欄のリンク、入力補完、画像ダイアログの画像を中クリックして新規タブで開けるようにします。
// @namespace   https://greasyfork.org/users/137
// @version     1.5.0
// @match       https://twitter.com/*
// @match       https://x.com/*
// @exclude     https://twitter.com/*/tos*
// @exclude     https://twitter.com/*/privacy*
// @exclude     https://twitter.com/i/cards/*
// @license     MPL-2.0
// @contributionURL https://github.com/sponsors/esperecyan
// @compatible  Edge
// @compatible  Firefox Firefoxを推奨 / Firefox is recommended
// @compatible  Opera
// @compatible  Chrome
// @grant       dummy
// @run-at      document-start
// @icon        https://abs.twimg.com/favicons/twitter.ico
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/392927
// @downloadURL https://update.greasyfork.org/scripts/392927/Twitter%20Middle%20Clicks.user.js
// @updateURL https://update.greasyfork.org/scripts/392927/Twitter%20Middle%20Clicks.meta.js
// ==/UserScript==

'use strict';

addEventListener('mouseup', function (event) { // Firefox、Google Chromeは、auxclickがリンク上でしか動作しない不具合がある
	if (event.button !== 1 || event.detail !== 0 || event.target.closest('a')) {
		// 中クリックでない、ダブルクリック、またはリンクのクリックなら
		return;
	}

	if (event.target.localName === 'img' && event.target.matches('[data-testid="swipe-to-dismiss"] *')) {
		// 画像ダイアログの画像
		open(event.target.src);
		return;
	}

	if (event.target.dataset.text) {
		if (!event.target.parentElement.parentElement.style.color) {
			return;
		}

		// ポスト本文入力欄のリンク
		let url;
		const content = event.target.textContent;
		if (content.startsWith('@')) {
			url = '/' + content.replace('@', '');
		} else if (content.startsWith('#')) {
			// ハッシュタグ
			url = '/hashtag/' + encodeURIComponent(content.replace('#', ''));
		} else if (content.startsWith('$')) {
			// キャッシュタグ
			url = '/search?q=' + encodeURIComponent(content);
		} else {
			try {
				new URL(content);
			} catch (exception) {
				if (exception.name !== 'TypeError') {
					throw exception;
				}
				// ドメイン
				url = 'http://' + content;
			}

			if (!url) {
				// URL
				url = content;
			}
		}
		open(url);
		return;
	}

	const option = event.target.closest('[role="option"]');
	if (option) {
		// ポスト本文入力欄、または検索窓の入力補完
		let url;
		if (option.querySelector('[data-testid="TypeaheadUser"]')) {
			// ユーザー
			url = '/' + option.querySelectorAll('[dir="ltr"]')[2].textContent.replace('@', '');
		} else {
			let content = option.querySelector('[dir="ltr"]').textContent;
			const searchForm = option.closest('[role="search"]');
			if (searchForm) {
				// 検索窓
				const searchTerms = searchForm.querySelector('[role="combobox"]').value;
				switch (content) {
					case `「${searchTerms}」を検索`:
						content = searchTerms;
						break;
					case `@${searchTerms}さんのプロフィール`:
						url = '/' + searchTerms.replace('@', '');
						break;
				}
			}
			if (!url) {
				url = content.startsWith('#')
					? '/hashtag/' + encodeURIComponent(content.replace('#', '')) // ハッシュタグ
					: '/search?q=' + encodeURIComponent(content); // Xの検索窓では空白が「+」ではなく「%20」に置き換わる
			}
		}
		open(url);
		return;
	}

	// Ctrl + 主クリック
	const init = {};
	for (const key in event) {
		init[key] = event[key];
	}
	init.button = 0;
	init.ctrlKey = true;
	if (!event.target.dispatchEvent(new MouseEvent('click', init))) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}
}, true);
