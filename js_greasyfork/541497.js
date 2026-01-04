// ==UserScript==
// @name         链接复制助手
// @namespace    hsopenScript
// @version      2.6.7
// @description  按 Alt+1 启用/关闭监听，点击复制 JSON 字段或提示，不弹窗，顶部心跳提示，监听开启时对特定链接加彩虹文字或边框样式。处理带撇号的内容时会删除整个包含撇号的单词。
// @author       hsopen
// @license      GPLv3
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/541497/%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541497/%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== 配置区域 =====
  const excludePathRules = [
    path => path === "/wp-admin/edit-tags.php?taxonomy=product_cat&post_type=product",
    path => path === "/wp-admin/edit.php?post_type=product",
    path => path.startsWith("/wp-admin/edit.php?s=")
  ];

  const jsonExtractRules = {
    match: (pathname) => {
      const pathOnly = pathname.split('?')[0];
      if (pathOnly.includes('/products/')) return { jsonField: 'product.title' };
      if (pathOnly.includes('/collections/')) return { jsonField: 'collection.title' };
      return null;
    }
  };

  const heartbeatText = '■';
  const heartbeatFontSize = '40px';
  const heartbeatZIndex = 2147483647;
  const rainbowTextClass = 'hsopen-rainbow-text';
  const rainbowBorderClass = 'hsopen-rainbow-border';

  const rainbowCSS = `
    .${rainbowTextClass} {
      position: relative;
      z-index: 1;
    }
    .${rainbowTextClass}::after {
      content: "";
      position: absolute;
      top: -1px;
      left: -1px;
      right: -1px;
      bottom: -1px;
      z-index: -1;
      border-radius: 4px;
      border: 1px solid transparent;
      background: linear-gradient(90deg, red, orange, yellow, green, cyan, blue, violet);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 2px;
      pointer-events: none;
    }
    .${rainbowBorderClass} {
      box-shadow: 0 0 0 2px rgba(255, 0, 255, 0.5),
                  0 0 8px 2px rgba(255, 192, 203, 0.5);
      border-radius: 6px;
    }
  `;

  const currentPath = window.location.pathname + window.location.search;
  const isExcludedPage = excludePathRules.some(rule => rule(currentPath));

  let isActive = false;
  let heartbeatEl = null;
  let rainbowLinks = new Set();

  function addGlobalStyle(css) {
    if (document.getElementById('hsopen-rainbow-style')) return;
    const style = document.createElement('style');
    style.id = 'hsopen-rainbow-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createHeartbeatText() {
    if (heartbeatEl) return;
    heartbeatEl = document.createElement('div');
    heartbeatEl.textContent = heartbeatText;
    Object.assign(heartbeatEl.style, {
      position: 'fixed',
      top: '12px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'rgba(255, 77, 77, 0.6)',
      fontWeight: 'bold',
      fontSize: heartbeatFontSize,
      zIndex: heartbeatZIndex,
      userSelect: 'none',
      pointerEvents: 'none',
      textShadow: '0 0 8px rgba(255,255,255,0.3)',
      animation: 'colorFlash 1.5s infinite ease-in-out, heartbeatScale 1.5s infinite ease-in-out',
      fontFamily: 'Arial, sans-serif',
    });

    const style = document.createElement('style');
    style.textContent = `
      @keyframes heartbeatScale {
        0%, 100% { transform: translateX(-50%) scale(1); }
        50% { transform: translateX(-50%) scale(1.15); }
      }
      @keyframes colorFlash {
        0% { color: rgba(255, 77, 77, 0.6); }
        33% { color: rgba(255, 210, 77, 0.6); }
        66% { color: rgba(77, 154, 255, 0.6); }
        100% { color: rgba(255, 77, 77, 0.6); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(heartbeatEl);
  }

  function removeHeartbeatText() {
    if (heartbeatEl) {
      heartbeatEl.remove();
      heartbeatEl = null;
    }
  }

  function getFieldValue(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  function processText(text) {
    // 找到第一个带撇号的单词的位置（以空格分割）
    const words = text.split(' ');
    let index = words.findIndex(word => word.includes("'"));
    if (index === -1) {
      // 没有撇号，返回原字符串
      return text.trim();
    }
    // 返回撇号单词之后的所有单词（不包括带撇号的单词本身）
    return words.slice(index + 1).join(' ').trim();
  }


  async function fetchJsonAndCopy(url, fieldPath) {
    try {
      const jsonUrl = url + '.json';
      const res = await fetch(jsonUrl);
      const data = await res.json();
      let value = getFieldValue(data, fieldPath) || `[字段 ${fieldPath} 未找到]`;
      value = processText(value);
      GM_setClipboard(value);
      showCopyText(value);
    } catch (err) {
      console.error('[复制助手] 获取 JSON 出错:', err);
      GM_setClipboard(url.pathname);
      showCopyText(url.pathname + ' [获取失败]');
    }
  }

  function onClickLink(e) {
    if (!isActive) return;

    const a = e.target.closest('a[href]');
    if (!a) return;

    a.classList.remove(rainbowTextClass);
    a.classList.remove(rainbowBorderClass);
    rainbowLinks.delete(a);

    const url = new URL(a.href);
    const pathname = url.pathname;

    if (isExcludedPage) {
      e.preventDefault();
      GM_setClipboard(pathname);
      showCopyText(pathname);
      return;
    }

    const match = jsonExtractRules.match(pathname);
    if (match) {
      e.preventDefault();
      fetchJsonAndCopy(url.origin + pathname, match.jsonField);
      return;
    }
  }

  function showCopyText(text) {
    const toast = document.createElement('div');
    toast.textContent = text;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#222',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '13px',
      opacity: '0.9',
      zIndex: heartbeatZIndex,
      pointerEvents: 'none',
      transition: 'opacity 0.4s ease-in-out',
      fontFamily: 'Arial, sans-serif',
    });
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 2000);
  }

  function addRainbowText() {
    rainbowLinks.clear();
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      try {
        const url = new URL(link.href, location.origin);
        const pathOnly = url.pathname;

        if (pathOnly.includes('/products/') || pathOnly.includes('/collections/')) {
          const hasVisibleText = link.innerText.trim().length > 0;
          if (hasVisibleText) {
            link.classList.add(rainbowTextClass);
          } else {
            link.classList.add(rainbowBorderClass);
          }
          rainbowLinks.add(link);
        }
      } catch (e) { }
    });
  }

  function removeRainbowText() {
    rainbowLinks.forEach(link => {
      link.classList.remove(rainbowTextClass);
      link.classList.remove(rainbowBorderClass);
    });
    rainbowLinks.clear();
  }

  function toggleListener() {
    isActive = !isActive;
    if (isActive) {
      createHeartbeatText();
      addRainbowText();
      document.addEventListener('click', onClickLink, true);
      console.log('[链接复制助手] 已启动（Alt+1 切换）');
    } else {
      removeHeartbeatText();
      removeRainbowText();
      document.removeEventListener('click', onClickLink, true);
      console.log('[链接复制助手] 已关闭（Alt+1 切换）');
    }
  }

  addGlobalStyle(rainbowCSS);

  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === '1') {
      e.preventDefault();
      toggleListener();
    }
  });

})();
