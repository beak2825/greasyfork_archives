// ==UserScript==
// @name         B站收藏夹批量提取视频链接／Bilibili Favlist Extractor
// @namespace    ChatGPT
// @version      0.3
// @author       GPT
// @description  在 B 站收藏夹页提取本页所有视频标题 + 链接到浮动窗口，支持一键复制与导出 TXT
// @match        https://space.bilibili.com/*/favlist*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_download
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540332/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%EF%BC%8FBilibili%20Favlist%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/540332/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%A4%B9%E6%89%B9%E9%87%8F%E6%8F%90%E5%8F%96%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%EF%BC%8FBilibili%20Favlist%20Extractor.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** 计算当前页码（URL 参数 page= 或 pn=，默认 1） */
  function getPageNumber() {
    const u = new URL(location.href);
    return parseInt(u.searchParams.get('page') || u.searchParams.get('pn') || '1', 10);
  }

  /** 导出为 TXT 文件 */
  function exportTxt(content) {
    const now   = new Date();
    const y     = now.getFullYear();
    const m     = String(now.getMonth() + 1).padStart(2, '0');
    const d     = String(now.getDate()).padStart(2, '0');
    const name  = `${y}${m}${d}_第${getPageNumber()}页.txt`;
    GM_download({
      url: URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' })),
      name,
      saveAs: true
    });
  }

  /** 收集当前 DOM 中已渲染的视频标题+链接 */
  function collectVideos() {
    const anchors = [...document.querySelectorAll('a[href*="/video/"]')];
    const map = new Map();              // 去重（以 BV 号为键）
    anchors.forEach(a => {
      const url = new URL(a.href, location.origin);
      const m   = url.pathname.match(/\/video\/(BV\w+)/);
      if (!m) return;
      const bv = m[1];
      const title = (a.innerText || '').trim();
      map.set(bv, `${title} ${url.origin}${url.pathname}`);
    });
    return [...map.values()];
  }

  /** 创建浮窗 */
  function createPanel() {
    const panel = document.createElement('div');
    panel.id = 'fav-extractor-panel';
    panel.innerHTML = `
      <div id="fav-extractor-header">
        <span>🎬 收藏夹视频列表</span>
        <button id="fav-extractor-refresh">刷新</button>
        <button id="fav-extractor-copy">复制全部</button>
        <button id="fav-extractor-export">导出TXT</button>
        <button id="fav-extractor-close">✕</button>
      </div>
      <textarea id="fav-extractor-output" readonly></textarea>
      <style>
        #fav-extractor-panel{
          position:fixed; right:24px; bottom:24px; z-index:999999;
          width:360px; height:150px; max-height:90vh;
          background:#fff; border:1px solid #888;
          box-shadow:0 6px 12px rgba(0,0,0,.2); border-radius:8px; font-size:14px;
          display:flex; flex-direction:column; resize:both; overflow:hidden;
        }
        #fav-extractor-header{
          display:flex; align-items:center; justify-content:space-between;
          background:#00AEEC; color:#fff; padding:6px 8px; cursor:move; user-select:none;
        }
        #fav-extractor-header button{
          margin-left:6px; border:none; border-radius:4px; padding:2px 6px;
          background:#fff; color:#00AEEC; cursor:pointer; font-size:12px;
        }
        #fav-extractor-header button:hover{opacity:.8;}
        #fav-extractor-output{
          flex:1; width:100%; border:none; padding:8px; box-sizing:border-box;
          font-family:monospace; white-space:pre; overflow:auto;
        }
      </style>
    `;
    document.body.appendChild(panel);

    /** 拖动支持 */
    (function () {
      const header = panel.querySelector('#fav-extractor-header');
      let sx, sy, sl, st, dragging = false;
      header.addEventListener('mousedown', e => {
        dragging = true;
        sx = e.clientX; sy = e.clientY;
        const r = panel.getBoundingClientRect();
        sl = r.left; st = r.top;
        e.preventDefault();
      });
      document.addEventListener('mousemove', e => {
        if (!dragging) return;
        panel.style.left = sl + (e.clientX - sx) + 'px';
        panel.style.top  = st + (e.clientY - sy) + 'px';
        panel.style.right = 'auto'; panel.style.bottom = 'auto';
      });
      document.addEventListener('mouseup', () => dragging = false);
    })();

    /** 填充文本框 */
    function fillTextarea() {
      const output = panel.querySelector('#fav-extractor-output');
      output.value = collectVideos().join('\n');
    }

    /** 按钮事件 */
    panel.querySelector('#fav-extractor-refresh').onclick = fillTextarea;
    panel.querySelector('#fav-extractor-copy').onclick    = () => {
      const txt = panel.querySelector('#fav-extractor-output').value;
      GM_setClipboard(txt, { type: 'text', mimetype: 'text/plain' });
      alert(`已复制 ${txt.split('\\n').length} 条链接到剪贴板！`);
    };
    panel.querySelector('#fav-extractor-export').onclick  = () => {
      const txt = panel.querySelector('#fav-extractor-output').value;
      exportTxt(txt);
    };
    panel.querySelector('#fav-extractor-close').onclick   = () => panel.remove();

    /** 初始填充 & 动态监听 */
    fillTextarea();
    const root = document.querySelector('.fav-video-list,.be-pager');
    if (root) {
      new MutationObserver(fillTextarea).observe(root, { childList: true, subtree: true });
    }
  }

  /* 等 DOM 就绪后创建浮窗 */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPanel);
  } else {
    createPanel();
  }
})();
