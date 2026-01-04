// ==UserScript==
// @name ESJ Zone：更好的用戶介面
// @namespace https://jasonhk.dev/
// @version 1.1.0
// @description 透過調整 ESJ Zone 的用戶介面來改善使用體驗。
// @author Jason Kwok
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.esjzone.cc/my/favorite*
// @match https://www.esjzone.cc/my/reply*
// @match https://www.esjzone.cc/my/view*
// @downloadURL https://update.greasyfork.org/scripts/459723/ESJ%20Zone%EF%BC%9A%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%94%A8%E6%88%B6%E4%BB%8B%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/459723/ESJ%20Zone%EF%BC%9A%E6%9B%B4%E5%A5%BD%E7%9A%84%E7%94%A8%E6%88%B6%E4%BB%8B%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
let css = `
    .product-title
    {
        width: revert !important;
        white-space: revert;
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
