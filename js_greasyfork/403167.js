// ==UserScript==
// @name Unlimited Novel Failures Dark Theme
// @namespace ew0345
// @version 1
// @description A dark theme for Unlimited Novel Failures
// @license CC BY-NC Creative Commons Attribution-NonCommerical
// @grant GM_addStyle
// @run-at document-start
// @match *://*.unlimitednovelfailures.mangamatters.com/*
// @downloadURL https://update.greasyfork.org/scripts/403167/Unlimited%20Novel%20Failures%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/403167/Unlimited%20Novel%20Failures%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
body {
    background: #171717 !important;
}
#primary {
    padding-top: 5% !important;
    background-color: #232323 !important;
    color: #eee !important;
    border-radius: 25px !important;
}
.entry-title {
    color: lightslategray !important;
    font-style: italic !important;
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
