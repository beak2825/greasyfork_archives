//
// Written by Glenn Wiking
// Script Version: 1.2.0
// Date of issue: 09/11/16
// Date of resolution: 09/11/16
//
// ==UserScript==
// @name        ShadeRoot ExtraTorrent
// @namespace   SREXT
// @description Eye-friendly magic in your browser for ExtraTorrent
// @include     http://*extratorrent.*
// @include     https://*extratorrent.*
// @include     http://*etmirror.*
// @include     https://*etmirror.*
// @include     http://*etproxy.*
// @include     https://*etproxy.*
// @include     http://*extratorrentonline.*
// @include     https://*extratorrentonline.*
// @include     http://*extratorrentlive.*
// @include     https://*extratorrentlive.*
// @version     0.1.0a
// @icon				http://i.imgur.com/lHjDStP.png

// @downloadURL https://update.greasyfork.org/scripts/25420/ShadeRoot%20ExtraTorrent.user.js
// @updateURL https://update.greasyfork.org/scripts/25420/ShadeRoot%20ExtraTorrent.meta.js
// ==/UserScript==

function ShadeRootEXT(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootEXT (
	'body {background-color: #202021 !important; color: #A9B2B7 !important;}'
	+ // INPUT COLOR
	'textarea, input {background-color: #164963 !important; border: 1px solid #386889 !important; color: #B9C2C7 !important;}'
	+
	'.error {color: #008FDD !important;}'
	+ // LINK COLOR 1
	'a, .link:hover, .top_cat, .top_more a {color: #277CB3 !important;}'
	+
	'.top_title b, tablemenu td a, .tablemenu td:hover a:hover, .right a, .top_more a, .td_menu a {color: #C1D4E0 !important;}'
	+
	'.blog_top, .td_menu, .menul, .menur, .top_cat {background: #2A4E7E !important;}'
	+
	'.blog_left, .blog_right {visibility: hidden !important;}'
	+
	'td.ms, .usr span {color: #B3D1E1 !important;}'
	+
	'img[src="//images4et.com/images/logo.gif"], img[src="//images4et.com/images/button_send.gif"], img[src="//images4et.com/images/button_upload_torrent.gif"], img[name="sbtn"], .h_search_btn, img, .btn, .hot_caption, input[name="btnsubmit"] {opacity: .8 !important;}'
	+
	'table.tl th, .top_pic img, img[width="100"] {border: 1px solid #206796 !important;}'
	+
	'table.tl th table td {background-color: #14222F !important;}'
	+
	'tr.tlr {background-color: #182E3B !important;}'
	+
	'tr.tlz {background-color: #14161D !important;}'
	+
	'.chat_msg, .fm td {background-color: #0F2330 !important; border: 1px solid #104D75 !important;}'
	+
	'.tztblsearch tbody tr td {background-color: rgb(11, 49, 69) !important; border: 1px solid rgb(15, 74, 114) !important;}'
	+
	'hr {border-color: #1F78B9 !important;}'
	+
	'.tabledata1 {background-color: #0D384E !important; border: 1px solid #166293 !important;}'
	+
	'.tabledata0 {background-color: #192B38 !important; border: 1px solid #05426B !important;}'
	+
	'img[src="//images4et.com/images/download_normal.gif"] {border-radius: 1em !important;}'
	+
	'td.tabledata_num, .cat_subcats, .pager_link, div.usrm {background-color: #122433 !important; border: 1px solid #08638D !important;}'
	+
	'div.bbl div.ddown, select {background-color: #1B3642 !important; border: 1px solid #317C99 !important; color: #8ACBE4 !important;}'
	+
	'.fm td.fmi {border-top: 1px solid #155987 !important; border-right: 1px solid #175F8F !important;}'
	+
	'.pager_no_link {color: #AAD6E7 !important; background-color: #155077 !important; border: 1px solid #227DC0 !important;}'
	+
	'table.fm td div.top, table.fm td.top {background: #22445A !important; border-bottom: 1px solid #174F78 !important;}'
	+
	'table.fm {border: 1px solid #0E3148 !important;}'
	+
	'table.fm th {background: #115474 !important;}'
	+
	'.blog_content, .top_torr, .navigator, div.nav {border: 1px dashed #276D99 !important;}'
	+
	'.hot_item, .article_item {border-top: 1px dashed #276D99 !important; border-bottom: 1px dashed #276D99 !important;}'
	+
	'.tablemenu td {background-color: #194C71 !important;}'
	+
	'td.stp, #hot_torrents {background: none !important;}'
	+
	'.highlight {background-color: #0C547B !important;}'
	+
	'.tablemenu td:hover {border: 1px solid #307DBF !important;}'
	+
	'.easy-autocomplete-container ul {background: #0B3953 !important; border-top: 1px dotted #296B90 !important;}'
	+
	'.easy-autocomplete.eac-blue-light ul li.selected, .easy-autocomplete.eac-blue-light ul .eac-category.selected, .easy-autocomplete-container ul li.selected {background-color: #0B2C45 !important;}'
	+
	'.borderdark {border: 1px dashed #226590 !important;}'
);