// ==UserScript==
// @name         标记已点击链接
// @description  点击链接变暗并加波浪线，标记持续到标签页关闭
// @version      1.0
// @author       WJ
// @match        *://*/*
// @license      MIT
// @grant        none
// @run-at       document-body
// @namespace https://greasyfork.org/users/914996
// @downloadURL https://update.greasyfork.org/scripts/541222/%E6%A0%87%E8%AE%B0%E5%B7%B2%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/541222/%E6%A0%87%E8%AE%B0%E5%B7%B2%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // 样式：变暗+波浪线
  const sheet = new CSSStyleSheet();
  sheet.replaceSync('a.x-marked{opacity:.7!important;text-decoration:underline wavy #0ce!important}');
  document.adoptedStyleSheets.push(sheet);

  // 读取已标记
  const marked = new Set(JSON.parse(sessionStorage.xMarked || '[]'));

  // 标记链接的函数
  const mark = a => a.classList.toggle('x-marked', marked.has(a.href));

  // 首次全扫
  document.body.querySelectorAll('a[href]').forEach(mark);

  // 监听新节点
  new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n =>
    n.nodeType === 1 && (n.tagName === 'A' ? mark(n)
      : n.querySelectorAll?.('a[href]').forEach(mark))
  ))).observe(document.body, {childList: true, subtree: true});

  // 点击记录
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (a && !a.closest(`
      nav,footer,aside,
      .btn,.nav,.navbar,.navigation,.menu,.menubar,
      .breadcrumb,.pagination,.tabs,.tabbar,.sidebar,.footer,
      [role="navigation"],[role="menu"],[role="tablist"],[role="banner"]`)){
    marked.add(a.href);
    sessionStorage.xMarked = JSON.stringify([...marked]);
    a.classList.add('x-marked')}
  }, true);
})();