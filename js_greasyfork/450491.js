// ==UserScript==
// @name Youtube Disable SHORTS
// @namespace https://greasyfork.org/en/users/153478-greasyshiny
// @version 1.2
// @description Simply hides all Shorts from Youtube
// @author GreasyShiny
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/450491/Youtube%20Disable%20SHORTS.user.js
// @updateURL https://update.greasyfork.org/scripts/450491/Youtube%20Disable%20SHORTS.meta.js
// ==/UserScript==

(function() {
let css = `

/* SHORTS DISABLER. Possible via the :has selector, available in Chrome, starting with version 105. */

ytd-grid-video-renderer.ytd-grid-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style=SHORTS]), ytd-rich-item-renderer:has(ytd-thumbnail-overlay-time-status-renderer[overlay-style=SHORTS]) {
    display:none !important
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
