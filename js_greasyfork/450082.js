// ==UserScript==
// @name komplett.no - Mega Chat (Desktop Edition)
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Utvider størrelsen på Komplett sin chat fordi den er så liten originalt. Kan være det blir for stort på laptop
// @author Lasse Brustad
// @grant GM_addStyle
// @run-at document-start
// @match *://*.komplett.no/*
// @downloadURL https://update.greasyfork.org/scripts/450082/komplettno%20-%20Mega%20Chat%20%28Desktop%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/450082/komplettno%20-%20Mega%20Chat%20%28Desktop%20Edition%29.meta.js
// ==/UserScript==

(function() {
let css = `
	.caas .chat-wrapper.chat-open {
		max-height: 1100px !important;
	}
	
	@media (min-width: 600px) {
		.caas .chat-wrapper.chat-open {
			width: 1500px !important;
		}
	}
	
	
	.caas .chat-wrapper .message-input-wrapper .chat-history {
		max-height: 800px !important;
	}
	
	
	.caas .chat-wrapper .message-input-wrapper .chat-history .chat-bubble {
		width: 1350px !important;
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
