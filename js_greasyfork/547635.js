// ==UserScript==
// @license MIT
// @name          Discuz 好友助手
// @namespace    https://tdsheepvillage.com
// @version      1.0.3
// @description  在“链接合集帖”一键批量打开邀请链接；在邀请页自动点击“接受邀请”，成功后自动关页并继续
// @author       you
// @match        https://www.tdsheepvillage.com/*
// @match        https://tdsheepvillage.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tdsheepvillage.com
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547635/Discuz%20%E5%A5%BD%E5%8F%8B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/547635/Discuz%20%E5%A5%BD%E5%8F%8B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const HOST = location.host;

  // ------------- 小工具 -------------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const includesText = (el, kw) => !!el && ((el.textContent || el.value || '') + '').includes(kw);

  // 统一的强制关闭（带多重兜底）
  function forceCloseTab(delay = 0) {
    setTimeout(() => {
      try { window.close(); } catch (e) {}
      // 再兜底一次：跳 blank 后再关，部分浏览器更容易成功
      setTimeout(() => {
        try { location.href = 'about:blank'; } catch (e) {}
        setTimeout(() => { try { window.close(); } catch (e) {} }, 60);
      }, 400);
    }, delay);
  }

  function createPanel() {
    const wrap = document.createElement('div');
    wrap.id = 'invite-batch-panel';
    wrap.innerHTML = `
      <div class="ibp-card">
        <div class="ibp-title">批量接受好友邀请</div>
        <div class="ibp-note">已识别链接：<span class="ibp-count">0</span> 条</div>
        <div class="ibp-note ibp-progress">待开始</div>
        <button class="ibp-btn">开始批量接受（0）</button>
      </div>
    `;
    GM_addStyle(`
      #invite-batch-panel{position:fixed;right:16px;bottom:16px;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial}
      #invite-batch-panel .ibp-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.12);padding:12px 14px;min-width:230px}
      .ibp-title{font-weight:600;margin-bottom:6px}
      .ibp-note{font-size:13px;color:#374151;margin:4px 0}
      .ibp-btn{all:unset;border:1px solid #2563eb;color:#2563eb;border-radius:8px;padding:6px 10px;cursor:pointer;font-size:13px}
      .ibp-btn:disabled{opacity:.5;cursor:not-allowed}
    `);
    document.body.appendChild(wrap);
    return wrap;
  }

  // ------------- 场景 A：邀请落地页（自动点“接受邀请”，自动关闭标签） -------------
  async function autoAcceptOnInvitePage() {
    // 1) 屏蔽/自动通过 alert/confirm/prompt，避免阻塞
    try {
      unsafeWindow.alert  = () => {};
      unsafeWindow.confirm = () => true;
      unsafeWindow.prompt  = () => null;
    } catch (e) {
      // 某些环境没有 unsafeWindow，用 window 兜底
      window.alert  = () => {};
      window.confirm = () => true;
      window.prompt  = () => null;
    }

    // 2) 判断是否邀请页（找“接受邀请”等按钮）
    const btns = Array.from(document.querySelectorAll('a,button,input'))
      .filter(el => {
        const t = (el.textContent || el.value || '').trim();
        return /接受邀请|接受 好友邀请|同意|Accept/i.test(t);
      });

    if (btns.length === 0) return false; // 不是邀请页

    // 已是好友/已处理：直接关闭
    const bodyTxt = (document.body.innerText || '').trim();
    if (/(已是好友|已接受邀请|请求已发送|等待验证|正在处理)/.test(bodyTxt)) {
      forceCloseTab(500);
      return true;
    }

    // 3) 点击“接受邀请”
    btns[0].click();

    // 4) 最多等 2.5s 观察成功提示；无论如何最后都关
    const okCheck = () => /(已是好友|操作成功|已接受邀请|请求已发送|等待验证|正在处理)/.test((document.body.innerText || '').trim());
    const t0 = Date.now();
    while (Date.now() - t0 < 2500) {
      if (okCheck()) break;
      await sleep(150);
    }

    // 5) 关闭（强制兜底）
    forceCloseTab(200);
    return true;
  }

  // ------------- 场景 B：链接合集帖（批量打开） -------------
  function collectInviteLinks() {
    // 合集帖每条是本站完整链接，且带 c=xxx 参数
    const as = Array.from(document.querySelectorAll('a[href]'));
    const list = as
      .map(a => a.href)
      .filter(h =>
        /^https?:\/\//.test(h) &&
        h.includes(HOST) &&
        /[?&]c=/.test(h)
      );
    return Array.from(new Set(list));
  }

  async function runBatch() {
    const panel = document.getElementById('invite-batch-panel');
    const progressEl = panel.querySelector('.ibp-progress');
    const btn = panel.querySelector('.ibp-btn');

    const links = collectInviteLinks();
    let done = 0;
    btn.disabled = true;

    for (const url of links) {
      progressEl.textContent = `打开并处理：${done + 1} / ${links.length}`;
      GM_openInTab(url, { active: false, insert: true, setParent: true });
      // 节流，避免被风控；需要更快可调小（自担风险）
      await sleep(1600);
      done++;
    }
    progressEl.textContent = `完成：${done} / ${links.length}`;
    btn.disabled = false;
  }

  (async function main() {
    // 邀请页：自动接受并关页
    const handled = await autoAcceptOnInvitePage();
    if (handled) return;

    // 合集帖：显示控制面板并运行
    const links = collectInviteLinks();
    if (links.length > 0) {
      const panel = createPanel();
      panel.querySelector('.ibp-count').textContent = links.length;
      const btn = panel.querySelector('.ibp-btn');
      const progressEl = panel.querySelector('.ibp-progress');
      btn.textContent = `开始批量接受（${links.length}）`;
      progressEl.textContent = '就绪';
      btn.addEventListener('click', runBatch);
    }
  })();
})();
