// ==UserScript==
// @name The Times Dark Mode
// @namespace git.arun.host/arun/userstyles
// @version 1.0.1
// @description A dark mode for The Times & The Sunday Times frontpage and articles.
// @author Arun Sunner
// @grant GM_addStyle
// @run-at document-start
// @match *://*.thetimes.co.uk/*
// @match https://www.thetimes.co.uk/article*
// @match https://www.thetimes.co.uk/static*
// @include /^(?:(?=.*?\-cartoon).*)$/
// @downloadURL https://update.greasyfork.org/scripts/407136/The%20Times%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/407136/The%20Times%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "thetimes.co.uk" || location.hostname.endsWith(".thetimes.co.uk"))) {
		css += `


		/* Page Theming */

		.Page {
			background-color: #000 !important;
		}

		.Container,
		.MainContainer,
		.Sticky-HeaderContainer,
		.Section::after,
		.Section::before {
			background-color: #000 !important;
		}

		.MainContainer {
			border-left: none !important;
			border-right: none !important;
		}

		.Item:before,
		.Item:after,
		.SUP-4 .Item-content,
		.ItemGrouped:before,
		.ItemGrouped:after,
		.Theme--news:before,
		.Theme--news:after {
			background-color: #222222 !important;
		}


		/* Footer */

		.GlobalFooter-header {
			border-top: none !important;
		}

		.GlobalFooter-backToTopSection,
		.GlobalFooter-backToTopSection .Container {
			background-color: #3C3F44 !important;
		}


		/* Headlines */

		.Headline,
		.Item-headline,
		.ArticlePagerItem-title,
		h1[role="heading"],
		[class*="responsiveweb__Heading"],
		[class*="Headline"] a,
		article[role="article"] p,
		.InTheNews-headline,
		span[class*="__DropCap"] {
			color: #e2e2e4 !important;
		}

		.Item-headline a:hover {
			transition: ease 0.5s;
		}


		/* Nav Menu */

		nav#global-menu-mobile {
			background-color: #0c0d0f !important;
		}

		nav#global-menu-mobile .GlobalMenu-parentLink,
		nav#global-menu-mobile .GlobalMenu-dropdown--primary {
			border-color: #242424 !important;
		}

		a.GlobalMenu-mobileLink {
			color: #eee;
		}

		#todays-sections-menu-desktop * {
			border-color: #242424 !important;
			color: #242424 !important;
		}

		#todays-sections-menu-mobile {
			list-style: none;
			padding: 0;
		}

		.GlobalSearch-searchInput#nav-search-mobile {
			width: 96.5%;
		}

		@media (min-width: 768px) and (max-width:1023px) {
			.OrientationBar {
				width: auto;
				right: 18.2rem;
			}
		}


		/* Article Specific */

		div[class*="__LeadAssetCaptionContainer"] *,
		div[class*="__InsetCaption"] * {
			color: #eee !important;
		}

		div[class*="__LeadAssetCaptionContainer"] :nth-child(2),
		div[class*="__InsetCaption"] :nth-child(2),
		div[class*="__HeaderContainer"] h2[role="heading"],
		*[class*="keylines__"] *,
		.Item-dip * {
			color: #bbb !important;
		}

		*[class*="keylines__"] * a:hover {
			color: #3C81BE !important;
			text-decoration: underline !important;
		}

		article [class*="responsiveweb-"][class*="css"][class*="r"],
		article span [class*="css"][class*="r"] {
			border-color: transparent !important;
		}


		/* Previous/Next Article */

		.ArticlePagerItem--winged .ArticlePagerItem-name {
			background-color: #333 !important;
			color: #fff !important;
		}

		.ArticlePagerItem-icon,
		.ArticlePagerItem:hover .ArticlePagerItem-icon {
			color: #fff !important;
		}

		.ArticlePagerItem:hover .ArticlePagerItem-title,
		.ArticlePagerItem:hover .ItemGrouped .ArticlePagerItem-title {
			color: #1d1d1b !important;
		}


		/* Fix for image backgrounds */

		.is-delayedImageContainer,
		.EditionList-itemLink,
		.EditionList-media {
			background: transparent !important;
		}


		/* Show More Button */

		.ShowMore button {
			background: #333333 !important;
			color: #fff !important;
			transition: ease 0.5s;
		}

		.ShowMore .ShowMore-button:active,
		.ShowMore .ShowMore-button:hover {
			border-color: #fff;
			background-color: #069 !important;
			transition: ease 0.5s;
		}


		/* Links in articles */

		[class*="linkweb__"] {
			color: inherit !important;
		}

		[class*="linkweb__"]:hover {
			color: #069 !important;
			font-weight: bold;
		}


		/* Masthead */

		.Masthead {
			background-color: #000;
			border-bottom: none;
			padding-top: 1em;
			padding-bottom: 0.75em;
		}

		.Masthead-logo,
		.Dual-Masthead-image {
			filter: invert(100%);
		}

		.Masthead time {
			color: white;
		}


		/* Error Pages */

		.ErrorPage-content *:not(input) {
			color: #fff !important;
		}

		.ErrorPage-media {
			filter: invert(100%);
		}


		/* Past Six Days */

		.PastSixDays-newspaperIcon {
			filter: invert(100%);
		}


		/* Section Theming */

		.u-themeColor,
		.Section-headerBackground,
		.GlobalNav *[class*="Theme--"],
		.OrientationBar-wrapper {
			filter: brightness(150%);
		}

		@media (max-width: 1024px) {
			[class*="Theme--"].GlobalNav-wrapper {
				filter: brightness(150%);
			}
		}

		.Item-articleLabel.u-themeColor,
		[class*="Theme--"] .Byline-name,
		[class*="__LabelContainer"],
		[class*="__HeaderContainer"] [class*="__HeaderContainer"] :nth-child(2):not([class*="LeadAsset"]) *:not([class*="LeadAsset"]) {
			filter: brightness(200%);
		}


		/* In The News Header */

		.InTheNews {
			background-color: #0c0e0f;
			border-bottom: none;
			padding-bottom: 10px;
		}


		/* Restore certain sections to default */

		.SUP-4 .Item-headline.Headline--l,
		.Item-headline.Headline--puzzle {
			color: #1D1D1B !important;
		}


		/* Ads/Paywall Restriction Styling */

		#master_adContainer,
		#master_adContainer div,
		#sponsored-article-container div {
			background: #232323 !important;
			border-color: #333333 !important;
			color: #dedede;
		}

		[class*="paywall"] [class*="css"][class*="r"] {
			border-color: transparent !important;
			display: none;
		}

		#paywall-portal-article-footer div,
		#paywall-portal-page-footer div div {
			background-color: #222222;
		}

		#paywall-portal-article-footer div::before {
			background-image: linear-gradient(rgba(255, 255, 255, 0), rgb(0, 0, 0));
		}

		#paywall-portal-article-footer *,
		#paywall-portal-page-footer * {
			color: #fefefe;
		}


		/* Puff */

		in-article-puff {
			padding-left: 2em;
			padding-right: 2em;
		}
		`;
}
if (new RegExp("^(?:(?=.*?\\-cartoon).*)\$").test(location.href)) {
		css += `
			/* Cartoons */
			#article-main h1[class*="Headline"] {
				color: initial !important;
			}
		`;
}
if (location.href.startsWith("https://www.thetimes.co.uk/article")) {
		css += `
			/* Header for shared articles */
			.ArticleMarketing--header .ArticleMarketing-container {
				background-color: #1b1b1b;
				padding-left: 5rem !important;
				padding-right: 5rem !important;
				;
			}
			.ArticleMarketing--header .ArticleMarketing-container * {
				color: #fff !important;
			}
		`;
}
if (location.href.startsWith("https://www.thetimes.co.uk/static")) {
		css += `
			/* Static Page Styling */
			body {
				color: #fff !important;
			}
			.Article-content a {
				color: #3C81BE !important;
			}
			img[src*="The-Times-and-Sunday-Times.png"] {
				filter: grayscale(1) invert(100%);
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
