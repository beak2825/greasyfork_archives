// ==UserScript==
// @name RemoveContentWarning
// @namespace liquid5925.styles
// @version 1.0.0
// @description Simple style that removes content warning on Twitter photos/videos in tweets
// @author liquid5925
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/454238/RemoveContentWarning.user.js
// @updateURL https://update.greasyfork.org/scripts/454238/RemoveContentWarning.meta.js
// ==/UserScript==

(function() {
let css = `
    div:has(> div > [style="backdrop-filter: blur(4px); background-color: rgba(255, 255, 255, 0.25);"]){
        display: none;
    }
    
    .r-yfv4eo {
        filter: blur(0px);
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
