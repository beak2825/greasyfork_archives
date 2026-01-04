// ==UserScript==
// @name         Hinata Blog 描述內容複製器
// @namespace    https://greasyfork.org/zh-TW/scripts/538446-hinata-blog-%E6%8F%8F%E8%BF%B0%E5%85%A7%E5%AE%B9%E8%A4%87%E8%A3%BD%E5%99%A8
// @version      1.1
// @description  一鍵複製日向坂 46 官方部落格文章標題＋內容。
// @author       abc0922001
// @match        https://www.hinatazaka46.com/s/official/diary/detail/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538446/Hinata%20Blog%20%E6%8F%8F%E8%BF%B0%E5%85%A7%E5%AE%B9%E8%A4%87%E8%A3%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538446/Hinata%20Blog%20%E6%8F%8F%E8%BF%B0%E5%85%A7%E5%AE%B9%E8%A4%87%E8%A3%BD%E5%99%A8.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /** 等待元素出現 */
  const waitFor = (sel, t = 5000) =>
    new Promise((ok, ng) => {
      const f = () => document.querySelector(sel);
      if (f()) return ok(f());
      const ob = new MutationObserver(() => f() && (ob.disconnect(), ok(f())));
      ob.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => (ob.disconnect(), ng(new Error('timeout'))), t);
    });

  /** 簡易提示 */
  const tip = msg => window.alert(msg);

  /** 寫剪貼簿 */
  const copy = txt =>
    navigator.clipboard.writeText(txt)
      .then(() => tip('✅ 已複製！'))
      .catch(e => tip('❌ 複製失敗：' + e.message));

  /** 建立按鈕 */
  const btn = document.createElement('button');
  btn.textContent = '📋 複製文章';
  Object.assign(btn.style, {
    position: 'fixed', top: '10px', right: '10px', zIndex: 1000,
    padding: '6px 10px', fontSize: '14px',
    background: '#5bbee5', color: '#fff', border: 'none',
    borderRadius: '4px', cursor: 'pointer'
  });
  btn.onclick = () => {
    waitFor('.c-blog-article__text')
      .then(el => {
        const title = document.querySelector('.c-blog-article__title')?.textContent.trim() ?? '';
        copy(`<h1>${title}</h1>\n${el.innerHTML.trim()}`);
      })
      .catch(() => tip('⚠️ 找不到內容區塊。'));
  };
  document.body.appendChild(btn);
})();
