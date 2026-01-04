// ==UserScript==
// @name Take Tumblr Back to the Rightside Up
// @namespace https://greasyfork.org/users/662334
// @version 1.0.0
// @description No upside down ad on Tumblr for Stranger Things, please. (Hides only the Stranger Things ads not currently hidden by New XKit or XKit Rewritten.)
// @author citrusella
// @supportURL https://citrusella-flugpucker.tumblr.com
// @license CC-BY-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.tumblr.com/*
// @downloadURL https://update.greasyfork.org/scripts/447272/Take%20Tumblr%20Back%20to%20the%20Rightside%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/447272/Take%20Tumblr%20Back%20to%20the%20Rightside%20Up.meta.js
// ==/UserScript==

(function() {
let css = `
    .nnpB9.L5BHV, .QOMh2 img {
        display: none;
    }
    .QOMh2 a div {
        background-image: url(https://imgur.com/W1qHKEx.png) !important;
        background-repeat: no-repeat;
        height: 33px;
        width: 33px;
        background-size: 14px 27px;
        background-position: center;
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
