// ==UserScript==
// @name Hide Useless Fandom Stuff
// @namespace Gresh1234
// @version 1.1
// @description Gets rid of the non-wiki related stuff in all Fandom websites.
// @author Gresh1234
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/528260/Hide%20Useless%20Fandom%20Stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/528260/Hide%20Useless%20Fandom%20Stuff.meta.js
// ==/UserScript==

(function() {
let css = `.main-container {
	display: flex;
	flex-direction: column;
	margin-left: 0px;
	min-width: calc(768px);
	width: calc(100%);
}

.WikiaBarWrapper {
  display: none;
}

.notifications-placeholder {
  display: none;
}

.global-footer__content {
  display: none;
}

.global-explore-navigation {
	display: none;
}

.page__right-rail {
  display: none;
}

.global-top-navigation__fandom-logo {
  display: none;
}

.global-top-navigation__start-new-wiki {
  display: none;
}

.community-navigation__fandom-heart {
  display: none;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
