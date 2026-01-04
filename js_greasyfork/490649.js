// ==UserScript==
// @name SUP OA: No Watermarks
// @namespace https://jasonhk.dev/
// @version 1.0.0
// @description Remove watermarks on SUP OA.
// @author Jason Kwok
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.oa.sup.services/*
// @downloadURL https://update.greasyfork.org/scripts/490649/SUP%20OA%3A%20No%20Watermarks.user.js
// @updateURL https://update.greasyfork.org/scripts/490649/SUP%20OA%3A%20No%20Watermarks.meta.js
// ==/UserScript==

(function() {
let css = `
    .water-mark
    {
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
