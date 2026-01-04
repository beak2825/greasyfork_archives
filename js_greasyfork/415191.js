// ==UserScript==
// @name Misc Layout Tweaks for Gmail
// @namespace http://github.com/exterrestris
// @version 0.3.2
// @description Assorted layout tweaks for Gmail
// @grant GM_addStyle
// @run-at document-start
// @match *://*.mail.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/415191/Misc%20Layout%20Tweaks%20for%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/415191/Misc%20Layout%20Tweaks%20for%20Gmail.meta.js
// ==/UserScript==

(function() {
let css = `@namespace url(http://www.w3.org/1999/xhtml);

  .age.apN {
    overflow-x: auto;
  }

  .age.apP {
    overflow-x: hidden;
  }

  .aps {
    background-color: #f0f0ff;
  }

  .xX {
    width: 13ex;
  }

  .Wg {
    padding-right: 8px;
    padding-top: 10px;
  }

  .a3s img {
    max-width: 100%;
    height: auto;
  }

  .a3s :not(table, tbody, tr, th, td) > table:not([width], [style*="width"]),
  .aHU :not(table, tbody, tr, th, td) > table[width]:not([align], [width$="%"]) {
    width: 100% !important;
  }

  .ao8 {
    padding-right: 0;
  }

  * {
    scrollbar-width: thin;
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
