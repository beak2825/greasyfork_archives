// ==UserScript==
// @name         Torn RR Waiting Timers
// @namespace    ASTA_MK via ChatGPT
// @version      1.3
// @description  Show 15:00 countdown timers for new Russian Roulette games "Waiting for an opponent..."
// @license      MIT
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547170/Torn%20RR%20Waiting%20Timers.user.js
// @updateURL https://update.greasyfork.org/scripts/547170/Torn%20RR%20Waiting%20Timers.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DURATION_MS = 15 * 60 * 1000;
  const timers = new Map(); // <--- switched to Map

  const fmt = (ms) => {
    if (ms < 0) ms = 0;
    const sec = Math.floor(ms / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  function makeBadge(initialText) {
    const span = document.createElement('span');
    span.textContent = initialText;
    span.style.cssText = `
      margin-left:6px;
      padding:2px 6px;
      border-radius:6px;
      background:#eef2ff;
      color:#23263a;
      font-size:11px;
      font-weight:600;
      border:1px solid rgba(0,0,0,0.1);
    `;
    return span;
  }

  function attachTimer(row, statusBlock) {
    if (timers.has(row)) return;

    const start = Date.now();
    const badge = makeBadge(`⏳ ${fmt(DURATION_MS)}`);
    statusBlock.appendChild(badge);

    timers.set(row, { start, badge, row });
  }

  function updateTimers() {
    for (const [row, data] of timers.entries()) {
      if (!row.isConnected) {
        timers.delete(row);
        continue;
      }

      const status = row.querySelector('.statusBlock___j4JSQ .text___uzO1d');
      if (!status || !/waiting for an opponent/i.test(status.textContent)) {
        data.badge.remove();
        timers.delete(row);
        continue;
      }

      const remain = data.start + DURATION_MS - Date.now();
      data.badge.textContent = `⏳ ${fmt(remain)}`;
    }
  }

  function scan() {
    document.querySelectorAll('.row___CHcax').forEach((row) => {
      const status = row.querySelector('.statusBlock___j4JSQ .text___uzO1d');
      if (status && /waiting for an opponent/i.test(status.textContent)) {
        attachTimer(row, row.querySelector('.statusBlock___j4JSQ'));
      }
    });
  }

  // Run every second: update existing timers + attach to new rows
  setInterval(() => {
    scan();
    updateTimers();
  }, 1000);
})();
