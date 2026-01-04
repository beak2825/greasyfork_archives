// ==UserScript==
// @name 滚动条美化
// @namespace laster2800
// @version 1.0.2.20210817
// @description 美化滚动条
// @author Laster2800
// @homepageURL https://greasyfork.org/zh-CN/scripts/430290
// @supportURL https://greasyfork.org/zh-CN/scripts/430290/feedback
// @license LGPL-3.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/430290/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/430290/%E6%BB%9A%E5%8A%A8%E6%9D%A1%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
let css = `body::-webkit-scrollbar {
    width: 15px;
    height: 12px;
    background-color: #00000000;
}

body::-webkit-scrollbar-thumb {
    background-color: #00000040;
}

body::-webkit-scrollbar-corner {
    background-color: #00000000;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
