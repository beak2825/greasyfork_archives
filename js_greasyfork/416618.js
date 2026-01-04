// ==UserScript==
// @name VirtualCast Header Improvement
// @namespace https://greasyfork.org/users/137
// @version 1.1.1
// @description Reduces the page header height and unfixed.
// @author 100の人
// @homepageURL https://greasyfork.org/scripts/416618
// @license MPL-2.0
// @grant GM_addStyle
// @run-at document-start
// @match https://virtualcast.jp/*
// @match https://wiki.virtualcast.jp/wiki/*
// @downloadURL https://update.greasyfork.org/scripts/416618/VirtualCast%20Header%20Improvement.user.js
// @updateURL https://update.greasyfork.org/scripts/416618/VirtualCast%20Header%20Improvement.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://virtualcast.jp/")) {
		css += `@namespace url(http://www.w3.org/1999/xhtml);

			#main-header nav {
				position: absolute;
				bottom: 0.1em;
			}

			#main-header .navbar-nav {
				margin-top: unset;
			}

			#main-header .navbar-nav .nav-item {
				z-index: 1;
			}
		`;
}
if (location.href.startsWith("https://wiki.virtualcast.jp/wiki/")) {
		css += `@namespace url(http://www.w3.org/1999/xhtml);

			body {
				--header-height: 3em;
			}

			.header {
				height: unset;
			}

			.header .logo {
				height: 30px;
			}
		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
