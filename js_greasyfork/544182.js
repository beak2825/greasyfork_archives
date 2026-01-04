// ==UserScript==
// @name 央视频网页端 Linux 字体修复
// @namespace https://userstyles.world/user/imgradeone
// @version 20250731.08.06
// @description 修复 Linux 环境下的央视频网页端字体体验（因为央视频网页端只指定了苹方和微软雅黑两个字体）。
// @author imgradeone
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match *://*.yangshipin.cn/*
// @downloadURL https://update.greasyfork.org/scripts/544182/%E5%A4%AE%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E7%AB%AF%20Linux%20%E5%AD%97%E4%BD%93%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/544182/%E5%A4%AE%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E7%AB%AF%20Linux%20%E5%AD%97%E4%BD%93%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
let css = `
* {
    font-family: "Sarasa Gothic SC", "更纱黑体 SC", "Noto Sans CJK SC", sans-serif !important;
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
