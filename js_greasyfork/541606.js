// ==UserScript==
// @name         酒馆PNG缩略图监测自动下载器（带开关按钮）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动下载原图 + 禁止127.0.0.1 + 带UI按钮一键开关，自动带cookie！每秒一张！超级稳！
// @author       哥哥~
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541606/%E9%85%92%E9%A6%86PNG%E7%BC%A9%E7%95%A5%E5%9B%BE%E7%9B%91%E6%B5%8B%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E5%B8%A6%E5%BC%80%E5%85%B3%E6%8C%89%E9%92%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541606/%E9%85%92%E9%A6%86PNG%E7%BC%A9%E7%95%A5%E5%9B%BE%E7%9B%91%E6%B5%8B%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E5%B8%A6%E5%BC%80%E5%85%B3%E6%8C%89%E9%92%AE%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BLOCKED_HOSTS = ['127.0.0.1', 'localhost'];
  const downloaded = new Set();
  const queue = [];
  let isEnabled = false; // 初始状态：关闭

  function log(msg) {
    console.log(`[AutoPNG] ${msg}`);
  }

  // ▶️ 下载队列控制器：每秒执行一个
  setInterval(() => {
    if (!isEnabled || queue.length === 0) return;
    const url = queue.shift();
    downloadWithCookie(url);
  }, 1000);

  // ▶️ 转换 thumbnail → 原图链接
  function convertToOriginalURL(thumbnailUrl) {
    try {
      const urlObj = new URL(thumbnailUrl);
      const filename = urlObj.searchParams.get("file");
      if (!filename) return null;

      const host = urlObj.hostname;
      if (BLOCKED_HOSTS.includes(host)) {
        log(`🚫 屏蔽地址：${host}`);
        return null;
      }

      return `${urlObj.origin}/characters/${filename}`;
    } catch {
      return null;
    }
  }

  // ▶️ 下载原图（fetch + cookie）
  function downloadWithCookie(url) {
    fetch(url, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error(`下载失败：${url}`);
        return res.blob();
      })
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = url.split('/').pop().split('?')[0];
        document.body.appendChild(a);
        a.click();
        a.remove();
        log(`✅ 下载成功：${a.download}`);
      })
      .catch(err => log(`❌ ${err.message}`));
  }

  // ▶️ DOM 监听器
  const observer = new MutationObserver((mutations) => {
    if (!isEnabled) return; // 不工作
    for (const mutation of mutations) {
      const addedNodes = mutation.addedNodes;
      for (const node of addedNodes) {
        if (node.nodeType !== 1) continue;
        const imgs = node.querySelectorAll?.('img[src*="/thumbnail?type=avatar&file="]') || [];
        for (const img of imgs) {
          const thumbUrl = img.src;
          if (downloaded.has(thumbUrl)) continue;
          downloaded.add(thumbUrl);
          const originalUrl = convertToOriginalURL(thumbUrl);
          if (originalUrl) {
            log(`🎯 入队：${originalUrl}`);
            queue.push(originalUrl);
          }
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // ▶️ 创建按钮 UI
  const button = document.createElement('button');
  button.textContent = '🟢 自动下载 [关闭]';
  button.style = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    padding: 8px 12px;
    z-index: 99999;
    background-color: #f0f0f0;
    border: 2px solid #555;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  `;

  button.onclick = () => {
    isEnabled = !isEnabled;
    button.textContent = isEnabled ? '🟢 自动下载 [开启]' : '🔴 自动下载 [关闭]';
    log(`🚀 状态切换：${isEnabled ? '开启' : '关闭'}`);
  };

  document.body.appendChild(button);
})();
