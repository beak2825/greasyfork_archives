// ==UserScript==
// @name          迷你多彩滚动条 mod by Dark minimalistic scrollbar
// @update-url    https://openuserjs.org/install/leyang/Dark_minimalistic_scrollbar.user.js
// @description	  修改自Open User Js社区脚本——Dark minimalistic scrollbar（https://openuserjs.org/scripts/leyang/Dark_minimalistic_scrollbar）[Chrome/Opera][Custom colors]
// @author        XenRon, LE7ELS
// @run-at        document-start
// @version       0.20200113
// @match         *://*/*

// @namespace https://greasyfork.org/users/458539
// @downloadURL https://update.greasyfork.org/scripts/397836/%E8%BF%B7%E4%BD%A0%E5%A4%9A%E5%BD%A9%E6%BB%9A%E5%8A%A8%E6%9D%A1%20mod%20by%20Dark%20minimalistic%20scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/397836/%E8%BF%B7%E4%BD%A0%E5%A4%9A%E5%BD%A9%E6%BB%9A%E5%8A%A8%E6%9D%A1%20mod%20by%20Dark%20minimalistic%20scrollbar.meta.js
// ==/UserScript==

(function() {var css = [
	"::-webkit-scrollbar{",
	"	width: 5px!important;",
	"	height: 5px!important;",
	"}",
	"::-webkit-scrollbar-thumb{",
	"	background-color: rgba(0, 0, 0, 0.3)!important;",
	"	border-radius: 100px!important;",
	"}",
	"::-webkit-scrollbar-track{",
	"	background-color: transparent!important;",
	"}",
	"::-webkit-scrollbar-thumb:hover{",
	"	background: #13B66A!important;",
	"}",
	"::-webkit-scrollbar-thumb:active{",
	"	background: #f94c3f!important;",
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
