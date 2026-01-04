// ==UserScript==
// @name Patreon - Hide Comments
// @namespace http://tampermonkey.net/
// @version 3.0.2
// @description Hides the comments on Patreon creator posts. Designed to alleviate stress.
// @author XerBlade
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match *://*.patreon.com/*
// @downloadURL https://update.greasyfork.org/scripts/425161/Patreon%20-%20Hide%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/425161/Patreon%20-%20Hide%20Comments.meta.js
// ==/UserScript==

(function() {
let css = `

    div[data-tag="content-card-comment-thread-container"], div[data-tag="post-details"] ~ div {
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
