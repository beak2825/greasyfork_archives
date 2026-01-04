// ==UserScript==
// @name Twitter Zoom Cursor
// @namespace https://github.com/chocolateboy/userscripts
// @version 0.1.0
// @description Distinguish between images and links on Twitter
// @author chocolateboy
// @license GPL
// @grant GM_addStyle
// @run-at document-start
// @match https://twitter.com/*
// @match https://mobile.twitter.com/*
// @match https://x.com/*
// @match https://mobile.x.com/*
// @downloadURL https://update.greasyfork.org/scripts/413963/Twitter%20Zoom%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/413963/Twitter%20Zoom%20Cursor.meta.js
// ==/UserScript==

(function() {
let css = `
    a[role="link"][href^="/"][href$="/photo/1"],
    a[role="link"][href^="/"][href$="/photo/2"],
    a[role="link"][href^="/"][href$="/photo/3"],
    a[role="link"][href^="/"][href$="/photo/4"] {
        cursor: zoom-in !important;
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
