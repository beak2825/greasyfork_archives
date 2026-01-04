// ==UserScript==
// @name        Twitter Original Image Link
// @name:ja     X/Twitter 原寸画像リンク
// @description Simple script that replace an image link with an original image URL if you click links on Tweet for navigating the image on new tab or copying the URL.
// @description:ja ツイート上の画像をクリックしたとき (新しいタブで開く・URLのコピー) に、画像のリンクを原寸画像のURLに置換する軽量スクリプトです。
// @namespace   https://greasyfork.org/users/137
// @version     2.1.0
// @match       https://x.com/*
// @match       https://pro.x.com/*
// @match       https://pro.twitter.com/*
// @license     MPL-2.0
// @contributionURL https://github.com/sponsors/esperecyan
// @compatible  Edge
// @compatible  Firefox Firefoxを推奨 / Firefox is recommended
// @compatible  Opera
// @compatible  Chrome
// @grant       dummy
// @run-at      document-start
// @icon        https://abs.twimg.com/favicons/twitter.3.ico
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/392845
// @downloadURL https://update.greasyfork.org/scripts/392845/Twitter%20Original%20Image%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/392845/Twitter%20Original%20Image%20Link.meta.js
// ==/UserScript==

'use strict';

const tweetDeck = location.origin !== 'https://x.com';

function replaceImageLink(event)
{
	/** @type {HTMLElement} */
	const target = event.target;

	const localName = target.localName;
	if (tweetDeck ? localName !== 'a' || event.target.rel !== 'mediaPreview' : localName !== 'img') {
		return;
	}

	/** @type {HTMLAnchorElement} */
	const anchor = tweetDeck
		? target
		: event.target.closest('[href$="/photo/1"], [href$="/photo/2"], [href$="/photo/3"], [href$="/photo/4"]');
	if (!tweetDeck && (!anchor || !anchor.matches('article *'))) {
		return;
	}

	const url = new URL(tweetDeck ? /https:\/\/[^"]+/.exec(target.style.backgroundImage)[0] : event.target.src);
	if (tweetDeck) {
		const result = /\.([a-z]{3})$/.exec(url.pathname);
		if (result) {
			url.searchParams.set('format', result[1]);
		}
	}
	url.searchParams.set('name', 'orig');
	anchor.href = url;
}

addEventListener('click', replaceImageLink, true);
addEventListener('auxclick', replaceImageLink, true);
