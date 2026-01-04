//
// Written by Charlie Zhang
// Script Version: 1.0.0a
// Date of issue: 08/29/17
// Date of resolution: 08/29/17
//
// ==UserScript==
// @name        ShadeRoot Pastebin
// @namespace   SRPB
// @description Eye-friendly magic in your browser for Pastebin
// @version     0.0.1a
// @icon        https://i.imgur.com/yh3Gany.png
// --			https://i.imgur.com/f6FIniz.png

// @include        https://pastebin.com/*

// @downloadURL https://update.greasyfork.org/scripts/383976/ShadeRoot%20Pastebin.user.js
// @updateURL https://update.greasyfork.org/scripts/383976/ShadeRoot%20Pastebin.meta.js
// ==/UserScript==

function ShadeRootPB(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootPB(
    '#super_frame, #header_wrap {width: 95%}'
    +
	// CONTENT COLOR 2 backgound for middle ring
	'body, #content_frame, #monster_frame {background-color: #081015;}'
	+
	// CONTENT COLOR 1
	'#main_frame, .code_box, ol, #code_frame div, #code_frame {background-color: #101C27 !important;}'
	+
	// BORDERS 1
	'#content_frame, #monster_frame {border-bottom: 1px solid #153550 !important; border-right: 1px solid #153550 !important; border-left: 1px solid #153550 !important;}'
	+
	// TEXT COLOR 1
	'body, .content_right_title a, a.folder_link, .code_box, #code_frame div, h1, h2, h3, h4, h5, h6, p {color: #bfcace !important;}'
	+
	// TEXT COLOR 2
	'.content_title, ol {color: #4cace9 !important;}'
	+
	// LINK COLOR 1
	'.maintable td a, .select2-dropdown {color: #2D77E7 !important;}'
	+
	'.maintable td a:hover, .main-heading {color: #80ADF3 !important;}'
	+
	'.code_box, #code_frame2, .login_field, input[type="checkbox"] + label span, .well, .btn-selectable {border: 1px solid #153550 !important}'
	+
	'textarea.paste_code, textarea.paste_textarea, textarea, input, select, .message_top, .select2-container--default .select2-selection--single .select2-selection__rendered, .select2-container--default .select2-selection--single {background-color: #253845 !important; border: 1px solid #2f5a7e !important; color: #bed4e9 !important;}'
	+
	'img {opacity: .85 !important;}'
	+
	'.nav-filters > li > a {color: #b3d4e6 !important;}'
	+
	'.content_title {border-bottom: 2px solid #1e3c59 !important;}'
	+
	'.form_login_frame {border-bottom: 2px solid #174160 !important; border-left: 1px solid #143f5f !important;}'
	+
	'#content_right {background: none !important;}'
	+
	'.right_menu li {border-top: 1px dotted #2e6ead !important; color: #b5d0e1 !important;}'
	+
	'.custom-file-input:hover::before, .custom-file-input:active::before, input.button1:hover, .button1:hover {color: #bed4e9 !important;}'
	+
	'.paste_box_icon, .form_avatar {border: 1px solid #26699b !important;}'
	+
	'.button1, .button2, input.button1, .my-account-body {background-color: #1b445f !important; border-bottom: 2px solid #11314d !important; color: #cedfed !important;}'
	+
	'#steadfast {filter:brightness(.7) !important; opacity: .9 !important;}'
	+
	'#error {background-color: #30100c !important; border: 1px solid #861C14 !important;}'
	+
	'.content_sub_title {border-bottom: 1px solid #19406c !important;}'
	+
	'.tools_screenshots img, .my-account-body {border: 1px solid #1f68b0 !important;}'
	+
	'.maintable th {border-bottom: 2px solid #145184 !important;}'
	+
	'.maintable td {border-bottom: 1px solid #1F527D !important;}'
	+
	'.maintable tr:hover, #code_frame div:hover {background-color: #122C3C !important;}'
	+
	'#code_buttons {background: #245584 !important; border-bottom: 1px solid #1d5381 !important;}'
	+
	'.text .de1, .text .de2, .account-body-container {border-left: 1px solid #152836 !important;}'
	+
	'.paste_box_line2, .paste_box_line_u2, .mega-menu .subnav-menu-label {color: #87c1f3 !important;}'
	+
	'.tagline {border-bottom: 1px solid #2d5674 !important;}'
	+
	'.tagline span {background: #2d5674 !important;}'
	+
	'#success {background-color: #114a1d !important; border: 1px solid #5E9520 !important;}'
	+
	'.pro_frame_big {border-right: 1px solid #162e3f !important;}'
	+
	'.pro_frame_life {background-color: #203F5D !important;}'
	+
	'.pro_frame, .pro_frame_life {border: 1px #1d5c9b solid !important; border-bottom: 2px solid #0c3b5f !important;}'
	+
	'.pro_frame_life_top, .gsc-cursor-box .gsc-cursor-page {background-color: #1F5081 !important; border: 1px solid #1e5387 !important;}'
	+
	'.buy_button {border-top: 1px #3491d5 dotted !important;}'
	+
	'.pro_frame, .pro_frame_life {background: #123D5D !important;}'
	+
	'.message_window, .my-account-header {border: 1px solid #1e4974 !important;}'
	+
	'.select2-dropdown {background-color: #1b507e !important; border: 1px solid #0f3e6c !important;}'
	+
	'.publisher-pastebin .hello-bar {background-color: #0E2C42 !important;}'
	+
	'.publisher-pastebin .hello-bar a, .js-module-title {color: #d3e2ea !important;}'
	+
	'.jumbotron, #sc-hero-unit, #page-hero-unit {background-color: #1a5778 !important;}'
	+
	'.navbar.navbar-master {box-shadow: 0 1px 0 0 #134468 !important;}'
	+
	'input[type="checkbox"] + label span {background-color: #0d3f77;}'
	+
	'.publisher-pastebin .search-input-icon, .publisher-pastebin .shopping-cart-icon, .publisher-pastebin .navbar-default .navbar-nav > li > a, .publisher-pastebin .navbar-default .navbar-nav > li > a:hover, .publisher-pastebin .nav-item-link, .publisher-pastebin .dropdown-menu > li > a, .publisher-pastebin .dropdown-menu > li > a:hover, .publisher-pastebin .navbar-default .navbar-nav > .open > a {color: #D4E6EF !important;}'
	+
	'.navbar .mega-menu {background: #13293c !important; border-bottom: 1px solid #17314a !important; border-top: 1px solid #194e7b !important;}'
	+
	'.nav-filters-desktop, .category-footer {border-bottom: 1px solid #1b4b74 !important; border-top: 1px solid #1d4b8f !important;}'
	+
	'.categories-menu-container__refine-select.styled-select {background-color: #17416b !important; border: 1px solid #235b8c !important;}'
	+
	'.email-capture-modal .modal-content {background-color: #0e355c !important; filter: brightness(.6) !important;}'
	+
	'.sc-sale-unit {background: #142838 !important;}'
	+
	'.sale-detail-title, .site-contents .intelligent-module header a {color: #b1d2e1 !important;}'
	+
	'.buy-now-column .price-container {border-top: 1px solid #214f7b !important;}'
	+
	'hr {border-top: 1px solid #21436f !important;}'
	+
	'.sc-sale-guarantee-box {border: 1px solid #1f5684 !important;}'
	+
	'.course .container-fluid {background-color: #0e1f2d !important;}'
	+
	'.course .nav > li.col-xs-4 a, .course .nav li.col-xs-3 a, .course .nav li.col-xs-6 a, .course .nav li.col-xs-12 a, .course .nav li a {color: #cadcec !important;}'
	+
	'.course #sc-share-buttons {background-color: #226ea5 !important; border: 1px solid #124990 !important;}'
	+
	'.cart .cart-products, .cart {background-color: #103044 !important;}'
	+
	'.cart {border: 1px solid #1f4c72 !important;}'
	+
	'.cart .cart-subtotal {background-color: #0a384e !important; border-top: 1px solid #1f5081 !important;}'
	+
	'.my-account-header {background-color: #0d2130 !important;}'
	+
	'.my-account-header .active, .well, .btn-selectable {background-color: #16303e !important;}'
	+
	'.nav-tabs > li > a:hover {border-color: #27709e #1e498a #19687a !important;}'
	+
	'.nav-tabs li a:hover {background-color: #101820 !important; border-bottom: 1px solid #385775 !important;}'
	+
	'.my-account-body .balance-highlight {background-color: #19303b !important; border-radius: 1em;}'
	+
	'.modal-dialog .modal-content {background-color: #092948 !important;}'
	+
	'.bubble {background-color: #153962 !important; border: 1px solid #0e4b90 !important; color: #c6daed !important;}'
	+
	'.course-outline > ul > li {background-color: #183b5d !important; border-color: #112b44 !important;}'
	+
	'.checkout-steps {background-color: #132c44 !important; border-bottom: 1px solid #173766 !important;}'
	+
	'.checkout-step-title, .gsc-selected-option, .gsc-control-cse div {color: #c5dde6 !important;}'
	+
	'.payment-info {border: solid #205796 !important;}'
	+
	'.navbar.navbar-master .simple-menu {background: #122541 !important; border: 1px solid #21588f !important;}'
	+
	'.simple-menu a:hover {background: #1b5a98 !important;}'
	+
	'#adBlock, .gsc-adBlock {display: none !important;}'
	+
	'.gsc-control-cse {border-color: #134977 !important; background-color: #0B3E80 !important;}'
	+
	'.gsc-control-cse div {background: #102233 !important;}'
	+
	'.gsc-webResult.gsc-result, .gsc-results .gsc-imageResult {border-color: #164E77 !important;}'
	+
	'.gs-webResult .gs-snippet, .gs-imageResult .gs-snippet, .gs-fileFormatType {color: #c1d4db !important;}'
	+
	'.gs-webResult.gs-result a.gs-title:hover, .gs-webResult.gs-result a.gs-title:hover b, .gs-imageResult a.gs-title:hover, .gs-imageResult a.gs-title:hover b, .gs-webResult.gs-result a.gs-title:link, .gs-webResult.gs-result a.gs-title:link b, .gs-imageResult a.gs-title:link, .gs-imageResult a.gs-title:link b {color: #5E87E9 !important;}'
	+
	'.gs-webResult div.gs-visibleUrl, .gs-imageResult div.gs-visibleUrl {color: #1e78ba !important;}'
	+
	'.gsc-above-wrapper-area {border-bottom: 1px solid #1B436B !important;}'
    +
    // java
    '.java .st0 {color: #bed4e9 !important;}'
    +
    // c
    '.c .me1 {color: #bed4e9 !important;}'
);