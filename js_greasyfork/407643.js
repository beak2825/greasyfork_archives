// ==UserScript==
// @name TL.net Footer Team Images
// @namespace tl.net
// @version 1.0.0
// @description Integrates footer team images into a posts body to reduce unused space.
// @author Korakys
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.tl.net/*
// @downloadURL https://update.greasyfork.org/scripts/407643/TLnet%20Footer%20Team%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/407643/TLnet%20Footer%20Team%20Images.meta.js
// ==/UserScript==

(function() {
let css = `

  .pnt01
  {
    padding-bottom: 0em;
  }

  .forumPost > section
  {
    padding: 10px 8px 18px 8px;
    word-wrap: break-word;
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
