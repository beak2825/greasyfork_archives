// ==UserScript==
// @name imobiliare
// @namespace patraulea.com
// @version 0.2.0
// @description Imobiliare.
// @author Patraulea Trandafir
// @grant GM_addStyle
// @run-at document-start
// @match *://*.blitz.ro/*
// @match *://*.imobiliare.ro/*
// @match *://*.edil.ro/*
// @match *://*.impakt-imobiliare.ro/*
// @match *://*.weltimobiliare.ro/*
// @match *://*.residence-imobiliare.ro/*
// @match *://*.chirieclujnapoca.ro/*
// @match *://*.olx.ro/*
// @downloadURL https://update.greasyfork.org/scripts/409484/imobiliare.user.js
// @updateURL https://update.greasyfork.org/scripts/409484/imobiliare.meta.js
// ==/UserScript==

(function() {
let css = `
.listing-title h4 a,
.grid-view>li>a p.offer-title,
h2 a,
h2 a:hover,
h4 a, 
a.cf, 
.box-anunt h2.titlu-anunt,
div.pic a span,
.link
{
    color: -webkit-link ! important;
}

/*residence-imobiliare.ro: .properties-grid .property h2 a*/

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
