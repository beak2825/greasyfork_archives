// ==UserScript==
// @name        pixiv ツリー型コメント
// @name:ja     pixiv スタンプを削除
// @name:en     pixiv Stamp Eraser
// @description Deletes stamps on comment sections. In addition, changes the comment section’s default linear mode to threaded mode on comment sections in group pages.
// @description:ja コメント欄のスタンプを削除します。また、グループ機能において、返信コメントを返信先の下に移動します。
// @namespace   https://greasyfork.org/users/137
// @version     5.2.0
// @match       https://www.pixiv.net/*
// @require     https://greasyfork.org/scripts/17896/code/start-script.js?version=112958
// @license     MPL-2.0
// @contributionURL https://github.com/sponsors/esperecyan
// @compatible  Edge
// @compatible  Firefox 推奨 (Recommended)
// @compatible  Opera
// @compatible  Chrome
// @grant       dummy
// @noframes
// @run-at      document-start
// @icon        https://www.pixiv.net/favicon.ico
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/5291
// @downloadURL https://update.greasyfork.org/scripts/5291/pixiv%20%E3%83%84%E3%83%AA%E3%83%BC%E5%9E%8B%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/5291/pixiv%20%E3%83%84%E3%83%AA%E3%83%BC%E5%9E%8B%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88.meta.js
// ==/UserScript==

/*global startScript */

'use strict';

class StampEraser
{
	constructor()
	{
		const root = document.getElementById('root');
		if (!root) {
			return;
		}

		new MutationObserver(mutations => {
			for (const mutation of mutations) {
				const commentListParentSelector = 'main h2 ~ div:nth-of-type(2)';
				if (!mutation.target.matches(`${commentListParentSelector},
					${commentListParentSelector} > ul, ${commentListParentSelector} > ul *`)) {
					continue;
				}

				for (const element of mutation.addedNodes) {
					switch (element.localName) {
						case 'ul':
							this.hideStampComments(element);
							break;
						case 'li':
							this.hideIfStamp(element);
							break;
					}
				}
			}
		}).observe(root, {childList: true, subtree: true});
	}

	/**
	 * コメントリストからスタンプを削除します。
	 * @access private
	 * @param {HTMLLIElement} comment
	 */
	hideStampComments(commentList)
	{
		for (const comment of Array.from(commentList.children)) {
			this.hideIfStamp(comment);
		}
	}

	/**
	 * スタンプコメント、または絵文字単体のコメントであれば削除します。
	 * @access private
	 * @param {HTMLLIElement} comment
	 */
	hideIfStamp(comment)
	{
		let ul, stamp, emoji;
		if (!comment.hidden
			&& (!(ul = comment.getElementsByTagName('ul')[0]) || ul.hidden)
			&& ((stamp = comment.querySelector('div[style*="/stamp/"]')) && !ul?.contains(stamp)
				|| (emoji = comment.querySelector('img[src*="/emoji/"]')) && !ul?.contains(emoji)
					&& !emoji.previousSibling && !emoji.nextSibling)) {
			// 返信が存在しない、かつスタンプコメントか絵文字単体のコメントであれば
			if (comment.matches('ul ul li')) {
				// 返信コメントであれば
				const list = comment.parentElement;
				const parentComment = list.closest('li');
				if (comment.parentElement.querySelectorAll('li:not([hidden])').length === 1) {
					// 他に返信が存在しなければ
					list.hidden = true;
					this.hideIfStamp(parentComment);
				} else {
					comment.hidden = true;
				}
				return;
			}

			comment.hidden = true;
		}
	}
}

function main()
{
	document.head.insertAdjacentHTML('beforeend', `<style>
		/*====================================
			グループのコメント欄
		*/
		/*------------------------------------
			区切り線
		*/
		#page-group #timeline li.post div.comment div.post,
		#page-group #timeline li.post div.comment div.post ~ div.post {
			border-top: dashed 1px #DEE0E8;
			border-bottom: none;
		}
		#page-group #timeline li.post div.comment div.post::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			border-top: dashed 1px #FFFFFF;
		}
		#page-group #timeline li.post div.comment {
			border-bottom: dashed 1px #DEE0E8;
		}
		/*------------------------------------
			最初のコメント
		*/
		#page-group #timeline li.post div.comment > div.post:first-of-type,
		#page-group #timeline li.post div.comment > .tree:first-of-type > div.post:first-of-type,
		#page-group #timeline li.post div.comment > div.post:first-child::before,
		#page-group #timeline li.post div.comment > .tree:first-child > div.post:first-of-type::before {
			/* 一番上のコメント */
			/* 「以前のコメントを見る」ボタンがある時は、白色の破線は消さない */
			border-top: none;
		}
		/*------------------------------------
			返信コメント
		*/
		#page-group #timeline li.post div.comment .tree > :nth-of-type(n+2) {
			margin-left: 2em;
		}
		#page-group #timeline li.post div.comment .tree .postbody {
			width: initial;
		}
	</style>`);

	/**
	 * コメントリスト要素。
	 * @type {HTMLDivElement}
	 */
	const commentList = document.getElementById('timeline');

	/**
	 * {@link MutationObserver#observe}の第2引数に指定するオブジェクト。
	 * @type {MutationObserverInit}
	 */
	const observerOptions = {
		childList: true,
		subtree: true,
	};

	moveAllReplyComments();

	// コメントの増減を監視する
	new MutationObserver(function (mutations, observer) {
		const firstMutationRecord = mutations[0];
		const firstAddedNode = firstMutationRecord.addedNodes[0];
		if (firstAddedNode) {
			// コメントが増えていれば
			// 監視を一旦停止して返信コメントを移動する
			observer.disconnect();
			moveAllReplyComments();
			observer.observe(commentList, observerOptions);
		}
	}).observe(commentList, observerOptions);

	/**
	 * すべての返信コメントを返信先コメントの下に移動します。
	 */
	function moveAllReplyComments()
	{
		const repliedUserNames = document.querySelectorAll('.body > p > a');
		for (let i = repliedUserNames.length - 1; i >= 0; i--) {
			/**
			 * 返信先コメント投稿者名。
			 * @type {HTMLSpanElement}
			 */
			const repliedUserName = repliedUserNames[i];

			/**
			 * 返信先コメント。
			 * @type {?HTMLDivElement}
			 */
			const repliedComment = document.getElementById(repliedUserName.hash.replace('#', ''));

			if (repliedComment) {
				// 返信先コメントが存在すれば
				moveReplyComment(repliedComment, repliedUserName.closest('.post'));
				// 返信先コメント投稿者名を削除
				repliedUserName.parentElement.remove();
			}
		}
	}

	/**
	 * 返信コメントを返信先コメントの下に移動します。
	 * @param {HTMLDivElement} repliedComment - 返信先コメント。
	 * @param {HTMLDivElement} replyComment - 返信コメント。
	 */
	function moveReplyComment(repliedComment, replyComment)
	{
		if (!replyComment.previousElementSibling) {
			const parent = replyComment.parentNode;
			if (parent && parent.classList.contains('tree')) {
				// 返信コメントにラッパー要素が存在すれば
				replyComment = parent;
			}
		}

		/**
		 * 返信先コメントと返信コメントを格納するラッパー要素。
		 * @type {HTMLDivElement}
		 */
		let tree = null;
		if (!repliedComment.previousElementSibling) {
			const parent = repliedComment.parentNode;
			if (parent.classList.contains('tree')) {
				// ラッパー要素がすでに存在すれば
				tree = parent;
			}
		}

		if (!tree) {
			// ラッパー要素が存在しなければ
			// ラッパー要素を作成
			tree = document.createElement('div');
			tree.classList.add('tree');
			// 返信先コメントをラッパー要素に置換
			repliedComment.replaceWith(tree);
			// 返信先コメントをラッパーに追加
			tree.append(repliedComment);
		}

		// 返信コメント移動
		tree.append(replyComment);
	}
}

if (location.pathname.startsWith('/group/')) {
	startScript(
		main,
		parent => parent.id === 'wrapper',
		target => target.id === 'template-drawr-paint-ui',
		() => document.getElementById('template-drawr-paint-ui'),
	);
} else {
	document.addEventListener('DOMContentLoaded', function () {
		new StampEraser();
	}, { passive: true, once: true });
}
