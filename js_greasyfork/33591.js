//
// Written by Glenn Wiking
// Script Version: 1.0.0a
// Date of issue: 09/19/17
// Date of resolution: 09/19/17
//
// ==UserScript==
// @name        ShadeRoot Sendvid
// @namespace   SRSV
// @description Eye-friendly magic in your browser for SendVid
// @version     1.0.0a
// @icon        https://i.imgur.com/h5OdjFg.png

// @include     http://*sendvid.*
// @include     https://*sendvid.*

// @downloadURL https://update.greasyfork.org/scripts/33591/ShadeRoot%20Sendvid.user.js
// @updateURL https://update.greasyfork.org/scripts/33591/ShadeRoot%20Sendvid.meta.js
// ==/UserScript==

function ShadeRootSV(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootSV(
	'.menu {background-color: rgba(17, 16, 15, 0.92) !important;}'
	+
	'input {box-shadow: inset 0 1px 3px #1a1814 !important; background-color: #393937 !important; color: #E4E3CA !important;}'
	+
	// BUTTON
	'.pure-button-primary, .pure-button-selected, a.pure-button-primary, a.pure-button-selected {background-color: #201F1A !important; color: #cfbc68 !important;}'
	+
	// LINK
	'a, .wrapper #breadcrumbs {color: #cfbc68 !important;}'
	+
	'.pure-button-default.btn-face {background-color: #152B5C !important;}'
	+
	'.pure-button-default.btn-twit {background-color: #106D90 !important;}'
	+
	'.pure-button-default.btn-goog {background-color: #83180e !important;}'
	+
	'.list-menu a:hover, .support-search-big .inner {border-color: #958316 !important;}'
	+
	'.myvideos .header, .myvideoshead, .acchead {border-bottom: 1px solid #544949 !important;}'
	+
	// BG 1
	'html, .myvideos, #upload-container, .logobox, .regular, #company-support-portal, #footer, textarea {background: #262511 !important;}'
	+
	'.btn-search, .acchead .accinn:last-child {border-left: 1px solid #484040 !important;}'
	+
	'.btn-search:hover {background-color: #78640d !important;}'
	+
	// TEXT 1
	'p, h1, h2, h3, h4, h5, h6, pre, code, b, strong, li, label, textarea, .largeno, .hidden-xs, #support-main #search-results .meta, #support-main .articles .meta, .input-block .label  {color: #c3c290 !important;}'
	+
	'input, textarea, select, checkbox, radio {border: 1px solid #ab9a1c !important;}'
	+
	// TEXT 2
	'.small-form-explanation {color: #90893D !important;}'
	+
	'.logo {color: #E9D01A !important;}'
	+
	'.btn-menu span {background-color: #E9D01A !important;}'
	+
	'#bg-stretch {opacity: 0.8; filter: brightness(.95) !important;}'
	+
	'.progress {background-color: #1a1616 !important;}'
	+
	'.uploadbox {padding: 10px 1em !important;}'
	+
	'.watchvideo, h2:hover .editable {border: 1px solid #c69a1b !important;}'
	+
	'.processing {background: #3e3b35 !important;}'
	+
	'.title, .list-videos > li, #support-main h3, .dashboard td, #support-side h3 {border-bottom: 1px solid #b78d15 !important;}'
	+
	'.video-controls .title, .ctrls, .support-search-big .inner {background: #2c2824 !important;}'
	+
	'.iconbox {background-color: #957024 !important; border-right: 2px solid #574510 !important;}'
	+
	'.cubespinner {opacity: 0.8 !important;}'
	+
	'.linkbox {background-color: #2f2c28 !important; border: 2px solid #9E7B18 !important;}'
	+
	'.list-ctrls a, .video-page {background-color: #171612 !important;}'
	+
	'.list-ctrls a:hover {background: #665718 !important;}'
	+
	'.list-videos > li:hover {background: #44380f !important;}'
	+
	'.btn-del:hover {background-color: #181715 !important; border-color: #90691a !important;}'
	+
	'.pbar {background-color: #BF9915 !important;}'
	+
	'.vjs-control-bar {background-color: rgb(7, 20, 30) !important;}'
	+
	'.regular {background: #18160b !important;}'
	+
	'#company-header {display: none !important;}'
	+
	'#support-header h2 {color: #4A4845 !important;}'
	+
	'#company-support-portal .content {background: #3c3b36 !important;}'
	+
	'.support-body {border: 1px solid #7A6018 !important; box-shadow: 0 3px 4px #272622 !important;}'
	+
	'#rate_article div {color: #3bb616 !important;}'
	+
	'.rate-link-down {color: #bf1414 !important;}'
	+
	'#support-side h3 {padding: 5px 0 20px 10px !important;}'
	+
	'#support-side li {margin: 0px 0 5px 10px !important;}'
	+
	'#new_email {background: #3C3b36 !important;}'
	+
	'.article-content, .article-content span {color: #DAD7CD !important;}'
);