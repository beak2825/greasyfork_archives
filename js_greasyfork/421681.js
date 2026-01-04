// ==UserScript==
// @name     Startpage_Lite
// @description    Startpage, simplified and improved.
// @author   Visiblink
// @version  1.14
// @include  https://*.startpage.com*
// @include  https://startpage.com*
// @run-at   document-start
// @grant    none
// @namespace https://greasyfork.org/users/220598
// @downloadURL https://update.greasyfork.org/scripts/421681/Startpage_Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/421681/Startpage_Lite.meta.js
// ==/UserScript==

(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
  
// change the header color
".header {",
  "background-color:white !important;",
  "}",

// center the results on the page
".header__logo {",
  "width:22% !important;",
  "}",

" .inline-nav-menu-container {",
  "margin-left:25% !important;",
  "}",

" .layout-news__body {",
  "margin-left:25% !important;",
  "}",
  
" .layout-video__body {",
  "margin-left:25% !important;",
  "}",

" .layout-web__body--desktop {",
  "margin-left:25% !important;",
  "}",

// remove the anonymous view icon
" .w-gl__anonymous-view-url {",
  "display:none !important;",
  "}",

// change the URL color to Google green
" .inline-nav-menu__link__active {",
  "color: #1a0dab !important;",
  "}",
  
// set the search result link to Google blue
"h3 {",
  "color: #1a0dab;",
	"}",

// set the page indicators and prev-next buttons to Google blue
".pagination__num:hover {",
  "background-color: #1a0dab !important;",
	"}",

".pagination__next-prev-button:hover {",
  "background-color: #1a0dab !important;",
	"}",

// set the search result URL to Google green 
"a.w-gl__result-url {",
  "color: #006621;",
	"}",

// remove search filter globe icon
".search-filter-region__selected-all-regions-icon {",
  "display:none;",
	"}",

// remove footer
".footer {",
  "display:none;",
	"}",
".footer-home {display:none !important;}",
".css-sc4ugc {display:none !important;}",
  
  
// remove the floating feedback button on desktop
".layout-web__feedback-button-container--desktop {",
  "display:none !important;",
	"}",

// remove floating feedback button
".layout-web__feedback-button-container {",
  "display:none !important;",
	"}",

// remove privacy please menu
".privacy-please__container {",
  "display:none;",
	"}",

// remove "web results" text
".w-gl__label {",
  "display:none;",
	"}",

// remove privacy please menu on homepage
".privacy-please-menu-home {",
  "display:none;",
	"}",

// remove subtitle below search on main page
".subtitle {",
  "display:none !important;",
	"}",

// remove subtitle below search on main page
".footer-home-above-fold {",
  "color:white; !important; background-color:white !important",
	"}",
  
// remove main page fluff
"#marketing-tag-container {visibility:hidden !important;}",
".learn-more-container {display:none !important;}",

// remove main page 'hide promotional messaging' links and below the fold  
".home .hide-promo-phase-1__text {visibility: hidden !important;}",
".home .hide-promo-phase-1__button .settings-icon {visibility: hidden !important;}",
".home__section-one {border-top:none !important;}",
".home__section-two {display:none !important;}",
".home__section-three {display:none !important;}",
".home__section-four {display:none !important;}",
".home__section-five {display:none !important;}",
".home__section-six {display:none !important;}"

  
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();