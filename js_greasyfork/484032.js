// ==UserScript==
// @name X/Twitter Card Title Repair
// @namespace https://greasyfork.org/users/137
// @version 2.1.0
// @description About headings of Twitter cards with large image, displays titles as before.
// @author 100の人
// @homepageURL https://greasyfork.org/scripts/476802
// @license MPL-2.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.twitter.com/*
// @match *://*.x.com/*
// @downloadURL https://update.greasyfork.org/scripts/484032/XTwitter%20Card%20Title%20Repair.user.js
// @updateURL https://update.greasyfork.org/scripts/484032/XTwitter%20Card%20Title%20Repair.meta.js
// ==/UserScript==

(function() {
let css = `
	body {
		/* 背景画像: デフォルト */
		--domain-color: #536471;
		--border-color: #CFD9DE;
		--title-color: #0F1419;
		--hover-background: rgba(0, 0, 0, 0.03);
	}

	body:is(
		[style*="background-color: rgb(21, 32, 43)"],
		[style*="background-color: #15202B;"] /* Google Chrome */
	) {
		/* 背景画像: ダークブルー */
		--domain-color: #8B98A5;
		--border-color: #38444D;
		--title-color: #F7F9F9;
		--hover-background: rgba(255, 255, 255, 0.03);
	}

	body:is(
		[style*="background-color: rgb(0, 0, 0)"],
		[style*="background-color: #000000;"] /* Google Chrome */
	) {
		/* 背景画像: ブラック */
		--domain-color: #71767B;
		--border-color: #2F3336;
		--title-color: #E7E9EA;
		--hover-background: rgba(255, 255, 255, 0.03);
	}
	
	div:has(> [data-testid="card.wrapper"] [data-testid="card.layoutLarge.media"]) {
		--padding: 12px;
		border-radius: 16px;
		overflow: hidden;
		border: solid 1px var(--border-color);
		gap: unset;
		line-height: 20px;
		font-family: "Segoe UI", Meiryo, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
	}
	
	div:has(> [data-testid="card.wrapper"] [data-testid="card.layoutLarge.media"]):hover {
		background: var(--hover-background);
	}
	
	[data-testid="card.wrapper"]:has([data-testid="card.layoutLarge.media"]),
	[data-testid="card.wrapper"] [data-testid="card.layoutLarge.media"],
	[data-testid="card.wrapper"] [data-testid="card.layoutLarge.media"] a {
		display: contents;
	}
	
	[data-testid="card.wrapper"]:has([data-testid="card.layoutLarge.media"]) + a {
		/* ドメイン */
		border-top: solid 1px var(--border-color);
		padding: var(--padding) var(--padding) 0;
		text-decoration: unset;
	}

	[data-testid="card.layoutLarge.media"] [role="link"][aria-label] > div:last-of-type {
		/* タイトル */
		order: 1;
		position: unset;
		color: var(--title-color);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: 0 var(--padding) calc(var(--padding) + 2px);
	}

	[data-testid="card.layoutLarge.media"] [role="link"][aria-label] > div:last-of-type * {
		font-size: unset;
		line-height: unset;
		color: unset !important;
		background: unset;
		padding: unset;
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
