// ==UserScript==
// @name         强制解除禁止复制并自动复制选中文本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  移除网页复制限制、解除选中限制、自动复制选中文本到剪贴板,于7.7针对小鹅通进行迭代
// @author       xiangyang
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541884/%E5%BC%BA%E5%88%B6%E8%A7%A3%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/541884/%E5%BC%BA%E5%88%B6%E8%A7%A3%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 解锁 CSS 限制
  GM_addStyle(`
    * {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
    }
    body {
      -webkit-touch-callout: default !important;
    }
  `);

  // 解锁 JS 事件限制
  const events = ['copy', 'cut', 'paste', 'select', 'selectstart', 'contextmenu', 'mousedown', 'mouseup', 'keydown'];
  events.forEach(evt => {
    document.addEventListener(evt, function (e) {
      e.stopPropagation();
    }, true);
  });

  // 自动复制选中文本
  let lastCopied = '';
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: fixed;
    background: #4caf50;
    color: #fff;
    padding: 6px 10px;
    border-radius: 5px;
    font-size: 14px;
    z-index: 99999;
    opacity: 0.95;
    display: none;
    pointer-events: none;
  `;
  document.body.appendChild(tooltip);

  function showTooltip(text, x, y) {
    tooltip.textContent = text;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.style.display = 'block';
    setTimeout(() => {
      tooltip.style.display = 'none';
    }, 1200);
  }

  document.addEventListener("mouseup", function (e) {
    const selected = window.getSelection().toString().trim();
    if (selected && selected !== lastCopied) {
      const textarea = document.createElement("textarea");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.value = selected;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      lastCopied = selected;
      showTooltip("✅ 选中文本已复制", e.pageX + 10, e.pageY + 10);
    }
  });
})();
