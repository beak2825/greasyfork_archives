// ==UserScript==
// @name          Textvn.com pink skin custom
// @description	  Textvn.com iu mau hong ghe su gia doi
// @author        XScalibur
// @homepage      https://www.reddit.com/user/72c75b513f5cbe594a01
// @include       https://*.textvn.com/*
// @include       http://*.textvn.com/*
// @match        *://*.textvn.com/*
// @run-at        document-start
// @version       0.1
// @namespace https://greasyfork.org/users/332323
// @downloadURL https://update.greasyfork.org/scripts/389293/Textvncom%20pink%20skin%20custom.user.js
// @updateURL https://update.greasyfork.org/scripts/389293/Textvncom%20pink%20skin%20custom.meta.js
// ==/UserScript==
(function() {var css = [
	"body {",
	"    background: black;",
	"    color: pink;",
	"}",
	"",
	".nav {",
	"    background: black;",
	"}",
	"",
	".container .textarea {",
	"    background: black;",
	"    color: pink;",
	"}",
	"",
	".functions.ng-scope {",
	"    background: black;",
	"    color: pink;",
	"}",
	"",
	".container .functions .footer-share .url {",
	"    background: grey;",
	"    color: pink;",
	"}",
	"",
	".container .functions .modal {",
	"    background: black;",
	"    color: pink;",
	"}",
	"",
	".container .functions .modal .input-box {",
	"    background: grey;",
	"    color: pink;",
	"}",
	"",
	".text {",
	"    background: black;",
	"    color: pink;",
	"}",
	"",
	".text-functions {",
	"    background: black;",
	"    color: pink;",
	"}",
	"",
	".muted {    ",
	"    color: pink;",
	"}",
	"",
	"",
	".markdown-body {",
	"    background: black;",
	"    color: pink;",
	"}",
	"",
    ".carbon-wrap {",
	"    background: black;",
	"    color: pink;",
	"}",
	"",
    ".carbon-poweredby {",
	"    background: pink;",
	"}",
	"",
    ".alertify .ajs-dialog {",
	"    background: pink;",
    "    color: pink;",
	"}",
	"",
    ".alertify .ajs-header {",
	"    background: pink;",
    "    color: pink;",
	"}",
	"",
    ".alertify .ajs-footer {",
	"    background: pink;",
    "    color: pink;",
	"}",
	"",
    ".container .functions .nav a.active {",
	"    color: pink;",
	"}",
    "",
    ".panel {",
    "    background: black;",
	"    color: pink;",
    "}",
    "",
	".area {",
	"    background: black;",
	"    color: pink;",
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
