// ==UserScript==
// @name Mastodon custom
// @namespace https://greasyfork.org/users/981677
// @version 1.1
// @description Mastodon customizer; change colors, fonts, and more.
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/454584/Mastodon%20custom.user.js
// @updateURL https://update.greasyfork.org/scripts/454584/Mastodon%20custom.meta.js
// ==/UserScript==

(function() {
let css = `@font-face {
	 font-family: "Ariel1";
	 src: local("Libre Baskerville"), url("https://arielbecker/etc/fuentes/LibreBaskerville-Regular.ttf") format("ttf");
	 font-style: normal;
	 font-weight: 400;
}
 
@font-face {
	 font-family: "Ariel2";
	 src: local("JackInput"), url("https://arielbecker/etc/fuentes/JAi_____.TTF") format("ttf");
	 font-style: normal;
	 font-weight: 400;
}
 
@font-face {
	 font-family: "Ariel3";
	 src: local("Virtue"), url("https://arielbecker/etc/fuentes/virtue.ttf") format("ttf");
	 font-style: normal;
	 font-weight: 400;
}
 
body {
	 font-family: "Ariel3", monospace !important;
	 font-size: 12pt;
	 line-height: 14pt;
}
 
.status__content {
	 font-size: 10pt;
	 line-height: 12pt;
}
 
.drawer {
	 width: 16%;
}
 
.column {
	 width: 28%;
}
 
.columns-area {
	 max-width: 100vw;
}
 
.column-header .column-header__button .drawer__header {
	 background: #282828;
}

.column-header__button {
	color: #dde3ec;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
