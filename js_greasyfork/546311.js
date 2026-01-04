// ==UserScript==
// @name         Zed Gym Usage Tracker (48h)
// @namespace    zed.city.gymtracker
// @version      1.2.1
// @description  Counts gym uses by stat within a 48h window. Stops on expiry; requires {Restart}
// @match        https://www.zed.city/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546311/Zed%20Gym%20Usage%20Tracker%20%2848h%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546311/Zed%20Gym%20Usage%20Tracker%20%2848h%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** Storage ***/
  const LS_KEY = 'Zed-Gym-Tracker-v1';

  function readState() {
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
      return s && typeof s === 'object' ? s : null;
    } catch { return null; }
  }
  function writeState(s) {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  }
  function freshState() {
    return {
      startedAt: 0,        // set on first valid gym call after restart
      frozen: false,       // when true, ignore events until user clicks {Restart}
      totals: {
        total: 0,
        strength: 0,
        defense: 0,
        speed: 0,
        agility: 0
      }
    };
  }
  if (!readState()) writeState(freshState());

  /*** Time helpers ***/
  const DAY_MS = 48 * 60 * 60 * 1000;
  function remainingMs(s) {
    if (s.frozen) return 0;
    if (!s.startedAt) return DAY_MS;
    const elapsed = Date.now() - s.startedAt;
    return Math.max(0, DAY_MS - elapsed);
  }
  function fmtHMS(ms) {
    let secs = Math.floor(ms / 1000);
    const h = Math.floor(secs / 3600); secs -= h * 3600;
    const m = Math.floor(secs / 60); secs -= m * 60;
    const pad = (n) => (n < 10 ? '0' + n : '' + n);
    return `${pad(h)}:${pad(m)}:${pad(secs)}`;
  }

  /*** UI ***/
  let panel, btn, tickTimer, confirmOverlay;

  function ensureStyles() {
    if (document.getElementById('zed-gym-style')) return;
    const style = document.createElement('style');
    style.id = 'zed-gym-style';
    style.textContent = `
      .zed-gym-btn {
        position: fixed; right: 12px; bottom: 100px; z-index: 9999;
        padding: 6px 12px; font-weight: 600; font-size: 12px; border-radius: 8px;
        border: 1px solid rgba(255,255,255,.15);
        background: rgba(20,20,28,.75); color: #fff; cursor: pointer;
        box-shadow: 0 3px 12px rgba(0,0,0,.4); backdrop-filter: blur(5px);
        transition: all .15s ease;
      }
      .zed-gym-btn:hover { background: rgba(32,34,44,.9); transform: translateY(-1px); }

      .zed-gym-panel {
        position: fixed; right: 12px; bottom: 152px; z-index: 10000; width: 260px;
        display: none; padding: 12px; border-radius: 12px;
        background: rgba(16,18,22,.95); color: #fff;
        border: 1px solid rgba(255,255,255,.12);
        box-shadow: 0 8px 28px rgba(0,0,0,.55); backdrop-filter: blur(8px);
        font-size: 13px;
      }
      .zed-gym-panel.open { display: block; }

      .zg-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; font-weight:600; font-size:14px; }
      .zg-body { display:grid; grid-template-columns: 1fr auto; gap:8px 6px; margin-bottom:10px; }
      .zg-row { grid-column: 1 / -1; display:flex; align-items:center; justify-content:space-between; padding:6px 8px; border-radius:8px; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); }
      .zg-actions { display:flex; gap:6px; margin-top: 8px; }
      .zg-actions button {
        flex:1 1 auto; padding:6px 10px; border-radius:6px;
        border:1px solid rgba(255,255,255,.18);
        background:rgba(32,36,42,.85); color:#fff;
        cursor:pointer; font-size:12px; transition: all .15s ease;
      }
      .zg-actions button:hover { background: rgba(45,50,60,.9); }
      .zg-close { margin-left: 8px; font-size: 14px; cursor: pointer; border: none; background: transparent; color: #aaa; }
      .zg-value { font-weight: 700; font-variant-numeric: tabular-nums; }
      .zg-frozen { color: #ffb4b4; font-weight: 700; }

      /* Confirmation overlay */
      .zg-confirm-overlay {
        position: fixed; inset: 0; z-index: 10001; display: none;
        background: rgba(0,0,0,.45);
      }
      .zg-confirm {
        position: absolute; right: 12px; bottom: 152px; width: 260px;
        background: #151821; color: #fff; border-radius: 12px;
        border: 1px solid rgba(255,255,255,.12);
        box-shadow: 0 8px 28px rgba(0,0,0,.55);
        padding: 12px; font-size: 13px;
      }
      .zg-confirm h4 { margin: 0 0 10px 0; font-size: 14px; }
      .zg-confirm .zg-confirm-actions { display:flex; gap:8px; }
      .zg-confirm .zg-confirm-actions button {
        flex:1 1 auto; padding: 6px 10px; border-radius: 6px;
        border: 1px solid rgba(255,255,255,.18);
        background: rgba(32,36,42,.9); color: #fff; cursor: pointer;
      }
      .zg-confirm .zg-confirm-actions button:hover { background: rgba(45,50,60,.95); }
    `;
    document.head.appendChild(style);
  }

  function ensureButton() {
    if (btn) return btn;
    btn = document.createElement('button');
    btn.className = 'zed-gym-btn';
    btn.type = 'button';
    btn.title = 'Show Gym Tracker';
    btn.textContent = 'GYM';
    btn.addEventListener('click', () => { buildPanel(); togglePanel(); });
    document.body.appendChild(btn);
    return btn;
  }

  function buildConfirmOverlay() {
    if (confirmOverlay) return confirmOverlay;
    confirmOverlay = document.createElement('div');
    confirmOverlay.className = 'zg-confirm-overlay';
    confirmOverlay.innerHTML = `
      <div class="zg-confirm" role="dialog" aria-modal="true" aria-labelledby="zg-confirm-title">
        <h4 id="zg-confirm-title">Do you want to wipe the 48hr stats?</h4>
        <div class="zg-confirm-actions">
          <button class="zg-yes">Yes</button>
          <button class="zg-no">No</button>
        </div>
      </div>
    `;
    document.body.appendChild(confirmOverlay);

    // Close on backdrop click
    confirmOverlay.addEventListener('click', (e) => {
      if (e.target === confirmOverlay) hideConfirm();
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (confirmOverlay.style.display === 'block' && e.key === 'Escape') hideConfirm();
    });

    return confirmOverlay;
  }

  function showConfirm(onYes) {
    buildConfirmOverlay();
    confirmOverlay.style.display = 'block';
    const yes = confirmOverlay.querySelector('.zg-yes');
    const no = confirmOverlay.querySelector('.zg-no');

    const cleanup = () => {
      yes.removeEventListener('click', yesHandler);
      no.removeEventListener('click', noHandler);
    };
    const yesHandler = () => {
      cleanup();
      hideConfirm();
      try { onYes && onYes(); } catch {}
    };
    const noHandler = () => {
      cleanup();
      hideConfirm();
    };
    yes.addEventListener('click', yesHandler);
    no.addEventListener('click', noHandler);

    // Focus "No" first to reduce accidental wipes; "Yes" second
    setTimeout(() => no.focus(), 0);
  }

  function hideConfirm() {
    if (confirmOverlay) confirmOverlay.style.display = 'none';
  }

  function buildPanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.className = 'zed-gym-panel';
    panel.innerHTML = `
      <div class="zg-head">
        <strong>GYM USAGE (48hr)</strong>
        <button class="zg-close" aria-label="Close">✕</button>
      </div>
      <div class="zg-body">
        <div class="zg-row"><span>Time remaining</span><b class="zg-remaining zg-value">48:00:00</b></div>
        <div class="zg-row"><span>Total Gym attempts</span><b class="zg-total zg-value">0</b></div>
        <div class="zg-row"><span>Strength</span><b class="zg-strength zg-value">0</b></div>
        <div class="zg-row"><span>Defense</span><b class="zg-defense zg-value">0</b></div>
        <div class="zg-row"><span>Speed</span><b class="zg-speed zg-value">0</b></div>
        <div class="zg-row"><span>Agility</span><b class="zg-agility zg-value">0</b></div>
      </div>
      <div class="zg-actions">
        <button class="zg-restart">{Restart}</button>
      </div>
      <div class="zg-status" style="margin-top:6px; font-size:12px; display:none;">
        <span class="zg-frozen">Timer expired — tracking paused. Press {Restart} to begin a new 48h window.</span>
      </div>
    `;
    panel.querySelector('.zg-close').addEventListener('click', togglePanel);
    panel.querySelector('.zg-restart').addEventListener('click', () => {
      showConfirm(() => {
        writeState(freshState());
        render(true);
      });
    });
    document.body.appendChild(panel);
    startTicker();
    render(true);
    return panel;
  }

  function togglePanel() {
    if (!panel) return;
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) render();
  }

  function startTicker() {
    if (tickTimer) clearInterval(tickTimer);
    tickTimer = setInterval(() => {
      if (panel && panel.classList.contains('open')) {
        const s = readState();
        const left = remainingMs(s);
        const el = panel.querySelector('.zg-remaining');
        if (el) el.textContent = fmtHMS(left);

        // Freeze exactly at expiry.
        if (!s.frozen && s.startedAt && left <= 0) {
          s.frozen = true;
          writeState(s);
          render();
        }
      }
    }, 1000);
  }

  function render() {
    const s = readState();
    if (!panel) return;
    panel.querySelector('.zg-remaining').textContent = fmtHMS(remainingMs(s));
    panel.querySelector('.zg-total').textContent = String(s.totals.total);
    panel.querySelector('.zg-strength').textContent = String(s.totals.strength);
    panel.querySelector('.zg-defense').textContent = String(s.totals.defense);
    panel.querySelector('.zg-speed').textContent = String(s.totals.speed);
    panel.querySelector('.zg-agility').textContent = String(s.totals.agility);
    const status = panel.querySelector('.zg-status');
    if (status) status.style.display = s.frozen ? 'block' : 'none';
  }

  /*** Counting logic ***/
  function applyGymOutcome(outcome) {
    let s = readState() || freshState();
    if (s.frozen) return;

    if (s.startedAt && (Date.now() - s.startedAt) >= DAY_MS) {
      s.frozen = true;
      writeState(s);
      render();
      return;
    }

    const iters = Number.isFinite(outcome?.iterations) ? outcome.iterations : 1;
    const skill = String(outcome?.gym_rewards?.skill || '').toLowerCase();
    if (!iters || !skill) return;

    if (!s.startedAt) {
      s.startedAt = Date.now();
    }

    s.totals.total += iters;
    if (skill === 'strength') s.totals.strength += iters;
    else if (skill === 'defense') s.totals.defense += iters;
    else if (skill === 'speed') s.totals.speed += iters;
    else if (skill === 'agility') s.totals.agility += iters;

    writeState(s);
    render();
  }

  /*** Network interception (XHR + fetch) ***/
  function handleResponse(url, json) {
    try {
      if (!/start_job|startJob/i.test(url)) return;
      const outcome = json?.outcome;
      if (!outcome || !outcome.gym_rewards) return;
      applyGymOutcome(outcome);
    } catch {}
  }

  // XHR hook
  (function hookXHR() {
    if (XMLHttpRequest.prototype.__gymHooked__) return;
    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
      this.__gymURL = url || '';
      return open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
      this.addEventListener('readystatechange', function () {
        if (this.readyState !== 4) return;
        try {
          const text = this.responseText || '';
          const first = text[0];
          if (!text || (first !== '{' && first !== '[')) return;
          const json = JSON.parse(text);
          handleResponse(this.__gymURL || '', json);
        } catch {}
      });
      return send.apply(this, arguments);
    };
    Object.defineProperty(XMLHttpRequest.prototype, '__gymHooked__', { value: true, configurable: false });
  })();

  // fetch hook
  (function hookFetch() {
    if (window.__gymFetchHooked__) return;
    window.__gymFetchHooked__ = true;
    const prev = window.fetch;
    window.fetch = async function () {
      const res = await prev.apply(this, arguments);
      try {
        const req = arguments[0];
        const url = typeof req === 'string' ? req : (req && req.url) || '';
        const clone = res.clone();
        const ct = clone.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const json = await clone.json();
          handleResponse(url, json);
        }
      } catch {}
      return res;
    };
  })();

  /*** Boot ***/
  ensureStyles();
  ensureButton();
  buildPanel();
})();