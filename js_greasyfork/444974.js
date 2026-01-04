// ==UserScript==
// @name MsDocToc
// @namespace mailto: fish404hsif@gmail.com
// @version 0.1.1
// @description Sticky Microsoft Docs TOC
// @author fish-404
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.docs.microsoft.com/*
// @match *://*.learn.microsoft.com/*
// @downloadURL https://update.greasyfork.org/scripts/444974/MsDocToc.user.js
// @updateURL https://update.greasyfork.org/scripts/444974/MsDocToc.meta.js
// ==/UserScript==

(function() {
let css = `
    .is-vertically-scrollable {
        position: sticky;
        top: 3vh;
    }

    #right-rail-in-this-article-list {
        overflow-y: auto;
        max-height: 70vh;
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
