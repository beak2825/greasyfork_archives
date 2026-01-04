// ==UserScript==
// @name         Lalafo Creatio Chat — AI Grammar Check
// @name:ru      Lalafo Creatio Chat — Проверка грамматики (RU/KY)
// @namespace    http://tampermonkey.net/
// @version      2025.08.14
// @description  Кнопка проверки грамматики (RU/KY) в чате на lalafo.creatio.com (быстрый/детальный режим)
// @description:ru Кнопка проверки грамматики (RU/KY) в чате на lalafo.creatio.com (быстрый/детальный режим)
// @author       Oleg Gismatulin
// @license      MIT
// @match        https://lalafo.creatio.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=creatio.com
// @run-at       document-idle
// @noframes
// @grant        GM_xmlhttpRequest
// @connect      lalafo-reach-category.fly.dev
// @downloadURL https://update.greasyfork.org/scripts/545554/Lalafo%20Creatio%20Chat%20%E2%80%94%20AI%20Grammar%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/545554/Lalafo%20Creatio%20Chat%20%E2%80%94%20AI%20Grammar%20Check.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // -------- Config --------
  const API_BASE_PROD = 'https://lalafo-reach-category.fly.dev';
  const API_TIMEOUT_MS = 60_000;
  const MAX_LEN = 10_000;
  const ICON_URL = 'https://cdn.oaistatic.com/assets/favicon-eex17e9e.ico';

  // -------- Selectors --------
  const SELECTORS = {
    rightPanel: '#rightPanel',
    chatWrap: '#OmniChatModule_WrapContainer',
    footer: '.footer',
    attachBtnLabel: 'label.send-attachment-button',
    chatInput: '[data-item-marker="ChatInputField"]',
  };

  // -------- Markers --------
  const MARKERS = {
    btn: 'ai-check-button',
    modalId: 'ai-check-modal-overlay',
  };

  const qs = (sel, root = document) => root.querySelector(sel);

  function waitForElement(selector, root = document, timeoutMs = 60_000) {
    return new Promise((resolve, reject) => {
      const el = qs(selector, root);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const found = qs(selector, root);
        if (found) { obs.disconnect(); resolve(found); }
      });
      obs.observe(root, { childList: true, subtree: true });
      if (timeoutMs > 0) {
        setTimeout(() => { try { obs.disconnect(); } catch {} reject(new Error(`Timeout waiting for ${selector}`)); }, timeoutMs);
      }
    });
  }

  function getInputText(inputEl) {
    return (inputEl?.innerText || '')
      .replace(/\u00A0/g, ' ')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  }

  function setInputText(inputEl, text) {
    if (!inputEl) return;
    const safe = (text || '').replace(/[&<>]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[s]));
    const html = safe.replace(/\n/g, '<br>');
    inputEl.innerHTML = html;
    try {
      inputEl.focus();
      const range = document.createRange();
      range.selectNodeContents(inputEl);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch {}
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
  }

  async function fetchJsonWithRetry(url, options, { retries = 2, timeoutMs = API_TIMEOUT_MS } = {}) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const res = await fetch(url, { ...options, signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) {
          if (res.status >= 500 && attempt < retries) { await backoff(attempt); continue; }
          const errText = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status}: ${errText}`);
        }
        const ct = res.headers.get('content-type') || '';
        if (!ct.includes('application/json')) throw new Error(`Unexpected content-type: ${ct}`);
        return await res.json();
      } catch (e) {
        clearTimeout(t);
        const retriable = e.name === 'AbortError' || /NetworkError|Failed to fetch/i.test(String(e)) || /HTTP 5\d{2}/.test(String(e));
        if (attempt < retries && retriable) { await backoff(attempt); continue; }
        throw e;
      }
    }
  }
  function backoff(attempt) {
    const base = 400 * Math.pow(2, attempt);
    const jitter = Math.floor(Math.random() * 200);
    return new Promise(r => setTimeout(r, base + jitter));
  }

  function injectStyles() {
    if (document.getElementById('ai-check-button-style')) return;
    const style = document.createElement('style');
    style.id = 'ai-check-button-style';
    style.textContent = `
      .${MARKERS.btn}{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;margin-right:6px;border:none;border-radius:6px;background:transparent;cursor:pointer}
      .${MARKERS.btn}:hover{background:rgba(0,0,0,.06)}
      .${MARKERS.btn} img{width:18px;height:18px;display:block}
      #${MARKERS.modalId}{position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:999999}
      #${MARKERS.modalId} .modal{width:min(720px,92vw);background:#fff;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.2);padding:16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
      #${MARKERS.modalId} .modal h3{margin:0 0 12px 0;font-size:16px}
      #${MARKERS.modalId} .row{margin:10px 0}
      #${MARKERS.modalId} .label{font-size:12px;opacity:.75;margin-bottom:6px}
      #${MARKERS.modalId} .box{width:100%;min-height:72px;border:1px solid #e0e0e0;border-radius:8px;padding:5px;background:#fafafa;white-space:pre-wrap;overflow-y:auto}
      #${MARKERS.modalId} textarea.box{background:#fff;resize:vertical;min-height:110px;font-family:inherit;font-size:14px}
      #${MARKERS.modalId} .meta{font-size:12px;opacity:.8;margin-top:6px}
      #${MARKERS.modalId} .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}
      #${MARKERS.modalId} .btn{padding:8px 12px;border-radius:8px;border:1px solid #d0d0d0;background:#fff;cursor:pointer;font-size:14px}
      #${MARKERS.modalId} .btn.primary{border-color:#1976d2;background:#1976d2;color:#fff}
      #${MARKERS.modalId} .btn:disabled{opacity:.6;cursor:default}
      #${MARKERS.modalId} .spinner{display:inline-block;width:16px;height:16px;border:2px solid #ccc;border-top-color:#1976d2;border-radius:50%;animation:ai_spin .9s linear infinite;vertical-align:-3px;margin-right:6px}
      @keyframes ai_spin{to{transform:rotate(360deg)}}
      #${MARKERS.modalId} .error{color:#b71c1c;font-size:13px;margin-top:8px}
    `;
    document.head.appendChild(style);
  }

  function createAiButton(onClick) {
    const btn = document.createElement('button');
    btn.className = MARKERS.btn;
    btn.type = 'button';
    btn.title = 'AI проверка (клик — быстрый; Alt — детально)';
    btn.setAttribute('aria-label', 'Проверить текст (AI)');
    const img = document.createElement('img');
    img.src = ICON_URL;
    img.alt = 'AI';
    btn.appendChild(img);
    btn.addEventListener('click', onClick);
    return btn;
  }

  function openModalSkeleton() {
    closeModal();
    const overlay = document.createElement('div');
    overlay.id = MARKERS.modalId;
    overlay.innerHTML = `
      <div class="modal">
        <h3>Проверка грамматики</h3>
        <div class="row">
          <div class="label">Исходный текст</div>
          <div class="box" data-box="original"></div>
        </div>
        <div class="row" data-row="progress"><span class="spinner"></span> Идёт проверка...</div>
        <div class="row" data-row="result" style="display:none;">
          <div class="label">Исправленный текст (можно отредактировать перед заменой)</div>
          <textarea class="box" data-box="corrected"></textarea>
          <div class="meta" data-box="meta" style="display:none;"></div>
        </div>
        <div class="row error" data-row="error" style="display:none;"></div>
        <div class="actions">
          <button class="btn" data-act="cancel">Отмена</button>
          <button class="btn primary" data-act="replace" disabled>Заменить в поле ввода</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); }, { once: true });
    qs('[data-act="cancel"]', overlay).addEventListener('click', closeModal);
    return overlay;
  }

  function closeModal() {
    const ex = document.getElementById(MARKERS.modalId);
    if (ex) ex.remove();
  }

  function renderResult(overlay, { original, corrected, details }) {
    qs('[data-box="original"]', overlay).textContent = original || '';
    qs('[data-row="progress"]', overlay).style.display = 'none';
    qs('[data-row="result"]', overlay).style.display = '';
    qs('[data-box="corrected"]', overlay).value = corrected || original || '';

    const meta = qs('[data-box="meta"]', overlay);
    if (details && (details.detected_language || details.corrections_made || details.confidence !== undefined)) {
      const corr = (details.corrections_made || []).map(c => `• ${c}`).join('\n');
      const lang = details.detected_language ? `Язык: ${details.detected_language.toUpperCase()}` : '';
      const conf = (typeof details.confidence === 'number') ? `Уверенность: ${(details.confidence * 100).toFixed(0)}%` : '';
      meta.textContent = [lang, conf, corr].filter(Boolean).join('\n');
      meta.style.display = '';
    } else {
      meta.style.display = 'none';
    }

    const replaceBtn = qs('[data-act="replace"]', overlay);
    replaceBtn.disabled = false;
    return {
      getCorrected: () => qs('[data-box="corrected"]', overlay).value || '',
      onReplace: (fn) => replaceBtn.addEventListener('click', fn, { once: true }),
    };
  }

  function renderError(overlay, message) {
    qs('[data-row="progress"]', overlay).style.display = 'none';
    const e = qs('[data-row="error"]', overlay);
    e.textContent = message || 'Ошибка запроса';
    e.style.display = '';
  }

  // -------- API --------
  async function grammarCorrect({ text, details }) {
    const url = `${API_BASE_PROD}/api/v1/grammar/correct`;
    const body = JSON.stringify({ text, details: !!details });
    const data = await fetchJsonWithRetry(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (data && typeof data === 'object' && data.corrected_text) return data;
    throw new Error('Unexpected API response');
  }

  // -------- Main integration --------
  function installIntoChat(chatWrap) {
    const footer = qs(SELECTORS.footer, chatWrap);
    const attachLabel = qs(SELECTORS.attachBtnLabel, footer);
    const inputEl = qs(SELECTORS.chatInput, footer);
    if (!footer || !attachLabel || !inputEl) return;

    if (qs(`.${MARKERS.btn}`, footer)) return;

    const aiBtn = createAiButton(async (ev) => {
      const original = getInputText(inputEl);
      if (!original) { alert('Поле ввода пустое.'); return; }
      if (original.length > MAX_LEN) { alert(`Слишком длинный текст (${original.length}). Максимум: ${MAX_LEN} символов.`); return; }

      const details = !!ev.altKey; // Alt+Click => details=true

      const overlay = openModalSkeleton();
      qs('[data-box="original"]', overlay).textContent = original;

      try {
        const data = await grammarCorrect({ text: original, details });
        const corrected = data.corrected_text || original;

        const ui = renderResult(overlay, { original, corrected, details: details ? data : null });
        ui.onReplace(() => { setInputText(inputEl, ui.getCorrected()); closeModal(); });
      } catch (e) {
        renderError(overlay, `Не удалось выполнить проверку: ${e.message || e}`);
      }
    });

    attachLabel.insertAdjacentElement('afterend', aiBtn);

    const mo = new MutationObserver(() => {
      const refooter = qs(SELECTORS.footer, chatWrap);
      const relabel = qs(SELECTORS.attachBtnLabel, refooter);
      if (refooter && relabel && !qs(`.${MARKERS.btn}`, refooter)) {
        relabel.insertAdjacentElement('afterend', aiBtn);
      }
    });
    mo.observe(chatWrap, { childList: true, subtree: true });
  }

  async function init() {
    injectStyles();
    try {
      const rightPanel = await waitForElement(SELECTORS.rightPanel, document.body, 120_000);
      const hook = async () => {
        try {
          const chatWrap = await waitForElement(SELECTORS.chatWrap, rightPanel, 120_000);
          installIntoChat(chatWrap);
        } catch {}
      };
      hook();
      const rpObs = new MutationObserver(() => {
        const chatWrap = qs(SELECTORS.chatWrap, rightPanel);
        if (chatWrap) installIntoChat(chatWrap);
      });
      rpObs.observe(rightPanel, { childList: true, subtree: true });
    } catch {}
  }

  init();
})();
