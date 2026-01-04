// ==UserScript==
// @name Remove YouTube Movie Purchase
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description to remove YouTube Movie Purchase
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.youtube.com/watch?v=*
// @downloadURL https://update.greasyfork.org/scripts/468212/Remove%20YouTube%20Movie%20Purchase.user.js
// @updateURL https://update.greasyfork.org/scripts/468212/Remove%20YouTube%20Movie%20Purchase.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    ytd-watch-next-secondary-results-renderer.ytd-watch-flexy ytd-compact-movie-renderer.style-scope.ytd-item-section-renderer {
        display: none;
    }
    #offer-module.ytd-watch-next-secondary-results-renderer {
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
