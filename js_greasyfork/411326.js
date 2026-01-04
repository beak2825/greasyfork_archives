// ==UserScript==
// @name GitHub: Always Expand Timeline Contents
// @namespace rinsuki.net
// @version 1.0.0
// @description A new userstyle
// @author rinsuki
// @grant GM_addStyle
// @run-at document-start
// @match *://*.github.com/*
// @downloadURL https://update.greasyfork.org/scripts/411326/GitHub%3A%20Always%20Expand%20Timeline%20Contents.user.js
// @updateURL https://update.greasyfork.org/scripts/411326/GitHub%3A%20Always%20Expand%20Timeline%20Contents.meta.js
// ==/UserScript==

(function() {
let css = `
    #dashboard .news .js-news-feed-event-group.Details:not(.Details--on) .Details-content--hidden.body {
        display: block !important;
    }
    #dashboard .news .js-news-feed-event-group.Details button.js-details-target {
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
