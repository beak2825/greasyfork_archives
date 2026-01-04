// ==UserScript==
// @name         强力屏蔽 CSDN 网站与链接
// @namespace    紫阳花
// @version      1.1
// @description  页面加载前阻止访问 csdn.net，隐藏所有 csdn 链接
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544788/%E5%BC%BA%E5%8A%9B%E5%B1%8F%E8%94%BD%20CSDN%20%E7%BD%91%E7%AB%99%E4%B8%8E%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/544788/%E5%BC%BA%E5%8A%9B%E5%B1%8F%E8%94%BD%20CSDN%20%E7%BD%91%E7%AB%99%E4%B8%8E%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  // 如果当前页面就是 csdn 子域，则立即停止加载
  if (location.hostname.includes('csdn.net')) {
    alert('🚫 已阻止访问 CSDN 页面：' + location.href);
    document.open();
    document.write('');
    document.close();
    return;
  }

  function hideCsdn() {
    // 隐藏页面中所有 csdn 链接
    document.querySelectorAll('a[href*="csdn.net"]').forEach(a => {
      a.style.display = 'none';
    });
  }

  // 防止动态加载后插入链接，定时循环执行隐藏动作
  const observer = new MutationObserver(hideCsdn);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // 初次执行一次
  document.addEventListener('DOMContentLoaded', hideCsdn);
})();
