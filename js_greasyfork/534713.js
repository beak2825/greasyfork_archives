// ==UserScript==
// @name         Torn Russian Roulette Martingale Betting Buttons (Dynamic Base + Multiplier + Persistent Settings)
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Torn RR 1–10 Martingale buttons with configurable starting bet and multiplier (2x/2.5x/3x/etc.), plus persistent settings and inline Settings UI.
// @author       Original Author - Chris-Cross; Base/UX - GreasyDiddy; upgrades - ChatGPT
// @license      MIT
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534713/Torn%20Russian%20Roulette%20Martingale%20Betting%20Buttons%20%28Dynamic%20Base%20%2B%20Multiplier%20%2B%20Persistent%20Settings%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534713/Torn%20Russian%20Roulette%20Martingale%20Betting%20Buttons%20%28Dynamic%20Base%20%2B%20Multiplier%20%2B%20Persistent%20Settings%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // -------------------------
  // Utilities & Persistence
  // -------------------------
  const LS_KEY = 'trr_martingale_settings_v2';

  const defaultSettings = {
    base: 25_000,   // default base bet
    mult: 3         // default martingale multiplier
  };

  function loadSettings() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return { ...defaultSettings };
      const parsed = JSON.parse(raw);
      const base = Number(parsed.base);
      const mult = Number(parsed.mult);
      if (!Number.isFinite(base) || base <= 0) parsed.base = defaultSettings.base;
      if (!Number.isFinite(mult) || mult <= 1) parsed.mult = defaultSettings.mult;
      return { base: parsed.base, mult: parsed.mult };
    } catch {
      return { ...defaultSettings };
    }
  }

  function saveSettings(s) {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  }

  function parseBetInput(input) {
    if (!input && input !== 0) return null;
    input = String(input).toLowerCase().replace(/,/g, '').trim();
    let multiplier = 1;
    if (input.endsWith('k')) {
      multiplier = 1e3; input = input.slice(0, -1);
    } else if (input.endsWith('m')) {
      multiplier = 1e6; input = input.slice(0, -1);
    } else if (input.endsWith('b')) {
      multiplier = 1e9; input = input.slice(0, -1);
    }
    const value = parseFloat(input);
    if (isNaN(value) || value <= 0) return null;
    return Math.floor(value * multiplier);
  }

  function formatMoney(n) {
    try { return n.toLocaleString('en-US'); } catch { return String(n); }
  }

  function calcBets(base, mult, count = 10) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(Math.floor(base * Math.pow(mult, i)));
    }
    return arr;
  }

  // -------------------------
  // Injection
  // -------------------------
  const BUTTONS_CONTAINER_ID = 'martingale-buttons';
  const MODAL_ID = 'martingale-settings-modal';

  function makeBtn(text, title) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.title = title || '';
    btn.className = 'torn-btn';
    btn.style.padding = '4px 10px';
    btn.style.fontSize = '11px';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.userSelect = 'none';
    return btn;
  }

  function injectButtons() {
    const container = document.querySelector('[class*="createWrap___"]');
    const inputBox = document.querySelector('input[aria-label="Money value"]');
    if (!container || !inputBox) {
      setTimeout(injectButtons, 400);
      return;
    }
    if (document.getElementById(BUTTONS_CONTAINER_ID)) return;

    const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

    // Outer container
    const wrap = document.createElement('div');
    wrap.id = BUTTONS_CONTAINER_ID;
    wrap.style.display = 'flex';
    wrap.style.flexWrap = 'wrap';
    wrap.style.gap = '6px';
    wrap.style.marginTop = '10px';
    wrap.style.alignItems = 'center';

    // Build buttons from settings
    const settings = loadSettings();
    const bets = calcBets(settings.base, settings.mult, 10);

    // 1–10 buttons
    bets.forEach((bet, idx) => {
      const btn = makeBtn(String(idx + 1), `$${formatMoney(bet)}`);
      btn.addEventListener('click', () => {
        nativeSetter.call(inputBox, formatMoney(bet));
        inputBox.dispatchEvent(new Event('input', { bubbles: true }));
        inputBox.dispatchEvent(new Event('change', { bubbles: true }));
      });
      wrap.appendChild(btn);

      // After "10", append Settings button
      if (idx === 9) {
        const settingsBtn = makeBtn('Settings', 'Configure base bet + multiplier (persists)');
        settingsBtn.style.padding = '4px 10px';
        settingsBtn.addEventListener('click', openSettingsModal);
        wrap.appendChild(settingsBtn);
      }
    });

    container.appendChild(wrap);
  }

  // -------------------------
  // Settings Modal
  // -------------------------
  function openSettingsModal() {
    if (document.getElementById(MODAL_ID)) return;

    const settings = loadSettings();

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.id = MODAL_ID;
    backdrop.style.position = 'fixed';
    backdrop.style.inset = '0';
    backdrop.style.background = 'rgba(0,0,0,0.35)';
    backdrop.style.zIndex = '99999';
    backdrop.style.display = 'flex';
    backdrop.style.alignItems = 'center';
    backdrop.style.justifyContent = 'center';

    // Modal
    const modal = document.createElement('div');
    modal.style.minWidth = '320px';
    modal.style.maxWidth = '420px';
    modal.style.background = '#1f1f1f';
    modal.style.color = '#eaeaea';
    modal.style.borderRadius = '8px';
    modal.style.boxShadow = '0 8px 20px rgba(0,0,0,0.4)';
    modal.style.padding = '16px';
    modal.style.fontSize = '13px';

    modal.innerHTML = `
      <div style="font-weight:700; font-size:14px; margin-bottom:8px;">Martingale Settings</div>
      <div style="display:flex; flex-direction:column; gap:10px;">
        <label style="display:flex; flex-direction:column; gap:6px;">
          <span>Starting/Base Bet</span>
          <input id="trr_base_input" type="text" placeholder="e.g. 25k, 2.5m, 1b"
                 value="${settings.base}" style="padding:6px 8px; border-radius:6px; border:1px solid #3a3a3a; background:#111; color:#fff;">
        </label>
        <label style="display:flex; flex-direction:column; gap:6px;">
          <span>Multiplier (e.g., 2, 2.5, 3)</span>
          <input id="trr_mult_input" type="number" step="0.1" min="1.1" max="10"
                 value="${settings.mult}" style="padding:6px 8px; border-radius:6px; border:1px solid #3a3a3a; background:#111; color:#fff;">
        </label>
        <div id="trr_preview" style="max-height:160px; overflow:auto; border:1px dashed #3a3a3a; border-radius:6px; padding:8px;"></div>
        <div style="display:flex; gap:8px; justify-content:flex-end;">
          <button id="trr_cancel_btn" class="torn-btn" style="padding:6px 12px;">Cancel</button>
          <button id="trr_save_btn" class="torn-btn" style="padding:6px 12px; font-weight:700;">Save</button>
        </div>
      </div>
    `;

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    const baseEl = modal.querySelector('#trr_base_input');
    const multEl = modal.querySelector('#trr_mult_input');
    const prevEl = modal.querySelector('#trr_preview');

    // Center the modal buttons' text (fix)
    const cancelBtn = modal.querySelector('#trr_cancel_btn');
    const saveBtn = modal.querySelector('#trr_save_btn');
    [cancelBtn, saveBtn].forEach((b) => {
      b.style.display = 'flex';
      b.style.alignItems = 'center';
      b.style.justifyContent = 'center';
      b.style.height = '28px';     // approximate Torn small button height
      b.style.lineHeight = '28px'; // match height for vertical centering
      b.style.padding = '0 12px';  // balanced horizontal padding
    });

    function renderPreview() {
      const baseParsed = parseBetInput(baseEl.value);
      const multParsed = Number(multEl.value);
      if (!baseParsed || !Number.isFinite(multParsed) || multParsed <= 1) {
        prevEl.innerHTML = `<div style="opacity:.8;">Enter a valid base + multiplier &gt; 1 to see preview.</div>`;
        return;
      }
      const previewBets = calcBets(baseParsed, multParsed, 10);
      prevEl.innerHTML = previewBets.map((b, i) => `<div>${i + 1}: $${formatMoney(b)}</div>`).join('');
    }

    function closeModal() {
      document.removeEventListener('keydown', handleEsc);
      backdrop.remove();
    }

    function handleEsc(ev) {
      if (ev.key === 'Escape') closeModal();
    }

    document.addEventListener('keydown', handleEsc);

    renderPreview();
    baseEl.addEventListener('input', renderPreview);
    multEl.addEventListener('input', renderPreview);

    cancelBtn.addEventListener('click', closeModal);

    saveBtn.addEventListener('click', () => {
      const newBase = parseBetInput(baseEl.value);
      const newMult = Number(multEl.value);
      if (!newBase) {
        alert('Invalid base bet.');
        return;
      }
      if (!Number.isFinite(newMult) || newMult <= 1) {
        alert('Multiplier must be a number greater than 1 (e.g., 2, 2.5, 3).');
        return;
      }
      saveSettings({ base: newBase, mult: newMult });
      closeModal();
      document.getElementById(BUTTONS_CONTAINER_ID)?.remove();
      injectButtons();
    });

    // Close on backdrop click
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  // -------------------------
  // Bootstrapping
  // -------------------------
  const observer = new MutationObserver(() => {
    if (location.href.includes('russianRoulette')) injectButtons();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(injectButtons, 800);
  setTimeout(injectButtons, 2000);
})();