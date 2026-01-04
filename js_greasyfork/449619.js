// ==UserScript==
// @name          Strong Font Rendering Like Safari (1-0-2)
// @namespace     http://userstyles.org
// @description	  Wanted a darker effect so this is a tweaked version of original script and is based on ... Firefox Strong Font Rendering (Like Safari)  Since Firefox 3.5 Font rendering style http://userstyles.org/styles/20442 at userstyles.org got so huge success, I thought of refining the code of rendering in Firefox 3.6.9 and above...
// @author        Aniket
// @homepage      https://userstyles.org/styles/37354
// @license	  no license
// @run-at        document-start
// @match	  *://*/*
// @version       0.20100926133214
// @downloadURL https://update.greasyfork.org/scripts/449619/Strong%20Font%20Rendering%20Like%20Safari%20%281-0-2%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449619/Strong%20Font%20Rendering%20Like%20Safari%20%281-0-2%29.meta.js
// ==/UserScript==
(function() {var css = [
	"/*Designed by logonaniket(TM) aka Aniket from http;//logonaniket.com",
	"Under Creative Commons License. Some rights reserved. 2010.*/",
	"",
	"@namespace html url(http://www.w3.org/1999/xhtml);",
	"body, input {text-shadow: 1px 0px 2px #999;}"
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