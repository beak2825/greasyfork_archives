// ==UserScript==
// @name         超星学习通基础优化
// @namespace    https://example.com/
// @version      0.2
// @description  补上 favicon（网站图标） ；把页首 Logo 的 href 修正为 https://i.chaoxing.com/base，支持右键/Ctrl-新标签（支持点击 Logo 返回主页）
// @author       you
// @match        https://*.chaoxing.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540803/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%9F%BA%E7%A1%80%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/540803/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%9F%BA%E7%A1%80%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------- 常量 ---------- */
  const ICON_URL  = 'https://picx.zhimg.com/80/v2-36782948275aad708dd6cc0ce7e995bf_720w.png';
  const LOGO_URL  = 'https://i.chaoxing.com/base';

  /* ---------- 功能 1：保证 favicon ---------- */
  function ensureFavicon() {
    if (!document.querySelector('link[rel~="icon" i]')) {
      const link = document.createElement('link');
      link.rel   = 'icon';
      link.type  = 'image/png';
      link.href  = ICON_URL;
      document.head.appendChild(link);
    }
  }

  /* ---------- 功能 2：修正页首 Logo 链接 ---------- */
  function fixLogoLink() {
    // 目标: <a class="Logo"> … </a>
    const logo = document.querySelector('.Header a.Logo');
    if (!logo) return;

    const alreadyOk = logo.href.replace(/\/$/,'') === LOGO_URL;
    if (alreadyOk) return;

    // 1) 设置正确 href
    logo.href = LOGO_URL;
    logo.style.cursor = 'pointer';
    // 2) 让 Ctrl-点击 / 右键新标签页 都可用
    logo.target = '_blank';
    logo.rel    = 'noopener noreferrer';

    // 3) 去掉干扰点击的内联脚本
    logo.removeAttribute('onclick');
    logo.onclick = null;
  }

  /* ---------- 初始执行 ---------- */
  const runAll = () => { ensureFavicon(); fixLogoLink(); };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAll);
  } else {
    runAll();
  }

  /* ---------- 监控动态 DOM（SPA / 懒加载） ---------- */
  const observer = new MutationObserver(runAll);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
