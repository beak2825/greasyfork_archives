// ==UserScript==
// @name Imaglr Extra Ad remover
// @namespace Hentiedup
// @version 0.2.2
// @description Hide those "Sponsored" and "Go Premium" ad posts that are among normal posts
// @author Hentiedup
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.imaglr.com/*
// @downloadURL https://update.greasyfork.org/scripts/536121/Imaglr%20Extra%20Ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/536121/Imaglr%20Extra%20Ad%20remover.meta.js
// ==/UserScript==

(function() {
let css = `
    .profile-content > .container > .flex > div.mb-4,
    .sidebar-vast-ad {
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
