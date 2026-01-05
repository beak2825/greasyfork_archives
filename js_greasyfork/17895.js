// ==UserScript==
// @name        polyfill (削除予定)
// @description 廃止された URL.createFor() を使用するスクリプト向けの一時的なライブラリ。もともとMicrosoft Edge、Firefox、Opera、Google Chrome向けの複数のpolyfillを実装したライブラリでした。
// @version     2.0.0
// @license     Mozilla Public License Version 2.0 (MPL 2.0); https://www.mozilla.org/MPL/2.0/
// @compatible  Edge
// @compatible  Firefox
// @compatible  Opera
// @compatible  Chrome
// @author      100の人
// @homepage    https://greasyfork.org/scripts/17895
// ==/UserScript==

'use strict';

if (!('createFor' in URL)) {
	/**
	 * 分をミリ秒に変換するときの乗数。
	 * @constant {number}
	 */
	const MINUTES_TO_MILISECONDS = 60 * 1000;

	/**
	 * Blob URL を自動破棄するまでのミリ秒数。
	 * @constant {number}
	 */
	const MAX_LIFETIME = 10 * MINUTES_TO_MILISECONDS;

	/**
	 * Blob URLを生成し、{@link MAX_LIFETIME}ミリ秒後に破棄します。
	 * @see [Remove createFor() · Issue #57 · w3c/FileAPI]{@link https://github.com/w3c/FileAPI/issues/57}
	 * @see [Bug 1062917 - Implement URL.createFor]{@link https://bugzilla.mozilla.org/show_bug.cgi?id=1062917}
	 * @see [Issue 608460 - chromium - Consider implementing URL.createFor() - Monorail]{@link https://bugs.chromium.org/p/chromium/issues/detail?id=608460}
	 * @param {Blob} blob
	 * @returns {string} Blob URL。
	 */
	URL.createFor = function (blob) {
		const url = this.createObjectURL(blob);
		window.setTimeout(() => this.revokeObjectURL(url), MAX_LIFETIME);
		return url;
	};
}
