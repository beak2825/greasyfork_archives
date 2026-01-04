// ==UserScript==
// @name         TVerの関連エピソードのリンクを自動コピー
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  TVerの関連エピソードのリンクをリスト形式でクリップボードにコピーする。
// @author       urabeat
// @match        https://tver.jp/episodes/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/474786/TVer%E3%81%AE%E9%96%A2%E9%80%A3%E3%82%A8%E3%83%94%E3%82%BD%E3%83%BC%E3%83%89%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%87%AA%E5%8B%95%E3%82%B3%E3%83%94%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/474786/TVer%E3%81%AE%E9%96%A2%E9%80%A3%E3%82%A8%E3%83%94%E3%82%BD%E3%83%BC%E3%83%89%E3%81%AE%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%87%AA%E5%8B%95%E3%82%B3%E3%83%94%E3%83%BC.meta.js
// ==/UserScript==
(function() {
'use strict';
// ===ユーザー設定領域===
// 待ち時間_wait(秒数)を設定する。
const _wait = 3;
// ======================

const sleep = second => new Promise(resolve => setTimeout(resolve, second * 1000));

const getURLs = () => document.querySelectorAll('[class^="episode-row_container"]');
const createURLList = () =>
	Object.values(getURLs()).reduce((text, item) => {
		const _url = item.href;
		return `${text}${_url}\n`;
	}, '');
const outputText = text => {
    GM_setClipboard(text);
	return console.log(text, '\"以上の内容をクリップボードにコピーしました。\"');
};

async function work(wait) {
    await sleep(wait);
    outputText(createURLList());
}

work(_wait);
})();