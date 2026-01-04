// ==UserScript==
// @name          Old Dislike/Like bar (Youtube)
// @namespace     http://userstyles.org
// @description	  The old like/dislike bar.
// @author        Skeleton 11223
// @homepage      https://userstyles.org/styles/137820
// @include       http://www.youtube.com/*
// @include       https://www.youtube.com/*
// @include       http://*.www.youtube.com/*
// @include       https://*.www.youtube.com/*
// @run-at        document-start
// @version       0.20170118041918
// @downloadURL https://update.greasyfork.org/scripts/33648/Old%20DislikeLike%20bar%20%28Youtube%29.user.js
// @updateURL https://update.greasyfork.org/scripts/33648/Old%20DislikeLike%20bar%20%28Youtube%29.meta.js
// ==/UserScript==
(function() {var css = [
	".video-extras-sparkbar-likes {",
	"    float: left;",
	"    height: 4px;",
	"    border-right: 1px solid #fff;",
	"    background: #060;",
	"}",
	".video-extras-sparkbars {",
	"    height: 4px;",
	"    margin: 2px 0;",
	"    border: 1px solid #ccc;",
	"    overflow: hidden;",
	"    -webkit-border-radius: 3px;",
	"    -moz-border-radius: 3px;",
	"    border-radius: 3px;",
	"}",
	".video-extras-sparkbar-dislikes {",
	"    float: right;",
	"    height: 4px;",
	"    margin-right: -1px;",
	"    background: #c00;",
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
