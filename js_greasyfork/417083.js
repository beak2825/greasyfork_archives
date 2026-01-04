// ==UserScript==
// @name Google - Hide user reviews
// @namespace https://greasyfork.org/en/users/710405-ajhall
// @version 1.0.0
// @description Hide user reviews on Google.com search results
// @author ajhall
// @grant GM_addStyle
// @run-at document-start
// @match *://*.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/417083/Google%20-%20Hide%20user%20reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/417083/Google%20-%20Hide%20user%20reviews.meta.js
// ==/UserScript==

(function() {
let css = `
  div[data-attrid="kc:/ugc:user_reviews"] {
    display: none !important
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
