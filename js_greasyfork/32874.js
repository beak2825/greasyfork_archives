//
// Written by Glenn Wiking
// Script Version: 0.1.1c
// Date of issue: 03/09/17
// Date of resolution: 03/09/17
//
// ==UserScript==
// @name        ShadeRoot ThePornDude
// @namespace   SRPD
// @description Eye-friendly magic in your browser for ThePornDude
// @include     *theporndude.*

// @version     0.1.1c
// @icon        https://i.imgur.com/jjBTTTi.png
// @downloadURL https://update.greasyfork.org/scripts/32874/ShadeRoot%20ThePornDude.user.js
// @updateURL https://update.greasyfork.org/scripts/32874/ShadeRoot%20ThePornDude.meta.js
// ==/UserScript==

function ShadeRootPD(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootPD (
	//BG COLOR 1
	'body, .lang {background-color: #181110 !important; color: #edd1c8 !important;}'
	+
	//DIV COLOR 1
	'.top, .category-header, .no-results, .link-content, .breadcrumb-single {background: none repeat scroll 0px 0px #564642 !important;}'
	+
	//DIV COLOR 2
	'results-nav, #results-pagination {background: #2b2320 !important;}'
	+
	//DIV COLOR 3
	'.link-header, .page-content {background: #442823 !important;}'
	+
	//TEXT COLOR 1
	'.category-header, .link-header, .link-details-review, .link-details-review p, li, .link-rating, .category-desc, .url_short_desc, .page-content {color: #f3e1d9 !important;}'
	+
	//TEXT COLOR 2
	'a, footer div, .url_link_title a, .category-results a {color: #dbb8b1 !important;}'
	+
	//TEXT COLOR 3
	'.category-text-block, .date, .procons h3, .text {color: #cc5628 !important;}'
	+
	'input, .results-header {background-color: #140f0e !important; border: 1px solid #894d3d !important; color: #f5dbd6 !important;}'
	+
	'.category-wrapper {background: #3b1c12 !important; color: #cc5628 !important;}'
	+
	'img, .main-container, .ctm-icon {opacity: .85 !important;}'
	+
	'.url_link_container img {opacity: 1 !important; filter: brightness(.8) !important;}'
	+
	//BORDER ROUND 1
	'.category-container, .results-header {border: 1px solid #623125 !important;}'
	+
	'footer {text-shadow: 1px 1px #5f362b !important;}'
	+
	'.results-nav .item {background: #8c3c23 !important;}'
	+
	'.results-nav .item:active {background: #502818 !important;}'
	+
	'.quote {color: #b96262 !important; opacity: .7 !important;}'
	+
	'h3 {color: #cc5628 !important;}'
	+
	'.breadcrumb-category {background: #301b15 !important;}'
	+
	'.lang ul li {background: #573f39 !important;}'
);