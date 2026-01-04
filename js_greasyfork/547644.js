// ==UserScript==
// @name         标记已点击链接+禁止打开新标签
// @description  点击链接变暗并加波浪线，标记持续到标签页关闭
// @version      1.1
// @author       WJ
// @match        *://*/*
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-end
// @namespace https://greasyfork.org/users/914996
// @downloadURL https://update.greasyfork.org/scripts/547644/%E6%A0%87%E8%AE%B0%E5%B7%B2%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%2B%E7%A6%81%E6%AD%A2%E6%89%93%E5%BC%80%E6%96%B0%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/547644/%E6%A0%87%E8%AE%B0%E5%B7%B2%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%2B%E7%A6%81%E6%AD%A2%E6%89%93%E5%BC%80%E6%96%B0%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // 1. 排除列表
  const pclb = `
    #install-area,button,
    nav,footer,aside,menu,dialog,.box.border,.between,
    .btn,.nav,.navbar,.navigation,.menu,.menubar,.swiper-wrapper,
    .breadcrumb,.pagination,.tabs,.tabbar,.sidebar,.footer,
    [class^="btn"],[role="navigation"],[role="menu"],[role="tablist"],[role="banner"]`;

  // 2. 样式
  GM_addStyle('a.WJYDJ{opacity:.7 !important;text-decoration:underline wavy #00f5ff !important}');

  // 3. 读取已标记
  const marked = new Set(JSON.parse(sessionStorage.xMarked || '[]'));

  // 4. 标记函数
  const mark = a => marked.has(a.href) && !a.closest(pclb) && a.classList.add('WJYDJ');

  // 5. 首次全扫
  document.body.querySelectorAll('a[href]').forEach(mark);

  // 6. 监听新节点
  new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n =>
    n.nodeType === 1 && (n.tagName === 'A' ? mark(n)
      : n.querySelectorAll?.('a[href]').forEach(mark))
  ))).observe(document.body, {childList: true, subtree: true});

  // 7. 点击记录
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a) return;
    if (a.protocol !== 'javascript:' && !a.hasAttribute('download')) {
      location.href = a.href;
      e.preventDefault();
    };
    if (!a.closest(pclb)) {
      marked.add(a.href);
      sessionStorage.xMarked = JSON.stringify([...marked]);
      a.classList.add('WJYDJ');
    };
  }, true);
})();