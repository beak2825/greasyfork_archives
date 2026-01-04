// ==UserScript==
// @name          wsmudcss
// @namespace     http://userstyles.org
// @description	  自用
// @author        yunv K
// @homepage      https://userstyles.org/styles/166762
// @include       http://game.wsmud.com/*
// @include       https://game.wsmud.com/*
// @include       http://*.game.wsmud.com/*
// @include       https://*.game.wsmud.com/*
// @include       http://www.wsmud.com/*
// @include       https://www.wsmud.com/*
// @include       http://*.www.wsmud.com/*
// @include       https://*.www.wsmud.com/*
// @run-at        document-start
// @version       0.20190105004514
// @downloadURL https://update.greasyfork.org/scripts/376343/wsmudcss.user.js
// @updateURL https://update.greasyfork.org/scripts/376343/wsmudcss.meta.js
// ==/UserScript==
(function() {var css = [
	".container{ position: fixed; top: 0;left: 0;width:60%;}",
	".content-room{width:95%; border: 1px solid #fffcee; }",
	".content-message{width:98%;}",
	".channel{ position: fixed;top:1%;left: 60%;width:40%;min-height: 98%;}",
	".map { position: fixed; top: 30%;z-index: 15;border: 1px solid #fffcee;background: #9e9d9b; }",
	".dialog {position: fixed;left: 6%;z-index: 14;width:50%;background: #121212;}",
	".dialog-confirm{ position: fixed; top: 60%;left: 30%;width:50%; z-index: 15;border: 1px solid #fffcee;background: #9e9d9b; }",
	".dialog-skills {",
	"       min-height:20em;   ",
	"}",
	".dialog-tasks {",
	"   height:30em;",
	"}",
	".dialog-confirm {",
	"   left: 6%;top:20%;",
	"}",
	".item-plushp{",
	"   width: 130px;",
	"}",
	".progress.mp .progress-bar{",
	"   background-color: #0004ff;",
	"}",
	"@media(min-width: 1440px) {",
	"    body {",
	"        width: 100%;",
	"}",
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
