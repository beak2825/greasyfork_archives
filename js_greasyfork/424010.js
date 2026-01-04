// ==UserScript==
// @name B站头图更换（动图）
// @namespace https://cocoa.chino
// @version 1.0.2
// @description 可以自行换图，默认智乃厨XD
// @author yui_san
// @grant GM_addStyle
// @run-at document-start
// @match *://*.space.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/424010/B%E7%AB%99%E5%A4%B4%E5%9B%BE%E6%9B%B4%E6%8D%A2%EF%BC%88%E5%8A%A8%E5%9B%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/424010/B%E7%AB%99%E5%A4%B4%E5%9B%BE%E6%9B%B4%E6%8D%A2%EF%BC%88%E5%8A%A8%E5%9B%BE%EF%BC%89.meta.js
// ==/UserScript==

(function() {
let css = `
    .h-inner{
    background-image: url(https://i0.hdslb.com/bfs/space/495a961d2a11279c35ad01ff3e50159fbea414a3.png)!important;
    /*@2560w_400h_100q_1o.webp借用@秋雨冬落_的头图，感谢*/
    background-position: 60% 77%!important;
    /*background-repeat: repeat-y;
    background-size: contain!important;*/
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
