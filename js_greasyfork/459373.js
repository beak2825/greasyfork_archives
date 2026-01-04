// ==UserScript==
// @name Polygon Dark Theme
// @namespace Yeehaw
// @version 2023.03.02
// @description Makes Polygon less aids for the eyes
// @author NoahBK
// @license Like I give a fuck
// @grant GM_addStyle
// @run-at document-start
// @match *://*.polygon.com/*
// @downloadURL https://update.greasyfork.org/scripts/459373/Polygon%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/459373/Polygon%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.3);
    border-radius: 0px;
    background-color: #212121;
  }
  html[hide-scrollbar="true"] ::-webkit-scrollbar {
    display: none;
  }
  ::-webkit-scrollbar {
    width: 8px;
    background-color: #212121;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 0px;
    -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, .3);
    background: linear-gradient(360deg, #da0050 50%, #8e2b88 100%);
  }

  body,
  .l-root,
  .c-showcase-eight-up__main,
  .c-two-group-breaker__main,
  .c-showcase-eight-up .c-entry-box--compact,
  .l-hub-wrapper,
  .l-main-content,
  .c-river-section-title--basic h2,
  .c-showcase-eight-up .c-entry-box--compact:nth-child(5),
  .c-compact-river__entry,
  .c-rock-list,
  .c-tab-bar,
  .c-entry-group-labels__item:first-child::before,
  .c-entry-group-labels__item:nth-child(2):before,
  .c-entry-group-labels__item:first-child:hover::before,
  .c-comments__message,
  .c-shoppable,
  .c-user-activity__entry:nth-child(odd),
  .c-two-up .c-entry-box-hero,
  .c-showcase-five-up__main,
  .c-showcase-five-up .c-entry-box--compact {
    background: #0e0e0e;
    border-color: #111;
    color: #eee;
  }
  .c-user-activity__modes a {
    background: #0e0e0e;
  }
  .c-showcase-five-up .c-entry-box--comp
  `;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
