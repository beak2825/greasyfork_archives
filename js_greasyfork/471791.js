// ==UserScript==
// @name author note remover (RoyalRoad)
// @namespace http://ironbrain.io/
// @version 1.0
// @description Hides the author notes on royalroad posts
// @author Lati
// @license GNU
// @grant GM_addStyle
// @run-at document-start
// @match http://royalroad.com/*
// @match https://royalroad.com/*
// @match http://*.royalroad.com/*
// @match https://*.royalroad.com/*
// @downloadURL https://update.greasyfork.org/scripts/471791/author%20note%20remover%20%28RoyalRoad%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471791/author%20note%20remover%20%28RoyalRoad%29.meta.js
// ==/UserScript==

(function() {
let css = `
    .author-note-portlet {
        display: none !important;
    }
`;

if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
