// ==UserScript==
// @name        Niconama Prevent 184 Forcing
// @name:ja     ニコニコ生放送　強制184を回避
// @description On comment posting in Niconama, Prevents the forced disabling of name tag (184/anonymous comments). It works when the player is loaded, so it is possible to temporarily disable the name tag and post.
// @description:ja ニコニコ生放送のコメント投稿において、なふだ表示が強制的に無効化される (184/匿名コメントになる) のを回避します。プレイヤーが読み込まれたタイミングで動作するので、一時的になふだ表示を無効して投稿することも可能です。
// @namespace   https://greasyfork.org/users/137
// @version     1.1.0
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
// @downloadURL https://update.greasyfork.org/scripts/474267/Niconama%20Prevent%20184%20Forcing.user.js
// @updateURL https://update.greasyfork.org/scripts/474267/Niconama%20Prevent%20184%20Forcing.meta.js
// ==/UserScript==

'use strict';

new MutationObserver(function (mutations, observer) {
	if (mutations.every(
		mutation => mutation.target.nodeName !== 'svg' || !mutation.target.className.baseVal.includes('command-status'),
	)) {
		return;
	}

	observer.disconnect();

	const commentPostForm = document.querySelector('[class*="comment-post-form');
	if (!commentPostForm
		|| commentPostForm.querySelector('[class*="user-thumbnail-area"]')
		|| commentPostForm.comment.placeholder === '匿名解除中') { // チャンネル生放送
		// なふだ表示が有効なら
		return;
	}

	new MutationObserver(function (mutations, observer) {
		observer.disconnect();
		// なふだ表示を有効化
		commentPostForm.querySelector('[class*="anonymous-comment-post-toggle-button-field"] button').click();
	}).observe(commentPostForm.querySelector('[class*="command-tool"]'), { childList: true });

	// コマンド欄へフォーカスし、ポップアップを開く
	commentPostForm.command.focus();
	commentPostForm.comment.focus();
	commentPostForm.comment.blur();
}).observe(document.getElementById('root'), { childList: true, subtree: true });
