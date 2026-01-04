// ==UserScript==
// @name         LKML ArticleBody HTML 複製器
// @namespace    https://abc0922001.github.io/lkml-userscripts
// @version      1.1
// @description  一鍵複製 lkml.org <pre itemprop="articleBody"></pre> 內容（保留 <br> 及 HTML 標籤）
// @author       abc0922001
// @match        https://lkml.org/lkml/*/*/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538575/LKML%20ArticleBody%20HTML%20%E8%A4%87%E8%A3%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538575/LKML%20ArticleBody%20HTML%20%E8%A4%87%E8%A3%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitForElement(selector, timeout = 4000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const observer = new MutationObserver(() => {
        const found = document.querySelector(selector);
        if (found) {
          observer.disconnect();
          resolve(found);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        observer.disconnect();
        reject(new Error('Timeout'));
      }, timeout);
    });
  }

  function showToast(msg) {
    let toast = document.createElement('div');
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: 'fixed',
      top: '16px',
      right: '16px',
      background: '#222',
      color: '#fff',
      padding: '8px 20px',
      borderRadius: '6px',
      fontSize: '15px',
      zIndex: 9999,
      opacity: 0.95,
      boxShadow: '0 2px 10px #0003',
      pointerEvents: 'none'
    });
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 1800);
  }

  // 核心：複製 HTML
  function copyHtmlToClipboard(html) {
    // 建立暫存 textarea，寫入 HTML，再用 clipboardData 複製
    const listener = function(e) {
      e.clipboardData.setData('text/html', html);
      e.clipboardData.setData('text/plain', html); // 保底
      e.preventDefault();
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
    showToast('✅ 已複製 HTML（含 <br>）內容');
  }

  function createCopyBtn() {
    let btn = document.createElement('button');
    btn.textContent = '📋 複製 HTML';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 10000,
      padding: '8px 14px',
      fontSize: '16px',
      background: '#2b7de9',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      boxShadow: '0 1px 5px #0002'
    });
    btn.onclick = () => {
      const selector = 'pre[itemprop="articleBody"]';
      waitForElement(selector)
        .then(el => copyHtmlToClipboard(el.innerHTML))
        .catch(() => showToast('⚠️ 沒有找到正文'));
    };
    document.body.appendChild(btn);
  }

  createCopyBtn();
})();
