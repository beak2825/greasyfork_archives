// ==UserScript==
// @name           小鹅通 PC 端宽版显示
// @version        0.1
// @author         cooper1x
// @description    优化小鹅通专栏在 PC 端的阅读体验
// @match          *://*.xiaoeknow.com/*
// @run-at         document-end
// @namespace      https://greasyfork.org/zh-CN/scripts/489528-%E5%B0%8F%E9%B9%85%E9%80%9A-pc-%E7%AB%AF%E5%AE%BD%E7%89%88%E6%98%BE%E7%A4%BA
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/489528/%E5%B0%8F%E9%B9%85%E9%80%9A%20PC%20%E7%AB%AF%E5%AE%BD%E7%89%88%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/489528/%E5%B0%8F%E9%B9%85%E9%80%9A%20PC%20%E7%AB%AF%E5%AE%BD%E7%89%88%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

window.onload = () => {
  // 创建一个新的样式元素
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    /* 这里是您的 CSS 样式 */
    #app-layout {
      max-width: initial !important;
    }
    #app {
      width: 90% !important;
      max-width: initial !important;
    }
    .ace-table{
      width: 90% !important;
    }
    /* 隐藏分享按钮 */
    .float-share-btn{
      display: none;
    }
    /* 返回按钮放右上角 */
    .last-page{
      left: auto !important;
      top: 0px !important;
      right: 0px !important;
    }
  `;

  // 将样式元素添加到文档头部
  document.head.appendChild(style);
}