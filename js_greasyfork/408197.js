// ==UserScript==
// @name Watch2Gether - Hide Suggestions
// @namespace https://greasyfork.org/users/673307
// @version 1.1.1
// @description Hides video suggestions.
// @author BabblingFishes
// @homepageURL https://greasyfork.org/en/scripts/408197-watch2gether-hide-suggestions
// @license CC-BY-4.0
// @grant GM_addStyle
// @run-at document-start
// @match https://www.watch2gether.com/rooms/*
// @match https://w2g.tv/rooms/*
// @downloadURL https://update.greasyfork.org/scripts/408197/Watch2Gether%20-%20Hide%20Suggestions.user.js
// @updateURL https://update.greasyfork.org/scripts/408197/Watch2Gether%20-%20Hide%20Suggestions.meta.js
// ==/UserScript==

(function() {
let css = `
#w2g-editorial, .w2g-search-spacer, .w2g-center-ad, .w2g-square-ad {
    display: none !important;
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
