// ==UserScript==
// @name        ニコ生ゲーム中のシークバー移動を防止
// @description 追っかけ配信ではない、かつ再生中、かつニコ生ゲーム中の場合に、シークバー移動をブロックすることで、意図せず追っかけ配信へ切り替わってしまう問題に対処します。
// @namespace   https://greasyfork.org/users/137
// @version     1.2.0
// @match       https://live.nicovideo.jp/watch/lv*
// @license     MPL-2.0
// @contributionURL https://www.amazon.co.jp/registry/wishlist/E7PJ5C3K7AM2
// @compatible  Edge
// @compatible  Firefox 推奨
// @compatible  Opera
// @compatible  Chrome
// @grant       dummy
// @noframes
// @icon        https://nicolive.cdn.nimg.jp/relive/party1-static/images/common/favicon.3cf1c.ico
// @author      100の人
// @homepageURL https://greasyfork.org/users/137
// @downloadURL https://update.greasyfork.org/scripts/425024/%E3%83%8B%E3%82%B3%E7%94%9F%E3%82%B2%E3%83%BC%E3%83%A0%E4%B8%AD%E3%81%AE%E3%82%B7%E3%83%BC%E3%82%AF%E3%83%90%E3%83%BC%E7%A7%BB%E5%8B%95%E3%82%92%E9%98%B2%E6%AD%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/425024/%E3%83%8B%E3%82%B3%E7%94%9F%E3%82%B2%E3%83%BC%E3%83%A0%E4%B8%AD%E3%81%AE%E3%82%B7%E3%83%BC%E3%82%AF%E3%83%90%E3%83%BC%E7%A7%BB%E5%8B%95%E3%82%92%E9%98%B2%E6%AD%A2.meta.js
// ==/UserScript==

'use strict';

const SEEK_CONTROLLERS_SELECTOR = '[class*="seek-controller"], [class*="head-button"], [class*="back-button"]';

document.head.insertAdjacentHTML('beforeend', `<style>
	:is(${SEEK_CONTROLLERS_SELECTOR})[aria-disabled="true"]::after {
		content: "";
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		cursor: not-allowed;
	}
</style>`);

const seekControllers = document.querySelectorAll(SEEK_CONTROLLERS_SELECTOR);
const playButton = document.querySelector('[class*="play-button"]');
let liveStatus = document.querySelector('[data-live-status]');
const lockItemArea = document.querySelector('[class*="lock-item-area"]');

function switchEnabled()
{
	const ariaDisabled = /* 追っかけ再生中ではない */ liveStatus.dataset.liveStatus === 'live'
		&& /* 再生中 */ playButton.dataset.toggleState === 'true'
		&& /* ゲーム中 */ lockItemArea.querySelector('[data-content-type="game"], [data-content-type="akasha"]')
		? 'true'
		: 'false';
	for (const controller of seekControllers) {
		controller.setAttribute('aria-disabled', ariaDisabled);
	}
}

new Promise(function (resolve) {
	if (liveStatus) {
		resolve();
		return;
	}

	new MutationObserver(function (mutations, observer) {
		liveStatus = document.querySelector('[data-live-status]');
		if (liveStatus) {
			observer.disconnect();
			resolve();
		}
	}).observe(document.querySelector('[class*="time-status-area"]'), { childList: true });
}).then(function () {
	switchEnabled();
	new MutationObserver(switchEnabled).observe(liveStatus, { attributeFilter: [ 'data-live-status' ] });
	new MutationObserver(switchEnabled).observe(playButton, { attributeFilter: [ 'data-toggle-state' ] });
	new MutationObserver(switchEnabled).observe(lockItemArea, { childList: true });
});
