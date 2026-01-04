// ==UserScript==
// @name LWN.net
// @namespace https://lwn.net
// @version 1.0.1
// @description UserCSS style for LWN.net
// @license CC-BY-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.lwn.net/*
// @downloadURL https://update.greasyfork.org/scripts/407866/LWNnet.user.js
// @updateURL https://update.greasyfork.org/scripts/407866/LWNnet.meta.js
// ==/UserScript==

(function() {
let css = `

	.not-print { display: none !important; }
	div.CommentReplyButton { display: none !important; }

	div > pre { white-space: pre-wrap; }

	body > #menu { display: none !important; }
	body > div.topnav-container { display: none !important; }
	body > br { display: none !important; }
	body > center { display: none !important; }

	body > div.maincolumn { padding-left: 0em; }
	body > div.maincolumn > div.middlecolumn > div.PageHeadline { max-width: none; }
	body > div.maincolumn > div.middlecolumn > div.ArticleText { max-width: none; padding: 0em 0.5em 0em 0.5em; }
	body > div.maincolumn > div.middlecolumn > div.ArticleText > center { display: none !important; }
	body > div.maincolumn > div.middlecolumn   div.CommentBox { max-width: none; }

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
