// ==UserScript==
// @name          inoreader-clear
// @namespace     http://userstyles.org
// @description	  A customized style for <a href="https://www.inoreader.com/" target="_blank">InoReader</a> with :
// @author        hectorqiu
// @homepage      https://userstyles.org/styles/119240
// @include       http://inoreader.com/*
// @include       https://inoreader.com/*
// @include       http://*.inoreader.com/*
// @include       https://*.inoreader.com/*
// @run-at        document-start
// @version       0.3
// @downloadURL https://update.greasyfork.org/scripts/17144/inoreader-clear.user.js
// @updateURL https://update.greasyfork.org/scripts/17144/inoreader-clear.meta.js
// ==/UserScript==

(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
	".reader_pane_view_style_2{",
	"  width:400px!important;",
	"}",
  "#three_way_contents{",
	"  width:calc(100% - 740px)!important;",
	"  left:720px!important;",
	"}",
  
	"#subscriptions_buttons, #sb_rp_tools {background-image: none !important;border-bottom: 1px solid !important;}",
	".article_stripe{background-color: #fff !important;}",
  "#tree_pane, .tree_ad { background-color: #f7f7f7; border-right: 1px solid #aaa; color: #383838; font-size: 14px;}",
  ".article_stripe { width: 0;}",
  ".article_content { font-size: 16px !important;}",
  ".ad_size_leaderboard {  display: none;    height: 90px;    width: 728px;}",
  "#reader_pane .ad_title {  display: none;    margin-top: 0;}",
  ".reader_pane_view_style_2{width:400px!important;}",
  "#subscriptions_buttons, #sb_rp_tools{border-bottom: 1px solid ;background-image:none !important;}",
  ".article_stripe { opacity: 0 !important;}",
  "#wraper.tree_width_2 #tree_pane{width: 320px!important;}", 
  "#wraper.tree_width_2 .parent_div .parent_div .tree_link{	max-width:200px!important;}",
  "#wraper.tree_width_2 #reader_pane{	left:320px!important;}",
  ".article_content { max-width: 800px!important;}",
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
