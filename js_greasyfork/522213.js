// ==UserScript==
// @name         老男人暗黑主题
// @namespace    https://bbs.oldmantvg.net/
// @version      1.1
// @description  给 OldManTVG 论坛添加黑暗主题
// @author       薛老师
// @match        https://bbs.oldmantvg.net/*
// @grant        none
// @icon         https://bbs.oldmantvg.net/view/img/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/522213/%E8%80%81%E7%94%B7%E4%BA%BA%E6%9A%97%E9%BB%91%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/522213/%E8%80%81%E7%94%B7%E4%BA%BA%E6%9A%97%E9%BB%91%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 自定义CSS样式
  const darkThemeCSS = `
    body {
      background-color: #1e1e1e !important;
      color: #d4d4d4 !important;
    }
    a {
      color: #569cd6 !important;
    }
    header, nav, footer, .sidebar {
      background-color: #252526 !important;
    }
    .threadlist .thread, .forumlist tr, .card-header, .card-body, blockquote {
      background-color: #2d2d2d !important;
      color: #d4d4d4 !important;
      border: 1px solid #3c3c3c !important;
      padding: 10px;
      border-radius: 5px;
    }
    blockquote {
      border-left: 4px solid #569cd6 !important;
      padding-left: 10px !important;
      margin: 5px 0 !important;
      font-style: italic !important;
      color: #a8a8a8 !important;
    }
    .threadlist .thread:hover, .forumlist tr:hover, .card-header:hover, .card-body:hover, blockquote:hover {
      background-color: #3c3c3c !important;
    }
    input, textarea, select, button {
      background-color: #3c3c3c !important;
      color: #d4d4d4 !important;
      border: 1px solid #555555 !important;
    }
  `;

  // 添加样式到页面
  const style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = darkThemeCSS;
  document.head.appendChild(style);
})();
