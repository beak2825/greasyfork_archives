// ==UserScript==
// @name imdb reference 2025
// @namespace usercss
// @version 0.0.1.20250917183114
// @description various fixes for IMDbs new reference layout
// @grant GM_addStyle
// @run-at document-start
// @match *://*.imdb.com/*
// @downloadURL https://update.greasyfork.org/scripts/539233/imdb%20reference%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/539233/imdb%20reference%202025.meta.js
// ==/UserScript==

(function() {
let css = `

  h3 {font-size: 15px !important}
  
  [data-testid="hero__primary-text"] {font-size: 20px !important}
  
  [data-testid="hero__primary-text-suffix"] {font-size: 15px !important; vertical-align: baseline !important;}
  
  
  .ipc-link.ipc-link--base.name-credits--title-text.name-credits--title-text-big {font-weight: normal !important}
  
  .ipc-title__wrapper, .ipc-title-link-wrapper, .ipc-title__text {height: 22px !important}
  
[data-testid^="title-pc-principal-credit"],

  .ipc-scroll-to-top-button,
  .ipc-title__actions,
  .sc-e130ccf-0.ejKnoj,
  .sc-466f296a-1.jyZigm,
  .sc-a4f2ee84-2.kMoVTP,[data-testid^="hero-subnav-bar-right-block"]  {
visibility: hidden !important;
display: none !important;
}


section, .ipc-title__wrapper {border-left-color: none !important; margin: none !important}

.ipc-title--section-title,.ipc-title--subsection-title {background: none !important}
  .ipc-title__text:before {background: none !important}
  
  * { border:none !important}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
