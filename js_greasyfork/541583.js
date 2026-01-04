// ==UserScript==
// @name         WordPress首页显示登录按钮
// @namespace    https://admin.bloomnus.top/
// @version      1.0
// @description  检测是否为 WordPress 首页，如果是则显示登录按钮跳转到 /admin 页面。
// @author       hsopen
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license      GPL-v3
// @downloadURL https://update.greasyfork.org/scripts/541583/WordPress%E9%A6%96%E9%A1%B5%E6%98%BE%E7%A4%BA%E7%99%BB%E5%BD%95%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/541583/WordPress%E9%A6%96%E9%A1%B5%E6%98%BE%E7%A4%BA%E7%99%BB%E5%BD%95%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 检测是否是 WordPress 网站
  function isWordPressSite() {
    // 1. meta generator 判断
    const meta = document.querySelector('meta[name="generator"]');
    if (meta && /WordPress/i.test(meta.content)) return true;

    // 2. 静态资源路径判断
    const scripts = Array.from(document.scripts);
    const links = Array.from(document.querySelectorAll('link, img, script'));

    const hasWpContent = links.some(el => el.src?.includes('/wp-content/') || el.href?.includes('/wp-content/'));
    const hasWpIncludes = links.some(el => el.src?.includes('/wp-includes/') || el.href?.includes('/wp-includes/'));
    if (hasWpContent || hasWpIncludes) return true;

    // 3. 页面文本中包含“WordPress”
    if (document.body.innerText.includes('WordPress')) return true;

    return false;
  }

  function createLoginButton() {
    const btn = document.createElement('button');
    btn.textContent = '登录后台';
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '6px 12px',
      fontSize: '13px',
      zIndex: 9999,
      backgroundColor: '#0073aa',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    });

    btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#005177');
    btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#0073aa');
    btn.addEventListener('click', () => {
      const adminUrl = `${location.origin}/admin`;
      window.open(adminUrl, '_blank');
    });

    document.body.appendChild(btn);
  }

  // 主流程
  if (isWordPressSite()) {
    console.log('[WP检测] 识别为 WordPress 首页，显示登录按钮');
    createLoginButton();
  } else {
    console.log('[WP检测] 非 WordPress 首页，跳过');
  }
})();
