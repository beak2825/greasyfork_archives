// ==UserScript==
// @name         Blocket + Biluppgifter Historik
// @namespace    https://blocket.se/
// @version      1.0.7
// @description  Draggable bil-knapp på Blocket som hämtar ägar-/historikdata från biluppgifter.se och visar logg + summering.
// @author       You
// @match        https://www.blocket.se/*
// @match        https://blocket.se/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blocket.se
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      biluppgifter.se
// @connect      www.biluppgifter.se
// @run-at       document-end
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/545093/Blocket%20%2B%20Biluppgifter%20Historik.user.js
// @updateURL https://update.greasyfork.org/scripts/545093/Blocket%20%2B%20Biluppgifter%20Historik.meta.js
// ==/UserScript==

(function() {
  'use strict';
  function isAdPage() {
    try {
      return /\/annons\//.test(location.pathname);
    } catch (_) {
      return false;
    }
  }

  // Navigation handling for SPA route changes
  function setupNavigationListeners(onNavigate) {
    if (window.__bbhNavSetup) return;
    window.__bbhNavSetup = true;
    const notify = () => window.dispatchEvent(new Event('bbh:navigation'));
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    try {
      history.pushState = function pushStatePatched() {
        const ret = originalPushState.apply(this, arguments);
        notify();
        return ret;
      };
    } catch {}
    try {
      history.replaceState = function replaceStatePatched() {
        const ret = originalReplaceState.apply(this, arguments);
        notify();
        return ret;
      };
    } catch {}
    window.addEventListener('popstate', notify);
    // Also react to hash-only navigations
    window.addEventListener('hashchange', notify);
    // Handle BFCache restores and Safari mobile quirks
    window.addEventListener('pageshow', () => {
      // Defer to allow DOM to settle after restore
      setTimeout(() => notify(), 0);
    });
    // If the Navigation API is available, hook into it as well (guarded)
    try {
      if (window.navigation && typeof window.navigation.addEventListener === 'function') {
        window.navigation.addEventListener('navigate', notify);
      }
    } catch {}
    // Fallback: poll URL changes in case push/replace patching is blocked (iOS Safari sometimes)
    try {
      let lastHref = location.href;
      const poll = () => {
        const current = location.href;
        if (current !== lastHref) {
          lastHref = current;
          notify();
        }
      };
      window.__bbhNavPoller = window.setInterval(poll, 500);
    } catch {}
    window.addEventListener('bbh:navigation', () => {
      // Defer to allow DOM to update after route change
      setTimeout(() => {
        try { onNavigate(); } catch {}
      }, 0);
    });
  }

  function setUpPrefetchObserver() {
    if (window.__bbhPrefetchObserver) {
      try { window.__bbhPrefetchObserver.disconnect(); } catch {}
      window.__bbhPrefetchObserver = null;
    }
    // Kick once immediately
    prefetchFromPageIfPossible();
    const observer = new MutationObserver(() => {
      prefetchFromPageIfPossible();
    });
    try {
      observer.observe(document.documentElement, { childList: true, subtree: true });
      window.__bbhPrefetchObserver = observer;
      setTimeout(() => {
        try { observer.disconnect(); } catch {}
        if (window.__bbhPrefetchObserver === observer) window.__bbhPrefetchObserver = null;
      }, 30000);
    } catch {}
  }


  const STORAGE_KEYS = {
    buttonPosition: 'bb_hist_button_position'
  };
  // Storage helpers: prefer GM_* (persists better across Safari quirks), fallback to localStorage
  function loadButtonPosition() {
    try {
      if (typeof GM_getValue === 'function') {
        const val = GM_getValue(STORAGE_KEYS.buttonPosition);
        if (val && typeof val === 'object' && typeof val.x === 'number' && typeof val.y === 'number') return val;
      }
    } catch {}
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.buttonPosition);
      if (!stored) return null;
      const pos = JSON.parse(stored);
      if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') return pos;
    } catch {}
    return null;
  }

  function saveButtonPosition(x, y) {
    const pos = { x: Math.max(0, Math.round(x)), y: Math.max(0, Math.round(y)) };
    try { if (typeof GM_setValue === 'function') GM_setValue(STORAGE_KEYS.buttonPosition, pos); } catch {}
    try { localStorage.setItem(STORAGE_KEYS.buttonPosition, JSON.stringify(pos)); } catch {}
  }


  // Holds background-prefetched data from the page content (if a plate was detected)
  let prefetchedData = null; // { plate, counts, ulHTML, ownersUlHTML, ownersSummaryHTML }
  let prefetchInFlight = null; // Promise | null

  const createElement = (tagName, options = {}) => {
    const el = document.createElement(tagName);
    const { className, attrs, html, text, children, on } = options;
    if (className) el.className = className;
    if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (html != null) el.innerHTML = html;
    if (text != null) el.textContent = text;
    if (children) children.forEach(child => el.appendChild(child));
    if (on) Object.entries(on).forEach(([evt, handler]) => el.addEventListener(evt, handler));
    return el;
  };

  function addGlobalStyles() {
    const css = `
      .bbh-floating-btn {
        position: fixed; inset: auto 20px 20px auto; width: 56px; height: 56px;
        border-radius: 50%; background: linear-gradient(135deg, #ff4d4d, #e62e2e); color: #fff;
        box-shadow: 0 12px 28px rgba(0,0,0,.22), 0 2px 8px rgba(0,0,0,.1);
        display: flex; align-items: center; justify-content: center; cursor: grab; z-index: 2147483647;
        transition: box-shadow .2s ease, transform .1s ease, background .2s ease, opacity .2s ease;
        opacity: .85; touch-action: none; -webkit-tap-highlight-color: transparent;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
      }
      .bbh-floating-btn.is-active { opacity: 1; }
      .bbh-floating-btn:active { cursor: grabbing; transform: scale(0.98); }
      .bbh-floating-btn svg { width: 28px; height: 28px; }

      .bbh-modal-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,.6); backdrop-filter: blur(8px); z-index: 2147483646;
        display: none; align-items: center; justify-content: center; padding: 20px;
        opacity: 0; transition: opacity .3s ease, backdrop-filter .3s ease;
      }
      .bbh-modal-backdrop.show { opacity: 1; }
      .bbh-modal { 
        width: min(920px, 95vw); max-height: 90vh; overflow: hidden; background: #fff; color: #111;
        border-radius: 20px; box-shadow: 0 25px 60px rgba(0,0,0,.25), 0 8px 24px rgba(0,0,0,.15); 
        border: 1px solid rgba(255,255,255,.8); transform: scale(0.95) translateY(20px);
        transition: transform .3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity .3s ease;
        opacity: 0; display: flex; flex-direction: column;
      }
      .bbh-modal.show { transform: scale(1) translateY(0); opacity: 1; }
      .bbh-modal, .bbh-modal * { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"; }
      .bbh-modal header { 
        display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 16px; 
        border-bottom: 1px solid #f0f0f0; position: sticky; top: 0; 
        background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,.98) 100%); 
        backdrop-filter: blur(10px); z-index: 1; border-radius: 20px 20px 0 0;
      }
      .bbh-modal header h3 { margin: 0; font-size: 18px; letter-spacing: -.3px; font-weight: 700; color: #1a1a1a; }
      .bbh-actions { display: flex; align-items: center; gap: 10px; }
      .bbh-btn { 
        appearance: none; border: 1px solid #e0e0e0; background: #fff; color: #374151; 
        padding: 10px 16px; border-radius: 12px; cursor: pointer; font-size: 13px; line-height: 1.2; 
        font-weight: 500; transition: all .2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 1px 3px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.06);
      }
      .bbh-btn:hover { background: #f9f9f9; border-color: #d0d0d0; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.15); }
      .bbh-btn.primary { 
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color: #fff; border-color: #1f2937;
        box-shadow: 0 2px 8px rgba(31,41,55,.3);
      }
      .bbh-btn.primary:hover { background: linear-gradient(135deg, #111827 0%, #0f172a 100%); box-shadow: 0 4px 16px rgba(31,41,55,.4); }
      .bbh-btn.ghost { background: rgba(255,255,255,.8); border-color: rgba(0,0,0,.08); color: #6b7280; backdrop-filter: blur(10px); }
      .bbh-btn.ghost:hover { background: rgba(255,255,255,.95); border-color: rgba(0,0,0,.12); }
      .bbh-btn[aria-disabled="true"] { opacity: .4; pointer-events: none; transform: none; }
      .bbh-modal .bbh-close { 
        border: 0; background: rgba(0,0,0,.05); font-size: 20px; cursor: pointer; 
        padding: 8px; border-radius: 12px; color: #6b7280; width: 36px; height: 36px;
        display: flex; align-items: center; justify-content: center;
        transition: all .2s ease;
      }
      .bbh-modal .bbh-close:hover { background: rgba(0,0,0,.1); color: #374151; transform: scale(1.05); }
      .bbh-modal .bbh-body { padding: 20px 24px 24px; overflow-y: auto; flex: 1; }

      .bbh-form { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
      .bbh-form input[type="text"] { 
        padding: 14px 16px; font-size: 15px; border-radius: 14px; border: 1.5px solid #e5e7eb; 
        width: 100%; text-transform: uppercase; outline: none; background: #fafafa;
        transition: all .2s cubic-bezier(0.4, 0, 0.2, 1); font-weight: 500; color: #1f2937;
      }
      .bbh-form input[type="text"]:focus { 
        border-color: #1f2937; box-shadow: 0 0 0 4px rgba(31,41,55,.1); background: #fff;
        transform: translateY(-1px);
      }
      .bbh-form input[type="text"]:hover { border-color: #d1d5db; background: #fff; }
      .bbh-form button { 
        padding: 14px 20px; font-size: 14px; border-radius: 14px; border: 0; cursor: pointer; 
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color: #fff; 
        display: inline-flex; align-items: center; gap: 10px; font-weight: 600;
        transition: all .2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(31,41,55,.25);
      }
      .bbh-form button:hover { 
        background: linear-gradient(135deg, #111827 0%, #0f172a 100%);
        transform: translateY(-2px); box-shadow: 0 4px 16px rgba(31,41,55,.4);
      }
      .bbh-note { color: #6b7280; font-size: 13px; margin-top: -8px; margin-bottom: 16px; line-height: 1.4; }
      .bbh-error { 
        color: #dc2626; font-weight: 600; margin-top: 8px; padding: 12px 16px; 
        background: rgba(220,38,38,.05); border: 1px solid rgba(220,38,38,.2);
        border-radius: 12px; font-size: 13px;
      }
      .bbh-loading { 
        color: #1f2937; font-weight: 500; padding: 12px 16px;
        background: rgba(59,130,246,.05); border: 1px solid rgba(59,130,246,.2);
        border-radius: 12px; font-size: 13px;
      }

      .bbh-summary { display: flex; flex-wrap: wrap; gap: 10px; margin: 12px 0 18px; }
      .bbh-tag { 
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); 
        border: 1px solid #e2e8f0; color: #334155; padding: 8px 14px; 
        border-radius: 20px; font-size: 12px; font-weight: 600;
        box-shadow: 0 1px 3px rgba(0,0,0,.1), inset 0 1px 0 rgba(255,255,255,.6);
        transition: all .2s ease;
      }
      .bbh-tag:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,.15); }
      .bbh-tag.is-filter { cursor: pointer; user-select: none; }
      .bbh-tag.is-active { 
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        color: #fff; border-color: #1e293b; box-shadow: 0 2px 8px rgba(30,41,59,.3), 0 1px 3px rgba(0,0,0,.2);
      }

      /* Tabs */
      .bbh-tabs { 
        display: inline-flex; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); 
        border: 1px solid #e2e8f0; padding: 6px; border-radius: 16px; gap: 4px; 
        margin: 12px 0 16px; box-shadow: 0 2px 8px rgba(0,0,0,.1);
      }
      .bbh-tab { 
        appearance: none; background: transparent; border: 0; padding: 10px 16px; 
        border-radius: 12px; cursor: pointer; font-size: 13px; color: #64748b; 
        font-weight: 500; transition: all .2s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      }
      .bbh-tab:hover { color: #334155; background: rgba(255,255,255,.6); }
      .bbh-tab[aria-selected="true"] { 
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #fff;
        box-shadow: 0 2px 8px rgba(30,41,59,.3), 0 1px 3px rgba(0,0,0,.2);
        transform: translateY(-1px);
      }
      .bbh-panels { margin-top: 16px; }
      .bbh-panel { display: none; opacity: 0; transition: opacity .3s ease; }
      .bbh-panel.active { display: block; opacity: 1; }

      /* Basic formatting for the imported history list */
      .bbh-history-wrap { border-top: 1px solid #e2e8f0; padding-top: 16px; }
      .bbh-history-wrap ul.history { list-style: none; padding: 0; margin: 0; }
      .bbh-history-wrap ul.history li { 
        display: grid; grid-template-columns: 32px 1fr; gap: 14px; 
        padding: 16px 0; border-bottom: 1px solid #f1f5f9; align-items: start;
        transition: background .2s ease;
      }
      .bbh-history-wrap ul.history li:hover { background: rgba(248,250,252,.5); margin: 0 -16px; padding: 16px; border-radius: 12px; }
      .bbh-history-wrap ul.history li .icon svg { width: 26px; height: 26px; color: #64748b; }
      .bbh-history-wrap ul.history li .info h3 { 
        margin: 0 0 8px; font-size: 15px; display: flex; gap: 8px; align-items: baseline; 
        font-weight: 600; color: #1e293b;
      }
      .bbh-history-wrap ul.history li .info h3 .numb { font-weight: 500; color: #64748b; margin-left: 10px; font-size: 12px; }
      .bbh-history-wrap ul.history li .info p { margin: 0; font-size: 13px; color: #475569; line-height: 1.5; }
      .bbh-history-wrap b.success { color: #059669; font-weight: 600; }
      .bbh-history-wrap b.warning { color: #d97706; font-weight: 600; }

      /* Owners list styling to match history list */
      .bbh-owners-wrap { border-top: 1px solid #e2e8f0; padding-top: 16px; }
      .bbh-owners-wrap ul.owners { list-style: none; padding: 0; margin: 0; }
      .bbh-owners-wrap ul.owners li { 
        display: grid; grid-template-columns: 32px 1fr; gap: 14px; 
        padding: 16px 0; border-bottom: 1px solid #f1f5f9; align-items: start;
        transition: background .2s ease;
      }
      .bbh-owners-wrap ul.owners li:hover { background: rgba(248,250,252,.5); margin: 0 -16px; padding: 16px; border-radius: 12px; }
      .bbh-owners-wrap ul.owners li .icon { 
        width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
        border-radius: 50%; color: #fff; font-size: 14px; font-weight: 600;
      }
      .bbh-owners-wrap ul.owners li .info h3 { 
        margin: 0 0 8px; font-size: 15px; font-weight: 600; color: #1e293b; 
        display: flex; gap: 8px; align-items: baseline;
      }
      .bbh-owners-wrap ul.owners li .info h3 .date { 
        font-weight: 500; color: #64748b; margin-left: 10px; font-size: 12px; 
      }
      .bbh-owners-wrap ul.owners li .info p { 
        margin: 0; font-size: 13px; color: #475569; line-height: 1.5; 
      }
      
      /* Simple owner entries (when they're just text paragraphs) */
      .bbh-owners-wrap > p { 
        padding: 16px 20px; margin: 8px 0; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px; line-height: 1.6; 
        color: #334155; box-shadow: 0 1px 3px rgba(0,0,0,.1);
      }

      @media (max-width: 480px) {
        .bbh-modal { width: 95vw; }
        .bbh-floating-btn { inset: auto 14px 14px auto; width: 48px; height: 48px; }
        .bbh-floating-btn svg { width: 24px; height: 24px; }
      }
    `;
    if (typeof GM_addStyle === 'function') {
      GM_addStyle(css);
    } else {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    }
  }

  function createFloatingButton(onClick) {
    const btn = createElement('div', { className: 'bbh-floating-btn', attrs: { title: 'Biluppgifter historik' } });
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
        <path d="M3 13h18M5 7h14a3 3 0 0 1 2.83 1.95l1.17 3.12A2 2 0 0 1 21.13 14H2.87a2 2 0 0 1-1.87-1.93L1.5 10A3 3 0 0 1 4.5 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor"/>
        <circle cx="16.5" cy="17.5" r="1.5" fill="currentColor"/>
      </svg>
    `;

    // Dragging behavior (mouse + touch)
    let drag = { active: false, startX: 0, startY: 0, origX: 0, origY: 0, moved: false };
    const beginDrag = (clientX, clientY) => {
      drag.active = true;
      drag.moved = false;
      drag.startX = clientX;
      drag.startY = clientY;
      const rect = btn.getBoundingClientRect();
      drag.origX = rect.left;
      drag.origY = rect.top;
    };
    const continueDrag = (clientX, clientY) => {
      if (!drag.active) return;
      const dx = clientX - drag.startX;
      const dy = clientY - drag.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
      const nx = drag.origX + dx;
      const ny = drag.origY + dy;
      btn.style.left = `${Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, nx))}px`;
      btn.style.top = `${Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, ny))}px`;
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
    };
    const endDrag = () => {
      if (!drag.active) return;
      drag.active = false;
      try {
        const rect = btn.getBoundingClientRect();
        // Clamp to viewport before persisting
        const x = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, rect.left));
        const y = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, rect.top));
        saveButtonPosition(x, y);
      } catch {}
    };
    // Mouse events
    btn.addEventListener('mousedown', (e) => { beginDrag(e.clientX, e.clientY); e.preventDefault(); });
    window.addEventListener('mousemove', (e) => continueDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', endDrag);
    // Touch events
    btn.addEventListener('touchstart', (e) => {
      const t = e.touches && e.touches[0];
      if (!t) return;
      beginDrag(t.clientX, t.clientY);
      e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchmove', (e) => {
      const t = e.touches && e.touches[0];
      if (!t) return;
      continueDrag(t.clientX, t.clientY);
    }, { passive: false });
    window.addEventListener('touchend', () => endDrag(), { passive: true });

    // Activate on click/tap when not dragged, and make fully opaque
    const activate = () => {
      if (!drag.moved) {
        btn.classList.add('is-active');
        onClick();
      }
    };
    btn.addEventListener('click', activate);
    btn.addEventListener('touchend', (e) => { e.preventDefault(); activate(); }, { passive: false });

    document.documentElement.appendChild(btn);

    // After insertion, restore persisted position and clamp to viewport
    const restoreAndClamp = () => {
      try {
        const pos = loadButtonPosition();
        if (pos) {
          const x = Math.max(0, Math.min(window.innerWidth - btn.offsetWidth, pos.x));
          const y = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, pos.y));
          btn.style.left = `${x}px`;
          btn.style.top = `${y}px`;
          btn.style.right = 'auto';
          btn.style.bottom = 'auto';
        }
      } catch {}
    };
    restoreAndClamp();
    window.addEventListener('resize', restoreAndClamp);
    window.addEventListener('orientationchange', restoreAndClamp);
    return btn;
  }

  function createModal() {
    const backdrop = createElement('div', { className: 'bbh-modal-backdrop', attrs: { role: 'dialog', 'aria-modal': 'true' } });
    const modal = createElement('div', { className: 'bbh-modal' });
    const header = createElement('header');
    const title = createElement('h3', { text: 'Biluppgifter historik' });
    const actions = createElement('div', { className: 'bbh-actions' });
    const closeBtn = createElement('button', { className: 'bbh-close', attrs: { type: 'button', 'aria-label': 'Stäng' }, html: '&#x2715;' });
    closeBtn.addEventListener('click', () => close());
    actions.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(actions);

    const body = createElement('div', { className: 'bbh-body' });

    const form = createElement('form', { className: 'bbh-form' });
    const input = createElement('input', { attrs: { type: 'text', placeholder: 'Registreringsnummer (t.ex. ABC123 eller ABC12D)', required: 'true', autocomplete: 'off', autocapitalize: 'characters', autocorrect: 'off', spellcheck: 'false', inputmode: 'text' } });
    const submit = createElement('button', { className: 'bbh-btn primary', text: 'Hämta historik', attrs: { type: 'submit' } });
    form.appendChild(input);
    form.appendChild(submit);

    const note = createElement('div', { className: 'bbh-note', text: 'Källa: biluppgifter.se (SSR). Vi hämtar #history-log och beräknar summering.' });
    const status = createElement('div');

    // Tabs + panels
    const tabs = createElement('div', { className: 'bbh-tabs', attrs: { role: 'tablist' } });
    const tabOwners = createElement('button', { className: 'bbh-tab', text: 'Ägare', attrs: { role: 'tab', 'aria-selected': 'true' } });
    const tabHistory = createElement('button', { className: 'bbh-tab', text: 'Historik', attrs: { role: 'tab', 'aria-selected': 'false' } });
    tabs.appendChild(tabOwners);
    tabs.appendChild(tabHistory);

    const panels = createElement('div', { className: 'bbh-panels' });
    const ownersPanel = createElement('div', { className: 'bbh-panel active' });
    const ownersSummaryWrap = createElement('div');
    const ownersWrap = createElement('div', { className: 'bbh-owners-wrap' });
    ownersPanel.appendChild(ownersSummaryWrap);
    ownersPanel.appendChild(ownersWrap);

    const historyPanel = createElement('div', { className: 'bbh-panel' });
    const summary = createElement('div', { className: 'bbh-summary' });
    const historyWrap = createElement('div', { className: 'bbh-history-wrap' });
    historyPanel.appendChild(summary);
    historyPanel.appendChild(historyWrap);
    panels.appendChild(ownersPanel);
    panels.appendChild(historyPanel);

    // Filter support for history pills
    let activeFilterClass = null;
    const HISTORY_CLASS_TO_LABEL = new Map([
      ['classified', 'Annons'],
      ['changedowner', 'Ägarbyten'],
      ['changedstatus', 'Trafikstatusändringar'],
      ['inspection', 'Besiktningar'],
      ['register', 'Registrerad'],
      ['preregister', 'Förregistrerad']
    ]);
    const LABEL_TO_HISTORY_CLASS = new Map(Array.from(HISTORY_CLASS_TO_LABEL.entries()).map(([k, v]) => [v, k]));

    function applyFilter(nextFilterClass) {
      activeFilterClass = nextFilterClass || null;
      const list = historyWrap.querySelector('ul.history');
      if (!list) return;
      const items = list.querySelectorAll(':scope > li');
      items.forEach(li => {
        if (!activeFilterClass) {
          li.style.display = '';
        } else {
          li.style.display = li.classList.contains(activeFilterClass) ? '' : 'none';
        }
      });
      // Update pill states
      summary.querySelectorAll('.bbh-tag').forEach(tag => tag.classList.remove('is-active'));
      if (activeFilterClass) {
        const activeLabel = HISTORY_CLASS_TO_LABEL.get(activeFilterClass);
        const activeTag = Array.from(summary.querySelectorAll('.bbh-tag')).find(t => (t.textContent || '').trim().startsWith(activeLabel));
        if (activeTag) activeTag.classList.add('is-active');
      }
        updateHistoryTabCount();
    }

    function wireFilterPills() {
      // Make pills clickable and bind to filters
      const tags = summary.querySelectorAll('.bbh-tag');
      tags.forEach(tag => {
        tag.classList.add('is-filter');
        tag.setAttribute('role', 'button');
        tag.tabIndex = 0;
        const label = (tag.textContent || '').split(':')[0].trim();
        const filterClass = LABEL_TO_HISTORY_CLASS.get(label) || null;
        const onActivate = () => {
          const next = activeFilterClass === filterClass ? null : filterClass;
          applyFilter(next);
        };
        tag.addEventListener('click', onActivate);
        tag.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate(); }
        });
      });
    }

    // Update owners tab label with count in parentheses
    function updateOwnersTabCount() {
      try {
        const ul = ownersWrap.querySelector('ul.owners');
        const total = ul ? ul.querySelectorAll(':scope > li').length : 0;
        tabOwners.textContent = total > 0 ? `Ägare (${total})` : 'Ägare';
      } catch {
        tabOwners.textContent = 'Ägare';
      }
    }

    // Update history tab label with count (respects active filter if any)
    function updateHistoryTabCount() {
      try {
        const ul = historyWrap.querySelector('ul.history');
        let total = 0;
        if (ul) {
          total = activeFilterClass
            ? ul.querySelectorAll(`:scope > li.${activeFilterClass}`).length
            : ul.querySelectorAll(':scope > li').length;
        }
        tabHistory.textContent = total > 0 ? `Historik (${total})` : 'Historik';
      } catch {
        tabHistory.textContent = 'Historik';
      }
    }

    // Tab behavior
    function activateTab(which) {
      const isOwners = which === 'owners';
      tabOwners.setAttribute('aria-selected', isOwners ? 'true' : 'false');
      tabHistory.setAttribute('aria-selected', isOwners ? 'false' : 'true');
      ownersPanel.classList.toggle('active', isOwners);
      historyPanel.classList.toggle('active', !isOwners);
    }
    tabOwners.addEventListener('click', () => activateTab('owners'));
    tabHistory.addEventListener('click', () => activateTab('history'));
    activateTab('owners');

    // External link placed next to the submit button inside the form (avoids overlay issues on mobile)
    const openExternalBtn = createElement('a', { className: 'bbh-btn ghost', text: 'Öppna på Biluppgifter', attrs: { href: '#', target: '_blank', rel: 'noopener noreferrer', 'aria-disabled': 'true' } });
    openExternalBtn.addEventListener('click', (e) => { if (openExternalBtn.getAttribute('aria-disabled') === 'true') e.preventDefault(); });

    form.appendChild(openExternalBtn);
    body.appendChild(form);
    body.appendChild(note);
    body.appendChild(status);
    body.appendChild(tabs);
    body.appendChild(panels);

    modal.appendChild(header);
    modal.appendChild(body);
    backdrop.appendChild(modal);
    document.documentElement.appendChild(backdrop);

    const open = () => {
      backdrop.style.display = 'flex';
      // Trigger animations
      requestAnimationFrame(() => {
        backdrop.classList.add('show');
        modal.classList.add('show');
      });
      // Hide floating button while modal is open
      try {
        const btn = document.querySelector('.bbh-floating-btn');
        if (btn) btn.style.display = 'none';
      } catch {}
      // If we already have prefetched data, hydrate immediately
      if (prefetchedData && prefetchedData.plate) {
        input.value = prefetchedData.plate;
        summary.innerHTML = '';
        historyWrap.innerHTML = '';
        try {
          const map = new Map(Object.entries(prefetchedData.counts || {}));
          if (map.size) renderCounts(map, summary);
        } catch {}
        if (prefetchedData.ulHTML) {
          historyWrap.innerHTML = prefetchedData.ulHTML;
          wireFilterPills();
          updateHistoryTabCount();
        } else {
          // If we only have the plate prefetched, perform fetch now
          fetchAndRender(prefetchedData.plate);
        }
        if (prefetchedData.ownersUlHTML) {
          ownersWrap.innerHTML = prefetchedData.ownersUlHTML;
          enhanceOwnersList(ownersWrap);
        }
        updateOwnersTabCount();
        if (prefetchedData.ownersSummaryHTML) {
          ownersSummaryWrap.innerHTML = prefetchedData.ownersSummaryHTML;
        }
        updateOpenLinkFromInput();
        if (prefetchedData.ulHTML) return;
      }
      // Try to prefetch now if not ready, then hydrate; otherwise auto-fetch if plate found
      prefetchFromPageIfPossible()?.then((data) => {
        if (data && data.plate) {
          input.value = data.plate;
          summary.innerHTML = '';
          historyWrap.innerHTML = data.ulHTML || '';
          ownersWrap.innerHTML = data.ownersUlHTML || '';
          if (data.ownersUlHTML) enhanceOwnersList(ownersWrap);
          ownersSummaryWrap.innerHTML = data.ownersSummaryHTML || '';
          updateOwnersTabCount();
          try { renderCounts(new Map(Object.entries(data.counts || {})), summary); } catch {}
          wireFilterPills();
          updateHistoryTabCount();
          updateOpenLinkFromInput();
        } else {
          const plate = extractPlateFromPage();
          if (plate) {
            input.value = plate;
            fetchAndRender(plate);
          }
        }
      });
    };
    const close = () => {
      backdrop.classList.remove('show');
      modal.classList.remove('show');
      setTimeout(() => {
        backdrop.style.display = 'none';
        // Restore floating button visibility after modal close
        try {
          const btn = document.querySelector('.bbh-floating-btn');
          if (btn) {
            btn.classList.remove('is-active');
            btn.style.display = isAdPage() ? '' : 'none';
          }
        } catch {}
      }, 300); // Match the transition duration
    };
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

    function buildBiluppgifterUrl(plate) {
      return `https://biluppgifter.se/fordon/${encodeURIComponent(plate)}/#agarhistorik`;
    }

    function updateOpenLinkFromInput() {
      const plate = (input.value || '').trim().toUpperCase();
      if (!plate) {
        openExternalBtn.setAttribute('aria-disabled', 'true');
        openExternalBtn.setAttribute('href', '#');
        return;
      }
      openExternalBtn.setAttribute('href', buildBiluppgifterUrl(plate));
      openExternalBtn.setAttribute('aria-disabled', 'false');
    }
    input.addEventListener('input', updateOpenLinkFromInput);
    updateOpenLinkFromInput();

    async function fetchAndRender(plate) {
      summary.innerHTML = '';
      historyWrap.innerHTML = '';
      ownersWrap.innerHTML = '';
      ownersSummaryWrap.innerHTML = '';
      updateOwnersTabCount();
      updateHistoryTabCount();
      status.className = 'bbh-loading';
      status.textContent = 'Hämtar historik...';

      try {
        const [histHtml, ownersHtmlMaybe] = await Promise.all([
          fetchBiluppgifterHTML(plate),
          fetchOwnersHTML(plate).catch(() => null)
        ]);
        const parsed = new DOMParser().parseFromString(histHtml, 'text/html');
        const historySection = parsed.querySelector('#history-log');
        if (!historySection) throw new Error('Ingen historik-sektion hittades (#history-log).');
        const historyList = historySection.querySelector('ul.history');
        if (!historyList) throw new Error('Ingen lista hittades (ul.history).');

        // Build counts
        const counts = computeCounts(historyList);
        renderCounts(counts, summary);

        // Clone and inject list
        const cloneList = historyList.cloneNode(true);
        historyWrap.appendChild(cloneList);
        wireFilterPills();
        updateHistoryTabCount();
        // Owners parse/render
        let ownersUlHTML = '';
        let ownersSummaryHTML = '';
        if (ownersHtmlMaybe) {
          try {
            const ownersDoc = new DOMParser().parseFromString(ownersHtmlMaybe, 'text/html');
            const ownersUl = ownersDoc.querySelector('ul.owners');
                    if (ownersUl) {
          ownersUlHTML = ownersUl.outerHTML;
          ownersWrap.innerHTML = ownersUlHTML;
          enhanceOwnersList(ownersWrap);
        }
            updateOwnersTabCount();
            // Try to capture the small summary paragraphs before the list
            const section = ownersDoc.querySelector('section');
            if (section) {
              const ps = section.querySelectorAll('p');
              const fragments = [];
              for (let i = 0; i < Math.min(2, ps.length); i++) {
                fragments.push(ps[i].outerHTML);
              }
              if (fragments.length) {
                ownersSummaryHTML = fragments.join('');
                ownersSummaryWrap.innerHTML = ownersSummaryHTML;
              }
            }
          } catch {}
        }
        // Enable external link
        openExternalBtn.setAttribute('href', buildBiluppgifterUrl(plate));
        openExternalBtn.setAttribute('aria-disabled', 'false');
        status.textContent = '';
        status.className = '';

        // Cache as prefetched for next time
        try {
          prefetchedData = {
            plate,
            counts: Object.fromEntries(counts.entries()),
            ulHTML: historyList.outerHTML,
            ownersUlHTML,
            ownersSummaryHTML,
          };
        } catch {}
      } catch (err) {
        status.className = 'bbh-error';
        status.textContent = err && err.message ? err.message : 'Ett fel uppstod vid hämtning.';
      }
    }

    async function onSubmit(e) {
      e.preventDefault();
      const plate = (input.value || '').trim().toUpperCase();
      if (!plate) return;
      await fetchAndRender(plate);
    }

    form.addEventListener('submit', onSubmit);

    return { open, close, input, onSubmit };
  }

  function computeCounts(historyList) {
    const counts = new Map();
    // Known classes to track: classified, changedowner, changedstatus, inspection, register, preregister
    const trackClasses = ['classified', 'changedowner', 'changedstatus', 'inspection', 'register', 'preregister'];
    const translate = new Map([
      ['classified', 'Annons'],
      ['changedowner', 'Ägarbyten'],
      ['changedstatus', 'Trafikstatusändringar'],
      ['inspection', 'Besiktningar'],
      ['register', 'Registrerad'],
      ['preregister', 'Förregistrerad']
    ]);

    historyList.querySelectorAll(':scope > li').forEach(li => {
      const matched = trackClasses.find(cls => li.classList.contains(cls));
      if (!matched) return;
      const key = translate.get(matched) || matched;
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    return counts;
  }

  function renderCounts(counts, container) {
    container.innerHTML = '';
    if (!counts || counts.size === 0) return;
    Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0], 'sv')).forEach(([label, num]) => {
      const tag = createElement('span', { className: 'bbh-tag', text: `${label}: ${num}` });
      container.appendChild(tag);
    });
  }

  function enhanceOwnersList(container) {
    // Find all existing owner entries and enhance them
    const ownersList = container.querySelector('ul.owners');
    if (ownersList) {
      const items = ownersList.querySelectorAll('li');
      items.forEach((item, index) => {
        // Skip if already enhanced
        if (item.querySelector('.icon')) return;
        
        // Create icon with person number
        const icon = createElement('div', { 
          className: 'icon', 
          text: (index + 1).toString() 
        });
        
        // Wrap existing content in info div if not already wrapped
        let infoDiv = item.querySelector('.info');
        if (!infoDiv) {
          const content = item.innerHTML;
          item.innerHTML = '';
          infoDiv = createElement('div', { className: 'info', html: content });
          item.appendChild(infoDiv);
        }
        
        // Insert icon at the beginning
        item.insertBefore(icon, infoDiv);
        
        // Try to extract and format dates if present
        const textContent = infoDiv.textContent || '';
        const dateMatch = textContent.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          const h3 = infoDiv.querySelector('h3') || createElement('h3');
          if (!h3.querySelector('.date')) {
            const dateSpan = createElement('span', { className: 'date', text: dateMatch[1] });
            h3.appendChild(dateSpan);
            if (!infoDiv.querySelector('h3')) {
              infoDiv.insertBefore(h3, infoDiv.firstChild);
            }
          }
        }
      });
    }
    
    // Also enhance simple paragraph entries
    const paragraphs = container.querySelectorAll('p');
    paragraphs.forEach(p => {
      // Skip if it's already in the summary area
      if (p.closest('.bbh-owners-wrap') && !p.closest('ul.owners')) {
        // This is a simple owner info paragraph, styling is handled by CSS
      }
    });
  }

  function fetchBiluppgifterHTML(plate) {
    const url = `https://biluppgifter.se/fordon/${encodeURIComponent(plate)}/#agarhistorik`;
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7',
          'Upgrade-Insecure-Requests': '1',
          'Sec-CH-UA': '"Chromium";v="138", "Not)A;Brand";v="24", "Google Chrome";v="138"',
          'Sec-CH-UA-Mobile': '?0',
          'Sec-CH-UA-Platform': '"Windows"',
          'Sec-Fetch-Site': 'cross-site',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'Referer': 'https://www.blocket.se/',
          'DNT': '1',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        onload: (res) => {
          const status = res.status || 0;
          if (status >= 200 && status < 300) {
            if (res.responseText) {
              resolve(res.responseText);
            } else {
              reject(new Error('Tomt svar från biluppgifter.se.'));
            }
          } else if (status === 404) {
            reject(new Error('Fordonet hittades inte (404).'));
          } else {
            reject(new Error(`Fel vid hämtning: HTTP ${status}`));
          }
        },
        onerror: () => reject(new Error('Nätverksfel vid hämtning.')),
        ontimeout: () => reject(new Error('Timeout vid hämtning.')),
        timeout: 20000,
      });
    });
  }

  function fetchOwnersHTML(plate) {
    const url = `https://biluppgifter.se/vem-ager-bilen/${encodeURIComponent(plate)}/`;
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'sv-SE,sv;q=0.9,en-US;q=0.8,en;q=0.7',
          'Upgrade-Insecure-Requests': '1',
          'Sec-CH-UA': '"Chromium";v="138", "Not)A;Brand";v="24", "Google Chrome";v="138"',
          'Sec-CH-UA-Mobile': '?0',
          'Sec-CH-UA-Platform': '"Windows"',
          'Sec-Fetch-Site': 'cross-site',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Dest': 'empty',
          'Referer': 'https://www.blocket.se/',
          'DNT': '1',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        onload: (res) => {
          const status = res.status || 0;
          if (status >= 200 && status < 300) {
            resolve(res.responseText || '');
          } else if (status === 404) {
            resolve(''); // silently ignore if page missing
          } else {
            resolve('');
          }
        },
        onerror: () => resolve(''),
        ontimeout: () => resolve(''),
        timeout: 20000,
      });
    });
  }

  // Initialize
  addGlobalStyles();
  const modal = createModal();
  const floatingButton = createFloatingButton(() => { modal.open(); floatingButton.style.display = 'none'; });
  // Initial visibility based on current route
  try { floatingButton.style.display = isAdPage() ? '' : 'none'; } catch {}

  // -------------
  // Autofetch logic: detect a license plate on Blocket pages and prefetch
  // -------------
  function extractPlateFromPage() {
    // 1) Try to parse from the page HTML (e.g. cf_license_plate JSON) or just license_plate JSON
    let html = '';
    try { html = document.documentElement ? document.documentElement.innerHTML : ''; } catch { html = ''; }
    if (html) {
      // Match classic ABC123 or new ABC12D in cf_license_plate/license_plate JSON fields
      const jsonMatch = /"cf_license_plate"\s*:\s*\[\s*"([A-Za-zÅÄÖåäö]{3}\s?-?\s?(?:[0-9]{3}|[0-9]{2}[A-Za-zÅÄÖåäö]))"\s*\]|"license_plate"\s*:\s*(?:\[\s*")?([A-Za-zÅÄÖåäö]{3}\s?-?\s?(?:[0-9]{3}|[0-9]{2}[A-Za-zÅÄÖåäö]))(?:"\s*\])?/i.exec(html);
      if (jsonMatch && (jsonMatch[1] || jsonMatch[2])) {
        const raw = jsonMatch[1] || jsonMatch[2];
        const norm = raw.replace(/\s|-/g, '').toUpperCase().replace(/[ÅÄÖ]/g, (c) => ({ 'Å':'A','Ä':'A','Ö':'O' }[c] || c));
        return norm;
      }
    }
    // 2) Fallback to scanning visible description/body text
    const containers = [
      '[data-cy="ad-description"]',
      '[class*="Description" i]',
      '.description',
      '#vip-description',
      'main',
      'article'
    ];
    let text = '';
    for (const sel of containers) {
      const el = document.querySelector(sel);
      if (el && el.innerText && el.innerText.length > 20) { text = el.innerText; break; }
    }
    if (!text) text = document.body ? (document.body.innerText || '') : '';
    // Support ABC123 and ABC12D in visible text
    const reClassic = /\b([A-Za-zÅÄÖåäö]{3})[- ]?([0-9]{3})\b/;
    const reNew = /\b([A-Za-zÅÄÖåäö]{3})[- ]?([0-9]{2})([A-Za-zÅÄÖåäö])\b/;
    let m = reClassic.exec(text);
    if (!m) m = reNew.exec(text);
    if (!m) return null;
    const letters = m[1].toUpperCase().replace(/[ÅÄÖ]/g, (c) => ({ 'Å':'A','Ä':'A','Ö':'O' }[c] || c));
    const tail = (m[2] + (m[3] || '')).toUpperCase().replace(/[ÅÄÖ]/g, (c) => ({ 'Å':'A','Ä':'A','Ö':'O' }[c] || c));
    return `${letters}${tail}`;
  }

  async function prefetchFromPageIfPossible() {
    if (prefetchInFlight) return prefetchInFlight;
    prefetchInFlight = (async () => {
      try {
        const plate = extractPlateFromPage();
        if (!plate) return null;
          // No localStorage for plate; rely solely on page extraction/manual input
        const [histHtml, ownersHtmlMaybe] = await Promise.all([
          fetchBiluppgifterHTML(plate),
          fetchOwnersHTML(plate).catch(() => null)
        ]);
        const parsed = new DOMParser().parseFromString(histHtml, 'text/html');
        const historySection = parsed.querySelector('#history-log');
        if (!historySection) return null;
        const historyList = historySection.querySelector('ul.history');
        if (!historyList) return null;
        const countsMap = computeCounts(historyList);
        const countsObj = Object.fromEntries(countsMap.entries());
        let ownersUlHTML = '';
        let ownersSummaryHTML = '';
        if (ownersHtmlMaybe) {
          try {
            const ownersDoc = new DOMParser().parseFromString(ownersHtmlMaybe, 'text/html');
            const ownersUl = ownersDoc.querySelector('ul.owners');
            if (ownersUl) ownersUlHTML = ownersUl.outerHTML;
            const section = ownersDoc.querySelector('section');
            if (section) {
              const ps = section.querySelectorAll('p');
              const fragments = [];
              for (let i = 0; i < Math.min(2, ps.length); i++) fragments.push(ps[i].outerHTML);
              if (fragments.length) ownersSummaryHTML = fragments.join('');
            }
          } catch {}
        }
        prefetchedData = { plate, counts: countsObj, ulHTML: historyList.outerHTML, ownersUlHTML, ownersSummaryHTML };
        return prefetchedData;
      } catch (_) {
        return null; // ignore background prefetch errors
      } finally {
        prefetchInFlight = null;
      }
    })();
    return prefetchInFlight;
  }

  // Route-aware mounting/visibility and prefetching
  function handleNavigation() {
    if (isAdPage()) {
      try { floatingButton.style.display = ''; } catch {}
      // Close any previous modal state if navigating between ads keeps it open
      try { modal.close(); } catch {}
      // Reset prefetched buffer and start prefetch on the new page
      try { prefetchedData = null; } catch {}
      setUpPrefetchObserver();
      // Also attempt an immediate prefetch once
      prefetchFromPageIfPossible();
    } else {
      try { floatingButton.style.display = 'none'; } catch {}
      try { modal.close(); } catch {}
      if (window.__bbhPrefetchObserver) {
        try { window.__bbhPrefetchObserver.disconnect(); } catch {}
        window.__bbhPrefetchObserver = null;
      }
    }
  }

  setupNavigationListeners(handleNavigation);
  // Run once on load
  handleNavigation();
})();

