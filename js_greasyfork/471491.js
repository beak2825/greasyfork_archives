// ==UserScript==
// @name GitHub bring back tabs
// @namespace github.com/regs01/usercss
// @version 1.0.0
// @description Bringing back tabs, which are far better for readability
// @author coth
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.github.com/*
// @downloadURL https://update.greasyfork.org/scripts/471491/GitHub%20bring%20back%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/471491/GitHub%20bring%20back%20tabs.meta.js
// ==/UserScript==

(function() {
let css = `

nav.UnderlineNav
{
  max-width: 1280px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: 32px !important;
}

nav.UnderlineNav li
{
  position: relative !important;
  top: 6px !important;
  border-top-left-radius: 4px !important;
  border-top-right-radius: 4px !important;
  overflow: hidden !important;
}

nav.UnderlineNav li > .UnderlineNav-item
{
  border-radius: 0px !important;
  padding-top: 0px !important;
  padding-bottom: 4px !important;
  border-color: transparent;
  border-style: solid !important;
  border-width: 3px 1.5px 0px 1.5px !important;
}

nav.UnderlineNav li > .UnderlineNav-item.selected::after
{
  display: none !important;
}

nav.UnderlineNav li > .UnderlineNav-item.selected
{
  border-top: 3px solid #fd8c73 !important;
  border-bottom: none !important;
}

@media (prefers-color-scheme: light) {
  
  nav.UnderlineNav li > .UnderlineNav-item.selected
  {
    background-color: #fff !important;
    border-left: 1.5px solid #d8dee4 !important;
    border-right: 1.5px solid #d8dee4 !important;
  }
  
}

@media (prefers-color-scheme: dark) {
  
  nav.UnderlineNav li > .UnderlineNav-item.selected
  {
    background-color: #0d1117 !important;
    border-left: 1.5px solid #21262d !important;
    border-right: 1.5px solid #21262d !important;
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
