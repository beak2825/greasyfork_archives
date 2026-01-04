// ==UserScript==
// @name          Textvn.com custom skin include background image
// @description   Custom skin va background cho http://textvn.com
// @author        XScalibur
// @homepage      https://www.reddit.com/user/72c75b513f5cbe594a01
// @include       https://*.textvn.com/*
// @include       http://*.textvn.com/*
// @match        *://*.textvn.com/*
// @run-at        document-start
// @version       1.1
// @namespace https://greasyfork.org/users/332323
// @downloadURL https://update.greasyfork.org/scripts/389292/Textvncom%20custom%20skin%20include%20background%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/389292/Textvncom%20custom%20skin%20include%20background%20image.meta.js
// ==/UserScript==
(function() {var css = [
	"/* Userstyle for textvn.com. Created by: XScalibur */",
	"/* Licence: GNU v3 */",
	"/* Userstyle URL: todo /*",
	"/* Version 1.0 22/08/2019 20:20*/",
	"",
	".nav {",
	"    background: black;",
	"}",
	"",
	".container .textarea {",
	"    background: url('https://cdn19.textvn.com/6a98ecb5809293fb5c1c8df089d83670/KxS3O9q2.jpg') no-repeat center center fixed;",
	"    color: white;",
        "    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */",
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
