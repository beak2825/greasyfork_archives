// ==UserScript==
// @name 自定义代码字体 (自用)
// @namespace acdzh_code_font
// @version 0.0.3
// @description 自定义代码字体
// @author acdzh <acdzh@outlook.com>
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/447694/%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BB%A3%E7%A0%81%E5%AD%97%E4%BD%93%20%28%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447694/%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BB%A3%E7%A0%81%E5%AD%97%E4%BD%93%20%28%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
let css = `code, pre {
    font-family: Fira Code VF,Fira Code,Monaco,Menlo,Consolas,Droid Sans Mono,Courier New,monospace !important;
    font-variant-ligatures: normal !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
