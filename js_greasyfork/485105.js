// ==UserScript==
// @name         notion 增强脚本个性化目录弹窗缩小标题字号
// @namespace    https://github.com/98zi/MyTampermonkey
// @version      0.0.1
// @description  修改字体大小，多余的遮罩，个性化目录弹窗，浮动在右侧（目录必须作为第一个块元素）
// @author       98zi
// @match        *://www.notion.so/*
// @match        *://*.notion.site/*
// @grant        none
// @run-at       document-start
// @icon         https://www.notion.so/images/logo-ios.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485105/notion%20%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%E4%B8%AA%E6%80%A7%E5%8C%96%E7%9B%AE%E5%BD%95%E5%BC%B9%E7%AA%97%E7%BC%A9%E5%B0%8F%E6%A0%87%E9%A2%98%E5%AD%97%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/485105/notion%20%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%E4%B8%AA%E6%80%A7%E5%8C%96%E7%9B%AE%E5%BD%95%E5%BC%B9%E7%AA%97%E7%BC%A9%E5%B0%8F%E6%A0%87%E9%A2%98%E5%AD%97%E5%8F%B7.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var styleElement = document.createElement('style');
  styleElement.textContent = `
  h1{font-size:24px !important;}
  .notion-scroller{overflow-y:scroll !important}
  .notranslate::after{content:none !important}
  .notion-page-content>.notion-table_of_contents-block:nth-child(1){position:fixed!important;right:20px!important;top:100px!important;background:#fff;
           border-radius:6px;width:300px!important;box-shadow:1px 2px 5px rgba(0,0,0,.2);padding:10px;box-sizing:border-box;z-index:999!important;max-height:78vh;
           overflow-y: auto;}
  `;
  document.head.appendChild(styleElement);

})();