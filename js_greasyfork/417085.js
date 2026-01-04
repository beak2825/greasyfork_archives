// ==UserScript==
// @name NewsBlur - Stop yelling
// @namespace https://greasyfork.org/en/users/710405-ajhall
// @version 1.0.0
// @description Change ALLCAPS text on NewsBlur into something more reasonable
// @author ajhall
// @grant GM_addStyle
// @run-at document-start
// @match *://*.newsblur.com/*
// @downloadURL https://update.greasyfork.org/scripts/417085/NewsBlur%20-%20Stop%20yelling.user.js
// @updateURL https://update.greasyfork.org/scripts/417085/NewsBlur%20-%20Stop%20yelling.meta.js
// ==/UserScript==

(function() {
let css = `
  * {
    text-transform: none !important;
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
