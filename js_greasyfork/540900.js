// ==UserScript==
// @name         GF Auto Add to My Set
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  在脚本详情页一键把脚本加入自定义集合并保存
// @match        https://greasyfork.org/*/scripts/*
// @match        https://greasyfork.org/*/users/*/sets/*/edit*  
// @grant        GM_openInTab
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540900/GF%20Auto%20Add%20to%20My%20Set.user.js
// @updateURL https://update.greasyfork.org/scripts/540900/GF%20Auto%20Add%20to%20My%20Set.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // —— 配置区 ——  
  // 1. 填成你的集合编辑页面 URL（如截图里那条）
  const SET_EDIT_URL = 'https://greasyfork.org/zh-CN/users/xxx/sets/yyy/edit';  // 这里需要改成你实际的集合编辑页面地址

  // —— 样式 ——  
  GM_addStyle(`
    .gf-autoadd-btn {
      font-size:16px;
      color:#d4a017;
      background:transparent;
      border:none;
      cursor:pointer;
      margin-left:.5em;
    }
  `);

  // —— 脚本详情页逻辑 ——  
  if (/^\/[^\/]+\/scripts\/\d+/.test(location.pathname) &&
      !/\/sets\/\d+\/edit/.test(location.pathname)) {
    const m = location.pathname.match(/scripts\/(\d+)/);
    if (!m) return;
    const scriptId = m[1];

    // 找到标题节点（兼容多布局）
    const titleEl = document.querySelector(
      '[itemprop="name"], .script-header__title, .script-page__title, h1, h2'
    );
    if (!titleEl) return;

    // 插入按钮
    const btn = document.createElement('button');
    btn.textContent = '★ 加入集合';
    btn.className = 'gf-autoadd-btn';
    btn.title = '一键添加并保存到自定义集合';
    titleEl.appendChild(btn);

    btn.onclick = () => {
      // 打开编辑页并带上 ?add=ID
      GM_openInTab(`${SET_EDIT_URL}?add=${scriptId}`, { active: true });
    };
    return;
  }

  // —— 编辑页面自动填充逻辑 ——  
  if (location.href.startsWith(SET_EDIT_URL)) {
    const url = new URL(location.href);
    const addId = url.searchParams.get('add');
    if (!addId) return;

    // 1) 文本框里追加（若已存在则不重复）
    const ta = document.querySelector('textarea');
    const items = ta.value.split(/\s+/).filter(Boolean);
    if (!items.includes(addId)) {
      ta.value = (ta.value.trim() ? ta.value + '\n' : '') + addId;
    }

    // 2) 点击「包含」
    setTimeout(() => {
      const includeBtn = [...document.querySelectorAll('button, input[type="button"]')]
        .find(el => el.innerText.trim() === '包含');
      includeBtn && includeBtn.click();

      // 3) 再点击「保存」
      setTimeout(() => {
        const saveBtn = [...document.querySelectorAll('button, input[type="submit"]')]
          .find(el => el.innerText.trim() === '保存');
        saveBtn && saveBtn.click();
      }, 500);
    }, 500);
  }
})();
