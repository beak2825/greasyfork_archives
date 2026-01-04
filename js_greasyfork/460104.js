// ==UserScript==
// @name Better Bing AI
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A new userstyle
// @author rinsuki
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.bing.com/*
// @downloadURL https://update.greasyfork.org/scripts/460104/Better%20Bing%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/460104/Better%20Bing%20AI.meta.js
// ==/UserScript==

(function() {
let css = `
    /* ここにコードを挿入... */
    body {
        --cib-font-text: -apple-system, Roboto, SegoeUI, 'Segoe UI', 'Helvetica Neue', Helvetica, sans-serif !important;
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
