// ==UserScript==
// @name         Reuters-FullArticle
// @namespace    https://github.com/your-handle
// @version      0.6.0
// @description  移除路透新版 paywall，完全展开正文并修复无法滚动到底的问题
// @match        *://*.reuters.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544494/Reuters-FullArticle.user.js
// @updateURL https://update.greasyfork.org/scripts/544494/Reuters-FullArticle.meta.js
// ==/UserScript==

(function(){
  'use strict';

  function expandArticle() {
    // 1. 删除 paywall
    document.querySelectorAll('[data-testid="paywall"], .paywall-overlay, .paywall-container')
      .forEach(el => el.remove());

    // 2. 去掉 paywall 限制类
    document.querySelectorAll('[class*="paywall"], [class*="restricted"]')
      .forEach(el => {
        el.className = el.className
          .split(/\s+/)
          .filter(c => !/paywall|restricted/i.test(c))
          .join(' ');
      });

    // 3. 清理常见容器样式限制
    const unlock = el => {
      if (!el) return;
      el.style.maxHeight = 'none';
      el.style.height = 'auto';
      el.style.overflow = 'visible';
      el.style.position = 'static';
      el.style.clip = 'auto';
    };

    // 主文与常见包裹层
    [
      document.querySelector('article'),
      document.querySelector('#main-content'),
      document.querySelector('[data-testid="BodyWrapper"]'),
      document.querySelector('.app__container'),
      document.body,
      document.documentElement
    ].forEach(unlock);

    // 确保根节点可滚动
    document.documentElement.style.overflowY = 'auto';
    document.body.style.overflowY = 'auto';
  }

  // 4. 动态检测
  const mo = new MutationObserver(expandArticle);
  mo.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener('DOMContentLoaded', expandArticle);
  window.addEventListener('load', expandArticle);

  // 5. 多次尝试防覆盖
  let cnt = 0;
  const timer = setInterval(() => {
    expandArticle();
    if (++cnt >= 10) clearInterval(timer);
  }, 800);
})();
