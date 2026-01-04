// ==UserScript==
// @name YouTube - Permanent Mouse Cursor / Pointer
// @namespace https://greasyfork.org/en/users/844240-madmanmoon
// @version 1
// @description Removes annoying AI crap.
// @author MadManMoon
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/526710/YouTube%20-%20Permanent%20Mouse%20Cursor%20%20Pointer.user.js
// @updateURL https://update.greasyfork.org/scripts/526710/YouTube%20-%20Permanent%20Mouse%20Cursor%20%20Pointer.meta.js
// ==/UserScript==

(function() {
let css = `
  /* This disables cursor hiding*/
  :root{
    cursor: default !important;
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
