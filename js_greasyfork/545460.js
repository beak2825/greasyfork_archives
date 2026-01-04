// ==UserScript==
// @name         T&F Dashboard Reviewer Invite Badges
// @homepage     https://github.com/etShaw-zh/tandf-review-badges
// @namespace    https://rp.tandfonline.com/dashboard/
// @version      1.0.0
// @author       Jianjun Xiao <et_shaw@126.com>
// @description  Displays invite badges next to "Out for Review" in expanded submission cards
// @match        https://rp.tandfonline.com/*
// @run-at       document-start
// @grant        none
// @icon         https://static.rp.tandfonline.com/tandf/images/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545460/TF%20Dashboard%20Reviewer%20Invite%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/545460/TF%20Dashboard%20Reviewer%20Invite%20Badges.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STATE = { submissions: [], byId: new Map(), ready: false };

  const fmt = (iso) => {
    try {
      const d = new Date(iso);
      const p = (n) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
    } catch { return iso; }
  };

  const injectStyles = () => {
    if (document.getElementById('tandf-review-badge-style')) return;
    const style = document.createElement('style');
    style.id = 'tandf-review-badge-style';
    style.textContent = `
      .tandf-review-badges{display:inline-flex;gap:.35rem;margin-left:.5rem;vertical-align:middle;flex-wrap:wrap}
      .tandf-review-badge{display:inline-flex;align-items:center;padding:2px 8px;font-size:12px;line-height:1.4;border-radius:999px;border:1px solid rgba(0,0,0,.15);background:#f5f7ff;color:#2a3cff;white-space:nowrap;cursor:default;user-select:none}
      .tandf-review-badge .rev{font-weight:700;margin-right:.35rem}
    `;
    document.head.appendChild(style);
  };

  // Build an index from API data: store {date, revision} by submissionId
  const buildIndex = () => {
    STATE.byId.clear();
    for (const sub of STATE.submissions || []) {
      const id = String(sub?.submissionId || '').trim();
      if (!id) continue;

      const fallbackRev = Number.isFinite(+sub?.revision) ? +sub.revision : 0;
      const logs = (Array.isArray(sub?.auditLogs) ? sub.auditLogs : [])
        .filter(x => x?.status === 'UNDER_REVIEW' && x?.date)
        .map(x => ({
          date: x.date,
          rev: Number.isFinite(+x?.revision) ? +x.revision : fallbackRev
        }));

      if (!STATE.byId.has(id)) STATE.byId.set(id, { logs: [] });
      STATE.byId.get(id).logs.push(...logs);
    }

    // Sort all logs in ascending order by date
    for (const rec of STATE.byId.values()) {
      rec.logs.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    STATE.ready = true;
  };

  const getSubmissionIdFromExpandedCard = (expandCardEl) => {
    const root = expandCardEl.closest('[id^="submission-"]');
    if (!root) return null;
    const idEl = root.querySelector('.submission.card.collapsed .detail.submission-id span');
    return idEl?.textContent?.trim() || null;
  };

  // Create a render signature: "R{rev}@{date}" for uniqueness between rounds
  const makeSignature = (logs) => {
    const list = Array.isArray(logs) ? logs.slice().sort((a,b)=>new Date(a.date)-new Date(b.date)) : [];
    return list.map(x => `R${x.rev}@${x.date}`).join('|') || 'EMPTY';
  };

  // Create or update badges (with revision number)
  const ensureBadges = (statusEl, logs) => {
    let wrap = statusEl.nextElementSibling;
    const sig = makeSignature(logs);

    if (wrap && wrap.classList.contains('tandf-review-badges')) {
      if (wrap.dataset.sig === sig) return; // No changes
      wrap.dataset.sig = sig;
      wrap.innerHTML = '';
    } else {
      wrap = document.createElement('span');
      wrap.className = 'tandf-review-badges';
      wrap.dataset.sig = sig;
      statusEl.insertAdjacentElement('afterend', wrap);
    }

    const list = (Array.isArray(logs) && logs.length) ? logs : [{ date: '__UNKNOWN__', rev: -1 }];
    list.forEach((item, i) => {
      const badge = document.createElement('span');
      badge.className = 'tandf-review-badge';
      if (item.date === '__UNKNOWN__') {
        badge.textContent = 'Invite: Unknown';
      } else {
        // Format: R{rev} Invite: YYYY-MM-DD HH:mm
        const strong = document.createElement('span');
        strong.className = 'rev';
        strong.textContent = `R${item.rev}`;
        const text = document.createTextNode(`Invite: ${fmt(item.date)}`);
        badge.appendChild(strong);
        badge.appendChild(text);
        badge.title = `UNDER_REVIEW #${i + 1} — R${item.rev} @ ${item.date}`;
        badge.dataset.iso = item.date;
        badge.dataset.rev = String(item.rev);
      }
      wrap.appendChild(badge);
    });
  };

  // Render only inside expanded cards
  const render = () => {
    if (!STATE.ready) return;
    const expandedCards = document.querySelectorAll('.submission.card.expandView');
    expandedCards.forEach((card) => {
      const statusNodes = card.querySelectorAll('.status, .detail.status .info, .tandf-review-status');
      statusNodes.forEach((node) => {
        const text = (node.textContent || '').trim();
        if (!/\bOut\s*for\s*Review\b/i.test(text)) return;

        const subId = getSubmissionIdFromExpandedCard(card);
        if (!subId) return;

        const rec = STATE.byId.get(String(subId));
        ensureBadges(node, rec?.logs || []);
      });
    });
  };

  // MutationObserver with requestAnimationFrame debounce
  // Ignores changes inside our own badge container
  let scheduled = false;
  const scheduleRender = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      render();
    });
  };

  const startObserver = () => {
    const obs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.target && m.target.nodeType === 1) {
          const el = /** @type {Element} */(m.target);
          if (el.closest && el.closest('.tandf-review-badges')) {
            return; // Skip if mutation is inside our container
          }
        }
      }
      scheduleRender();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  };

  // Network interception to capture submission data
  const TARGET = '/v2/metadata/user';
  const _fetch = window.fetch;
  window.fetch = async function (...args) {
    const res = await _fetch.apply(this, args);
    try {
      const req = args[0];
      const url = typeof req === 'string' ? req : (req && req.url) || '';
      if (url.includes(TARGET)) {
        const json = await res.clone().json();
        if (Array.isArray(json)) {
          STATE.submissions = json;
          buildIndex();
          scheduleRender();
        }
      }
    } catch {}
    return res;
  };

  const _open = XMLHttpRequest.prototype.open;
  const _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__tandfURL = url || '';
    return _open.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function () {
    this.addEventListener('load', function () {
      try {
        if ((this.__tandfURL || '').includes(TARGET)) {
          const json = JSON.parse(this.responseText || 'null');
          if (Array.isArray(json)) {
            STATE.submissions = json;
            buildIndex();
            scheduleRender();
          }
        }
      } catch {}
    });
    return _send.apply(this, arguments);
  };

  // Boot sequence: inject styles, start observer, initial render
  const boot = () => { injectStyles(); startObserver(); scheduleRender(); };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();