// ==UserScript==
// @name Nolt—Expanded user info (profile)
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description User info box is larger.
// @author sK6g6Z6IXv2JA8eH
// @grant GM_addStyle
// @run-at document-start
// @match *://*.nolt.io/*
// @downloadURL https://update.greasyfork.org/scripts/405069/Nolt%E2%80%94Expanded%20user%20info%20%28profile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/405069/Nolt%E2%80%94Expanded%20user%20info%20%28profile%29.meta.js
// ==/UserScript==

(function() {
let css = `
	@media only screen and (min-width: 801px) {
		.cMcHFZ {
			width: -moz-available;
			width: available;
			max-width: calc(690px - 4rem);
			overflow: auto;
		}
		.caYfMP {
			max-height: 32rem;
		}
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
