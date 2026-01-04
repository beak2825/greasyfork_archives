// ==UserScript==
// @name DW Spoiler Cuts
// @namespace https://greasyfork.org/en/users/571926-nonniemoose
// @version 1.0
// @description Spoiler cuts for Dreamwidth
// @grant GM_addStyle
// @run-at document-start
// @match *://*.dreamwidth.org/*
// @downloadURL https://update.greasyfork.org/scripts/404067/DW%20Spoiler%20Cuts.user.js
// @updateURL https://update.greasyfork.org/scripts/404067/DW%20Spoiler%20Cuts.meta.js
// ==/UserScript==

(function() {
let css = `

div[tabindex] {display: inline;}
div[tabindex]>b~div {display: none;}
div[tabindex]>b {color: #00f; text-decoration: underline; cursor: pointer;}
div[tabindex]>b::before {content: "[";}
div[tabindex]>b::after {content: "]";}

div[tabindex]:focus>b {display: none;}
div[tabindex]:focus>b~div {display: inline;}
div[tabindex]:focus {outline: none;}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
