// ==UserScript==
// @name          Goodblox 2009 Evening
// @namespace     http://userstyles.org
// @description	  it is epic.
// @author        dreamer
// @homepage      h
// @include       http://goodblox.xyz/*
// @include       https://goodblox.xyz/*
// @include       http://*.goodblox.xyz/*
// @include       https://*.goodblox.xyz/*
// @run-at        document-start
// @version       0.20191008011902
// @downloadURL https://update.greasyfork.org/scripts/391451/Goodblox%202009%20Evening.user.js
// @updateURL https://update.greasyfork.org/scripts/391451/Goodblox%202009%20Evening.meta.js
// ==/UserScript==
(function() {var css = [
	"body {",
	"    background: url(https://i.imgur.com/6jq84gn.png) no-repeat scroll center top, #F8FCFF url(https://i.imgur.com/CUz0NRL.png) repeat-x;",
	"}",
	"#Banner {",
	"    background-image: url(https://i.imgur.com/zwo3Fvz.png);",
	"}",
	".Asset .AssetThumbnail, .imgc {",
	"    background: white;",
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
