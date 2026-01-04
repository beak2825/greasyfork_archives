// ==UserScript==
// @name [yande.re] Show and highlight HIDDEN posts
// @namespace yui
// @version 1.0.0
// @description Uncensored pictures are the best 显示并高亮隐藏的图片
// @author yui
// @grant GM_addStyle
// @run-at document-start
// @match *://*.yande.re/*
// @downloadURL https://update.greasyfork.org/scripts/463796/%5Byandere%5D%20Show%20and%20highlight%20HIDDEN%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/463796/%5Byandere%5D%20Show%20and%20highlight%20HIDDEN%20posts.meta.js
// ==/UserScript==

(function() {
let css = `
    .javascript-hide {
    display: block !important;
    background-color: antiquewhite
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
