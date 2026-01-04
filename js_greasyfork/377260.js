// ==UserScript==
// @name          武神传说css
// @namespace     http://userstyles.org
// @description	  电脑上玩泥巴，就要玩的爽，摒弃手机的显示方式。
// @author        将来
// @homepage      https://userstyles.org/styles/162570
// @include       http://game.wsmud.com/*
// @include       https://game.wsmud.com/*
// @include       http://*.game.wsmud.com/*
// @include       https://*.game.wsmud.com/*
// @run-at        document-start
// @version       将来1.9
// @downloadURL https://update.greasyfork.org/scripts/377260/%E6%AD%A6%E7%A5%9E%E4%BC%A0%E8%AF%B4css.user.js
// @updateURL https://update.greasyfork.org/scripts/377260/%E6%AD%A6%E7%A5%9E%E4%BC%A0%E8%AF%B4css.meta.js
// ==/UserScript==
(function() {var css = [
	".container{ position: fixed; top: 0;left: 0;width:100%;}",
	".room_desc{width:100%;}",
    ".room_exits{width:50%;margin-right:300px;padding-right:300px;}",
    ".room_items{width:50%;}",
    ".bottom-bar{width:40%;left:60%;}",
	".content-message{width:60%;}",
	".channel{ position: fixed;top:25.1%;left: 60.2%;width:36%;min-height: 57%;}",
	".map { position: fixed; top: 30%;z-index: 15;border: 1px solid #fffcee;background: #9e9d9b; }",
	".dialog {position: fixed;left: 30%;z-index: 14;width:50%;background: #121212;}",
	".dialog-confirm{ position: fixed; top: 60%;left: 30%;width:50%; z-index: 15;border: 1px solid #fffcee;background: 666666; }",
	".dialog-skills {",
	"       min-height:20em;   ",
	"}",
	".dialog-tasks {",
	"   height:30em;",
	"}",
    ".state-bar{width:260px}"
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
