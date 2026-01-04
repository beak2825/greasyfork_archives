// ==UserScript==
// @name         微信/知乎文章代码块一键复制(公众号:掌心向暖）
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  支持知乎和微信公众号的代码块/引用样式一键复制
// @match        *://*.zhihu.com/*
// @match        *://mp.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544002/%E5%BE%AE%E4%BF%A1%E7%9F%A5%E4%B9%8E%E6%96%87%E7%AB%A0%E4%BB%A3%E7%A0%81%E5%9D%97%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%28%E5%85%AC%E4%BC%97%E5%8F%B7%3A%E6%8E%8C%E5%BF%83%E5%90%91%E6%9A%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544002/%E5%BE%AE%E4%BF%A1%E7%9F%A5%E4%B9%8E%E6%96%87%E7%AB%A0%E4%BB%A3%E7%A0%81%E5%9D%97%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%28%E5%85%AC%E4%BC%97%E5%8F%B7%3A%E6%8E%8C%E5%BF%83%E5%90%91%E6%9A%96%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 复制文本到剪贴板
  function copyToClipboard(text) {
    if (!text) return;
    navigator.clipboard?.writeText(text).catch(() => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;top:-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    });
  }

  // 注入按钮样式（只执行一次）
  function injectButtonStyle() {
    if (document.querySelector('#custom-copy-btn-style')) return;
    const style = document.createElement('style');
    style.id = 'custom-copy-btn-style';
    style.textContent = `
      .custom-copy-btn {
        position: absolute;
        top: 6px;
        right: 10px;
        z-index: 999;
        background-color: #165DFF;
        color: white;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        font-family: sans-serif;
      }
    `;
    document.head.appendChild(style);
  }

  // 创建复制按钮
  function createCopyButton(container, extractText) {
    if (!container || container.querySelector('.custom-copy-btn')) return;

    const btn = document.createElement('div');
    btn.className = 'custom-copy-btn';
    btn.innerText = '复制';

    btn.addEventListener('click', () => {
      const text = extractText();
      if (!text) return;
      copyToClipboard(text.trim());
      btn.innerText = '✔ 已复制';
      btn.style.backgroundColor = '#00B42A';
      setTimeout(() => {
        btn.innerText = '复制';
        btn.style.backgroundColor = '#165DFF';
      }, 1600);
    });

    if (getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }

    container.appendChild(btn);
  }

  // 通用文本提取器（段落 + LI）
  function extractTextFromElements(elements) {
    const lines = [];
    let emptyCount = 0;
    elements.forEach(el => {
      const text = el.innerText.trim();
      if (!text) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          lines.push('');
          emptyCount = 0;
        }
        lines.push(el.tagName === 'LI' ? `- ${text}` : text);
      }
    });
    return lines.join('\n');
  }

  // 微信内容处理
  function matchWeixinBlocks() {
    const selectors = [
      'pre',
      'section[data-tools="code"]',
      'blockquote[style*="border-left"]',
      'blockquote[style*="background-color"][style*="border-left"]',
      'section section section[style*="border"][style*="background"]'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(block => {
        createCopyButton(block, () => {
          const codeList = block.querySelectorAll('code');
          if (codeList.length > 0) {
            return Array.from(codeList).map(code =>
              code.innerText.replace(/\u00A0/g, ' ').replace(/\r?\n/g, '\n').trim()
            ).join('\n');
          }

          const paras = block.querySelectorAll('p, li');
          if (paras.length > 0) return extractTextFromElements(paras);

          const fallback = block.querySelectorAll('*');
          return extractTextFromElements(fallback);
        });
      });
    });
  }

  // 知乎内容处理
  function matchZhihuBlocks() {
    document.querySelectorAll('div.highlight').forEach(block => {
      const pre = block.querySelector('pre');
      if (pre) createCopyButton(block, () => pre.innerText || '');
    });

    document.querySelectorAll('blockquote[data-pid], blockquote[data-first-child]').forEach(bq => {
      createCopyButton(bq, () => {
        const clone = bq.cloneNode(true);
        const btn = clone.querySelector('.custom-copy-btn');
        if (btn) btn.remove();

        let text = clone.innerText || '';
        text = text.replace(/^(\*|·|●|\s)+/, '');
        text = text.replace(/&amp;/g, '&');
        return text.replace(/~+$/, '').trim();
      });
    });
  }

  // 平台观察器
  function initObserver(platformCheck, callback) {
    if (!platformCheck()) return;
    callback();
    const observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(callback, 2000);
  }

  // 初始化
  window.addEventListener('load', () => {
    injectButtonStyle();
    const host = location.hostname;
    initObserver(() => host.includes('zhihu.com'), matchZhihuBlocks);
    initObserver(() => host.includes('mp.weixin.qq.com'), matchWeixinBlocks);
  });
})();