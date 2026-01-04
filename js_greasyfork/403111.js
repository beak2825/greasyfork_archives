// ==UserScript==
// @name Fandom - Remove Garbage
// @namespace https://greasyfork.org/users/317698
// @version 1.0.0
// @description Makes fandom wiki pages great again (removes top video, sidebar, bottom bar, bottom feeds, fandom navigation, and extends main content to fill container).
// @author jurassicplayer
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.fandom.com/*
// @downloadURL https://update.greasyfork.org/scripts/403111/Fandom%20-%20Remove%20Garbage.user.js
// @updateURL https://update.greasyfork.org/scripts/403111/Fandom%20-%20Remove%20Garbage.meta.js
// ==/UserScript==

(function() {
let css = `

  #mixed-content-footer, #WikiaRailWrapper, div[itemprop="video"], .wds-global-footer, #WikiaBarWrapper, .wds-global-navigation__content-bar-left {
    display:none;
  }

  #WikiaMainContent {
	width: 100%;
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
