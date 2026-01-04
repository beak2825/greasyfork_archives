// ==UserScript==
// @name         Torn Hospital SUPERHERO
// @namespace    https://www.torn.com/profiles.php?XID=3164010
// @version      1.0.35
// @description  Continue reviving after each click, even after success or failed energy. Filters, QR, min %, page range and more.
// @author       None [3164010]
// @match        https://www.torn.com/hospitalview.php*
// @match        https://m.torn.com/hospitalview.php*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536726/Torn%20Hospital%20SUPERHERO.user.js
// @updateURL https://update.greasyfork.org/scripts/536726/Torn%20Hospital%20SUPERHERO.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const KEYS = {
    qr: 'tc_reviver_qr',
    active: 'tc_reviver_active',
    idle: 'tc_reviver_idle',
    offline: 'tc_reviver_offline',
    pvp: 'tc_reviver_pvp',
    minTime: 'tc_reviver_minTime',
    threshold: 'tc_reviver_threshold',
    pageRange: 'tc_reviver_pageRange',
  };
  const attempted = new Set();

  const load = (key, def = true) => JSON.parse(localStorage.getItem(key)) ?? def;
  const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  function showError(message) {
    let errBox = document.querySelector('#revive-error-box');
    if (!errBox) {
      errBox = document.createElement('div');
      errBox.id = 'revive-error-box';
      errBox.style.color = 'red';
      errBox.style.fontWeight = 'bold';
      errBox.style.marginTop = '4px';
      document.querySelector('.reviver-bar')?.appendChild(errBox);
    }
    errBox.textContent = message;
  }

  function parseTime(txt) {
    const h = /(\d+)h/.exec(txt);
    const m = /(\d+)m/.exec(txt);
    return (h ? +h[1] : 0) * 60 + (m ? +m[1] : 0);
  }

  function getCurrentPage() {
    const match = location.hash.match(/start=(\d+)/);
    return match ? Math.floor(parseInt(match[1]) / 50) + 1 : 1;
  }

  function navigateToPage(pageNum) {
    const offset = (pageNum - 1) * 50;
    const hash = offset ? `#start=${offset}` : '';
    location.hash = hash;
  }

  function getNextReviveCandidate() {
    const visible = [...document.querySelectorAll('.user-info-list-wrap > li')].filter(li => li.style.display !== 'none');
    for (const li of visible) {
      const idMatch = li.innerHTML.match(/XID=(\d+)/);
      const id = idMatch ? idMatch[1] : null;
      if (id && !attempted.has(id)) return { id, li };
    }
    return null;
  }

  function goToNextPage() {
    const [startStr, endStr] = (load(KEYS.pageRange, '1-3') || '1-3').split('-');
    const start = parseInt(startStr) || 1;
    const end = parseInt(endStr) || start;
    let current = getCurrentPage();
    let nextPage = current + 1 > end ? start : current + 1;
    navigateToPage(nextPage);
  }

  function handleRevive() {
    const qr = load(KEYS.qr, true);
    const threshold = parseFloat(load(KEYS.threshold, 0)) || 0;

    const confirmBox = document.querySelector('.confirm-revive[style*="block"]');
    const confirmYes = confirmBox?.querySelector('.action-yes');
    const text = confirmBox?.textContent || '';
    const match = text.match(/(\d+\.?\d*)%/);
    const chance = match ? parseFloat(match[1]) : 100;

    if (confirmBox) {
      if (!qr) return;
      if (text.includes("not enough energy")) {
        showError("You do not have enough energy to revive.");
        return;
      }
      if (chance < threshold) {
        confirmBox.querySelector('.action-no')?.click();
        const next = getNextReviveCandidate();
        if (next) {
          attempted.add(next.id);
          setTimeout(handleRevive, 100);
        } else {
          goToNextPage();
        }
        return;
      }
      confirmYes?.click();
      setTimeout(() => {
        const next = getNextReviveCandidate();
        if (next) {
          attempted.add(next.id);
          setTimeout(handleRevive, 100);
        } else {
          goToNextPage();
        }
      }, 400);
      return;
    }

    const next = getNextReviveCandidate();
    if (next) {
      attempted.add(next.id);
      next.li.querySelector('a.revive')?.click();
      return;
    }

    goToNextPage();
  }

  function applyFilter() {
    const show = {
      active: load(KEYS.active, true),
      idle: load(KEYS.idle, true),
      offline: load(KEYS.offline, false),
    };
    const pvp = load(KEYS.pvp, false);
    const minTime = parseInt(load(KEYS.minTime, 0)) || 0;

    document.querySelectorAll('.user-info-list-wrap > li').forEach(li => {
      const statusIcon = li.querySelector('#iconTray li')?.title || '';
      const status = statusIcon.includes('Online') ? 'active' : statusIcon.includes('Idle') ? 'idle' : 'offline';
      const canRevive = li.querySelector('a.revive') && !li.querySelector('a.revive').classList.contains('reviveNotAvailable');
      const reason = li.querySelector('.reason')?.innerText || '';
      const time = parseTime(li.querySelector('.time')?.innerText || '');
      const hidePVP = !pvp && reason.includes("Hospitalized");
      const tooShort = (minTime > 0) && time < minTime * 60;

      li.style.display = (canRevive && show[status] && !hidePVP && !tooShort) ? '' : 'none';
    });
  }

  function createUI() {
    const style = document.createElement('style');
    style.textContent = `
      .reviver-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 6px;
        margin-bottom: 0.5rem;
        backdrop-filter: blur(4px);
        align-items: center;
        background: rgba(0,0,0,0.3);
        z-index: 10;
      }
      .reviver-bar button {
        background: #222;
        border: 1px solid #444;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 13px;
        font-weight: bold;
        color: #eee;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.4);
      }
      .reviver-bar button.active {
        background: #28a745;
        border-color: #1e7e34;
        color: #fff;
        box-shadow: 0 0 6px #28a745;
      }
      .reviver-bar button#revive-btn {
        background: #a32828;
        color: #fff;
        border-color: #822020;
      }
      .reviver-bar input {
        width: 50px;
        padding: 4px;
        font-size: 13px;
        background: #111;
        border: 1px solid #555;
        border-radius: 4px;
        color: #fff;
        text-align: center;
      }
    `;
    document.head.appendChild(style);

    const bar = document.createElement('div');
    bar.className = 'reviver-bar';

    ['qr', 'active', 'idle', 'offline', 'pvp'].forEach(key => {
      const btn = document.createElement('button');
      btn.textContent = key.toUpperCase();
      btn.classList.toggle('active', load(KEYS[key], key !== 'offline' && key !== 'pvp'));
      btn.onclick = () => {
        const val = !load(KEYS[key]);
        save(KEYS[key], val);
        btn.classList.toggle('active', val);
        applyFilter();
      };
      bar.appendChild(btn);
    });

    const reviveBtn = document.createElement('button');
    reviveBtn.textContent = 'Revive';
    reviveBtn.id = 'revive-btn';
    reviveBtn.onclick = handleRevive;
    bar.appendChild(reviveBtn);

    ['threshold', 'minTime', 'pageRange'].forEach(k => {
      const input = document.createElement('input');
      input.placeholder = k === 'threshold' ? '%' : (k === 'minTime' ? 'h' : '1-3');
      input.value = load(KEYS[k], '');
      input.oninput = () => save(KEYS[k], input.value);
      bar.appendChild(input);
    });

    document.querySelector('.userlist-wrapper')?.parentElement.prepend(bar);
  }

  function init() {
    createUI();
    applyFilter();
    const wrap = document.querySelector('.userlist-wrapper');
    if (wrap) new MutationObserver(applyFilter).observe(wrap, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
