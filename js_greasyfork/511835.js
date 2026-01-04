// ==UserScript==
// @name 鸿蒙字体
// @namespace 鸿蒙字体
// @version 1.9.4
// @description 使用华为鸿蒙字体替换网页字体
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/511835/%E9%B8%BF%E8%92%99%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/511835/%E9%B8%BF%E8%92%99%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `


@import url('https://s1.hdslb.com/bfs/static/jinkela/long/font/medium.css');

/* 全局应用 HarmonyOS_Medium 字体 */
* {
    font-family: 'HarmonyOS_Medium' !important;
}

/* 排除特定域名 */
`;
if (new RegExp("^(?:^(?!.*(fanqienovel\\.com/reader|android\\.google\\.cn|bilibili\\.com|developer\\.huawei\\.com|ai\\.qaqgpt\\.com)).*\$)\$").test(location.href)) {
  css += `
      * {
          font-family: 'HarmonyOS_Medium' !important;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
