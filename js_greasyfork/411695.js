// ==UserScript==
// @name bdsmlr - Extra Ad Remover
// @namespace Hentiedup
// @version 0.0.5
// @description Remove tricky ads that adblock doesn't remove. (tested /w uBlock)
// @author Hentiedup
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bdsmlr.com/*
// @downloadURL https://update.greasyfork.org/scripts/411695/bdsmlr%20-%20Extra%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/411695/bdsmlr%20-%20Extra%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
let css = `
    .newsfeed > .feed[class="feed clearfix "],
    .newsfeed > a[href]:not([class]),
    .newsfeed > .firstitems > a[href]:not([class]){
        display: none !important;
    }
    .anad,
    .hyper-premium,
    #premo,
    .aholder,
    .atitle,
    iframe:empty {
        display: none !important;
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
