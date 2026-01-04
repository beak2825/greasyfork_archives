// ==UserScript==
// @name         💀 鸡汤来了
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  毒鸡汤语录
// @author       石小石Orz
// @license MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_addStyle
// @connect      api.btstu.cn
// @downloadURL https://update.greasyfork.org/scripts/539526/%F0%9F%92%80%20%E9%B8%A1%E6%B1%A4%E6%9D%A5%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/539526/%F0%9F%92%80%20%E9%B8%A1%E6%B1%A4%E6%9D%A5%E4%BA%86.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 记录定时器
  let hideTimeoutId = null;

  // 注入全局样式
  GM_addStyle(`
    .poison-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      padding: 7px 12px;
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      background: linear-gradient(135deg, #000428, #004e92);
      border: none;
      border-radius: 25px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.6);
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    .poison-btn:hover {
      transform: scale(1.15);
    }

    .poison-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 99998;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.6s ease;
    }

    .poison-text {
      font-size: 64px;
      font-weight: 900;
      max-width: 90vw;
      text-align: center;
      padding: 40px;
      white-space: pre-wrap;
      line-height: 1.5;
      font-family: "Microsoft YaHei", sans-serif;
      color: transparent;
      background-image: linear-gradient(to right, #000428, #004e92);
      -webkit-background-clip: text;
      -webkit-text-stroke: 2px white;
      text-shadow: 0 0 20px rgba(255,255,255,0.4);
      transform: scale(0.7);
      opacity: 0;
      transition: all 0.8s ease;
      user-select: none;
    }
  `);

  // 创建按钮
  const btn = GM_addElement(document.body, 'button', {
    class: 'poison-btn',
    textContent: '💀 鸡汤来了'
  });

  // 创建遮罩和文字
  const overlay = GM_addElement(document.body, 'div', { class: 'poison-overlay' });
  const quote = GM_addElement(overlay, 'div', { class: 'poison-text' });

  // 点击按钮加载鸡汤
  btn.addEventListener('click', () => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://api.btstu.cn/yan/api.php?charset=utf-8&encode=json',
      onload: function (res) {
        try {
          const data = JSON.parse(res.responseText);
          quote.textContent = `💀 ${data.text}`;
          showQuote();
        } catch (e) {
          quote.textContent = '💀 鸡汤炸了';
          showQuote();
        }
      },
      onerror: function () {
        quote.textContent = '💀 鸡汤没了';
        showQuote();
      }
    });
  });

  // 展示鸡汤 + 设置关闭计时器
  function showQuote() {
    clearTimeout(hideTimeoutId); // 清除旧的计时器
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    quote.style.opacity = '1';
    quote.style.transform = 'scale(1)';

    hideTimeoutId = setTimeout(hideQuote, 5000);
  }

  // 隐藏鸡汤
  function hideQuote() {
    quote.style.opacity = '0';
    quote.style.transform = 'scale(0.7)';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  }

  // 点击遮罩时关闭鸡汤（排除点击按钮本身）
  overlay.addEventListener('click', (e) => {
    if (!quote.contains(e.target)) {
      clearTimeout(hideTimeoutId);
      hideQuote();
    }
  });
})();
