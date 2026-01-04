// ==UserScript==
// @name Hide YouTube Shorts in Videos SidePanel
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description To hide YouTube Shorts in Videos SidePanel
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/468799/Hide%20YouTube%20Shorts%20in%20Videos%20SidePanel.user.js
// @updateURL https://update.greasyfork.org/scripts/468799/Hide%20YouTube%20Shorts%20in%20Videos%20SidePanel.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    ytd-watch-next-secondary-results-renderer.ytd-watch-flexy ytd-reel-shelf-renderer.ytd-item-section-renderer {display:none}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
