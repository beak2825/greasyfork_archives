// ==UserScript==
// @name          Reddit Animated Sidebar
// @namespace     http://userstyles.org
// @description	  Best side bar cover up.
// @author        anonnow
// @homepage      https://userstyles.org/styles/109720
// @include       http://reddit.com/*
// @include       https://reddit.com/*
// @include       http://*.reddit.com/*
// @include       https://*.reddit.com/*
// @run-at        document-start
// @version       0.20150125230053
// @downloadURL https://update.greasyfork.org/scripts/372715/Reddit%20Animated%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/372715/Reddit%20Animated%20Sidebar.meta.js
// ==/UserScript==
(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
	"html {",
	"    overflow-x: hidden;",
	"}",
	"",
	".side {",
	"    margin-left: 0px;",
	"    margin-right: -280px;",
	"    opacity: 0.6;",
	"    transition: opacity 0.5s, margin 0.5s;",
	"    -webkit-transition: opacity 0.5s, margin 0.5s;",
	"    -moz-transition: opacity 0.5s, margin 0.5s;",
	"    -o-transition: opacity 0.5s, margin 0.5s;",
	"    transition-delay: 1s;",
	"    -webkit-transition-delay: 1s;",
	"    -moz-transition-delay: 1s;",
	"    -o-transition-delay: 1s;",
	"    transition-timing-function: ease-in-out;",
	"    -webkit-transition-timing-function: ease-in-out;",
	"    -moz-transition-timing-function: ease-in-out;",
	"    -o-transition-timing-function: ease-in-out;",
	"}",
	"",
	"body>.content, body {",
	"    /* This MUST apply to prevent showing stuff through the side bar */",
	"    z-index: -1 ;",
	"    position: relative ;",
	"}",
	"",
	".side:hover, .side:focus {",
	"    transition: opacity 0.2s, margin 0.2s;",
	"    -webkit-transition: opacity 0.2s, margin 0.2s;",
	"    -moz-transition: opacity 0.2s, margin 0.2s;",
	"    -o-transition: opacity 0.2s, margin 0.2s;",
	"    /* Apply a negative margin to the left to prevent the content from",
	"       being shuffled around by the side bar */",
	"    margin-left: -280px;",
	"    margin-right: 0px;",
	"    opacity: 1;",
	"    transition-delay: 0s;",
	"    -webkit-transition-delay: 0s;",
	"    -moz-transition-delay: 0s;",
	"    -o-transition-delay: 0s;",
	"}",
	"",
	".content {",
	"    margin-right: 40px ;",
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
