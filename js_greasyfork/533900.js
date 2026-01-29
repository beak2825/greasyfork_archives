// ==UserScript==
// @name        妖火夜间模式
// @namespace   http://yaohuo.me/
// @supportURL  http://zgcwkj.cn
// @version     20260128.02
// @description 妖火论坛黑色主题样式
// @author      zgcwkj
// @match       *://yaohuo.me/*
// @match       *://www.yaohuo.me/*
// @license     MIT
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/533900/%E5%A6%96%E7%81%AB%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/533900/%E5%A6%96%E7%81%AB%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
(function() {
  //暗黑样式
  var myCss = `
@media screen and (prefers-color-scheme: dark) {
  * {
    color: #d8d8d8;
    background: #00000000 !important;
    border-color: #3a3a3a !important;
  }
  html, body {
    background: #121212 !important;
  }
  img {
    opacity: 0.65 !important;
  }
  a {
    color: #8ab4f8 !important;
  }
  h1, h2, h3, h4, h5, h6, div, label, input, code, span, button, .triangle-alert {
    color: #d8d8d8 !important;
  }
  .file-header-url*, .mod-list* {
    color: #d8d8d8 !important;
  }
  .title {
    color: #d8d8d8;
    background: #1a2420 !important;
  }
  .welcome {
    background: #2d5c5c !important;
  }
  .toggle-container, .aui-flexView, .ui-switcher-menu {
    background: #1e1e1e !important;
  }
  .settings-popup-styled-container, .toggle-container {
    background: #1e1e1e !important;
  }
  .active {
    color: #ffc107 !important;
  }
  .retime, .footer, .welcome > a, .text-gray-800, .tg-list-item > h4 {
    color: #d8d8d8 !important;
  }
}
`;
  GM_addStyle(myCss);
})();