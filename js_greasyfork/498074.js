// ==UserScript==
// @name         gnmdcsdn
// @namespace    http://tampermonkey.net/
// @description  友好阅读 CSDN，你不干净，我帮你干净; 搭配 Dark Reader 体验更佳： https://chrome.google.com/webstore/detail/eimadpbcbfnmbkopoojfekhnkhdbieeh
// @author       You
// @match         *://*.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.com
// @grant        none
// @version 1.0.9
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498074/gnmdcsdn.user.js
// @updateURL https://update.greasyfork.org/scripts/498074/gnmdcsdn.meta.js
// ==/UserScript==
(function () {
    "use strict";
    // 复制当前文章内容
    const title = document.querySelector('#articleContentId').innerHTML;
    const content = document.querySelector('#content_views').innerHTML;

    // 停止当前页面的所有加载
    window.stop();

    // 打开文档流
    document.open();

    // 写入新的 HTML 内容
    document.write(`
  <!DOCTYPE html>
  <html>
    <head>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/github-markdown-css@5.6.0/github-markdown.min.css">
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 70ch!important;
          margin: 0 auto!important;
          padding:4em 0;
        }
        img{
          height:auto!important;
          width:auto!important;
          aspect-ratio:auto!important;

        }
      </style>
    </head>
    <body class="container markdown-body">
    <h1>${title}</h1>
    ${content}
    </body>
  </html>
`);

    // 关闭文档流，使新内容生效
    document.close();
})();