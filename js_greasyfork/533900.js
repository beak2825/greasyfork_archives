// ==UserScript==
// @name        妖火夜间模式
// @namespace   http://yaohuo.me/
// @supportURL  http://zgcwkj.cn
// @version     20260124.01
// @description 妖火论坛黑色主题样式。
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
    color: #e0e0e0;
    background: #00000000 !important;
    border-color: #464646 !important;
  }
  html, body {
    background: #000000 !important;
  }
  img {
    opacity: 0.4 !important;
  }
  a {
    color: #7ea4e9 !important;
  }
  h1, h2, h3, h4, h5, h6, div, label, input, code, span, button, .triangle-alert {
    color: #e0e0e0 !important;
  }
  .file-header-url*, .mod-list* {
    color: #e0e0e0 !important;
  }
  .title {
    color: #e0e0e0;
    background: #1e2925 !important;
  }
  .welcome {
    background: #4ba0a0 !important;
  }
  .toggle-container, .aui-flexView, .ui-switcher-menu {
    background: #3d3d3d !important;
  }
  .settings-popup-styled-container, .toggle-container {
    background: #3d3d3d !important;
  }
  .active {
    color: #fff000 !important;
  }
  .retime, .footer, .welcome > a, .text-gray-800, .tg-list-item > h4 {
    color: #e0e0e0 !important;
  }
}
`;
  GM_addStyle(myCss);
})();