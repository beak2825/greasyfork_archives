// ==UserScript==
// @name Sabrina-Online.com – Dark [Ath]
// @namespace athari
// @version 1.0.0
// @description Dark theme for Sabrina-Online.com with layout fixes.
// @author Athari (https://github.com/Athari)
// @homepageURL https://github.com/Athari/AthariUserCSS
// @supportURL https://github.com/Athari/AthariUserCSS/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.sabrina-online.com/*
// @downloadURL https://update.greasyfork.org/scripts/536244/Sabrina-Onlinecom%20%E2%80%93%20Dark%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/536244/Sabrina-Onlinecom%20%E2%80%93%20Dark%20%5BAth%5D.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    color-scheme: dark;
  }

  html, body {
    background: #111;
    color: #eee;
  }
  a {
    color: #88f;
    text-decoration: none;
    &:active, &:hover {
      color: #bbf;
      text-decoration: underline;
    }
    &:visited {
      color: #939;
      &:active, &:hover {
        color: #bbf;
      }
    }
  }
  hr {
    border-color: #999;
  }

  td[bgcolor="#E779F7"],
  td[bgcolor="#E779F7"] :is(img, input[type=image]),
  img[src*="title"][src$=".gif"]:not([src="sabtitle0.gif"]):not([src*="/"]) {
    filter: invert(1) hue-rotate(180deg);
  }
  img[src="sabtitle0.gif"],
  img[src="offiSM.gif"] {
    filter:
      drop-shadow(1px 1px 1px #fff)
      drop-shadow(1px -1px 1px #fff)
      drop-shadow(-1px 1px 1px #fff)
      drop-shadow(-1px -1px 1px #fff);
  }

  img[src^="strip"] {
    box-shadow: 2px 2px 2px #000;
  }

  body > table {
    border-spacing: 0px;
  }
  img[src="sabtitle2.gif"] {
    display: block;
  }
  td[width="80"][bgcolor="#E779F7" i][valign="top" i] {
    min-width: 80px !important;
    + td {
      padding: 0 16px;
    }
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
