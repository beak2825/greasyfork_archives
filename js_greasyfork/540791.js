// ==UserScript==
// @name MyHeritage: line weight
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Increases the stroke of the lines.
// @author ciricuervo
// @grant GM_addStyle
// @run-at document-start
// @match *://*.myheritage.com/*
// @match *://*.myheritage.es/*
// @downloadURL https://update.greasyfork.org/scripts/540791/MyHeritage%3A%20line%20weight.user.js
// @updateURL https://update.greasyfork.org/scripts/540791/MyHeritage%3A%20line%20weight.meta.js
// ==/UserScript==

(function() {
let css = `

    path:not(g[data-type='_svgOuterGroup'] path) {
        stroke: rgb(128, 128, 128);
        stroke-width: 1.5px;
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
