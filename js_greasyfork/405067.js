// ==UserScript==
// @name Facepunch Commits—Better readability
// @namespace github.com/openstyles/stylus
// @version 1.0.3
// @description Commit descriptions adjusted: dark text on light background.
// @author sK6g6Z6IXv2JA8eH
// @grant GM_addStyle
// @run-at document-start
// @match *://*.commits.facepunch.com/*
// @downloadURL https://update.greasyfork.org/scripts/405067/Facepunch%20Commits%E2%80%94Better%20readability.user.js
// @updateURL https://update.greasyfork.org/scripts/405067/Facepunch%20Commits%E2%80%94Better%20readability.meta.js
// ==/UserScript==

(function() {
let css = `
	.commit.columns > .column:last-of-type {
		background-color: #f3f2f1;
	}
	.commit .repository {
		font-weight: normal;
		margin-bottom: 0.5em;
	}
	.commit .repository .repo a {
		color: #7cb43c;
	}
	.commit .repository .branch a {
		color: #dba400;
	}
	.commit .repository * a:hover {
		color: #383c42 !important;
	}
	.commit .commits-message {
		font-size: 0.9rem;
		color: #383c42;
	}
	.likes .like-button {
		color: rgba(56, 60, 66, .5);
	}
	.likes .like-button.current {
		color: #7cb43c;
	}
	.likes .like-button.current i {
		color: #7cb43c;
	}
	.likes .like-button i {
		color: rgba(56, 60, 66, .8);
	}
	.likes .like-button:hover {
		background-color: rgba(175, 175, 175, .2);
		border: 1px solid rgba(175, 175, 175, .3);
		color: #000;
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
