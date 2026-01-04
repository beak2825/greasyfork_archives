// ==UserScript==
// @license MIT
// @name         IMDb: Bulk Rate Episodes (custom rating + auto-load)
// @namespace    muhammad.imdb.bulk.rate
// @version      2.0
// @description  Type any rating (1–10) and apply to all episodes on the page. Optional auto-scroll loads the whole season first.
// @match        https://www.imdb.com/title/*/episodes*
// @match        https://imdb.com/title/*/episodes*
// @run-at       document-idle
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544984/IMDb%3A%20Bulk%20Rate%20Episodes%20%28custom%20rating%20%2B%20auto-load%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544984/IMDb%3A%20Bulk%20Rate%20Episodes%20%28custom%20rating%20%2B%20auto-load%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- config ---
  const DEFAULT_RATING = 7;
  const BETWEEN_ITEMS_DELAY = 1500;  // ms between different episodes
  const AFTER_CLICK_DELAY  = 250;    // short delay after opening modal
  const MAX_WAIT_MS        = 8000;   // generic wait timeout
  const AUTOLOAD_STEP_MS   = 800;    // wait between autoscroll steps
  const AUTOLOAD_MAX_STEPS = 120;    // hard cap on autoscroll attempts

  // --- styles ---
  GM_addStyle(`
    .imdb-bulk-rate-panel {
      position: fixed; right: 16px; bottom: 16px; z-index: 999999;
      background: #0f0f0f; color: #fff; padding: 12px; border-radius: 12px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.35);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
      display: grid; grid-template-columns: auto auto; gap: 8px 10px; align-items: center; min-width: 260px;
    }
    .imdb-bulk-rate-panel .title { grid-column: 1 / -1; font-weight: 700; font-size: 13px; opacity: .95; }
    .imdb-bulk-rate-panel label { font-size: 13px; opacity: .9; display:flex; align-items:center; gap:6px; }
    .imdb-bulk-rate-panel input[type="number"] {
      width: 64px; height: 32px; border-radius: 8px; border: 1px solid #333;
      background: #1a1a1a; color: #fff; text-align: center; font-size: 14px; outline: none;
    }
    .imdb-bulk-rate-panel button {
      height: 32px; padding: 0 10px; border-radius: 8px; border: none; cursor: pointer;
      background: #f5c518; color: #000; font-weight: 700;
    }
    .imdb-bulk-rate-panel .row { grid-column: 1 / -1; display:flex; gap:8px; align-items:center; }
    .imdb-bulk-rate-panel .muted { opacity:.7; font-size:12px; }
    .imdb-bulk-rate-panel .progress { font-size: 12px; opacity:.85; }
  `);

  // --- utils ---
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  async function waitFor(selOrFn, timeout = MAX_WAIT_MS, interval = 50) {
    const start = performance.now();
    while (performance.now() - start < timeout) {
      const v = (typeof selOrFn === 'string') ? document.querySelector(selOrFn) : selOrFn();
      if (v) return v;
      await sleep(interval);
    }
    return null;
  }

  function textMatch(el, re) {
    return el && re.test(el.textContent.trim());
  }

  function getEpisodeRateButtons() {
    const buttons = [...document.querySelectorAll('button[data-testid="rate-button"]')];
    return buttons.filter(b => !b.disabled && b.offsetParent !== null);
  }

  function findStarButtonInModal(rating, modalRoot) {
    const root = modalRoot || document;
    const selectors = [
      `button[aria-label="Rate ${rating}"]`,
      `button[aria-label="${rating}"]`,
      `[data-testid="rating-button-${rating}"]`,
      `[data-testid="rating-star-${rating}"]`,
      `[data-testid*="rating"] button[aria-label*="${rating}"]`,
    ];
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    const stars = [...root.querySelectorAll('.ipc-rating-star--interactive, button[aria-label^="Rate "]')];
    const byNumber = stars.find(s => /\d+/.test(s.getAttribute('aria-label') || '') && Number((s.getAttribute('aria-label')||'').replace(/[^\d]/g,'')) === rating);
    if (byNumber) return byNumber;
    if (stars.length >= rating) return stars[rating - 1];
    return null;
  }

  function findSubmitButtonInModal(modal) {
    let btn = modal.querySelector('button[type="submit"], [data-testid="rate-submit-button"], [data-testid="ratings-done-button"]');
    if (btn) return btn;
    const candidates = [...modal.querySelectorAll('button, .ipc-btn')];
    const re = /^(rate|done|submit|save)$/i;
    btn = candidates.find(b => textMatch(b, re));
    if (btn) return btn;
    const links = [...modal.querySelectorAll('a')];
    btn = links.find(a => textMatch(a, /^(rate|done)$/i));
    return btn || null;
  }

  async function clickAndRate(button, rating) {
    button.scrollIntoView({ behavior: 'smooth', block: 'center' });
    button.click();

    await sleep(AFTER_CLICK_DELAY);
    const modal = await waitFor(() => document.querySelector('div[role="dialog"]'));
    if (!modal) throw new Error('Rating modal did not appear');

    const starBtn = await waitFor(() => findStarButtonInModal(rating, modal));
    if (!starBtn) throw new Error('Could not find the star button for rating ' + rating);
    starBtn.click();

    await sleep(150);
    const submitBtn = await waitFor(() => findSubmitButtonInModal(modal), 4000);
    if (submitBtn) {
      if (!submitBtn.disabled && submitBtn.offsetParent !== null) submitBtn.click();
      else { submitBtn.focus(); await sleep(100); submitBtn.click(); }
    } else {
      console.warn('Submit button not found—maybe auto-submitted.');
    }

    const closed = await waitFor(() => !document.querySelector('div[role="dialog"]'), 6000);
    if (!closed) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await sleep(200);
    }
  }

  async function autoloadAllEpisodes(updateProgress) {
    // Scroll until no new rate buttons show up (or max steps)
    let prevCount = getEpisodeRateButtons().length;
    let stableTicks = 0;

    for (let step = 1; step <= AUTOLOAD_MAX_STEPS; step++) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });

      // Click any “Load more” / “Show more” buttons we can find
      const loadButtons = [...document.querySelectorAll('button, a')].filter(el =>
        /load more|show more|more episodes/i.test(el.textContent || '')
      );
      loadButtons.forEach(b => { if (!b.disabled) b.click(); });

      await sleep(AUTOLOAD_STEP_MS);

      const nowCount = getEpisodeRateButtons().length;
      if (updateProgress) updateProgress(`Loaded ~${nowCount} episode cards…`);
      if (nowCount > prevCount) {
        prevCount = nowCount;
        stableTicks = 0;
      } else {
        stableTicks++;
      }

      // consider it stable when no increase for 3 consecutive ticks
      if (stableTicks >= 3) break;
    }

    // scroll back to top so we don’t miss anything due to render quirks
    window.scrollTo({ top: 0, behavior: 'instant' });
    await sleep(300);
    return getEpisodeRateButtons().length;
  }

  async function rateAll(rating, { autoload = false, setStatus = null } = {}) {
    const r = Number(rating);
    if (!Number.isInteger(r) || r < 1 || r > 10) {
      alert('Please enter an integer rating from 1 to 10.');
      return;
    }

    if (setStatus) setStatus('Checking episodes…');
    let buttons;

    if (autoload) {
      const total = await autoloadAllEpisodes(msg => setStatus && setStatus(msg));
      if (setStatus) setStatus(`Loaded ${total} episodes. Starting ratings…`);
      buttons = getEpisodeRateButtons();
    } else {
      buttons = getEpisodeRateButtons();
      if (setStatus) setStatus(`Found ${buttons.length} visible episodes. Starting ratings…`);
    }

    if (buttons.length === 0) {
      alert('No rate buttons found. Are you logged in and on an episodes list page?');
      if (setStatus) setStatus('No episodes found.');
      return;
    }

    let success = 0, fail = 0;
    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      try {
        if (setStatus) setStatus(`(${i + 1}/${buttons.length}) Rating ${r}/10…`);
        await clickAndRate(btn, r);
        success++;
        await sleep(BETWEEN_ITEMS_DELAY);
      } catch (err) {
        console.warn('[IMDb Bulk Rate] Failed on item', i + 1, err);
        fail++;
        await sleep(800);
      }
    }

    if (setStatus) setStatus(`Done. Success: ${success}, Failed: ${fail}`);
    alert(`Done. Success: ${success}, Failed: ${fail}`);
  }

  // --- UI panel ---
  function mountPanel() {
    if (document.querySelector('.imdb-bulk-rate-panel')) return;

    const panel = document.createElement('div');
    panel.className = 'imdb-bulk-rate-panel';
    panel.innerHTML = `
      <div class="title">IMDb Bulk Rate</div>
      <label>Rating:
        <input type="number" min="1" max="10" step="1" value="${DEFAULT_RATING}" title="Rating 1–10" />
      </label>
      <label><input type="checkbox" class="autoload" /> Auto-load all episodes</label>
      <div class="row">
        <button type="button" class="go">Rate all</button>
        <span class="progress muted">Ready</span>
      </div>
    `;

    const input = panel.querySelector('input[type="number"]');
    const autoloadCb = panel.querySelector('.autoload');
    const goBtn = panel.querySelector('.go');
    const progressEl = panel.querySelector('.progress');

    const setStatus = (msg) => { progressEl.textContent = msg; };

    goBtn.addEventListener('click', () => {
      rateAll(input.value, { autoload: autoloadCb.checked, setStatus });
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        goBtn.click();
      }
    });

    document.body.appendChild(panel);
  }

  // Mount panel on load and keep it alive for SPA nav
  const readyObs = new MutationObserver(() => {
    if (document.body) mountPanel();
  });
  readyObs.observe(document.documentElement, { childList: true, subtree: true });
  mountPanel();

  // Menu commands (optional but handy)
  GM_registerMenuCommand('Bulk Rate: open panel', () => {
    mountPanel();
    const input = document.querySelector('.imdb-bulk-rate-panel input[type="number"]');
    if (input) input.focus();
  });
  GM_registerMenuCommand('Bulk Rate: prompt…', async () => {
    const val = prompt('What rating (1-10)?', String(DEFAULT_RATING));
    if (val != null) rateAll(val, { autoload: false });
  });

  console.log('[IMDb Bulk Rate] Ready. Use the panel (bottom-right) or TM menu.');
})();
