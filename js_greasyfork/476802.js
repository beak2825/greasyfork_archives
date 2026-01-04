/* ==UserStyle==
@name           X/Twitter Card Title Repair
@name:ja        X/Twitterカードへタイトルを復旧
@description    About headings of Twitter cards with large image, displays titles as before.
@description:ja TwitterカードのLarge画像の見出しについて、以前のようにタイトルが表示されるようにします。
@namespace      https://greasyfork.org/users/137
@version        2.1.0
@license        MPL-2.0
@contributionURL https://github.com/sponsors/esperecyan
@compatible     Edge
@compatible     Firefox Firefoxを推奨 / Firefox is recommended / Firefox 115 ESRには対応していません / Does not work in Firefox 115 ESR
@compatible     Opera
@compatible     Chrome
@author         100の人
@homepageURL https://greasyfork.org/scripts/476802
@downloadURL https://update.greasyfork.org/scripts/484032/XTwitter%20Card%20Title%20Repair.user.css
@updateURL https://update.greasyfork.org/scripts/484032/XTwitter%20Card%20Title%20Repair.meta.css
==/UserStyle== */

@-moz-document domain("twitter.com"), domain("x.com") {
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
}