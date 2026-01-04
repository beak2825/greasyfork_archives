// ==UserScript==
// @name         Microsoft To Do 自動調整欄位高度
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  修復 Microsoft To Do 欄位高度讓 textarea 高度自動符合內容
// @author       shanlan(grok-code-fast-1)
// @match        https://to-do.office.com/tasks/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546373/Microsoft%20To%20Do%20%E8%87%AA%E5%8B%95%E8%AA%BF%E6%95%B4%E6%AC%84%E4%BD%8D%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/546373/Microsoft%20To%20Do%20%E8%87%AA%E5%8B%95%E8%AA%BF%E6%95%B4%E6%AC%84%E4%BD%8D%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const sel = 'textarea.ms-TextField-field';
  const resize = t => {
    t.rows = 1;
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 'px';
  };
  let isResizing = false;
  document.addEventListener('mousedown', () => (isResizing = true));
  document.addEventListener('mouseup', () => {
    isResizing = false;
    document.querySelectorAll(sel).forEach(resize);
  });
  document.addEventListener('input', e => {
    if (e.target.matches(sel)) resize(e.target);
  }, true);
  const ro = new ResizeObserver(entries => {
    if (isResizing) return;
    entries.forEach(entry => {
      if (entry.target.matches(sel)) resize(entry.target);
    });
  });
  const scan = node => {
    if (node.matches(sel)) { resize(node); ro.observe(node); }
    node.querySelectorAll(sel).forEach(n => { resize(n); ro.observe(n); });
  };
  const mo = new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(scan)));
  mo.observe(document.body, { childList: true, subtree: true });
})();