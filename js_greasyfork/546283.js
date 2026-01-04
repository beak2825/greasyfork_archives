// ==UserScript==
// @name         Chatbox 對話列新增快速刪除按鈕
// @namespace    http://tampermonkey.net/
// @version      1.5.6
// @description  Chatbox 快速刪除快捷鍵
// @author       shanlan(grok-4-fast-reasoning)
// @match        https://web.chatboxai.app/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546283/Chatbox%20%E5%B0%8D%E8%A9%B1%E5%88%97%E6%96%B0%E5%A2%9E%E5%BF%AB%E9%80%9F%E5%88%AA%E9%99%A4%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/546283/Chatbox%20%E5%B0%8D%E8%A9%B1%E5%88%97%E6%96%B0%E5%A2%9E%E5%BF%AB%E9%80%9F%E5%88%AA%E9%99%A4%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(() => {
  const selMenu = '.mantine-Menu-dropdown';
  const menu = () => document.querySelector(selMenu);
  const poll = (fn, n = 25, d = 60) => { const t = () => (fn() || --n <= 0) ? 0 : setTimeout(t, d); t(); };

  // 注入CSS
  const injectCSS = () => {
    if (document.querySelector('#qd-custom-style')) return;
    const style = document.createElement('style');
    style.id = 'qd-custom-style';
    style.innerHTML = `
      .cursor-pointer.rounded-sm {
        padding-block: 2px !important;
        border-top: 1px solid #4d4d4d !important;
      }
    `;
    document.head.appendChild(style);
  };
  injectCSS();

  // 依 class 尋找
  const pickDelete = (m) => m?.querySelector('button[role="menuitem"] svg.tabler-icon-trash')?.closest('button[role="menuitem"]');
  const pickCheck = (m) => m?.querySelector('button[role="menuitem"] svg.tabler-icon-check')?.closest('button[role="menuitem"]');

  const tryConfirm = () => {
    const m = menu();
    const c = pickCheck(m);
    if (c) { c.click(); return true; }
    return false;
  };
  const tryDeleteThenConfirm = () => {
    const m = menu();
    const d = pickDelete(m);
    if (!d) return false;
    d.click();
    poll(tryConfirm);
    return true;
  };

  const act = (li) => {
    const more = li.querySelector('svg.tabler-icon-dots')?.closest('button');
    const star = li.querySelector('svg.tabler-icon-star')?.closest('button');
    const targetBtn = more || star;
    if (!targetBtn) return;
    targetBtn.click();
    poll(() => tryConfirm() || tryDeleteThenConfirm());
  };

  const inject = (li) => {
    if (!li || li.dataset.qd) return;
    const more = li.querySelector('svg.tabler-icon-dots')?.closest('button');
    const star = li.querySelector('svg.tabler-icon-star')?.closest('button');
    if (!more && !star) return;
    const btn = document.createElement('button');
    btn.type = 'button'; btn.title = 'Delete'; btn.dataset.qd = '1';
    btn.className = 'MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-pbh24y';
    btn.innerHTML = 'X';
    btn.style.background = '#e53935';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '0';
    btn.style.fontWeight = 'bold';
    btn.style.fontSize = '14px';
    btn.style.padding = '0 4px';
    btn.style.display = 'none';
    btn.style.position = 'relative';
    btn.style.left = '12px';
    btn.onmouseover = () => btn.style.background = '#b71c1c';
    btn.onmouseout = () => btn.style.background = '#e53935';
    btn.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      act(li);
    };

    const targetBtn = more || star;
    targetBtn.parentElement.insertBefore(btn, targetBtn);
    targetBtn.addEventListener('mouseenter', () => { btn.style.display = ''; });
    targetBtn.addEventListener('mouseleave', () => { btn.style.display = 'none'; });
    btn.addEventListener('mouseenter', () => { btn.style.display = ''; });
    btn.addEventListener('mouseleave', () => { btn.style.display = 'none'; });
    li.dataset.qd = '1';
  };

  const scan = () => document.querySelectorAll('div[class*="session-item"]').forEach(inject);
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  scan();
})();