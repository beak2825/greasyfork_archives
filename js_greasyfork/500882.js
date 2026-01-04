// ==UserScript==
// @name 百度搜索-去掉AI回答
// @namespace blolll
// @version 1.5
// @description 去掉百度搜索自带的AI回答
// @author 豪斯DR
// @license CC-BY-NC-ND-4.0
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^https?:\/\/(www.)?baidu.com\/s\?.*)$/
// @include /^(?:^https?:\/\/(www.)?baidu.com\/.*?&word=.*)$/
// @include /^(?:^https?:\/\/(www.)?baidu.com.*)$/
// @downloadURL https://update.greasyfork.org/scripts/500882/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2-%E5%8E%BB%E6%8E%89AI%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/500882/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2-%E5%8E%BB%E6%8E%89AI%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

(function() {
let css = `
[class^="wenda-general"],
.sc-aladdin,
[tpl="wenda_generate"],
[class^="_aladdin"] {
    display: none !important;
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
