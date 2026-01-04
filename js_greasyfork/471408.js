// ==UserScript==
// @name dm5+漫畫櫃 隱藏Y軸
// @namespace https://greasyfork.org/zh-TW/scripts/471408
// @version 1.5.1
// @description dm5、看漫畫(manhuagui)隱藏卷軸Y
// @author Leadra
// @homepageURL https://greasyfork.org/zh-TW/users/4839
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.dm5.com/*
// @match *://*.www.manhuagui.com/*
// @downloadURL https://update.greasyfork.org/scripts/471408/dm5%2B%E6%BC%AB%E7%95%AB%E6%AB%83%20%E9%9A%B1%E8%97%8FY%E8%BB%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/471408/dm5%2B%E6%BC%AB%E7%95%AB%E6%AB%83%20%E9%9A%B1%E8%97%8FY%E8%BB%B8.meta.js
// ==/UserScript==

(function() {
let css = `
::-webkit-scrollbar {
  width: 0em;
    overflow-x: auto;
}  
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}  
::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border: 1px solid #708090;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
