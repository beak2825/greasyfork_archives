// ==UserScript==
// @name UKVCAS Free Slots HIghlighter
// @namespace yui
// @version 1.0.0
// @description f***ing UKVCAS
// @author Me
// @grant GM_addStyle
// @run-at document-start
// @match *://*.ukvcas.co.uk/*
// @downloadURL https://update.greasyfork.org/scripts/451580/UKVCAS%20Free%20Slots%20HIghlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/451580/UKVCAS%20Free%20Slots%20HIghlighter.meta.js
// ==/UserScript==

(function() {
let css = `
    p.appointment-cost{display:none!important}
strong {
    font-size:47px!important;
    color: #ff0000!important}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
