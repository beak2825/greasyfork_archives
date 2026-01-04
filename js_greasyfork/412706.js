// ==UserScript==
// @name pixiv Comments Section Space Saving
// @namespace https://greasyfork.org/users/137
// @version 5.4.0
// @description Reduces margins and adds horizontal lines to reflect previous layout.
// @author 100の人
// @homepageURL https://greasyfork.org/scripts/412706
// @license MPL-2.0
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https://www\.pixiv\.net/(?:artworks/[0-9]+(?:[?#].*)?|novel/show\.php\?(?:[^#]*&)?id=[0-9]+(?:[&#].*)?))$/
// @downloadURL https://update.greasyfork.org/scripts/412706/pixiv%20Comments%20Section%20Space%20Saving.user.js
// @updateURL https://update.greasyfork.org/scripts/412706/pixiv%20Comments%20Section%20Space%20Saving.meta.js
// ==/UserScript==

(function() {
let css = `@namespace url(http://www.w3.org/1999/xhtml);

	/*====================================
		コメント欄
	*/
	main h2 ~ div:nth-of-type(2) > ul {
		--pixiv-border-width: 1px;
		--pixiv-border-style: solid;
		--pixiv-border-color: #D6DEE5;
		--comment-padding: 0.2em;
		--meta-line-height: 16px;
		--pixiv-color: #333;
		--author-comment-background: lavenderblush;
	}

	.fKkgNY ~ * main h2 ~ div:nth-of-type(2) > ul {
		/* ダークテーマ */
		--pixiv-color: white;
		--author-comment-background: #666065;
	}
	
	/*------------------------------------
		余白を修正
	*/
	#root main h2 ~ div:nth-of-type(2) li {
		margin-top: unset;
		margin-bottom: unset;
	}
	
	main h2 ~ div:nth-of-type(2) > ul > li > div > div > div:nth-of-type(1),
	main h2 ~ div:nth-of-type(2) li li > div /* 返信コメント */ {
		position: relative;
		padding: var(--comment-padding);
		padding-bottom: calc(var(--comment-padding) + var(--pixiv-border-width));
		border: var(--pixiv-border-width) var(--pixiv-border-color);
		border-top-style: var(--pixiv-border-style);
		margin-top: calc(var(--pixiv-border-width) * -1);
	}
	
	main h2 ~ div:nth-of-type(2) > ul > li:last-of-type {
		border-bottom: var(--pixiv-border-width) var(--pixiv-border-style) var(--pixiv-border-color);
	}
	
	main h2 ~ div:nth-of-type(2) :is(li > div > div, li li) > div:nth-of-type(1) > div:nth-of-type(2) {
		display: grid;
		grid-template:
			"name date"
			"body body"
			/ max-content 1fr;
		grid-column-gap: 0.5em;
	}
	
	main h2 ~ div:nth-of-type(2) :is(li > div > div, li li) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) {
		grid-area: name;
	}
	
	main h2 ~ div:nth-of-type(2) :is(li > div > div, li li) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2) {
		grid-area: body;
		margin-top: unset;
		width: 100%;    /* 長い単語等が含まれていると親からはみ出る問題に対処 */
	}
	
	main h2 ~ div:nth-of-type(2) :is(li > div > div, li li) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(3) {
		grid-area: date;
		line-height: var(--meta-line-height);
	}
	
	main h2 ~ div:nth-of-type(2) :is(li > div > div, li li) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(3) > span:nth-of-type(2) {
		display: none;
	}
	
	main h2 ~ div:nth-of-type(2) :is(li > div > div, li li) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(3) > span:nth-of-type(3) {
		/* 返信ボタン */
		position: absolute;
		top: var(--comment-padding);
		right: var(--comment-padding);
		display: none;
	}
	
	main h2 ~ div:nth-of-type(2) > ul > li > div > div > div:nth-of-type(1):hover > .ui-profile-popup + div > div:nth-of-type(3) > span:nth-of-type(3),
	main h2 ~ div:nth-of-type(2) li li:hover .ui-profile-popup + div > div:nth-of-type(3) > span:nth-of-type(3) /* 返信コメント */ {
		display: inline;
	}
	
	/*------------------------------------
		ユーザー名にユーザーページへのリンク
	*/
	main h2 ~ div:nth-of-type(2) .ui-profile-popup {
		--user-icon-width: 40px;
		--user-icon-right-margin: 8px;
		color: var(--pixiv-color);
	}
	
	main h2 ~ div:nth-of-type(2) .ui-profile-popup::after {
		content: attr(data-user_name);
		position: absolute;
		top: var(--comment-padding);
		left: calc(var(--comment-padding) + var(--user-icon-width) + var(--user-icon-right-margin));
		font-weight: bold;
		display: block;
		line-height: var(--meta-line-height);
	}
	
	main h2 ~ div:nth-of-type(2) li li .ui-profile-popup {
		/* 返信コメント */
		--user-icon-width: 32px;
	}
	
	main h2 ~ div:nth-of-type(2) :is(li > div > div, li li) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) {
		color: transparent;
	}
	
	/*------------------------------------
		削除されたユーザーのアイコン
	*/
	main h2 ~ div:nth-of-type(2) .ui-profile-popup[data-user_name=""] {
		opacity: 0.4;
	}
	
	/*------------------------------------
		作者コメント強調方法の修正
	*/
	main h2 ~ div:nth-of-type(2) > ul > li > div > div > div:nth-of-type(1),
	main h2 ~ div:nth-of-type(2) li li > div /* 返信コメント */ {
		z-index: 0;
	}
	
	main h2 ~ div:nth-of-type(2) li .l6DTSU_ {
		background: var(--author-comment-background);
		color: transparent;
		z-index: -1;
		border-radius: unset;
		margin: unset;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	
	main h2 ~ div:nth-of-type(2) > ul > li > div > div > div:nth-of-type(1) .l6DTSU_ {
		/* 作者コメントが返信元であった場合用 */
		border-bottom: var(--pixiv-border-width) var(--pixiv-border-style) var(--pixiv-border-color);
	}
	
	main h2 ~ div:nth-of-type(2) > ul > li:last-of-type > div > div > div:nth-of-type(2) > div:empty {
		/* 作者コメント、一番下のコメント、かつ返信がなければ */
		margin-bottom: calc(var(--pixiv-border-width) * -1);
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
