// ==UserScript==
// @name codesandbox.io: collapse header for larger editor
// @namespace myfonj
// @version 1.0.0
// @description Pull header and social buttons to side panel
// @author myf
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.codesandbox.io/*
// @downloadURL https://update.greasyfork.org/scripts/441676/codesandboxio%3A%20collapse%20header%20for%20larger%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/441676/codesandboxio%3A%20collapse%20header%20for%20larger%20editor.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "codesandbox.io" || location.hostname.endsWith(".codesandbox.io"))) {
  css += `
   /* categorisation */
  `;
}
if (location.href.startsWith("https://codesandbox.io/s/")) {
  css += `
   header:not(:hover):not(:focus-within) {
     width: 55px;
     overflow: hidden;
   }
   header:not(:hover):not(:focus-within) a[href="/dashboard"] {
    opacity: 0;
   }
   header {
    z-index: 100;
    position: fixed;
    right: auto;
    left: 0;
   }
   /* reclaim header space */
   nav[aria-label="Sandbox Navigation"] + div {
    top: 0 !important;
   }
   /* sweep social buttons to panel */
   nav[aria-label="Sandbox Navigation"] + div > .SplitPane > .Pane1 > [class*="elements__Container"] > :last-child {
    position: fixed;
    bottom: .33em; left: .33em;
    display: flex;
    flex-direction: column;
   }
   nav[aria-label="Sandbox Navigation"] + div > .SplitPane > .Pane1 > [class*="elements__Container"] > :last-child  > div {
    display: contents;
   }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
