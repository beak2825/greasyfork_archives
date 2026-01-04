// ==UserScript==
// @name         Add red border to yd-translate-container
// @version      0.1
// @description  让有道翻译更好看
// @author       Augury
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/944879
// @downloadURL https://update.greasyfork.org/scripts/477465/Add%20red%20border%20to%20yd-translate-container.user.js
// @updateURL https://update.greasyfork.org/scripts/477465/Add%20red%20border%20to%20yd-translate-container.meta.js
// ==/UserScript==

(function () {
	'use strict';
	var css = ".yd-wrapper-block{border: solid #ffaaaa;background-color:#ffeeee;border-radius: 5px;}";
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