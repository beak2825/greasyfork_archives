// ==UserScript==
// @name pocketmonsters.net tweaks
// @namespace shirt.rip
// @version 0.1.0
// @description CSS tweaks for pocketmonsters.net
// @author shirt
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.pocketmonsters.net/*
// @downloadURL https://update.greasyfork.org/scripts/448549/pocketmonstersnet%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/448549/pocketmonstersnet%20tweaks.meta.js
// ==/UserScript==

(function() {
let css = `
  * {
    filter: none !important;
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
