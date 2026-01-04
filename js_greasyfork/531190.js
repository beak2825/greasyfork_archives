// ==UserScript==
// @name         知乎-移除自动关键字链接
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  移除知乎自动添加的关键字超链接（如 zhida.zhihu.com 链接）
// @icon         https://s21.ax1x.com/2025/03/23/pE0qpRK.jpg
// @compatible   chrome,edge,firefox
// @author       PeterJXL
// @homepageURL  https://www.peterjxl.com
// @license      MIT
// @create       2025-03-28
// @lastmodified 2025-03-28
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @run-at       document-end
// @supportURL   https://github.com/Peter-JXL/UserScript/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531190/%E7%9F%A5%E4%B9%8E-%E7%A7%BB%E9%99%A4%E8%87%AA%E5%8A%A8%E5%85%B3%E9%94%AE%E5%AD%97%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/531190/%E7%9F%A5%E4%B9%8E-%E7%A7%BB%E9%99%A4%E8%87%AA%E5%8A%A8%E5%85%B3%E9%94%AE%E5%AD%97%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  // 目标链接特征（匹配自动生成的知乎站内链接）
  const TARGET_LINK_REGEX = /https:\/\/zhida\.zhihu\.com\/search\?.*?(content_id|q)=/i;

  // 主处理函数
  function removeAutoLinks() {
      // 查找所有包含目标链接的 <a> 标签
      document.querySelectorAll('a[href]').forEach(link => {
          if (TARGET_LINK_REGEX.test(link.href)) {
              // 创建替换的文本节点
              const textNode = document.createTextNode(link.textContent);
              // 用纯文本替换链接
              link.parentNode.replaceChild(textNode, link);
          }
      });
  }

  // 初始执行
  removeAutoLinks();

  // 监听动态内容（如评论区加载、无限滚动）
  const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length) {
              removeAutoLinks();
          }
      });
  });

  observer.observe(document.body, {
      childList: true,
      subtree: true
  });

  // 监听知乎的异步加载（SPA页面切换）
  window.addEventListener('popstate', removeAutoLinks);
  window.addEventListener('pushstate', removeAutoLinks);

})();