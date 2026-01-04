// ==UserScript==
// @name         ChatGPT 回答图片分享
// @namespace    https://github.com/chixi4/chatgpt-answer-image-dl
// @version      1.1.0
// @description  在 ChatGPT “共享”里，点击“下载图片”
// @author       Chixi
// @license      MIT
// @match        https://chatgpt.com/c/*
// @match        https://chat.openai.com/c/*
// @require      https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/dist/html-to-image.min.js
// @grant        GM_addStyle
// @grant        GM_download
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/545548/ChatGPT%20%E5%9B%9E%E7%AD%94%E5%9B%BE%E7%89%87%E5%88%86%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/545548/ChatGPT%20%E5%9B%9E%E7%AD%94%E5%9B%BE%E7%89%87%E5%88%86%E4%BA%AB.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const REVERT_MS = 2000;
  const ORIGINAL_LABEL = '下载图片';
  const CARD_SELECTOR = '[data-testid="sharing-post-unfurl-view"]';

  // ---- 样式：离屏克隆与 Toast ----
  GM_addStyle(`
    /* 仅作用于离屏克隆（不影响页面真实样式） */
    .unlock-for-capture .aspect-\\[1200\\/630\\] { aspect-ratio: auto !important; height: auto !important; }
    .unlock-for-capture ${CARD_SELECTOR} { height: auto !important; }
    .unlock-for-capture .rounded-b-3xl.overflow-hidden { overflow: visible !important; }
    .unlock-for-capture .absolute.bg-gradient-to-t { display: none !important; }
    .__offscreen_capture_root__ { position: fixed !important; top: -100000px !important; left: -100000px !important; z-index: -1 !important; }

    /* 轻量 Toast，用于顶部反馈 */
    .__dl_toast_host { position:fixed; top:12px; left:0; right:0; display:flex; flex-direction:column; align-items:center; gap:8px; pointer-events:none; z-index:2147483647; }
    .__dl_toast_core {
      display:inline-flex; align-items:center; gap:8px;
      padding:8px 12px; border-radius:10px; border:1px solid #008635; background:#008635; color:#fff;
      box-shadow:0 8px 24px rgba(0,0,0,.25); pointer-events:auto;
      transform:translateY(-20px); opacity:0; transition:transform .2s ease, opacity .2s ease;
    }
    .__dl_toast_core.show { transform:translateY(0); opacity:1; }

    /* 禁用态外观（兼容 role=button 的 div） */
    .__dl_final_btn__[disabled] { opacity:.5; pointer-events:none; }
  `);

  // ---- 顶部提示 ----
  function showToast(message) {
    let host = document.querySelector('.__dl_toast_host');
    if (!host) {
      host = document.createElement('div');
      host.className = '__dl_toast_host';
      document.body.appendChild(host);
    }
    const toast = document.createElement('div');
    toast.className = '__dl_toast_core';
    toast.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.498 6.90887C12.7094 6.60867 13.1245 6.53642 13.4248 6.74774C13.7249 6.95913 13.7971 7.37424 13.5859 7.6745L9.62695 13.2995C9.51084 13.4644 9.32628 13.5681 9.125 13.5807C8.94863 13.5918 8.77583 13.5319 8.64453 13.4167L8.59082 13.364L6.50781 11.072L6.42773 10.9645C6.26956 10.6986 6.31486 10.3488 6.55273 10.1325C6.79045 9.91663 7.14198 9.9053 7.3916 10.0876L7.49219 10.1774L9.0166 11.8542L12.498 6.90887Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.3333 2.08496C14.7046 2.08496 18.2483 5.62867 18.2483 10C18.2483 14.3713 14.7046 17.915 10.3333 17.915C5.96192 17.915 2.41821 14.3713 2.41821 10C2.41821 5.62867 5.96192 2.08496 10.3333 2.08496ZM10.3333 3.41504C6.69646 3.41504 3.74829 6.3632 3.74829 10C3.74829 13.6368 6.69646 16.585 10.3333 16.585C13.97 16.585 16.9182 13.6368 16.9182 10C16.9182 6.3632 13.97 3.41504 10.3333 3.41504Z"></path></svg><span>${message}</span>`;
    host.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); toast.addEventListener('transitionend', () => toast.remove()); }, 2000);
  }

  // ---- 文件名：优先弹窗标题 ----
  function makeFilename(dlg) {
    const ts = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const titleElement = dlg.querySelector('h2[id^="radix-"]');
    const title = titleElement ? titleElement.textContent.trim().replace(/[\/\\?%*:|"<>]/g, '-') : 'chatgpt_share';
    return `${title}_${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}.png`;
  }

  // ---- 离屏克隆 ----
  function createOffscreenClone(sourceDialog) {
    const offscreenRoot = document.createElement('div');
    offscreenRoot.className = '__offscreen_capture_root__';
    const clonedDialog = sourceDialog.cloneNode(true);
    clonedDialog.classList.add('unlock-for-capture');
    offscreenRoot.appendChild(clonedDialog);
    document.documentElement.appendChild(offscreenRoot);
    return { offscreenRoot, clonedDialog };
  }

  // ---- 按钮文案 ----
  function setButtonLabel(btn, text) {
    let label =
      btn.querySelector('.w-full.text-center.text-xs') ||
      btn.querySelector('.text-xs') ||
      Array.from(btn.querySelectorAll('div, span')).reverse().find(el => (el.textContent || '').trim().length > 0);
    if (!label) label = btn;
    label.textContent = text;
  }

  // ---- 替换图标为“图片”图标 ----
  function setDownloadIconLikeCopy(btn) {
    const svg = btn.querySelector('svg');
    if (!svg) return;
    const keepW = svg.getAttribute('width');
    const keepH = svg.getAttribute('height');
    const keepClass = svg.getAttribute('class') || '';
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    if (keepW) svg.setAttribute('width', keepW);
    if (keepH) svg.setAttribute('height', keepH);
    if (keepClass) svg.setAttribute('class', keepClass);
    svg.innerHTML = `<path fill="currentColor" d="M8.759 3h6.482c.805 0 1.47 0 2.01.044.563.046 1.08.145 1.565.392a4 4 0 0 1 1.748 1.748c.247.485.346 1.002.392 1.564C21 7.29 21 7.954 21 8.758v6.483c0 .805 0 1.47-.044 2.01-.046.563-.145 1.08-.392 1.565a4 4 0 0 1-1.748 1.748c-.485.247-1.002.346-1.564.392-.541.044-1.206.044-2.01.044H8.758c-.805 0-1.47 0-2.01-.044-.563-.046-1.08-.145-1.565-.392a4 4 0 0 1-1.748-1.748c-.247-.485-.346-1.002-.392-1.564C3 16.71 3 16.046 3 15.242V8.758c0-.805 0-1.47.044-2.01.046-.563.145-1.08.392-1.565a4 4 0 0 1 1.748-1.748c.485-.247 1.002-.346 1.564-.392C7.29 3 7.954 3 8.758 3M6.91 5.038c-.438.035-.663.1-.819.18a2 2 0 0 0-.874.874c-.08.156-.145.38-.18.819C5 7.361 5 7.943 5 8.8v4.786l.879-.879a3 3 0 0 1 4.242 0l6.286 6.286c.261-.005.484-.014.682-.03.438-.036.663-.101.819-.181a2 2 0 0 0 .874-.874c.08-.156.145-.38.18-.819.037-.45.038-1.032.038-1.889V8.8c0-.857 0-1.439-.038-1.889-.035-.438-.1-.663-.18-.819a2 2 0 0 0-.874-.874c-.156-.08-.38-.145-.819-.18C16.639 5 16.057 5 15.2 5H8.8c-.857 0-1.439 0-1.889.038M13.586 19l-4.879-4.879a1 1 0 0 0-1.414 0l-2.286 2.286c.005.261.014.484.03.682.036.438.101.663.181.819a2 2 0 0 0 .874.874c.156.08.38.145.819.18C7.361 19 7.943 19 8.8 19zM14.5 8.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-3 1a3 3 0 1 1 6 0 3 3 0 0 1-6 0"></path>`;
  }

  // ---- 截图并下载 ----
  async function captureAndDownload(btn, dlg) {
    btn.setAttribute('disabled', 'true');
    setButtonLabel(btn, ORIGINAL_LABEL);
    let offscreenRoot = null;

    try {
      if (document.fonts?.ready) { await document.fonts.ready; }
      // 双 rAF：等一帧布局稳定
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      const { offscreenRoot: root } = createOffscreenClone(dlg);
      offscreenRoot = root;

      const clonedCard = offscreenRoot.querySelector(CARD_SELECTOR);
      if (!clonedCard) throw new Error('未找到共享链接预览卡片');

      // 适度增补下边距，避免截断圆角阴影
      const inner = offscreenRoot.querySelector('.rounded-b-3xl.p-5');
      if (inner) inner.style.padding = '20px 20px 40px 20px';

      const w = Math.ceil(clonedCard.scrollWidth || clonedCard.getBoundingClientRect().width || 1200);
      const h = Math.ceil(clonedCard.scrollHeight || clonedCard.getBoundingClientRect().height || 630);

      const blob = await window.htmlToImage.toBlob(clonedCard, {
        pixelRatio: Math.max(2, window.devicePixelRatio || 1),
        cacheBust: true,
        backgroundColor: null,
        width: w,
        height: h,
        filter: (node) => {
          const el = node;
          if (el?.classList?.contains('bg-gradient-to-t')) return false;
          const tag = el?.tagName;
          if (tag === 'SCRIPT' || tag === 'STYLE') return false;
          return true;
        }
      });
      if (!blob) throw new Error('生成图片失败：返回空 Blob');

      const url = URL.createObjectURL(blob);
      GM_download({
        url,
        name: makeFilename(dlg),
        saveAs: true,
        onload: () => {
          URL.revokeObjectURL(url);
          btn.removeAttribute('disabled');
          setButtonLabel(btn, '图片已下载！');
          showToast('图片已下载！');
          setTimeout(() => setButtonLabel(btn, ORIGINAL_LABEL), REVERT_MS);
        },
        onerror: (err) => {
          console.error('GM_download error:', err);
          btn.removeAttribute('disabled');
          setButtonLabel(btn, ORIGINAL_LABEL);
          showToast('下载失败，查看控制台了解详情');
        }
      });
    } catch (err) {
      console.error('截图失败:', err);
      btn.removeAttribute('disabled');
      setButtonLabel(btn, ORIGINAL_LABEL);
      showToast('截图失败，查看控制台了解详情');
    } finally {
      try { offscreenRoot?.remove(); } catch {}
      document.querySelectorAll('.__offscreen_capture_root__').forEach(n => n !== offscreenRoot && n.remove());
    }
  }

  // ---- 安全调度：把 DOM 改动挪到水合之后 ----
  const schedule = (cb) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => requestAnimationFrame(cb), { timeout: 1000 });
    } else {
      // 退化：用一次宏任务 + 一次绘制周期
      setTimeout(() => requestAnimationFrame(cb), 120);
    }
  };

  // ---- 插入按钮（带一次性哨兵，避免重复） ----
  function tryInsertButton() {
    const dialogs = [...document.querySelectorAll('[role="dialog"],[aria-modal="true"]')];
    const dlg = dialogs.find(d => /共享链接|Share link/i.test(d.textContent || ''));
    if (!dlg || dlg.__dl_injected__) return;

    const copyBtn = [...dlg.querySelectorAll('button,[role="button"]')]
      .find(b => /复制链接|Copy link/i.test((b.textContent || '').trim()));
    if (!copyBtn) return;

    dlg.__dl_injected__ = true; // 哨兵：标记已插入

    const btn = copyBtn.cloneNode(true);
    btn.classList.add('__dl_final_btn__');
    btn.setAttribute('type', 'button');
    setDownloadIconLikeCopy(btn);
    setButtonLabel(btn, ORIGINAL_LABEL);
    btn.style.marginBottom = '8px';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      captureAndDownload(btn, dlg);
    });

    // 进一步把真正的 DOM 插入安排到下一帧，减少与 React 后续微任务冲突
    requestAnimationFrame(() => {
      // 防止父节点已被替换
      if (copyBtn.parentElement) {
        copyBtn.parentElement.insertBefore(btn, copyBtn);
      } else {
        // 回退：直接附加到弹窗末尾
        dlg.appendChild(btn);
      }
    });
  }

  // ---- MutationObserver：仅做调度，不直接改 DOM ----
  let pending = false;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    schedule(() => { pending = false; tryInsertButton(); });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // 首次尝试（延后到空闲）
  schedule(tryInsertButton);
})();
