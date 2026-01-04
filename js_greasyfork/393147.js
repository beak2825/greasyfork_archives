// ==UserScript==
// @name         思源黑体NOTO无衬线
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @include     http*
// @include     https*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393147/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93NOTO%E6%97%A0%E8%A1%AC%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/393147/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93NOTO%E6%97%A0%E8%A1%AC%E7%BA%BF.meta.js
// ==/UserScript==

var link_style = document.createElement("link");
link_style.setAttribute("href","https://fonts.googleapis.com/css?family=Noto+Sans+SC:100,300,400,500,700,900|Noto+Serif+SC&display=swap");
link_style.setAttribute("rel","stylesheet");
var head = document.head;
head.appendChild(link_style);
(function() {var css = [
"*{font-family: 'Noto Sans SC',sans-serif!important;font-weight:400;}",
	"}"
	//font-family: 'Noto Serif SC', serif;|font-family: 'Noto Sans SC',sans-serif
].join("\n");
if (typeof addStyle != "undefined") {
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


