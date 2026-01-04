// ==UserScript==
// @name          Luogu Show User Homepage
// @description	  让洛谷用户主页可以显示
// @match        https://www.luogu.com.cn/user/*
// @author        Augury
// @version       0.0
// @namespace https://greasyfork.org/users/944879
// @downloadURL https://update.greasyfork.org/scripts/487445/Luogu%20Show%20User%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/487445/Luogu%20Show%20User%20Homepage.meta.js
// ==/UserScript==
(function() {var css = "";
	css += [
		"[data-v-e5ad98f0][data-v-f9624136]{",
		"	display:block !important;",
		"}",
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