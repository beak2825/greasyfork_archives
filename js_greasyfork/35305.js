// ==UserScript==
// @name          Modern Black
// @namespace     http://userstyles.org
// @description	  A modern black style for HackForums.
// @author        M0HX
// @homepage      https://userstyles.org/styles/
// @include       http://hackforums.net/*
// @include       https://hackforums.net/*
// @include       http://*.hackforums.net/*
// @include       https://*.hackforums.net/*

// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/35305/Modern%20Black.user.js
// @updateURL https://update.greasyfork.org/scripts/35305/Modern%20Black.meta.js
// ==/UserScript==
(function() {var css = [

    "body {",
	"    background: #072948 url(https://i.imgur.com/VhIHTd3.png) fixed;",
	"}",
	"#content {",
	"    background: none",
	"}",
    "#logo {",
	"    background: none",
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
		document.documentElement.appendChild(node);
	}


}
})();
