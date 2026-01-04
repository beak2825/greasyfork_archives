// ==UserScript==
// @name 掘金小册阅读暗黑模式
// @namespace lgldlk
// @version 0.1
// @description 掘金小册没有暗黑模式🥀，长时间阅读有点伤眼睛，于是自己做了一个✌️。
// @author lgldlk
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://juejin.cn/book/*/section/*
// @downloadURL https://update.greasyfork.org/scripts/449819/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E9%98%85%E8%AF%BB%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/449819/%E6%8E%98%E9%87%91%E5%B0%8F%E5%86%8C%E9%98%85%E8%AF%BB%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
let css = `
  .book-content .book-content-inner .book-body {
    background-color: #4f4f4f !important ;
  }

  .logo path {
    fill: #fff !important ;
  }

  .book-content__header {
    background-color: #2c2d2c !important;
    color: #eee !important;
  }

  .book-content .book-content-inner .book-content__header .title a {
    color: #fff !important;
  }

  .book-summary__header {
    background-color: #2c2d2c !important;
    color: #eee !important;
  }

  .book-summary__header .label {
    color: #fff !important;
    background-color: rgb(87, 87, 87, 10%) !important;
  }

  .section-page.book-section-view {
    background-color: #2c2d2c !important;
    max-width: 1000px !important;
  }

  .markdown-body {
    color: #eee !important;
  }

  .book-summary-inner {
    background-color: #2c2d2c !important;
  }

  .book-summary-inner .title {
    color: #ccc !important;
  }

  .section.route-active .title {
    color: #fff !important;
  }

  .route-active .label {
    color: #fff !important;
    background: rgb(92 96 102) !important;
  }

  .route-active .left .index {
    color: #fff !important;
  }

  .book-directory-comp {
    color: #eee !important;
  }

  .book-summary__footer {
    display: none !important;
  }

  .step-btn {
    background: #5e6063 !important;
  }

  .route-active:after {
    background-color: #fff !important ;
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
