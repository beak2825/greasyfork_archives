// ==UserScript==
// @name Hide scrollbar
// @namespace https://greasyfork.org/en/users/322108-nullgemm
// @version 0.2.1
// @description Hides the main scrollbar
// @author nullgemm
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/400261/Hide%20scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/400261/Hide%20scrollbar.meta.js
// ==/UserScript==

(function() {
let css = `html
{
  scrollbar-width: none;
}
::-webkit-scrollbar
{
    display:none;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
