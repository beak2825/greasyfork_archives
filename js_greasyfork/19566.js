// ==UserScript==
// @name        inoreader_clear
// @description  clear UI
// @include     http://www.inoreader.com/*
// @include	https://www.inoreader.com/*
// @grant       GM_addStyle
// @version     0.1
// @namespace https://greasyfork.org/users/19987
// @downloadURL https://update.greasyfork.org/scripts/19566/inoreader_clear.user.js
// @updateURL https://update.greasyfork.org/scripts/19566/inoreader_clear.meta.js
// ==/UserScript==

//GM_addStyle("");
GM_addStyle("#tree_pane, .tree_ad { background-color: #f7f7f7; border-right: 1px solid #aaa; color: #383838; font-size: 14px;}");
GM_addStyle(".article_stripe { width: 0;}");
GM_addStyle(".article_content { font-size: 16px !important;}");
GM_addStyle(".ad_size_leaderboard {  display: none;    height: 90px;    width: 728px;}");
GM_addStyle("#reader_pane .ad_title {  display: none;    margin-top: 0;}");

GM_addStyle(".reader_pane_view_style_2{width:400px!important;}");
GM_addStyle("#subscriptions_buttons, #sb_rp_tools{border-bottom: 1px solid ;background-image:none !important;}");
GM_addStyle(".article_stripe { opacity: 0 !important;}");

(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
	".reader_pane_view_style_2{",
	"  width:400px!important;",
	"}",
	"#three_way_contents{",
	"  width:calc(100% - 740px)!important;",
	"  left:670px!important;",
	"}",
	".article_content{",
	"  width:100% !important;",
	"  max-width:inherit!important;",
	"}",
	".article_footer_3way{",
	"  width:calc(100% - 740px) !important;",
	"}"
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