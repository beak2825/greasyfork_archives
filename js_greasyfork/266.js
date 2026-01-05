// ==UserScript==
// @name        pixiv コメントを展開
// @name:ja     pixiv コメントを展開
// @name:en     pixiv Comment Expander
// @description Expands pixiv comments. Always shows all comments (and replies).
// @description:ja コメント (+ 返信) を常に全件表示します。
// @namespace   http://userscripts.org/users/347021
// @version     2.10.0
// @match       https://www.pixiv.net/*
// @require     https://greasyfork.org/scripts/19616/code/utilities.js?version=895049
// @require     https://greasyfork.org/scripts/17896/code/start-script.js?version=112958
// @license     MPL-2.0
// @contributionURL https://github.com/sponsors/esperecyan
// @compatible  Edge
// @compatible  Firefox Firefoxを推奨 / Firefox is recommended
// @compatible  Opera
// @compatible  Chrome
// @grant       dummy
// @noframes
// @run-at      document-start
// @icon        https://s.pximg.net/common/images/apple-touch-icon.png
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/266
// @downloadURL https://update.greasyfork.org/scripts/266/pixiv%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%92%E5%B1%95%E9%96%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/266/pixiv%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%82%92%E5%B1%95%E9%96%8B.meta.js
// ==/UserScript==

/*global startScript, GreasemonkeyUtils */

'use strict';

new class CommentExpander
{
	/**
	 * 1回のコメント取得数制限。
	 * @constant {number}
	 */
	static get LIMIT() {return 200;}

	constructor()
	{
		startScript(
			() => GreasemonkeyUtils.executeOnUnsafeContext(this.changeLimit, [CommentExpander.LIMIT]),
			parent => parent.localName === 'html',
			target => target.localName === 'head',
			() => document.head,
		);

		document.addEventListener('DOMContentLoaded', () => {
			this.expandReplies();
		}, {once: true});
	}

	//eslint-disable-next-line no-redeclare
	/*global fetch:true */
	/**
	 * ページ側のコンテキストで実行してコメント取得数を変更する関数。
	 * @param {number} limit
	 */
	changeLimit(limit)
	{
		let offset;
		fetch = new Proxy(fetch, {
			apply(fetch, thisArgument, argumentList)
			{
				if (!(argumentList[0] instanceof Request)) {
					argumentList[0] = new URL(argumentList[0], location);
					if (argumentList[0].pathname.endsWith('/comments/roots')) {
						const params = argumentList[0].searchParams;
						if (Number.parseInt(params.get('offset')) === 0) {
							offset = 0;
						}
						params.set('offset', offset);
						params.set('limit', limit);
						offset += limit;
					}
				}
				return Reflect.apply(fetch, thisArgument, argumentList);
			},
		});
	}

	/**
	 * すべての返信を展開します。
	 * @access private
	 */
	expandReplies()
	{
		const topSideMenuBody = document.getElementsByClassName('__top_side_menu_body')[0];

		new MutationObserver(mutations => {
			for (const mutation of mutations) {
				if (mutation.target.parentElement.matches(
					'main h2 ~ div:nth-of-type(2) > ul [class^="ChildCommentList_showMoreButtonContainer__"] button',
				)) {
					// 「以前の返信を見る」の展開
					mutation.target.parentElement.click();
				}
			}
		}).observe(topSideMenuBody, {characterData: true, subtree: true});

		new MutationObserver(mutations => {
			for (const mutation of mutations) {
				if (!mutation.target.matches('main h2 ~ div:nth-of-type(2)')) {
					continue;
				}

				const list = Array.from(mutation.addedNodes).find(node => node.localName === 'ul');
				if (list) {
					this.watchAndClickButtons(list);
					return;
				}
			}
		}).observe(topSideMenuBody, {childList: true, subtree: true});
	}

	/**
	 * 指定された要素の子の追加を監視し、要素内のすべてのボタンを押します。
	 * @access private
	 * @param {HTMLUListElement} element
	 */
	watchAndClickButtons(element)
	{
		this.clickButtons(element);
		new MutationObserver(mutations => {
			for (const mutation of mutations) {
				for (const element of mutation.addedNodes) {
					this.clickButtons(element);
				}
			}
		}).observe(element, {childList: true});
	}

	/**
	 * 指定された要素内のすべてのボタンを押します。
	 * @access private
	 * @param {(HTMLUListElement|HTMLLIElement)} element
	 */
	clickButtons(element)
	{
		for (const button of element.querySelectorAll('[class^="ChildCommentList_showMoreButtonContainer__"] button')) {
			button.click();
		}
	}
}();
