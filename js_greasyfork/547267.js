// ==UserScript==
// @name         点击后链接标绿（可持久保存）
// @namespace    https://example.com
// @version      1.0.0.2025-08-25
// @description  点击链接后将其标记为绿色，已点过的链接会持久保存并在页面上自动标绿
// @author       GPT
// @match        *://*/*
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547267/%E7%82%B9%E5%87%BB%E5%90%8E%E9%93%BE%E6%8E%A5%E6%A0%87%E7%BB%BF%EF%BC%88%E5%8F%AF%E6%8C%81%E4%B9%85%E4%BF%9D%E5%AD%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/547267/%E7%82%B9%E5%87%BB%E5%90%8E%E9%93%BE%E6%8E%A5%E6%A0%87%E7%BB%BF%EF%BC%88%E5%8F%AF%E6%8C%81%E4%B9%85%E4%BF%9D%E5%AD%98%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // === 可调整选项 ===
  const OPTIONS = {
    color: '#0aae4f',          // 标记颜色
    ignoreHash: true,          // 认为 https://a.com/page#x 与 #y 是同一链接
    ignoreSearch: false,       // 认为 https://a.com/page?a=1 与 ?a=2 不同（若想忽略参数，设为 true）
    sameOriginOnly: false,     // 只标记与当前站点同源的链接
  };

  const STORAGE_KEY = 'tm_clicked_links_v1';
  let clicked = loadSet();

  // 注入样式（用 class 控制，优先级高）
  GM_addStyle(`
    a.tm-clicked-link { color: ${OPTIONS.color} !important; }
  `);

  // 页面初始渲染时，给已记录的链接加绿
  markAllOnPage();

  // 监听点击（左键、带 Ctrl/Meta 的新标签打开等）
  window.addEventListener('click', handleAnyClick, true);
  // 监听中键点击/其他辅助点击
  window.addEventListener('auxclick', handleAnyClick, true);
  // 有些站点会动态加载内容，使用简单的观察器给新节点补标记
  const mo = new MutationObserver(debounced(markAllOnPage, 200));
  mo.observe(document.documentElement, { childList: true, subtree: true });

  // ====== 具体函数 ======

  function handleAnyClick(e) {
    const a = e.target && closestAnchor(e.target);
    if (!a) return;
    if (!a.href) return;
    if (OPTIONS.sameOriginOnly && new URL(a.href, location.href).origin !== location.origin) return;

    const key = linkKey(a.href);
    // 记录并立即标色
    if (!clicked.has(key)) {
      clicked.add(key);
      saveSet(clicked);
    }
    markAnchor(a);
  }

  function markAllOnPage() {
    const anchors = document.querySelectorAll('a[href]');
    for (const a of anchors) {
      if (!a.href) continue;
      if (OPTIONS.sameOriginOnly && new URL(a.href, location.href).origin !== location.origin) continue;
      if (clicked.has(linkKey(a.href))) markAnchor(a);
    }
  }

  function markAnchor(a) {
    a.classList.add('tm-clicked-link');
  }

  function closestAnchor(el) {
    return el.closest ? el.closest('a[href]') : null;
  }

  function linkKey(href) {
    const u = new URL(href, location.href);
    if (OPTIONS.ignoreHash) u.hash = '';
    if (OPTIONS.ignoreSearch) u.search = '';
    // 统一移除结尾斜杠的差异（/path 与 /path/ 视为同一）
    u.pathname = u.pathname.replace(/\/+$/, '');
    // 小写协议与主机，保留路径大小写
    return `${u.protocol.toLowerCase()}//${u.host.toLowerCase()}${u.pathname}${u.search}${u.hash}`;
  }

  function loadSet() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }

  function saveSet(set) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
    } catch {
      // localStorage 可能满了，忽略
    }
  }

  // 简单防抖
  function debounced(fn, delay) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), delay);
    };
  }
})();
