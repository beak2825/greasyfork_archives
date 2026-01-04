// ==UserScript==
// @name ygg.CSS
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description works with https://greasyfork.org/fr/scripts/394971-ygg-js
// @author CoCtiC
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/395167/yggCSS.user.js
// @updateURL https://update.greasyfork.org/scripts/395167/yggCSS.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `


@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
@import url('https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap');
`;
if ((location.hostname === "yggtorrent.se" || location.hostname.endsWith(".yggtorrent.se"))) {
		css += `
			.cellContent {
				display: flex;
				flex-flow: row nowrap;
				align-items: center;
			}
			
			.directLink {
				padding: 6px !important;
				margin: 0 !important;
				flex: 1 0 10%;
			}
				
			.movieLink {
				flex: 9 0 50%;
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
