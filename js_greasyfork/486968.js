// ==UserScript==
// @name Test style for debugging conversion to userscript
// @namespace github.com/openstyles/stylus
// @version 45.0.0
// @description It was brought to my attention that some style stopped working as userscript…
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/486968/Test%20style%20for%20debugging%20conversion%20to%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/486968/Test%20style%20for%20debugging%20conversion%20to%20userscript.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `


/**/

el { color: green; }


/**/
`;
if ((location.hostname === "facebook.com" || location.hostname.endsWith(".facebook.com"))) {
  css += ` el { color: red; } `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
