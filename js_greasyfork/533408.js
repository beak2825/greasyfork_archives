// ==UserScript==
// @name         ChatGPT快捷深度搜索（自用版）
// @namespace    http://tampermonkey.net/
// @version      1.8.4
// @description  点击"搜"后分两步串行且加延时：1) 写前缀，2) 发送。每步确认成功再到下一步，避免过快导致失败或连发；按钮可拖动并记忆位置；长内容自动优化处理；支持 Ctrl+S/Ctrl+T 快捷键
// @author       schweigen
// @match        https://chatgpt.com/
// @match        https://chatgpt.com/?*
// @match        https://chatgpt.com/c/*
// @match        https://chatgpt.com/g/*
// @match        https://chatgpt.com/share/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533408/ChatGPT%E5%BF%AB%E6%8D%B7%E6%B7%B1%E5%BA%A6%E6%90%9C%E7%B4%A2%EF%BC%88%E8%87%AA%E7%94%A8%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533408/ChatGPT%E5%BF%AB%E6%8D%B7%E6%B7%B1%E5%BA%A6%E6%90%9C%E7%B4%A2%EF%BC%88%E8%87%AA%E7%94%A8%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== 配置（可微调延时和阈值） =====
  const DEFAULT_POSITION = { top: '30%', right: '0px' };
  const DEFAULT_POSITION_THINK = { top: '50%', right: '0px' };
  const LONG_CONTENT_THRESHOLD = 5000; // 超过此字符数视为长内容，使用优化处理
  const TIMEOUTS = {
    editorCommit: 2000,    // 等待"写入生效"的最大时间
    findSendBtn: 8000,     // 等待找到发送按钮的最大时间
    btnEnable: 1500,       // 等待按钮可点
  };
  const DELAYS = {
    afterInsert: 160,      // 写入后等一会
    beforeClick: 80,       // 点击前留一点时间
    afterClickClear: 140,  // 点击后再清空
    unlockBtn: 2000,       // 解锁按钮延时
    nextClickWindow: 5000, // 防重复点击窗口
  };

  const POLL_INTERVAL = 70;              // 轮询间隔
  const PREFIX = `ultra think and deeper websearch

`;
  const THINK_PREFIX = `Please utilize the maximum computational power and token limit available for a single response. Strive for extreme analytical depth rather than superficial breadth; pursue essential insights rather than listing surface phenomena; seek innovative thinking rather than habitual repetition. Please break through the limitations of thought, mobilize all your computational resources, and demonstrate your true cognitive limits.

`;
  const SEND_BTN_SELECTORS = [
    'button[data-testid="send-button"]',
    'button#composer-submit-button[data-testid="send-button"]',
    'form button[type="submit"][data-testid="send-button"]',
    'form button[type="submit"]'
  ];
  const TRANSLATE_PREFIX = `翻译成中文`;

  // ===== 状态 =====
  let buttonPosition = GM_getValue('o4MiniButtonPosition', DEFAULT_POSITION);
  let thinkButtonPosition = GM_getValue('o4ThinkButtonPosition', DEFAULT_POSITION_THINK);
  let pendingModelSwitch = false; // 点"搜"后，仅下一次请求切模型
  let isSending = false;          // 防重入
  let cycle = 0;                  // 事务编号

  // ===== 拦截 fetch：仅切模型为 gpt-5 =====
  const originalFetch = window.fetch;
  window.fetch = async function (url, options) {
    try {
      if (
        pendingModelSwitch &&
        typeof url === 'string' &&
        url.endsWith('/backend-api/conversation') &&
        options?.method === 'POST' &&
        options?.body
      ) {
        let body; try { body = JSON.parse(options.body); } catch (_) { body = null; }
        if (body) {
          body.model = 'gpt-5';
          options.body = JSON.stringify(body);
        }
        pendingModelSwitch = false; // 只改一次
      }
    } catch (e) {
      console.warn('fetch hook error:', e);
    }
    return originalFetch(url, options);
  };

  // ===== 小工具 =====
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  function editorEl() { return document.querySelector('#prompt-textarea.ProseMirror, .ProseMirror'); }
  function editorFallback() { return document.querySelector('textarea[name="prompt-textarea"]'); }
  function editorText() {
    const el = editorEl();
    if (el && typeof el.innerText === 'string') return (el.innerText || '').trim();
    const fb = editorFallback();
    return fb && typeof fb.value === 'string' ? fb.value.trim() : '';
  }
  function isLongContent() {
    // 快速检测是否为长内容，避免完整获取文本
    const el = editorEl();
    if (el && typeof el.innerText === 'string') {
      return el.innerText.length > LONG_CONTENT_THRESHOLD;
    }
    const fb = editorFallback();
    if (fb && typeof fb.value === 'string') {
      return fb.value.length > LONG_CONTENT_THRESHOLD;
    }
    return false;
  }
  function waitUntil(condFn, timeout = 1000, step = 50) {
    return new Promise((resolve, reject) => {
      const deadline = Date.now() + timeout;
      (function poll () {
        try {
          const v = condFn();
          if (v) return resolve(v);
          if (Date.now() > deadline) return reject(new Error('timeout'));
          setTimeout(poll, step);
        } catch (e) { reject(e); }
      })();
    });
  }
  function lockButton(btn, lock) {
    if (!btn) return;
    btn.setAttribute('aria-disabled', lock ? 'true' : 'false');
    btn.disabled = !!lock;
  }
  function clearEditorSafely() {
    const pm = editorEl();
    if (pm) {
      pm.focus();
      const r = document.createRange();
      r.selectNodeContents(pm);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
      document.execCommand('insertText', false, '');
      pm.dispatchEvent(new InputEvent('input', { bubbles: true }));
      pm.blur(); pm.focus();
      return;
    }
    const fb = editorFallback();
    if (fb) {
      fb.focus();
      fb.value = '';
      fb.dispatchEvent(new InputEvent('input', { bubbles: true }));
      fb.blur(); fb.focus();
    }
  }

  // ===== 主流程：严格分步 + 确认 + 延时 =====
  async function runPrefixThenSend(prefixText) {
    if (isSending) return;
    isSending = true;
    const myCycle = ++cycle;

    try {
      // 第 1 步：写前缀
      insertPrefixAtBeginning(prefixText);
      await sleep(DELAYS.afterInsert);
      await waitUntil(() => editorText().startsWith(prefixText), TIMEOUTS.editorCommit, POLL_INTERVAL);

      // 第 2 步：等待发送按钮 → 锁 → 切模型 → 点击
      const btn = await waitUntil(findSendButton, TIMEOUTS.findSendBtn, POLL_INTERVAL);
      await waitUntil(() => btn && !isDisabled(btn), TIMEOUTS.btnEnable, POLL_INTERVAL);
      lockButton(btn, true);
      pendingModelSwitch = true;
      await sleep(DELAYS.beforeClick);
      realClick(btn);

      // 清空编辑器，避免草稿回放再次发送
      await sleep(DELAYS.afterClickClear);
      clearEditorSafely();

      // 解锁
      setTimeout(() => lockButton(btn, false), DELAYS.unlockBtn);

    } catch (e) {
      console.warn('pipeline error:', e);
    } finally {
      setTimeout(() => { if (cycle === myCycle) isSending = false; }, DELAYS.nextClickWindow);
    }
  }

  // 将 PREFIX 插入到输入框最前面（不重复）
  function insertPrefixAtBeginning(prefixText) {
    const pm = editorEl();
    const fallback = editorFallback();

    // 检查是否为长内容，使用不同的处理策略
    const isLong = isLongContent();
    
    if (isLong) {
      // 长内容优化处理：先清空再插入，避免大选区操作
      const currentText = editorText();
      const finalText = currentText.startsWith(prefixText) ? currentText : (prefixText + currentText);
      
      if (pm) {
        pm.focus();
        // 先清空
        document.execCommand('selectAll', false, null);
        document.execCommand('insertText', false, '');
        // 再插入完整内容
        document.execCommand('insertText', false, finalText);
        pm.dispatchEvent(new InputEvent('input', { bubbles: true }));
        pm.blur(); pm.focus();
        return;
      }
      
      if (fallback) {
        fallback.focus();
        fallback.value = finalText;
        fallback.dispatchEvent(new InputEvent('input', { bubbles: true }));
        fallback.blur(); fallback.focus();
      }
      return;
    }

    // 短内容正常处理
    const currentText = editorText();
    const finalText = currentText
      ? (currentText.startsWith(prefixText) ? currentText : (prefixText + currentText))
      : prefixText;

    if (pm) {
      pm.focus();
      const range = document.createRange();
      range.selectNodeContents(pm);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand('insertText', false, finalText);
      pm.dispatchEvent(new InputEvent('input', { bubbles: true }));
      pm.blur(); pm.focus();
      return;
    }

    if (fallback) {
      fallback.focus();
      fallback.value = finalText;
      fallback.dispatchEvent(new InputEvent('input', { bubbles: true }));
      fallback.blur(); fallback.focus();
    }
  }

  function findSendButton() {
    for (const sel of SEND_BTN_SELECTORS) {
      const btn = document.querySelector(sel);
      if (btn) return btn;
    }
    return null;
  }

  function isDisabled(btn) {
    const aria = btn.getAttribute('aria-disabled');
    return btn.disabled || aria === 'true';
  }

  function realClick(btn) {
    try {
      // 优先用表单提交
      const form = btn.closest('form');
      if (form) {
        if (typeof form.requestSubmit === 'function') { form.requestSubmit(btn); }
        else { form.submit(); }
        return true;
      }

      // 退化到合成事件
      const rect = btn.getBoundingClientRect();
      const cx = Math.max(0, rect.left + rect.width / 2);
      const cy = Math.max(0, rect.top + rect.height / 2);
      const events = [
        new PointerEvent('pointerdown', { bubbles: true, clientX: cx, clientY: cy }),
        new MouseEvent('mousedown',     { bubbles: true, clientX: cx, clientY: cy }),
        new PointerEvent('pointerup',   { bubbles: true, clientX: cx, clientY: cy }),
        new MouseEvent('mouseup',       { bubbles: true, clientX: cx, clientY: cy }),
      ];
      for (const ev of events) btn.dispatchEvent(ev);
      btn.click();
      return true;
    } catch (e) {
      console.warn('realClick error:', e);
      return false;
    }
  }

  // ===== 快捷键监听 =====
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // 检查是否按下了 Ctrl 键（macOS）
      if (e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'y':
          case 'z':
            // Ctrl+Y / Ctrl+Z：翻译功能
            e.preventDefault();
            e.stopPropagation();
            runPrefixThenSend(TRANSLATE_PREFIX);
            notify('快捷键"译"已激活：Ctrl+Y / Ctrl+Z');
            break;
          case 's':
            // Ctrl+S：搜索功能
            e.preventDefault();
            e.stopPropagation();
            runPrefixThenSend(PREFIX);
            notify('快捷键"搜"已激活：Ctrl+S');
            break;
          case 't':
            // Ctrl+T：思考功能
            e.preventDefault();
            e.stopPropagation();
            runPrefixThenSend(THINK_PREFIX);
            notify('快捷键"思"已激活：Ctrl+T');
            break;
        }
      }
    }, true); // 使用捕获阶段确保优先处理
  }

  // ===== UI：按钮拖动 =====
  function makeDraggable(el, onSavePosition) {
    // 统一使用 Pointer 事件；按位移阈值识别拖动，释放时保存位置
    let isDragging = false;
    let pointerId = null;
    let startClientY = 0;
    let startTopPx = 0;
    const DRAG_THRESHOLD_PX = 6; // 超过该位移才视为拖动

    // 防止触摸滚动干扰拖动
    try { el.style.touchAction = 'none'; } catch (_) {}

    function toPxTop(value) {
      // 将任意 top（可能是百分比或 px）转换为 px 数值
      if (!value) return 0;
      if (String(value).endsWith('%')) {
        const percent = parseFloat(value) || 0;
        return window.innerHeight * (percent / 100);
      }
      const n = parseFloat(value);
      return Number.isFinite(n) ? n : 0;
    }

    function clampTop(px) {
      const maxTop = Math.max(0, window.innerHeight - el.offsetHeight);
      return Math.max(0, Math.min(px, maxTop));
    }

    function onPointerDown(e) {
      // 仅主指针/左键触发
      if (e.button !== undefined && e.button !== 0) return;
      pointerId = e.pointerId || 'mouse';
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
      const comp = getComputedStyle(el);
      startTopPx = toPxTop(comp.top);
      startClientY = e.clientY;
      isDragging = false; // 尚未到达阈值
    }

    function onPointerMove(e) {
      if ((e.pointerId || 'mouse') !== pointerId) return;
      const deltaY = e.clientY - startClientY;
      if (!isDragging && Math.abs(deltaY) >= DRAG_THRESHOLD_PX) {
        isDragging = true;
        el.style.cursor = 'move';
      }
      if (isDragging) {
        const nextTop = clampTop(startTopPx + deltaY);
        el.style.top = `${Math.round(nextTop)}px`;
        // 阻止页面选择/滚动
        e.preventDefault();
        e.stopPropagation();
      }
    }

    function onPointerUp(e) {
      if ((e.pointerId || 'mouse') !== pointerId) return;
      try { el.releasePointerCapture && el.releasePointerCapture(e.pointerId); } catch (_) {}
      if (isDragging) {
        // 标记抑制下一次 click
        el._suppressNextClick = true;
        el.style.cursor = 'pointer';
        // 交由回调保存位置与提示
        if (typeof onSavePosition === 'function') {
          onSavePosition({ top: el.style.top, right: el.style.right });
        }
      }
      isDragging = false;
      pointerId = null;
    }

    el.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
  }

  // ===== 创建"搜"按钮 =====
  function addQuickSearchButton() {
    if (document.getElementById('o4-mini-button')) return;

    const btn = document.createElement('div');
    btn.id = 'o4-mini-button';
    btn.style.cssText = `
      position: fixed;
      top: ${buttonPosition.top};
      right: ${buttonPosition.right};
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: linear-gradient(140.91deg, #7367F0 12.61%, #574AB8 76.89%);
      color: #fff;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,.2);
      transition: background .3s ease;
      font-size: 18px;
      user-select: none;
      touch-action: none;
    `;
    btn.textContent = '搜';

    makeDraggable(btn, ({ top, right }) => {
      buttonPosition = { top, right };
      GM_setValue('o4MiniButtonPosition', buttonPosition);
      notify('"搜"按钮位置已保存');
    });

    btn.addEventListener('click', function (e) {
      if (this._suppressNextClick) { this._suppressNextClick = false; return; }
      runPrefixThenSend(PREFIX);
      this.style.background = 'linear-gradient(140.91deg, #2ecc71 12.61%, #3498db 76.89%)';
      setTimeout(() => {
        this.style.background = 'linear-gradient(140.91deg, #7367F0 12.61%, #574AB8 76.89%)';
      }, 2000);
      notify('"搜"已激活：1)写前缀→2)发送（逐步确认+延时）');
    });

    document.body.appendChild(btn);
  }

  // ===== 创建"思"按钮 =====
  function addThinkButton() {
    if (document.getElementById('o4-think-button')) return;

    const btn = document.createElement('div');
    btn.id = 'o4-think-button';
    btn.style.cssText = `
      position: fixed;
      top: ${thinkButtonPosition.top};
      right: ${thinkButtonPosition.right};
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: linear-gradient(140.91deg, #FF6B6B 12.61%, #FF8E53 76.89%);
      color: #fff;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,.2);
      transition: background .3s ease;
      font-size: 18px;
      user-select: none;
      touch-action: none;
    `;
    btn.textContent = '思';

    makeDraggable(btn, ({ top, right }) => {
      thinkButtonPosition = { top, right };
      GM_setValue('o4ThinkButtonPosition', thinkButtonPosition);
      notify('"思"按钮位置已保存');
    });

    btn.addEventListener('click', function () {
      if (this._suppressNextClick) { this._suppressNextClick = false; return; }
      runPrefixThenSend(THINK_PREFIX);
      this.style.background = 'linear-gradient(140.91deg, #27ae60 12.61%, #2ecc71 76.89%)';
      setTimeout(() => {
        this.style.background = 'linear-gradient(140.91deg, #FF6B6B 12.61%, #FF8E53 76.89%)';
      }, 2000);
      notify('"思"已激活：1)写前缀→2)发送（逐步确认+延时）');
    });

    document.body.appendChild(btn);
  }

  // ===== 提示 =====
  function notify(msg) {
    const n = document.createElement('div');
    n.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0,0,0,.8);
      color: #fff;
      padding: 10px 20px;
      border-radius: 4px;
      z-index: 2147483647;
      transition: opacity .3s ease;
    `;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => { n.style.opacity = '0'; setTimeout(() => n.remove(), 300); }, 2000);
  }

  // ===== 注入与保活 =====
  function addInlineButtons() {
    // 适配新版 DOM：优先找旧容器，找不到则找新版 composer 的 trailing 区域
    let container = document.querySelector('div[data-testid="composer-trailing-actions"]');
    if (!container) {
      // 新版：form[data-type="unified-composer"] 下的 [grid-area:trailing] 区域
      // 1) 直接用包含类名匹配（避免转义复杂度）
      container = document.querySelector('form[data-type="unified-composer"] div[class*="[grid-area:trailing]"]');
      // 2) 再退化：基于 speech button 容器向上拿父级
      if (!container) {
        const speechContainer = document.querySelector('div[data-testid="composer-speech-button-container"]');
        if (speechContainer && speechContainer.parentElement) {
          container = speechContainer.parentElement;
        }
      }
    }
    if (!container) return false;
    if (document.getElementById('o4-translate-inline-btn') || document.getElementById('o4-mini-inline-btn') || document.getElementById('o4-think-inline-btn')) return true;

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex; align-items:center; gap:6px;';

    const commonBtnCss = `
      display:flex; align-items:center; justify-content:center;
      width:32px; height:32px; border-radius:9999px; color:#fff;
      box-shadow: 0 2px 8px rgba(0,0,0,.18); cursor:pointer;
      user-select:none; transition:opacity .2s ease, background .3s ease; font-weight:700; font-size:14px;
    `;
    
    // "译"（优先显示为第一个，蓝色圆圈）
    const translateBtn = document.createElement('div');
    translateBtn.id = 'o4-translate-inline-btn';
    translateBtn.style.cssText = commonBtnCss + 'background: linear-gradient(140.91deg, #3498db 12.61%, #2980b9 76.89%);';
    translateBtn.textContent = '译';
    translateBtn.addEventListener('click', function () {
      runPrefixThenSend(TRANSLATE_PREFIX);
      this.style.background = 'linear-gradient(140.91deg, #2ecc71 12.61%, #27ae60 76.89%)';
      setTimeout(() => { this.style.background = 'linear-gradient(140.91deg, #3498db 12.61%, #2980b9 76.89%)'; }, 2000);
      notify('\"译\"已激活：1)写前缀→2)发送（逐步确认+延时）');
    });

    // "搜"
    const searchBtn = document.createElement('div');
    searchBtn.id = 'o4-mini-inline-btn';
    searchBtn.style.cssText = commonBtnCss + 'background: linear-gradient(140.91deg, #7367F0 12.61%, #574AB8 76.89%);';
    searchBtn.textContent = '搜';
    searchBtn.addEventListener('click', function () {
      runPrefixThenSend(PREFIX);
      this.style.background = 'linear-gradient(140.91deg, #2ecc71 12.61%, #3498db 76.89%)';
      setTimeout(() => { this.style.background = 'linear-gradient(140.91deg, #7367F0 12.61%, #574AB8 76.89%)'; }, 2000);
      notify('"搜"已激活：1)写前缀→2)发送（逐步确认+延时）');
    });

    // "思"
    const thinkBtn = document.createElement('div');
    thinkBtn.id = 'o4-think-inline-btn';
    thinkBtn.style.cssText = commonBtnCss + 'background: linear-gradient(140.91deg, #FF6B6B 12.61%, #FF8E53 76.89%);';
    thinkBtn.textContent = '思';
    thinkBtn.addEventListener('click', function () {
      runPrefixThenSend(THINK_PREFIX);
      this.style.background = 'linear-gradient(140.91deg, #27ae60 12.61%, #2ecc71 76.89%)';
      setTimeout(() => { this.style.background = 'linear-gradient(140.91deg, #FF6B6B 12.61%, #FF8E53 76.89%)'; }, 2000);
      notify('"思"已激活：1)写前缀→2)发送（逐步确认+延时）');
    });

    wrap.appendChild(translateBtn); // 作为第一个
    wrap.appendChild(searchBtn);
    wrap.appendChild(thinkBtn);
    container.appendChild(wrap);
    return true;
  }

  function removeFloatingButtonsIfAny() {
    const a = document.getElementById('o4-mini-button');
    const b = document.getElementById('o4-think-button');
    if (a) a.remove();
    if (b) b.remove();
  }

  function boot() {
    if (!document.body) return;
    const inlineOk = addInlineButtons();
    if (inlineOk) {
      // 如果已经成功放到输入区，就不再显示浮动按钮
      removeFloatingButtonsIfAny();
      return;
    }
    // 找不到输入区时，回退到浮动按钮
    addQuickSearchButton();
    addThinkButton();
  }

  // 初始化快捷键监听
  setupKeyboardShortcuts();
  
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
  setInterval(boot, 2000);
})();
