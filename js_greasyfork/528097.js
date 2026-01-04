// ==UserScript==
// @name         LeetCode 描述內容複製器
// @namespace    https://abc0922001.github.io/leetcode-userscripts
// @version      2.0
// @description  複製 LeetCode 題目描述內容到剪貼簿的輕巧按鈕。
// @author       abc0922001
// @match        https://leetcode.com/problems/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528097/LeetCode%20%E6%8F%8F%E8%BF%B0%E5%85%A7%E5%AE%B9%E8%A4%87%E8%A3%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528097/LeetCode%20%E6%8F%8F%E8%BF%B0%E5%85%A7%E5%AE%B9%E8%A4%87%E8%A3%BD%E5%99%A8.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /**
   * 等待指定元素出現後回傳該元素
   * @param {string} selector - CSS 選擇器
   * @param {number} timeout - 最長等待毫秒數
   * @returns {Promise<Element>}
   */
  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const found = document.querySelector(selector);
      if (found) return resolve(found);

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`等待元素 "${selector}" 超時 (${timeout}ms)`));
      }, timeout);
    });
  }

  /**
   * 顯示提示訊息
   * @param {string} message - 顯示內容
   */
  function showAlert(message) {
    window.alert(message);
  }

  /**
   * 將 HTML 內容複製至剪貼簿
   * @param {string} content - 要複製的 HTML
   */
  function copyToClipboard(content) {
    navigator.clipboard.writeText(content)
      .then(() => showAlert('✅ 描述內容已複製到剪貼簿！'))
      .catch(err => showAlert(`❌ 複製失敗：${err.message}`));
  }

  /**
   * 初始化按鈕並綁定點擊事件
   */
  function createCopyButton() {
    const button = document.createElement('button');
    button.textContent = '📋 複製描述';
    Object.assign(button.style, {
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      padding: '6px 10px',
      fontSize: '14px',
      backgroundColor: '#2b7de9',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    });

    button.addEventListener('click', () => {
      const selector = 'div.elfjS[data-track-load="description_content"]';
      waitForElement(selector)
        .then(el => copyToClipboard(el.innerHTML))
        .catch(err => {
          showAlert('⚠️ 找不到描述內容區塊。');
          console.error(err);
        });
    });

    document.body.appendChild(button);
  }

  // 🚀 啟動腳本
  createCopyButton();
})();
