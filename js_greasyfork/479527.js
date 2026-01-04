// ==UserScript==
// @name Remove Video Focus Border for anime1
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A new userstyle
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.anime1.me/*
// @downloadURL https://update.greasyfork.org/scripts/479527/Remove%20Video%20Focus%20Border%20for%20anime1.user.js
// @updateURL https://update.greasyfork.org/scripts/479527/Remove%20Video%20Focus%20Border%20for%20anime1.meta.js
// ==/UserScript==

(function() {
let css = `
    .vjscontainer video[class*="vjs-"]:focus {
        outline: none;
        border-color: inherit;
        -webkit-box-shadow: none;
        box-shadow: none;
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
