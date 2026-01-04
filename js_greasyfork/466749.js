// ==UserScript==
// @name         微信读书看更多
// @namespace    glooory
// @version      0.1
// @description  微调微信读书布局，显示更多的文本内容。
// @author       glooorypu@gmail.com
// @match        https://weread.qq.com/web/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466749/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%9C%8B%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/466749/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%9C%8B%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function addGlobalStyle(css, id) {
    let head, style;
    if (id && document.getElementById(id)) return;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.id = id;
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  const appContentCSS = "div.app_content { max-width: 100vw !important; width: min(1400px, 100vw) !important; }";
  const topNavBarCSS = "div.readerTopBar { max-width: 100vw !important; width: min(1400px, 100vw) !important; height: auto; }";
  const homeNavLogoCSS = "a.readerTopBar_home { width: 40px; height: 40px; }"
  const floatBtnsCSS = "div.readerControls { left: auto; right: 16px; bottom: 24px; width: auto; margin-left: 0; }"
  const nextChapterBtnCSS = "div.readerFooter button { position: fixed; right: 10px; bottom: 420px; width: auto; padding: 16px 8px; line-height: 1; height: auto; }"
  const prevChapterBtnCSS = "div.readerContentHeader button { position: fixed; right: 10px; bottom: 492px; width: auto; padding: 16px 8px; line-height: 1; height: auto; border-radius: 12px;text-align: center;font-size: 16px;font-weight: 500; background-color: #f6f7f9;}";
  const catalogModalCSS = ".wr_whiteTheme div.readerCatalog { right: 0; margin-left: auto; }";
  const customCSS = appContentCSS + topNavBarCSS + homeNavLogoCSS + floatBtnsCSS + nextChapterBtnCSS + prevChapterBtnCSS + catalogModalCSS;

  addGlobalStyle(customCSS, "custom_reader_layout");
})();
