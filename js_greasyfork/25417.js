//
// Written by Glenn Wiking
// Script Version: 0.1.1a
// Date of issue: 10/11/16
// Date of resolution: 10/11/16
//
// ==UserScript==
// @name        ShadeRoot GFYCat
// @namespace   SRGFY
// @description Eye-friendly magic in your browser for GFYCat
// @include     http://gfycat.*
// @include     https://gfycat.*
// @include     http://*.gfycat.*
// @include     https://*.gfycat.*

// @version     0.1.1a
// @icon       	http://i.imgur.com/PZhhPFM.png
// @downloadURL https://update.greasyfork.org/scripts/25417/ShadeRoot%20GFYCat.user.js
// @updateURL https://update.greasyfork.org/scripts/25417/ShadeRoot%20GFYCat.meta.js
// ==/UserScript==

function ShadeRootGFYC(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootGFYC (
	  // NAV COLOR 1
	'.navbar, .main-container, .gfy-page-footer {background-color: #202E3E !important;}'
	+
	'.navbar-default {border-color: #202E3E !important;}'
	+
	'nav {box-shadow: 0px 0px 0px 1px #172B48 inset !important; background: #172B48 inset !important;}'
	+
	'img, .video-container, .gfy-small-thumb, .logo {opacity: .85 !important;}'
	+ // LINK COLOR 0
	'a, .channel, .big-title, strong {color: #D0DEF6 !important;}'
	+ // TEXT COLOR 1
	'.text-logo, .default-grey, .form-control, .api-banner:hover, .detail-container, .button, .detail-container span, .detail-container i, .content-block, .partner-name, .jumbotron .h1, .jumbotron h1, h2, h3, h4, h5, h6, .row .title, .header-text-wrapper .title, icon-column, .url-input, .tocify-wrapper > .search input {color: #D8E6ED !important;}'
	+ // TEXT COLOR 2
	'.pad-bottom, .text-content, .title-row, .bio, .benefits-block, .jumbotron p, .row .text, p {color: #8092B1 !important;}'
	+
	'.vertical-divider {background-color: #1965C9 !important;}'
	+ // LINK COLOR 1
	'a:hover, .api-banner, .button:hover, .detail-container span:hover, .detail-container i:hover {color: #4D9AFF !important;}'
	+ // INPUT COLOR
	'.form-control, .detail-container, .dropdown-menu, input {background-color: #1C426E !important;}'
	+ // BORDER COLOR 1
	'.search-input, .api-banner, .detail-container, #txtSearch, .url-input input#urlFetch {border: 1px solid #2366BF !important;}'
	+
	'.search-input, #txtSearch, .url-input input#urlFetch, .gif-div, input {border-color: #2366BF !important;}'
	+
	'.api-banner:hover {background-color: #2366BF !important; color: #D0DEF6 !important;}'
	+ // BG COLOR 1
	'body, .trending__container, .main-player-container, .view-container, .jumbotron, .jumbotron .container, .static_container .jumbotron, .tocify-wrapper, .dark-box, .content {background-color: #0D171D !important;}'
	+
	'.detail-container, .channel-container .ng-binding {background: rgba(24, 37, 48, 0.3) !important; padding: 0.25em .5em; border-radius: 3px;}'
	+
	'.dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus, .dropdown-menu > li > a:active {background-color: #195EA1 !important;}'
	+
	'.gfy-page-footer .container {border-top: 2px solid #284D71 !important;}'
	+
	'.main-player-container .mvpFeeds .scrollable {overflow-x: hidden !important;}'
	+
	'.arrow-prev, .arrow-next {background-color: rgba(18, 34, 50, 0.65) !important;}'
	+
	'.control-bar {background: rgba(20, 30, 47, 0.7) !important;}'
	+
	'.control-item {background-color: rgba(12, 28, 44, 0.1) !important;}'
	+
	'.uploader-name {color: #D0DEF6 !important;}'
	+
	'.fileinput-button {background-color: #0F2F53 !important;}'
	+
	'.gif-div, .headerContainer {background-color: #1B3F68;}'
	+
	'.text-content, .gif-div {background-color: #1C426E !important;}'
	+
	'.container-login .title, .container-reset-password .title, .container-signup .title, .container-verify-email .title {color: #8092B1 !important;}'
	+
	'.form-group .menu-btn {background-color: #214268 !important; color: #2475FF !important;}'
	+
	'.table > tbody > tr > td, .table > tbody > tr > th, .table > tfoot > tr > td, .table > tfoot > tr > th, .table > thead > tr > td, .table > thead > tr > th {border-top: 1px solid #1A579C !important;}'
	+
	'.table > thead > tr > th {border-bottom: 2px solid #1A579C !important;}'
	+
	'iframe {opacity: .7 !important;}'
	+
	'code, .msg-block {color: #87E0F8 !important; background-color: #163F75 !important;}'
	+
	'hr, .gifbrewery-container .border-bottom, .gifbrewery-container .header, .msg-block {border-color: #0F5FB9 !important;}'
	+
	'.btn-blue, .btn-blue:focus, .btn-blue:hover {background-color: #143B68 !important; color: #A3C5EC !important; border-color: #2475FF !important;}'
	+
	'.page-wrapper .content > p {max-width: 43vw !important; overflow-x: hidden !important;}'
	+
	'.content h1 {border-bottom: 1px solid #0E1A26 !important; border-top: 1px solid #0E1A26 !important; background-image: linear-gradient(to bottom, #165AA7, #0B3D6E) !important; color: #DBEEF5 !important;}'
	+
	'.content > h1, .content > h2, .content > h3, .content > h4, .content > h5, .content > h6, .content > p, .content > table, .content > ul, .content > ol, .content > aside, .content > dl {text-shadow: 0px 1px 0px #0E2439 !important; color: #8092B1 !important;}'
	+
	'.content h2 {border-top: 1px solid #072747 !important; background-image: linear-gradient(to bottom, rgba(31, 78, 176, 0.4), rgba(255, 255, 255, 0)) !important;}'
	+
	'tr:nth-child(2n+1) > td {background-color: #2E3F56 !important;}'
	+
	'tr:nth-child(2n) > td {background-color: #172129 !important;}'
	+
	'.content table tr:last-child, .content table th {border-bottom: 1px solid #112241 !important;}'
	+
	'.content aside.warning {background-color: #1A5B9B !important;}'
);