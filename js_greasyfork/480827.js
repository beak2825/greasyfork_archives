// ==UserScript==
// @name Google Poeple Also Ask Remover
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Removes "People Also Ask" section from Google search results page
// @author Doron Gold
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^https://www\.google\.[^/]*/.*)$/
// @downloadURL https://update.greasyfork.org/scripts/480827/Google%20Poeple%20Also%20Ask%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/480827/Google%20Poeple%20Also%20Ask%20Remover.meta.js
// ==/UserScript==

(function() {
let css = `
    #rso > div:nth-child(2) {
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
