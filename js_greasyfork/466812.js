// ==UserScript==
// @name 自用样式
// @namespace github.com/openstyles/stylu
// @version 2022.2023.5
// @description 按我
// @author 仰
// @license none
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/466812/%E8%87%AA%E7%94%A8%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/466812/%E8%87%AA%E7%94%A8%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
let css = `.my-class {
       color: red;
       font-weight: bold;
     }`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
