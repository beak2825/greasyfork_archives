// ==UserScript==
// @name         B站评论区狂点助手
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  “👍”按钮触发点赞，支持 Shadow DOM 遍历，日志可拖动/关闭，输出评论人和内容预览（修正 bili-rich-text 内容获取 & log 窗口半透明）
// @author       God of Gamblers
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/opus/*
// @match        https://www.bilibili.com/video/*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535907/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%8B%82%E7%82%B9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/535907/B%E7%AB%99%E8%AF%84%E8%AE%BA%E5%8C%BA%E7%8B%82%E7%82%B9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* 样式 */
  GM_addStyle(`
    .bm-like-btn {position:fixed;bottom:30px;right:30px;width:38px;height:38px;
        border-radius:50%;background:#ff66a1;color:#fff;font-size:18px;
        border:none;cursor:pointer;opacity:.25;transition:.2s;z-index:10000;
        display:flex;align-items:center;justify-content:center;}
    .bm-like-btn:hover {opacity:.8;}
    .bm-log-panel {position:fixed;width:360px;height:280px;
        bottom:80px;right:30px;background:rgba(33,37,43,0.7);
        border:1px solid #181a1f;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.2);
        z-index:9999;display:flex;flex-direction:column;overflow:hidden;}
    .bm-log-header {background:#282c34;color:#61dafb;
        padding:4px 8px;cursor:move;display:flex;justify-content:space-between;
        align-items:center;font-size:14px;user-select:none;}
    .bm-log-close {background:transparent;border:none;color:#61dafb;
        font-size:16px;cursor:pointer;line-height:1;}
    .bm-log-content {flex:1;padding:6px 8px;
        font:12px/1.4 monospace;color:#abb2bf;overflow-y:auto;white-space:pre-wrap;}
  `);

  /* 创建“👍”按钮 */
  const likeBtn = document.createElement('button');
  likeBtn.className = 'bm-like-btn'; likeBtn.textContent = '👍';
  likeBtn.title = '给评论全部点赞'; document.body.appendChild(likeBtn);

  /* 日志面板及拖拽关闭 */
  let logPanel, logContent;
  function ensureLogPanel() {
    if (logPanel) return;
    logPanel = document.createElement('div'); logPanel.className = 'bm-log-panel';
    const hdr = document.createElement('div'); hdr.className = 'bm-log-header';
    const title = document.createElement('span'); title.textContent = '点赞日志';
    const closeBtn = document.createElement('button'); closeBtn.className = 'bm-log-close'; closeBtn.textContent = '×';
    closeBtn.onclick = () => { logPanel.remove(); logPanel = null; };
    hdr.appendChild(title); hdr.appendChild(closeBtn);
    logContent = document.createElement('div'); logContent.className = 'bm-log-content';
    logPanel.appendChild(hdr); logPanel.appendChild(logContent);
    document.body.appendChild(logPanel);
    // 拖拽
    let dragging = false, ox = 0, oy = 0;
    hdr.addEventListener('mousedown', e => {
      dragging = true;
      const rect = logPanel.getBoundingClientRect();
      ox = e.clientX - rect.left; oy = e.clientY - rect.top;
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);
    });
    function onDrag(e) {
      if (!dragging) return;
      logPanel.style.left = e.clientX - ox + 'px';
      logPanel.style.top = e.clientY - oy + 'px';
      logPanel.style.right = 'auto'; logPanel.style.bottom = 'auto';
    }
    function stopDrag() {
      dragging = false;
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDrag);
    }
  }
  function log(msg) {
    ensureLogPanel();
    const t = new Date().toLocaleTimeString();
    const line = `[${t}] ${msg}`;
    logContent.textContent += line + '\n';
    logContent.scrollTop = logContent.scrollHeight;
    console.log(line);
  }

  /* 深度遍历收集所有点赞按钮 */
  function collectLikeButtons() {
    const found = new Set(); const stack = [document.body];
    while (stack.length) {
      const node = stack.pop(); if (!node) continue;
      if (node.nodeType === 1) {
        const el = node;
        if (el.id === 'like') {
          const btn = el.querySelector('button'); if (btn) found.add(btn);
        }
        for (const c of el.children) stack.push(c);
        if (el.shadowRoot) stack.push(el.shadowRoot);
      } else if (node.nodeType === 11) {
        for (const c of node.children || []) stack.push(c);
      }
    }
    return Array.from(found);
  }

  /* 滚动到底部，触发加载 */
  async function fullScrollLoad(interval = 800, maxAttempts = 2) {
    log('开始滚动加载...');
    return new Promise(res => {
      let last = 0, tries = 0;
      const timer = setInterval(() => {
        const h = document.documentElement.scrollHeight;
        if (h === last) {
          if (++tries >= maxAttempts) { clearInterval(timer); log('滚动加载结束'); res(); }
        } else { last = h; tries = 0; window.scrollTo(0, h); }
        log(` scrollHeight=${h}, tries=${tries}`);
      }, interval);
    });
  }

  /* 点赞流程（修正 bili-rich-text 内容获取） */
  async function likeAll() {
    likeBtn.disabled = true; log('开始点赞流程');
    await fullScrollLoad();
    const buttons = collectLikeButtons(); log(`共检测到 ${buttons.length} 个点赞按钮`);
    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      // 定位到 comment-renderer
      let node = btn;
      while (node && node.tagName !== 'BILI-COMMENT-RENDERER') {
        const root = node.getRootNode();
        if (root instanceof ShadowRoot) node = root.host;
        else break;
      }
      const renderer = node;
      const sr = renderer && renderer.shadowRoot;
      // 获取用户名
      let userName = '未知用户';
      try {
        const userInfo = sr.querySelector('bili-comment-user-info');
        const uiRoot = userInfo && userInfo.shadowRoot;
        const a = uiRoot && uiRoot.querySelector('#user-name a');
        if (a) userName = a.textContent.trim();
      } catch(e) {}
      // 获取评论内容
      let preview = '';
      try {
        // 首先尝试 bili-rich-text 内的 shadowRoot 下 p#contents
        const rich = sr.querySelector('bili-rich-text');
        if (rich && rich.shadowRoot) {
          const p = rich.shadowRoot.querySelector('p#contents');
          if (p) preview = p.textContent.trim().replace(/\s+/g,' ');
        }
        // 若未获取，再尝试 div#content 的文本
        if (!preview) {
          const cd = sr.querySelector('#content');
          if (cd) preview = cd.textContent.trim().replace(/\s+/g,' ');
        }
      } catch(e) {}
      if (preview.length > 30) preview = preview.slice(0, 30) + '...';
      // 判断是否已点赞
      const icon = btn.querySelector('bili-icon');
      const isLiked = icon && (
        icon.getAttribute('icon')?.includes('fill') || icon.getAttribute('style')?.includes('--brand_blue')
      );
      const idx = `[${i+1}/${buttons.length}]`;
      if (isLiked) {
        log(`${idx} 已点赞，跳过 — ${userName}: “${preview}”`);
      } else {
        btn.click(); log(`${idx} 点赞成功 — ${userName}: “${preview}”`);
        await new Promise(r => setTimeout(r, 300));
      }
    }
    log('✅ 点赞流程结束'); likeBtn.disabled = false;
  }

  likeBtn.addEventListener('click', likeAll);
})();
