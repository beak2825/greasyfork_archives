// ==UserScript==
// @name         Twkan-pages
// @namespace    https://twkan.com/
// @version      1.5
// @description  使用 MutationObserver + IntersectionObserver 监听页面 .page1，并添加醒目的上一章/下一章按钮
// @match        https://twkan.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541928/Twkan-pages.user.js
// @updateURL https://update.greasyfork.org/scripts/541928/Twkan-pages.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 创建一个更醒目的按钮
  function createBtn(text, pos, href) {
    const btn = document.createElement('button');
    btn.textContent = text;
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '30px',
      [pos]: '20px',
      background: 'rgba(0, 0, 0, 0.6)',        // 深色半透明背景
      color: '#fff',                           // 白色文字
      fontWeight: '600',                       // 加粗
      textShadow: '0 1px 2px rgba(0,0,0,0.8)',  // 文字阴影
      padding: '8px 16px',
      fontSize: '14px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      opacity: '0.8',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',   // 按钮阴影
      zIndex: '9999',
      transition: 'opacity 0.2s, transform 0.1s',
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(-2px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.opacity = '0.8';
      btn.style.transform = 'translateY(0)';
    });
    btn.addEventListener('click', () => {
      location.href = href;  // 当前页面跳转
    });
    document.body.appendChild(btn);
  }

  // 从 .page1 中取链接并创建按钮
  function setupButtons(page1) {
    const items = Array.from(page1.children);
    if (items.length !== 4) return;

    // 可能直接是 <a>，也可能在内部
    const firstA = items[0].tagName === 'A' ? items[0] : items[0].querySelector('a');
    const lastA  = items[3].tagName === 'A' ? items[3] : items[3].querySelector('a');
    if (!firstA || !lastA) return;

    createBtn('上一章', 'left',  firstA.href);
    createBtn('下一章', 'right', lastA.href);
  }

  // IntersectionObserver：当 .page1 元素“可见”时触发（确保在异步场景下也能生效）
  function observeVisibility(page1) {
    const io = new IntersectionObserver((entries, observer) => {
      for (const e of entries) {
        if (e.target === page1 && e.isIntersecting) {
          observer.disconnect();
          setupButtons(page1);
        }
      }
    }, { threshold: 0 });
    io.observe(page1);
  }

  // MutationObserver：全局监听 .page1 插入
  const mo = new MutationObserver((mutations, observer) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1 && node.classList.contains('page1')) {
          observer.disconnect();
          // 插入时马上尝试创建按钮，并启动可见性观察
          setupButtons(node);
          observeVisibility(node);
          return;
        }
      }
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // 脚本启动时：如果 .page1 已存在，则立即处理
  const existing = document.querySelector('.page1');
  if (existing) {
    setupButtons(existing);
    observeVisibility(existing);
  }
})();
