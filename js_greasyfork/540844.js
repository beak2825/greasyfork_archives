// ==UserScript==
// @name         Claude.ai Bulk Delete Automation
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  One‑click wipe for Claude.ai Recents. Press once; script keeps looping across reloads until nothing is left.
// @match        https://claude.ai/recents*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540844/Claudeai%20Bulk%20Delete%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/540844/Claudeai%20Bulk%20Delete%20Automation.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ========= CONFIG ========= */
  const CLICK_DELAY  = 1500;  // ms between each UI click
  const RELOAD_DELAY = 5000;  // ms to wait after confirming delete before reload
  const START_DELAY  = 2000;  // ms after page load before auto-resume kicks in
  const BUTTON_LABEL = 'Bulk Delete';
  /* ========================== */

  // Use sessionStorage so the flag clears when the last Claude tab closes
  const storage  = sessionStorage;
  const FLAG_KEY = '__bulkDeleteActive';   // key to persist automation state within the session

  const wait = ms => new Promise(r => setTimeout(r, ms));

  /**
   * Clicks the first <button> that satisfies the predicate, polling until timeout.
   * @returns {boolean} true if clicked; false on timeout.
   */
  async function clickWhenAvailable(predicate, timeout = 10000) {
    const start = performance.now();
    while (performance.now() - start < timeout) {
      const btn = [...document.querySelectorAll('button')].find(predicate);
      if (btn) {
        btn.click();
        return true;
      }
      await wait(250);
    }
    return false;
  }

  /**
   * Runs a single delete cycle. Returns true if it executed (items were present),
   * false if it found nothing to delete (Select button missing) so we can stop.
   */
  async function runOnce(btnEl) {
    if (btnEl) btnEl.textContent = 'Running…';

    // 1) "Select" (first conversation row)
    if (!await clickWhenAvailable(b => b.textContent.trim() === 'Select')) return false;
    await wait(CLICK_DELAY);

    // 2) "Select all"
    if (!await clickWhenAvailable(b => b.textContent.trim() === 'Select all')) return false;
    await wait(CLICK_DELAY);

    // 3) "Delete Selected"
    if (!await clickWhenAvailable(b => /Delete\s+Selected/i.test(b.textContent))) return false;
    await wait(CLICK_DELAY);

    // 4) Modal confirm "Delete"
    if (!await clickWhenAvailable(b => b.dataset.testid === 'delete-modal-confirm')) return false;

    // 5) Wait for backend, then refresh to pick up next batch
    setTimeout(() => location.reload(), RELOAD_DELAY);
    return true;  // a reload is imminent; automation continues on next page load
  }

  /** Inject a floating control button (once) */
  function addControlButton() {
    if (document.getElementById('__bulkDeleteBtn')) return;

    const btn = document.createElement('button');
    btn.id = '__bulkDeleteBtn';
    btn.textContent = BUTTON_LABEL;
    Object.assign(btn.style, {
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 9999,
      background: '#d32f2f',
      color: '#fff',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
    });

    btn.addEventListener('click', async () => {
      if (storage.getItem(FLAG_KEY)) return;   // already running
      storage.setItem(FLAG_KEY, '1');
      btn.disabled = true;
      await runOnce(btn);  // may trigger reload
    });

    document.body.appendChild(btn);
  }

  /** Auto-resume if the flag is set (user already started automation earlier) */
  async function autoResume() {
    if (!storage.getItem(FLAG_KEY)) return;            // not active
    const btn = document.getElementById('__bulkDeleteBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Running…';
    }

    await wait(START_DELAY);
    const worked = await runOnce(btn);
    if (!worked) {
      // No more items — stop automation
      storage.removeItem(FLAG_KEY);
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Done';
      }
    }
  }

  window.addEventListener('load', () => {
    addControlButton();
    autoResume();
  });
})();