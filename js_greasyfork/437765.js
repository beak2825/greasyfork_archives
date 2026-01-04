// ==UserScript==
// @name 网页贴吧不登录
// @namespace nobaidu.no
// @version 1.0.0
// @description 不显示贴吧登录窗口 no login no
// @author yui
// @grant GM_addStyle
// @run-at document-start
// @match *://*.tieba.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/437765/%E7%BD%91%E9%A1%B5%E8%B4%B4%E5%90%A7%E4%B8%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/437765/%E7%BD%91%E9%A1%B5%E8%B4%B4%E5%90%A7%E4%B8%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
let css = `
    #tiebaCustomPassLogin,.tieba-login-background,.tieba-login-wrapper{display:none!important}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
