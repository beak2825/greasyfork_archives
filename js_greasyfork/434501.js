// ==UserScript==
// @name zhwiki
// @namespace span
// @version 1.2
// @description change font and background
// @author max
// @grant GM_addStyle
// @run-at document-start
// @match *://*.wikipedia.org/*
// @match *://*.zh.m.wikipedia.org/*
// @downloadURL https://update.greasyfork.org/scripts/434501/zhwiki.user.js
// @updateURL https://update.greasyfork.org/scripts/434501/zhwiki.meta.js
// ==/UserScript==

(function() {
let css = `
body
 {
  border: none !important; 
  font-family: PingFangTC-Medium !important; 
  font-size: 14px !important; 
 }
ol.references {
    counter-reset: mw-ref-extends-parent list-item;
    font-size: 40%;
}
.mw-parser-output .refbegin {
    font-size: 40%;
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
