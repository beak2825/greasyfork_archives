// ==UserScript==
// @name         彩云小译 - 关闭字数限制弹窗
// @description  关闭彩云小译达到 5000 词的弹窗
// @author       Bush2021
// @match        https://fanyi.caiyunapp.com/*
// @icon         https://caiyunapp.com/favicon.ico
// @version      0.1
// @license      MIT
// @namespace    https://greasyfork.org/users/737511
// @downloadURL https://update.greasyfork.org/scripts/467791/%E5%BD%A9%E4%BA%91%E5%B0%8F%E8%AF%91%20-%20%E5%85%B3%E9%97%AD%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/467791/%E5%BD%A9%E4%BA%91%E5%B0%8F%E8%AF%91%20-%20%E5%85%B3%E9%97%AD%E5%AD%97%E6%95%B0%E9%99%90%E5%88%B6%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==
 
(function() {
  'use strict';
 
  // 监听 DOM 变化
  const observer = new MutationObserver((mutationsList) => {
    for(let mutation of mutationsList) {
      const elMessageBoxHeaderBtn = document.querySelector(".el-message-box__headerbtn");
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && elMessageBoxHeaderBtn) {
        elMessageBoxHeaderBtn.click();
      }
    }
  });
 
  // 配置观察选项
  const config = { attributes: true, childList: true, subtree: true };
 
  // 开始观察目标节点
  observer.observe(document.body, config);
 
})();
