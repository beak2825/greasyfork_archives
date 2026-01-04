// ==UserScript==
// @name         Bloomberg – FullArticle
// @namespace    https://github.com/your-repo
// @version      1.2.0
// @description  隐藏 Bloomberg 订阅登录弹窗、解除正文折叠并恢复滚动
// @match        https://www.bloomberg.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544497/Bloomberg%20%E2%80%93%20FullArticle.user.js
// @updateURL https://update.greasyfork.org/scripts/544497/Bloomberg%20%E2%80%93%20FullArticle.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // —— 1. 预注入基础 CSS，最小化闪烁 ——
  const initCss = document.createElement('style');
  initCss.textContent = `
    /* 临时隐藏登录容器，防止初始闪烁 */
    .reg-ui-client { display: none !important; }
  `;
  document.documentElement.prepend(initCss);

  // —— 2. 核心清理函数 ——
  function cleanPage() {
    // 2.1 删除 Bloomberg 登录/订阅 iframe 容器 :contentReference[oaicite:5]{index=5}
    document.querySelectorAll('.reg-ui-client').forEach(el => el.remove());

    // 2.2 删除任意 modal/dialog
    document.querySelectorAll('[aria-modal="true"], [role="dialog"]').forEach(el => el.remove());

    // 2.3 删除全屏 fixed 遮罩（宽高 ≥ 90% 视窗）
    document.querySelectorAll('body *').forEach(el => {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' &&
          parseInt(s.width)  >= window.innerWidth  * 0.9 &&
          parseInt(s.height) >= window.innerHeight * 0.9) {
        el.remove();
      }
    });

    // 2.4 恢复根节点及 Next.js 容器滚动
    ['html','body','#__next'].forEach(sel => {
      const e = document.querySelector(sel);
      if (e) {
        e.style.overflow    = 'auto';
        e.style.height      = 'auto';
        e.style.maxHeight   = 'none';
        e.style.position    = 'static';
        e.style.clip       = 'auto';
      }
    });

    // 2.5 展开正文区域
    document.querySelectorAll('article, main, [class*="story-container"], [class*="media-ui-Text_"]').forEach(el => {
      el.style.overflow    = 'visible';
      el.style.maxHeight   = 'none';
      el.style.height      = 'auto';
      el.style.clip        = 'auto';
    });
  }

  // —— 3. 多时机触发 & 监听 ——
  document.addEventListener('DOMContentLoaded', cleanPage);
  window.addEventListener('load', cleanPage);

  const mo = new MutationObserver(cleanPage);
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // 短期轮询，确保后续脚本不再复写
  let runs = 0;
  const timer = setInterval(() => {
    cleanPage();
    if (++runs > 10) clearInterval(timer);
  }, 300);
})();
