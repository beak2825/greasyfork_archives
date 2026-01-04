// ==UserScript==
// @name          textvn dark edition
// @description	  A dark theme edition version for the website http://textvn.com
// @author        NgocNhi
// @include       http://textvn.com/*
// @include       https://textvn.com/*
// @include       http://*.textvn.com/*
// @include       https://*.textvn.com/*
// @run-at        document-start
// @version       0.20160922073946
// @namespace https://greasyfork.org/users/715448
// @downloadURL https://update.greasyfork.org/scripts/418463/textvn%20dark%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/418463/textvn%20dark%20edition.meta.js
// ==/UserScript==
(function() {var css = [
	"/* Userstyle for textvn.com. Original script: XScalibur */",
	"/* Licence: GNU v3 */",
	"/* Userstyle URL: todo /*",
	"/* Version 1.0 11/12/2020 12:57*/",
	"",
	".nav {",
	"    background: black;",
	"}",
	"",
	".container .textarea {",
    "    font-family: 'Roboto', sans-serif;",
    "    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://cdn19.textvn.com/6a98ecb5809293fb5c1c8df089d83670/KxS3O9q2.jpg') no-repeat center center;",
	"    color: white;",
    "    -webkit-filter: grayscale(100%);",
    "    filter: grayscale(100%);",
    "    background-size: cover;",
	"}",
	"",
	".functions.ng-scope {",
	"    background: black;",
	"    color: yellow;",
	"}",
	"",
	".container .functions .footer-share .url {",
	"    background: grey;",
	"    color: yellow;",
	"}",
	"",
	".container .functions .modal {",
	"    background: black;",
	"    color: yellow;",
	"}",
	"",
	".container .functions .modal .input-box {",
	"    background: grey;",
	"    color: yellow;",
	"}",
	"",
	".text {",
	"    background: black;",
	"    color: yellow;",
	"}",
	"",
	".text-functions {",
	"    background: black;",
	"    color: yellow;",
	"}",
	"",
	".muted {    ",
	"    color: yellow;",
	"}",
	"",
	"",
	"/*---mark down view---*/",
	".markdown-body {",
	"    background: black;",
	"    color: yellow;",
	"}",
	"",
	".area {",
	"    background: black;",
	"    color: yellow;",
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
		document.documentElement.appendChild(node);
	}
}
})();
