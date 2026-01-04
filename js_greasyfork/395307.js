// ==UserScript==
// @name Google Search Display URL
// @namespace https://greasyfork.org/users/137
// @version 2.0.0
// @description Display URLs for each search result as before.
// @author 100の人 (エスパー・イーシア)
// @homepageURL https://greasyfork.org/scripts/395307
// @license MPL-2.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/395307/Google%20Search%20Display%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/395307/Google%20Search%20Display%20URL.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `


/*
【動作確認用】
サイトリンク付き
https://www.google.com/search?q=Greasy+Fork
https://www.google.com/search?q=Twitter
動画再生フォーム
https://www.google.com/search?q=%E5%A5%BD%E3%81%8D!%E9%9B%AA!%E6%9C%AC%E6%B0%97%E3%83%9E%E3%82%B8%E3%83%83%E3%82%AF
電卓
https://www.google.com/search?q=1-1
翻訳フォーム
https://www.google.com/search?q=test
乱数生成フォーム / このページを訳す
https://www.google.com/search?q=random+number
*/

@namespace url(http://www.w3.org/1999/xhtml);

`;
if (location.href === "https://www.google.com/search?q=Greasy%20Fork" || location.href === "https://www.google.co.jp/search?q=Greasy%20Fork") {
		css += `/* Greasy Forkの適用サイト用 */
			regexp("https?://www\\\\.google\\\\.(?:com|(?:com?\\\\.)?[a-z][a-z])/(?!(?:webhp$|$)|maps(?:$|.*)|search\\\\?(.*&)?(?:tbm=lcl|tbs=lrf|udm=2)(?:$|.*)).*") {
			.yuRUbf > div,
			[data-async-context^="query:"] div[data-hveid][data-ved]:not([id]):not([data-md]) h3  a {
				--url-color: #4D5156;
				--icon-size: 26px;
				--icon-margin-right: 12px;

				display: grid;
				grid-template:
					" icon  site  site"
					" icon  url   option"
					" title title title"
					/ calc(var(--icon-size) + var(--icon-margin-right)) min-content auto;
			}
			
			table h3 a {
				/* サイトリンク */
				display: block !important;
			}

			[data-async-context^="query:"] :is(
				div[data-hveid][data-ved]:not([id]):not([data-md]):not([class*="wholepage"])
			 ) cite {
				display: none;
			}

			.yuRUbf > div > span,
			.yuRUbf > div > span > a {
				display: contents;
			}

			:is(
				.yuRUbf > div,
				[data-async-context^="query:"] g-section-with-header g-link
			 ) h3 {
				grid-area: title;
				white-space: nowrap;
				transform: unset !important;
			}

			.yuRUbf > div h3 ~ div,
			.yuRUbf > div h3 ~ div > div {
				display: contents !important;
			}

			.yuRUbf > div h3 ~ div > div > span {
				 grid-area: icon;
				 align-self: center;
			}

			.yuRUbf > div h3 ~ div > div > div {
				 grid-area: site;
			}

			:is(
				.yuRUbf > div > a,
				.yuRUbf > div > span > a
			)::after {
				grid-area: url;
				content: attr(href);
				color: var(--url-color);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			
			table a::after {
				/* サイトリンク */
				content: unset !important;
			}

			.yuRUbf > div > div {
				grid-area: option;
				position: unset;
				width: 18px;
			}

			.yuRUbf > div > div > div:first-of-type {
				display: none;
			}

			.yuRUbf > div > div > div:nth-of-type(2) {
				margin-top: unset;
			}
		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
