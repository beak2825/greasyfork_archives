// ==UserScript==
// @name 网页无图模式 no pic
// @namespace nopic
// @version 1.0.0
// @description 网页无图模式
// @author Me
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:.*)$/
// @downloadURL https://update.greasyfork.org/scripts/459954/%E7%BD%91%E9%A1%B5%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F%20no%20pic.user.js
// @updateURL https://update.greasyfork.org/scripts/459954/%E7%BD%91%E9%A1%B5%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F%20no%20pic.meta.js
// ==/UserScript==

(function() {
let css = `img{display:none!important}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
