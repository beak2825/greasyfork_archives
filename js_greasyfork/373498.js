// ==UserScript==
// @name          Gmail Colour and Spacing Changes
// @namespace     https://greasyfork.org
// @description   Changes the colour and spacings of the new Gmail to look more like the old one. Could work on Chrome only...
// @author        MSzynisz
// @include       http://mail.google.com/*
// @include       https://mail.google.com/*
// @include       http://*.mail.google.com/*
// @include       https://*.mail.google.com/*
// @run-at        document-start
// @version       0.6
// @downloadURL https://update.greasyfork.org/scripts/373498/Gmail%20Colour%20and%20Spacing%20Changes.user.js
// @updateURL https://update.greasyfork.org/scripts/373498/Gmail%20Colour%20and%20Spacing%20Changes.meta.js
// ==/UserScript==
(function() {var css = [
	".zE {background-color: #FFFFFF !important; color: #000000 !important;}",
	".yO {background-color: #F3F3F3 !important; opacity: 1.0 !important; color: #000000 !important;}",
	".x7 {background-color: #FFFFCC !important; opacity: 1.0 !important;}",
	".xY {border-color: rgba(255, 255, 255, 1.0) !important; opacity: 1.0 !important;}",
    ".z0 {padding-left: 24px !important;}",
    ".z0 .L3{background-color: rgb(215,73,55) !important; color: white !important;}",
    ".z0 .L3::before{ -webkit-filter: drop-shadow(0px 0px 0.5px white) drop-shadow(0px 0px 0.5px white) drop-shadow(0px 0px 0.5px white) drop-shadow(0px 0px 0.5px white) drop-shadow(0px 0px 0.5px white)};",
    ".zw {padding: 10px 0 0 0;}",
	".zA {box-shadow: inset 0 -1px 0 0 #DDD !important;}",
	"div.h7{ background-color: #FFFFFF; transparent; box-shadow: inset 0 1px 0 0px #DDD;}",
	".byl .TN{height:26px !important;}",
    ".zw {padding-top: 10px !important;}",
    ".zw .TN{height:20px !important;}",
    ".G-atb::before{ box-shadow: inset 0 -1px 0 0 #DDD !important; }",
	"div.kv, div.kQ{ background-color: #F3F3F3; transparent; box-shadow: inset 0 1px 0 0px #DDD;}",
    "div.adv .G2{ padding-right:0px !important;}",
    "div.adv .Bk::after{ border-top: 1px solid #DDD !important; border-bottom: 1px solid #DDD !important;}",
    "div.adv{padding-right: 0px !important;}",
    "header{ background-color: #F3F3F3 !important; opacity: 1.0 !important; border-color: lightgray; border-bottom-style: solid; border-bottom-width: 0.7pt; }",
    "table{ border-color: rgba(255, 255, 255, 1.0) !important;  }",
    "header form{ background: #FFFFFF !important; opacity: 1.0 !important; border-color: rgba(217, 217, 217, 1.0) !important}",
    ".if{ margin-right: 10px !important; }",
    ".G2{ padding-right: 10px !important; }",
    ".aju{height: 60px !important;}",
    ".hx, .gs{padding-bottom: 10px !important;}",
    ".hx, .gE{padding-top: 10px !important;}",
    ".if .byY{padding-top: 10px !important; padding-bottom: 0px !important;}",
    ".xT {align-items: center !important; padding-bottom: 1px !important;}"
].join("\n");
if (typeof GM_addStyle != "undefined")
{
	GM_addStyle(css);
}
else if (typeof PRO_addStyle != "undefined")
{
	PRO_addStyle(css);
}
else if (typeof addStyle != "undefined")
{
	addStyle(css);
}
else
{
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0)
	{
		heads[0].appendChild(node);
	}
	else
	{
		document.documentElement.appendChild(node);
	}
}
})();