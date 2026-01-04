// ==UserScript==
// @name         Microsoft To Do 一鍵複製：標題/步驟/附註
// @namespace    http://tampermonkey.net/
// @version      1.6.0
// @description  從 Microsoft To Do 詳細面板擷取標題、所有步驟與附註為純文字一鍵複製，按鈕可拖曳(自動隱藏圖示)
// @author       shanlan(grok-code-fast-1)
// @match        https://to-do.office.com/tasks/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544997/Microsoft%20To%20Do%20%E4%B8%80%E9%8D%B5%E8%A4%87%E8%A3%BD%EF%BC%9A%E6%A8%99%E9%A1%8C%E6%AD%A5%E9%A9%9F%E9%99%84%E8%A8%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/544997/Microsoft%20To%20Do%20%E4%B8%80%E9%8D%B5%E8%A4%87%E8%A3%BD%EF%BC%9A%E6%A8%99%E9%A1%8C%E6%AD%A5%E9%A9%9F%E9%99%84%E8%A8%BB.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const HOST_ID = 'tm-copy-root', POS_KEY = 'tm-copy-root-pos', DONE_KEY = 'tm-copy-done-mark';
  let hostEl, shadow, btn, toastEl, switchEl, doneMark = true, closeBtn, wrapEl, isEnabled = true;
  let dragging = false, dragMoved = false, dragOffsetX = 0, dragOffsetY = 0, pointerId = null;

  function findDetailsRoot() { return $('#details') || $('.rightColumn #details') || $('.details'); }

  function getCleanTextFromQLEditor(editor) {
    return [...editor.children].map(block => {
      if (block.childNodes.length === 1 && (block.childNodes[0].nodeName === 'BR' || (block.childNodes[0].nodeType === 3 && !block.childNodes[0].textContent.trim()))) return '';
      return [...block.childNodes].map(node => node.nodeType === 3 ? node.textContent : node.nodeType === 1 && node.tagName === 'A' ? node.href : '').join('').replace(/\u00A0/g, ' ').trimEnd();
    }).join('\n');
  }

  function buildExportText(details) {
    const titleEl = details.querySelector('.editableContent-display[title]') || details.querySelector('.detailHeader .editableContent-display');
    const title = (titleEl?.getAttribute('title') || titleEl?.textContent || '').trim();
    const steps = $$('textarea[aria-label="步驟"]', details).map(textarea => {
      const row = textarea.closest('.ms-DetailsRow');
      const checked = row?.querySelector('[role="checkbox"]')?.getAttribute('aria-checked');
      let text = (textarea.value || textarea.textContent || '').replace(/\r\n/g, '\n').trimEnd();
      if (checked === "true" && doneMark) text = '[已完成]' + text;
      return text;
    }).filter(s => s);
    const noteEl = details.querySelector('.detailNote .ql-editor') || details.querySelector('.ql-editor[contenteditable="true"]');
    const note = noteEl ? getCleanTextFromQLEditor(noteEl) : '';
    let out = title ? title + '\n' : '';
    if (steps.length) out += '\n' + steps.join('\n');
    if (note) out += (out ? '\n\n' : '') + note;
    return out.trim();
  }

  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    Object.assign(ta.style, {position: 'fixed', top: '-9999px', left: '-9999px'});
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
  }

  function applySavedPos(host) {
    const s = localStorage.getItem(POS_KEY);
    if (!s) return;
    try {
      const { left, top } = JSON.parse(s);
      if (Number.isFinite(left) && Number.isFinite(top)) {
        host.style.left = left + 'px';
        host.style.top = top + 'px';
        host.style.removeProperty('right');
        host.style.removeProperty('bottom');
      }
    } catch {}
  }

  function ensureUI() {
    if (hostEl) return;
    hostEl = document.createElement('div');
    hostEl.id = HOST_ID;
    Object.assign(hostEl.style, {
      position: 'fixed', right: '20px', bottom: '20px', zIndex: '2147483647',
      display: 'inline-block', pointerEvents: 'none', width: 'auto', height: 'auto'
    });
    document.body.appendChild(hostEl);
    shadow = hostEl.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      :host{ all: initial; }
      #wrap { all: initial; position: relative; display: inline-flex; align-items: center; pointer-events: auto; touch-action: none; gap: 5px; }
      #copyBtn{ all: unset; display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; background: #0078d4; color: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,.2); cursor: grab; font: 600 13px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans TC",Arial,"Helvetica Neue",Helvetica,sans-serif; user-select: none; white-space: nowrap; }
      #copyBtn:hover{ background:#106ebe; }
      #copyBtn:active{ transform: translateY(1px); }
      #copyBtn.dragging{ cursor: grabbing !important; transform: none; }
      #switch { all: unset; display: inline-flex; align-items: center; cursor: pointer; user-select: none; margin-left: 2px; position: relative; }
      #switch-toggle { width: 32px; height: 18px; border-radius: 9px; background: #ccc; position: relative; transition: background .2s; margin-right: 3px; }
      #switch-toggle[data-on="1"] { background: #0078d4; }
      #switch-knob { position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.15); transition: left .2s; }
      #switch-toggle[data-on="1"] #switch-knob { left: 16px; }
      #switch-tooltip { display: none; position: absolute; left: 50%; top: -200%; transform: translateX(-50%); background: #222; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 12px; white-space: nowrap; z-index: 99; pointer-events: none; opacity: 0; transition: opacity .18s; }
      #switch:hover #switch-tooltip, #switch:focus-within #switch-tooltip { display: block; opacity: 1; }
      #toast{ all: unset; position: absolute; right: 0; bottom: 34px; background: rgba(0,0,0,.85); color: #fff; padding: 8px 10px; border-radius: 6px; font: 500 12px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans TC",Arial,"Helvetica Neue",Helvetica,sans-serif; opacity: 0; transition: opacity .2s ease; pointer-events: none; }
      #closeBtn { all: unset; position: absolute; top: -10px; right: -8px; width: 16px; height: 16px; color: #899197; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; z-index: 1; pointer-events: auto; }
      #closeBtn:hover { color: #5a6268; transform: scale(1.1); }
      #closeBtn:active { transform: scale(0.95); }
      #wrap.disabled { display: none !important; }
    `;
    wrapEl = document.createElement('div');
    wrapEl.id = 'wrap';
    btn = document.createElement('button');
    btn.id = 'copyBtn';
    btn.innerHTML = '📋複製';
    switchEl = document.createElement('span');
    switchEl.id = 'switch';
    switchEl.innerHTML = '<span id="switch-toggle" data-on="1"><span id="switch-knob"></span></span><span id="switch-tooltip">標註[已完成]</span>';
    closeBtn = document.createElement('button');
    closeBtn.id = 'closeBtn';
    closeBtn.innerHTML = '✕';
    closeBtn.title = '關閉按鈕（重新整理恢復）';
    toastEl = document.createElement('div');
    toastEl.id = 'toast';
    wrapEl.append(closeBtn, btn, switchEl, toastEl);
    shadow.append(style, wrapEl);
    applySavedPos(hostEl);
    setupEvents();
  }

  function setupEvents() {
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      isEnabled = false;
      wrapEl.classList.add('disabled');
      showToast('已關閉按鈕，重新整理頁面可恢復');
    });
    doneMark = localStorage.getItem(DONE_KEY) !== '0';
    updateSwitchUI();
    switchEl.addEventListener('click', e => {
      doneMark = !doneMark;
      localStorage.setItem(DONE_KEY, doneMark ? '1' : '0');
      updateSwitchUI();
      e.stopPropagation();
    });
    btn.addEventListener('click', e => {
      if (!isEnabled || dragMoved) { e.preventDefault(); e.stopImmediatePropagation(); dragMoved = false; return; }
      runCopy();
    });
    btn.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', e => {
      if (!isEnabled || !(e.ctrlKey || e.metaKey) || !e.shiftKey || (e.key || '').toLowerCase() !== 'c') return;
      e.preventDefault();
      runCopy();
    });
    window.addEventListener('resize', () => {
      if (!hostEl || !isEnabled) return;
      const rect = hostEl.getBoundingClientRect(), w = hostEl.offsetWidth, h = hostEl.offsetHeight, margin = 6;
      let x = rect.left, y = rect.top;
      x = Math.max(margin, Math.min(x, window.innerWidth - w - margin));
      y = Math.max(margin, Math.min(y, window.innerHeight - h - margin));
      Object.assign(hostEl.style, { left: x + 'px', top: y + 'px' });
      try { localStorage.setItem(POS_KEY, JSON.stringify({ left: x, top: y })); } catch {}
    });
  }

  function updateSwitchUI() {
    switchEl.querySelector('#switch-toggle').setAttribute('data-on', doneMark ? '1' : '0');
  }

  function showToast(msg) {
    if (!toastEl || !isEnabled) return;
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.style.opacity = '0', 1600);
  }

  async function runCopy() {
    if (!isEnabled) return;
    const details = findDetailsRoot();
    if (!details) { showToast('未找到 To Do 詳細面板'); return; }
    const text = buildExportText(details);
    if (!text) { showToast('沒有可複製的內容'); return; }
    try {
      await copyToClipboard(text);
      showToast(`已複製 ${text.split('\n').length} 行`);
    } catch (e) {
      showToast('複製失敗，請檢查主控台');
    }
  }

  function onPointerDown(e) {
    if (!isEnabled || e.pointerType === 'mouse' && e.button !== 0) return;
    pointerId = e.pointerId;
    dragging = true; dragMoved = false;
    const rect = hostEl.getBoundingClientRect();
    Object.assign(hostEl.style, { left: rect.left + 'px', top: rect.top + 'px' });
    hostEl.style.removeProperty('right');
    hostEl.style.removeProperty('bottom');
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    btn.setPointerCapture(pointerId);
    btn.classList.add('dragging');
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
  }

  function onPointerMove(e) {
    if (!dragging || !isEnabled) return;
    const w = hostEl.offsetWidth, h = hostEl.offsetHeight, margin = 6;
    let x = e.clientX - dragOffsetX, y = e.clientY - dragOffsetY;
    x = Math.max(margin, Math.min(x, window.innerWidth - w - margin));
    y = Math.max(margin, Math.min(y, window.innerHeight - h - margin));
    Object.assign(hostEl.style, { left: x + 'px', top: y + 'px' });
    if (!dragMoved) { const dx = Math.abs(e.movementX || 0), dy = Math.abs(e.movementY || 0); if (dx + dy > 1) dragMoved = true; }
  }

  function onPointerUp() {
    if (!dragging || !isEnabled) return;
    dragging = false;
    btn.releasePointerCapture(pointerId);
    btn.classList.remove('dragging');
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerUp);
    const rect = hostEl.getBoundingClientRect();
    try { localStorage.setItem(POS_KEY, JSON.stringify({ left: rect.left, top: rect.top })); } catch {}
  }

  ensureUI();
  setInterval(() => {
    if (!isEnabled) { wrapEl.style.display = 'none'; return; }
    const details = findDetailsRoot();
    wrapEl.style.display = details && details.offsetWidth > 0 && details.offsetHeight > 0 ? 'inline-flex' : 'none';
  }, 100);
})();