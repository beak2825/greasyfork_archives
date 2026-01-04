// ==UserScript==
// @name         TornPDA Pickpocketing Mobster Alert
// @namespace    https://torn.com/
// @version      1.0
// @description  Beep/vibration on any tab; flash + glow on visible Pickpocketing tab;
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547414/TornPDA%20Pickpocketing%20Mobster%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/547414/TornPDA%20Pickpocketing%20Mobster%20Alert.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ===== Config ===== */
  const SETTINGS_KEY      = 'tpda_mobster_alert_enabled';
  const TARGETS           = ['mobster'];
  const COOLDOWN_MS       = 10_000;
  const FLASH_DURATION_MS = 3_000;
  const GLOW_DURATION_MS  = 12_000;

  /* ===== State ===== */
  let enabled    = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'true');
  let lastAlert  = 0;
  let audioCtx   = null;
  let toggleBtn  = null;
  let lastGlowEl = null;

  /* ===== Helpers: viewport ===== */
  const isMobile = () =>
    (window.matchMedia && (window.matchMedia('(max-width: 820px)').matches || window.matchMedia('(pointer: coarse)').matches));

  /* ===== SPA / URL handling ===== */
  const fireLocChange = () => window.dispatchEvent(new Event('locationchange'));
  const wrapHistory = (fn) => function () { const r = fn.apply(this, arguments); try{fireLocChange();}catch{} return r; };
  (function patchHistoryEarly(){
    try {
      history.pushState = wrapHistory(history.pushState);
      history.replaceState = wrapHistory(history.replaceState);
      window.addEventListener('popstate', fireLocChange);
    } catch {}
  })();
  let __lastHref = location.href;
  setInterval(() => { if (location.href !== __lastHref) { __lastHref = location.href; fireLocChange(); } }, 250);

  const isPickpocketURL = () => {
    try {
      const u = new URL(location.href);
      const sid = u.searchParams.get('sid');
      const h = (location.hash || '').toLowerCase();
      return sid === 'crimes' && (h.includes('/pickpocket') || h.includes('pickpocket'));
    } catch { return false; }
  };

  // DOM signal that Pickpocketing is mounted (works on mobile too)
  const isPickpocketDOM = () => {
    // commit button container present somewhere (rows rendered)
    if (document.querySelector('[class*="commitButtonSection"] .commit-button, .commit-button')) return true;
    // or crime rows
    if (document.querySelector('[class*="crime-option"], [class*="crimeOptionWrapper"]')) return true;
    return false;
  };

  const onPickpocketView = () => isPickpocketURL() || isPickpocketDOM();

  /* ===== Audio / vibration / styles ===== */
  const ensureAudio = () => {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
    } catch {}
  };

  const playBeep = () => {
    try {
      ensureAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      osc.connect(gain).connect(audioCtx.destination);
      const t = audioCtx.currentTime;
      const env = (start, dur) => {
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.5, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      };
      osc.start(t);
      env(t, 0.12);
      env(t + 0.18, 0.14);
      osc.stop(t + 0.5);
    } catch {}
  };

  const vibrate = (pattern = [120, 80, 120]) => {
    try { navigator.vibrate && navigator.vibrate(pattern); } catch {}
  };

  const ensureStyleOnce = () => {
    if (document.getElementById('tpda_mobster_styles')) return;
    const style = document.createElement('style');
    style.id = 'tpda_mobster_styles';
    style.textContent = `
      @keyframes tpda_flash { from{opacity:0;} to{opacity:1;} }
      @keyframes tpda_glow {
        0%   { box-shadow: 0 0 0 0 rgba(255,64,64,0.0), 0 0 0 0 rgba(255,255,255,0.0); }
        100% { box-shadow: 0 0 16px 4px rgba(255,64,64,0.65), 0 0 2px 1px rgba(255,255,255,0.3) inset; }
      }
      .tpda-mobster-glow { position: relative; animation: tpda_glow 700ms ease-in-out 0s infinite alternate; border-radius: 10px; }
      .tpda-toast { position: fixed; left: 50%; bottom: 12px; transform: translateX(-50%); background: rgba(0,0,0,.84); color: #fff; padding: 10px 14px; border-radius: 10px; font-size: 13px; z-index: 2147483647; }
      .tpda-toggle { z-index: 2147483647; border: none; }
      .tpda-toggle-desktop {
        position: fixed; right: 45%; bottom: 10px;
        color: #fff; border-radius: 9999px;
        padding: 10px 14px; font-size: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,.2);
        background: #16a34a;
      }
      .tpda-toggle-mobile {
        position: fixed; left: 10px; bottom: 10px;
        width: 44px; height: 44px; border-radius: 9999px;
        display: inline-flex; align-items: center; justify-content: center;
        box-shadow: 0 4px 16px rgba(0,0,0,.25);
        background: #16a34a;
      }
      .tpda-toggle-mobile svg { width: 22px; height: 22px; }
      .tpda-toggle-off { background: #6b7280 !important; }
      .tpda-flash-overlay {
        position: fixed; inset: 0; z-index: 2147483646;
        background: white; pointer-events: none;
        animation: tpda_flash 300ms ease-in-out 0s 10 alternate;
      }
    `;
    document.head.appendChild(style);
  };

  const flashScreen = () => {
    ensureStyleOnce();
    if (document.getElementById('tpda_mobster_flash')) return;
    const overlay = document.createElement('div');
    overlay.id = 'tpda_mobster_flash';
    overlay.className = 'tpda-flash-overlay';
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), FLASH_DURATION_MS);
  };

  const toast = (msg) => {
    ensureStyleOnce();
    const el = document.createElement('div');
    el.className = 'tpda-toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  };

  /* ===== Toggle UI (mobile icon, desktop button) ===== */
  const renderToggle = () => {
    if (!onPickpocketView()) { if (toggleBtn) { toggleBtn.remove(); toggleBtn = null; } return; }
    if (toggleBtn && toggleBtn.isConnected) return;

    ensureStyleOnce();
    toggleBtn = document.createElement('button');
    toggleBtn.id = 'tpda_mobster_toggle';
    toggleBtn.className = `tpda-toggle ${isMobile() ? 'tpda-toggle-mobile' : 'tpda-toggle-desktop'}`;

    const setState = () => {
      const on = !!enabled;
      toggleBtn.classList.toggle('tpda-toggle-off', !on);
      if (isMobile()) {
        toggleBtn.innerHTML = on
          ? `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M12 22c1.1 0 2-.9 2-2H10a2 2 0 0 0 2 2z"/>
               <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
             </svg>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
               <path d="M18 8a6 6 0 0 0-9.33-4.94"/>
               <path d="M2 2l20 20"/>
               <path d="M5.17 5.17A5.97 5.97 0 0 0 6 8c0 7-3 7-3 9h14"/>
             </svg>`;
        toggleBtn.title = on ? 'Mobster Alert: ON' : 'Mobster Alert: OFF';
      } else {
        toggleBtn.textContent = on ? 'Mobster Alert: ON' : 'Mobster Alert: OFF';
      }
      toggleBtn.style.background = on ? '#16a34a' : '#6b7280';
    };
    setState();

    toggleBtn.addEventListener('click', async () => {
      enabled = !enabled;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(enabled));
      setState();
      ensureAudio(); // user interaction helps audio unlock on mobile
      try {
        if ('Notification' in window && Notification.permission === 'default') {
          await Notification.requestPermission().catch(()=>{});
        }
      } catch {}
      toast(enabled ? 'Alert enabled' : 'Alert disabled');
    });

    (document.body || document.documentElement).appendChild(toggleBtn);
  };

  // Watchdog: ensure toggle exists when it should
  setInterval(() => {
    if (onPickpocketView() && !document.getElementById('tpda_mobster_toggle')) {
      toggleBtn = null; renderToggle();
    }
  }, 1000);

  /* ===== Row detection (mobile-safe) ===== */
  const rowFromNode = (n) =>
    n?.closest?.('[class*="virtualItem"], [class*="crimeOptionWrapper"], [class*="crime-option"]') || null;

  // NEW: do NOT rely on button text; just require a commit button to confirm it's a crime row
  const hasCommitButton = (row) =>
    !!(row.querySelector('.commit-button') || row.querySelector('[class*="commitButtonSection"] [role="button"], [class*="commitButtonSection"] button'));

  const getTargetName = (row) => {
    const block = row.querySelector('[class*="titleAndProps"]');
    let first = null;
    for (const c of block?.children || []) { if (c.nodeType === 1) { first = c; break; } }
    return (first?.textContent || '').trim() || null;
  };

  const isTargetMatch = (name) => {
    if (!name) return false;
    const norm = name.toLowerCase().trim();
    return TARGETS.some(t => norm === t || norm.includes(t));
  };

  const applyGlowToRow = (row) => {
    ensureStyleOnce();
    if (lastGlowEl && lastGlowEl.isConnected) lastGlowEl.classList.remove('tpda-mobster-glow');
    const el = row.querySelector('[class*="crime-option"]') ||
               row.querySelector('[class*="crimeOptionWrapper"]') || row;
    el.classList.add('tpda-mobster-glow');
    lastGlowEl = el;
    setTimeout(() => el.classList.remove('tpda-mobster-glow'), GLOW_DURATION_MS);
  };

  /* ===== Alert ===== */
  const triggerAlert = (row) => {
    if (!enabled) return;
    const now = Date.now();
    if (now - lastAlert < COOLDOWN_MS) return;
    lastAlert = now;

    if (onPickpocketView() && !document.hidden) {
      flashScreen();
      setTimeout(() => applyGlowToRow(row), FLASH_DURATION_MS);
    }
    playBeep();
    vibrate();
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Torn: Mobster', { body: 'Mobster spotted in Pickpocketing' });
      }
    } catch {}
  };

  const handleRowIfMobster = (row) => {
    if (!row || !hasCommitButton(row)) return false;     // mobile-safe check
    const name = getTargetName(row);
    if (isTargetMatch(name)) { triggerAlert(row); return true; }
    return false;
  };

  const scanAllRows = () => {
    const rows = document.querySelectorAll('[class*="virtualItem"], [class*="crimeOptionWrapper"], [class*="crime-option"]');
    for (const row of rows) { if (handleRowIfMobster(row)) break; }
  };

  /* ===== Observers & boot ===== */
  const domObserver = new MutationObserver((muts) => {
    renderToggle();
    if (!enabled) return;
    for (const m of muts) {
      if (m.type === 'childList') {
        for (const n of m.addedNodes) {
          if (n.nodeType !== 1) continue;
          const cand = rowFromNode(n) ||
            (n.querySelector ? rowFromNode(n.querySelector('[class*="crime-option"], [class*="virtualItem"]') || n) : null);
          if (cand && handleRowIfMobster(cand)) return;
        }
      } else if (m.type === 'characterData') {
        const row = rowFromNode(m.target?.parentElement);
        if (row && handleRowIfMobster(row)) return;
      }
    }
  });

  const waitForPickpocketMount = async (timeoutMs = 6000) => {
    const ok = () => {
      return document.querySelector('.commit-button, [class*="commitButtonSection"] [role="button"], [class*="commitButtonSection"] button') ||
             document.querySelector('[class*="crime-option"], [class*="crimeOptionWrapper"]');
    };
    if (ok()) return true;
    return await new Promise(res => {
      const int = setInterval(() => { if (ok()) { clearInterval(int); clearTimeout(to); res(true); } }, 150);
      const to  = setTimeout(() => { clearInterval(int); res(false); }, timeoutMs);
    });
  };

  const onRouteChange = async () => {
    setTimeout(renderToggle, 150);
    setTimeout(renderToggle, 650);
    if (isPickpocketURL()) {
      await waitForPickpocketMount(6000);
      setTimeout(scanAllRows, 200);
      setTimeout(scanAllRows, 900);
    }
  };

  const start = () => {
    ensureStyleOnce();
    domObserver.observe(document.documentElement || document.body, { subtree: true, childList: true, characterData: true });
    renderToggle();
    setTimeout(scanAllRows, 600);
  };

  window.addEventListener('locationchange', onRouteChange);
  window.addEventListener('hashchange', onRouteChange);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

})();
