// ==UserScript==
// @name BewlyBewly + Bilibili Evolved 颜色问题修复
// @namespace bewlybewly-bilibilievolved-color-fix
// @version 1.0.1
// @description 修复 BewlyBewly 插件和 Bilibili Evolved 脚本同时使用时B站图标颜色显示不正常的问题
// @author lingbopro
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/509043/BewlyBewly%20%2B%20Bilibili%20Evolved%20%E9%A2%9C%E8%89%B2%E9%97%AE%E9%A2%98%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/509043/BewlyBewly%20%2B%20Bilibili%20Evolved%20%E9%A2%9C%E8%89%B2%E9%97%AE%E9%A2%98%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
let css = `
    /* 移除 Bilibili Evolved 颜色滤镜 */
    :root {
        --pink-image-filter: none!important;
        --blue-image-filter: none!important;
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
