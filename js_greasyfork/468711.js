// ==UserScript==
// @name Hide YouTube Pause Overlay
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description To hide YouTube Pause Overlay
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @match *://*.youtu.be/*
// @match *://*.www.yout-ube.com/*
// @match *://*.www.youtube-nocookie.com/*
// @downloadURL https://update.greasyfork.org/scripts/468711/Hide%20YouTube%20Pause%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/468711/Hide%20YouTube%20Pause%20Overlay.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    
    .ytp-embed#movie_player .ytp-pause-overlay {
      display: none;
    }

    .paused-mode.ytp-expand-pause-overlay .ytp-pause-overlay {
      display: none;
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
