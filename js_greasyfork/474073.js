// ==UserScript==
// @name            talk.jp外部リンク遷移ページ自動スキップ
// @name:en         talk.jp external link transition page autoskip
// @version         1.0.0
// @license         MIT License
// @description     talk.jpの外部リンク遷移ページを自動でスキップします。
// @description:en  Automatically skip external link transition page on talk.jp.
// @match           http://talk.jp/c?*
// @match           https://talk.jp/c?*
// @namespace       https://greasyfork.org/users/1160382
// @downloadURL https://update.greasyfork.org/scripts/474073/talkjp%E5%A4%96%E9%83%A8%E3%83%AA%E3%83%B3%E3%82%AF%E9%81%B7%E7%A7%BB%E3%83%9A%E3%83%BC%E3%82%B8%E8%87%AA%E5%8B%95%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97.user.js
// @updateURL https://update.greasyfork.org/scripts/474073/talkjp%E5%A4%96%E9%83%A8%E3%83%AA%E3%83%B3%E3%82%AF%E9%81%B7%E7%A7%BB%E3%83%9A%E3%83%BC%E3%82%B8%E8%87%AA%E5%8B%95%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97.meta.js
// ==/UserScript==

var url = window.location.href;

if (url.indexOf('http://talk.jp/c?') > -1) {
	location.href = url.replace('http://talk.jp/c?', '');
} else {
	location.href = url.replace('https://talk.jp/c?', '');
}