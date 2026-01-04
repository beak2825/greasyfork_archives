// ==UserScript==
// @name         Neopets Wishing Well Auto Wisher
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Compact embedded panel; persists config/state; 7 wishes auto; periodic refresh with persistent countdown; auto-start option.
// @match        https://www.neopets.com/wishing.phtml*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547432/Neopets%20Wishing%20Well%20Auto%20Wisher.user.js
// @updateURL https://update.greasyfork.org/scripts/547432/Neopets%20Wishing%20Well%20Auto%20Wisher.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LS_KEY = 'ww_bot_cfg_v2';
  const MAX_ATTEMPTS = 7;
  const MS_HOUR = 3600000;

  const defaults = {
    amount: 21,
    wish: '',
    active: false,
    autoStart: false,      // 👈 Nuevo flag
    attempts: 0,
    refreshHours: 0,       // 0 = off
    nextRefreshAt: null    // epoch ms, absolute target
  };

  const load = () => {
    try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(LS_KEY) || '{}')); }
    catch { return { ...defaults }; }
  };
  const save = (cfg) => localStorage.setItem(LS_KEY, JSON.stringify(cfg));

  let cfg = load();

  // ---------- helpers ----------
  const $ = (s, r=document) => r.querySelector(s);
  const hasWishCount = () => (document.documentElement.textContent || '').includes('Wish Count');

  const npCard = 'background:#f8f6ef;border:1px solid #999;padding:10px;font:12px Verdana,Arial,sans-serif;color:#333;';
  const npInput = 'background:#fff;border:1px solid #c8bda0;border-radius:4px;padding:4px;font:12px Verdana;';
  const npBtn   = 'background:#efe5c8;border:1px solid #7a623d;border-radius:5px;padding:4px 10px;cursor:pointer;font:12px Verdana;';

  function ensurePanel() {
    if ($('#ww_panel')) return;

    const form = $('input[name="donation"]')?.closest('form') || $('form[action*="wishing.phtml"]') || $('form');

    const wrap = document.createElement('div');
    wrap.id = 'ww_panel';
    wrap.style.cssText = 'max-width:360px;margin:12px auto;';
    wrap.innerHTML = `
      <div style="${npCard};border-radius:8px;text-align:center;box-shadow:2px 2px 6px rgba(0,0,0,.12);">
        <div style="font-weight:700;margin-bottom:8px;color:#5a4633;">✨ Wishing Well Auto ✨</div>

        <div style="display:grid;grid-template-columns:1fr;gap:8px;text-align:left">
          <label>Amount of Donation
            <input id="ww_amount" type="number" min="21" style="width:100%;${npInput}">
          </label>
          <label>Wish
            <input id="ww_wish" type="text" style="width:100%;${npInput}">
          </label>
          <label>Auto-refresh (hours, 0 = off)
            <input id="ww_refresh" type="number" min="0" style="width:100%;${npInput}">
          </label>
          <label>
            <input id="ww_autostart" type="checkbox" style="margin-right:4px;">
            Auto-start on page load
          </label>
        </div>

        <div style="display:flex;gap:8px;justify-content:center;margin-top:10px;">
          <button id="ww_start" style="${npBtn}">Start</button>
          <button id="ww_stop"  style="${npBtn}">Stop</button>
        </div>

        <div style="margin-top:8px;font-weight:700;color:#444;" id="ww_status">—</div>

        <div style="margin-top:8px;text-align:left">
          <div style="font-size:11px;margin-bottom:4px;">Attempts: <span id="ww_attempts_text">0/${MAX_ATTEMPTS}</span></div>
          <div style="width:100%;height:8px;background:#fff;border:1px solid #bcb39a;border-radius:4px;overflow:hidden;">
            <div id="ww_progress" style="height:100%;width:0%;background:#9acc66;"></div>
          </div>
        </div>

        <div style="margin-top:10px;font-size:12px;color:#5a4633;">
          <span id="ww_refresh_label">Refreshing in: (off)</span>
        </div>
      </div>
    `;

    if (form && form.parentNode) form.parentNode.insertBefore(wrap, form);
    else (document.body || document.documentElement).appendChild(wrap);

    // Inicializar inputs
    $('#ww_amount').value = cfg.amount;
    $('#ww_wish').value = cfg.wish;
    $('#ww_refresh').value = cfg.refreshHours;
    $('#ww_autostart').checked = cfg.autoStart;

    // Listeners
    $('#ww_amount').addEventListener('input', e => { cfg.amount = Math.max(21, Number(e.target.value) || 21); save(cfg); });
    $('#ww_wish').addEventListener('input', e => { cfg.wish = e.target.value || ''; save(cfg); });
    $('#ww_refresh').addEventListener('input', e => {
      const hrs = Math.max(0, Number(e.target.value) || 0);
      cfg.refreshHours = hrs;
      cfg.nextRefreshAt = hrs > 0 ? Date.now() + hrs*MS_HOUR : null;
      save(cfg);
      setupRefreshTimer(true);
    });
    $('#ww_autostart').addEventListener('change', e => {
      cfg.autoStart = e.target.checked;
      save(cfg);
    });

    // Botones
    $('#ww_start').addEventListener('click', () => {
      cfg.amount = Math.max(21, Number($('#ww_amount').value) || 21);
      cfg.wish = $('#ww_wish').value || '';
      cfg.active = true;
      cfg.attempts = 0;
      save(cfg);
      updateUI();
      setTimeout(trySubmit, 600);
    });

    $('#ww_stop').addEventListener('click', () => {
      cfg.active = false;
      save(cfg);
      updateUI();
    });

    updateUI();
  }

  function updateUI() {
    const pct = Math.min(100, Math.round((cfg.attempts / MAX_ATTEMPTS) * 100));
    const bar = $('#ww_progress');
    const txt = $('#ww_attempts_text');
    if (bar) bar.style.width = pct + '%';
    if (txt) txt.textContent = `${cfg.attempts}/${MAX_ATTEMPTS}`;

    const status = $('#ww_status');
    if (status) status.textContent = cfg.active ? `Auto (${cfg.attempts}/${MAX_ATTEMPTS})…` : 'Idle';
  }

  // ---------- auto-wish core ----------
  function trySubmit() {
    if (!cfg.active) { updateUI(); return; }

    if (!hasWishCount()) {
      cfg.active = false;
      cfg.attempts = 0;
      save(cfg);
      updateUI();
      const s = $('#ww_status'); if (s) s.textContent = 'Stopped: no "Wish Count" on page';
      return;
    }

    if (cfg.attempts >= MAX_ATTEMPTS) {
      cfg.active = false;
      save(cfg);
      updateUI();
      const s = $('#ww_status'); if (s) s.textContent = 'Done (7 attempts)';
      return;
    }

    const donationBox = document.querySelector('input[name="donation"]');
    const wishBox     = document.querySelector('input[name="wish"]');
    const submitBtn   = document.querySelector('input[type="submit"][value="Make a Wish"], input[type="submit"][value="Make a wish"]');

    if (!donationBox || !wishBox || !submitBtn) {
      setTimeout(trySubmit, 400);
      return;
    }

    donationBox.value = Math.max(21, Number(cfg.amount) || 21);
    wishBox.value = cfg.wish || '';

    cfg.attempts += 1;
    save(cfg);
    updateUI();

    const s = $('#ww_status'); if (s) s.textContent = `Submitting (${cfg.attempts}/${MAX_ATTEMPTS})…`;
    submitBtn.click();
  }

  // ---------- persistent countdown / refresh ----------
  let refreshTimeoutId = null;
  let countdownIntervalId = null;

  function formatCountdown(ms) {
    if (ms < 0) ms = 0;
    const h = Math.floor(ms / MS_HOUR);
    const m = Math.floor((ms % MS_HOUR) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h} hours ${m} min ${s} secs`;
  }

  function setupRefreshTimer(restartedByUser = false) {
    if (refreshTimeoutId) clearTimeout(refreshTimeoutId);
    if (countdownIntervalId) clearInterval(countdownIntervalId);

    const label = $('#ww_refresh_label');

    if (!cfg.refreshHours || cfg.refreshHours <= 0) {
      if (label) label.textContent = 'Refreshing in: (off)';
      cfg.nextRefreshAt = null;
      save(cfg);
      return;
    }

    if (!cfg.nextRefreshAt || restartedByUser) {
      cfg.nextRefreshAt = Date.now() + cfg.refreshHours * MS_HOUR;
      save(cfg);
    }

    if (cfg.nextRefreshAt <= Date.now()) {
      cfg.nextRefreshAt = Date.now() + cfg.refreshHours * MS_HOUR;
      save(cfg);
    }

    const paint = () => {
      const remain = cfg.nextRefreshAt - Date.now();
      if (label) label.textContent = `Refreshing in ${formatCountdown(remain)}`;
    };
    paint();
    countdownIntervalId = setInterval(paint, 1000);

    const remainNow = cfg.nextRefreshAt - Date.now();
    refreshTimeoutId = setTimeout(() => {
      if (cfg.refreshHours > 0) {
        cfg.nextRefreshAt = cfg.nextRefreshAt + cfg.refreshHours * MS_HOUR;
        save(cfg);
      }
      location.reload();
    }, Math.max(0, remainNow));
  }

  // ---------- boot ----------
  ensurePanel();

  if (cfg.active || cfg.autoStart) {
    cfg.active = true; // 
    save(cfg);
    setTimeout(trySubmit, 800);
  }
  updateUI();

  setupRefreshTimer(false);
})();
