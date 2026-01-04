// ==UserScript==
// @name         Hearthstone Leaderboard Rating Navigator
// @namespace    https://hearthstone.blizzard.com/
// @version      1.0.0
// @description  Jump to the page containing a target rating (MMR) using bounded binary search. UI injected into LeaderboardsFilters; live status shown bottom-right.
// @match        https://hearthstone.blizzard.com/community/leaderboards*
// @match        https://hearthstone.blizzard.com/*/community/leaderboards*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544568/Hearthstone%20Leaderboard%20Rating%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/544568/Hearthstone%20Leaderboard%20Rating%20Navigator.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ------- Configuration -------
  const UI_ID = 'hs-rating-navigator';
  const STATUS_ID = 'hs-rating-navigator-status';
  const STATE_KEY = 'hsRatingSearchState';
  const MAX_STEPS = 50; // safety cap
  const TABLE_SELECTOR = "[class*='LeaderboardsTable-Rendered']";
  const FILTERS_SELECTOR = ".LeaderboardsFilters";
  const ROW_SELECTOR = ".row";
  const COL_RANK_SELECTOR = ".col-rank";
  const COL_RATING_SELECTOR = ".col-rating";
  const PAGINATION_CONTAINER = ".PaginationContainer";
  const MIN_RATING = 8000;

  // ------- Utilities -------
  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  function getCurrentPage() {
    const url = new URL(location.href);
    const p = parseInt(url.searchParams.get('page') || '1', 10);
    return Number.isFinite(p) && p >= 1 ? p : 1;
  }

  function writeState(s) {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(s));
  }

  function readState() {
    try {
      const raw = sessionStorage.getItem(STATE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function clearState() {
    sessionStorage.removeItem(STATE_KEY);
  }

  function ensureFiltersContainer() {
    return document.querySelector(FILTERS_SELECTOR);
  }

  function ensureTableContainer() {
    return document.querySelector(TABLE_SELECTOR);
  }

  async function waitForTable(timeoutMs = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const table = ensureTableContainer();
      if (table) {
        const rows = table.querySelectorAll(ROW_SELECTOR);
        if (rows && rows.length > 0) return table;
      }
      await sleep(100);
    }
    return ensureTableContainer();
  }

  async function waitForPagination(timeoutMs = 8000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const maxPage = getMaxPageFromUI();
      if (maxPage != null) return maxPage;
      await sleep(100);
    }
    return getMaxPageFromUI();
  }

  function getMaxPageFromUI() {
    const cont = document.querySelector(PAGINATION_CONTAINER);
    if (!cont) return null;
    const btns = Array.from(cont.querySelectorAll('button'));
    let maxNum = null;
    for (const b of btns) {
      const t = (b.textContent || '').trim();
      const n = parseInt(t, 10);
      if (Number.isFinite(n)) {
        if (maxNum == null || n > maxNum) maxNum = n;
      }
    }
    return maxNum; // could be null if no numeric buttons yet (single-page case)
  }

  function parsePage() {
    const table = ensureTableContainer();
    if (!table) return null;

    const rows = Array.from(table.querySelectorAll(ROW_SELECTOR));
    const parsed = [];
    for (const r of rows) {
      const rankEl = r.querySelector(COL_RANK_SELECTOR);
      const ratingEl = r.querySelector(COL_RATING_SELECTOR);
      if (!rankEl || !ratingEl) continue;

      const rank = parseInt((rankEl.textContent || '').trim().replace(/[, ]+/g, ''), 10);
      const rating = parseInt((ratingEl.textContent || '').trim().replace(/[, ]+/g, ''), 10);
      if (Number.isFinite(rank) && Number.isFinite(rating)) {
        parsed.push({ row: r, rank, rating });
      }
    }
    if (parsed.length === 0) return null;

    // ranks ascend down the page; ratings descend with rank
    parsed.sort((a, b) => a.rank - b.rank);
    const ratings = parsed.map(p => p.rating);
    const minRating = Math.min(...ratings);
    const maxRating = Math.max(...ratings);

    return {
      rows: parsed,
      minRating,
      maxRating,
      minRank: parsed[0].rank,
      maxRank: parsed[parsed.length - 1].rank,
      count: parsed.length
    };
  }

  function highlightByRating(targetRating) {
    const table = ensureTableContainer();
    if (!table) return false;

    const rows = Array.from(table.querySelectorAll(ROW_SELECTOR)).map(r => {
      const ratingEl = r.querySelector(COL_RATING_SELECTOR);
      const rankEl = r.querySelector(COL_RANK_SELECTOR);
      if (!ratingEl || !rankEl) return null;
      const rating = parseInt((ratingEl.textContent || '').trim().replace(/[, ]+/g, ''), 10);
      const rank = parseInt((rankEl.textContent || '').trim().replace(/[, ]+/g, ''), 10);
      if (!Number.isFinite(rating) || !Number.isFinite(rank)) return null;
      return { r, rating, rank };
    }).filter(Boolean);

    if (!rows.length) return false;

    // exact match preferred; otherwise nearest rating (if tie, prefer higher rating / better rank)
    let best = null;
    let bestDiff = Infinity;
    for (const x of rows) {
      const diff = Math.abs(x.rating - targetRating);
      if (diff < bestDiff || (diff === bestDiff && x.rating > (best?.rating ?? -Infinity))) {
        best = x;
        bestDiff = diff;
      }
      if (diff === 0) break;
    }
    if (!best) return false;

    const elem = best.r;
    elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    elem.style.outline = '3px solid gold';
    elem.style.borderRadius = '6px';
    elem.style.background = 'rgba(255, 215, 0, 0.12)';
    return true;
  }

  // ------- UI -------
  function ensureControlUI() {
    if (document.getElementById(UI_ID)) return;

    const filters = ensureFiltersContainer();
    if (!filters) return;

    const wrap = document.createElement('div');
    wrap.id = UI_ID;
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '8px';
    wrap.style.marginLeft = '8px';
    wrap.style.marginRight = '-40px';
    wrap.style.padding = '8px';
    wrap.style.border = '2px solid rgba(255,255,255,0.15)';
    wrap.style.borderRadius = '6px';
    wrap.style.fontFamily = 'Belwe Bold,Open Sans,Helvetica,Arial,sans-serif';
    wrap.style.background = 'rgb(195, 177, 137)';
    wrap.style.boxShadow = 'inset 0px 0px 4px #0000007d';

    const label = document.createElement('label');
    label.textContent = 'Jump to Rating:';
    label.style.whiteSpace = 'nowrap';
    label.style.fontWeight = '600';
    label.style.color = 'rgb(97, 67, 38)';

    const input = document.createElement('input');
    input.type = 'number';
    input.min = String(MIN_RATING);
    input.step = '1';
    input.placeholder = 'e.g., 8200';
    input.style.padding = '4px 8px';
    input.style.width = '120px';
    input.setAttribute('aria-label', 'Target Rating');

    const btn = document.createElement('button');
    btn.textContent = 'Search';
    btn.style.padding = '4px 10px';
    btn.style.cursor = 'pointer';
    btn.style.border = '2px solid rgb(97, 67, 38)';
    btn.style.backgroundColor = 'rgb(240, 223, 182)';
    btn.style.borderRadius = '4px';
    btn.style.color = 'rgb(35, 58, 110)';

    //const stopBtn = document.createElement('button');
    //stopBtn.textContent = 'Stop';
    //stopBtn.style.padding = '4px 10px';
    //stopBtn.style.cursor = 'pointer';

    filters.appendChild(wrap); // append as last child per requirement
    wrap.appendChild(label);
    wrap.appendChild(input);
    wrap.appendChild(btn);
    //wrap.appendChild(stopBtn);

    const st = readState();
    if (st && st.targetRating) input.value = String(st.targetRating);

    btn.addEventListener('click', () => {
      const val = parseInt((input.value || '').trim(), 10);
      if (!Number.isFinite(val) || val < MIN_RATING) {
        setStatus(`Enter a rating ≥ ${MIN_RATING}.`);
        return;
      }
      startSearch(val);
    });

    //stopBtn.addEventListener('click', () => stopSearch('Stopped.'));

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = parseInt((input.value || '').trim(), 10);
        if (!Number.isFinite(val) || val < MIN_RATING) {
          setStatus(`Enter a rating ≥ ${MIN_RATING}.`);
          return;
        }
        startSearch(val);
      }
    });
  }

  function ensureStatusUI() {
    let box = document.getElementById(STATUS_ID);
    if (box) return box;

    box = document.createElement('div');
    box.id = STATUS_ID;
    box.style.position = 'fixed';
    box.style.right = '12px';
    box.style.bottom = '12px';
    box.style.zIndex = '2147483647';
    box.style.maxWidth = '360px';
    box.style.background = 'rgba(20,22,30,0.9)';
    box.style.backdropFilter = 'blur(4px)';
    box.style.color = '#fff';
    box.style.fontFamily = 'monospace';
    box.style.fontSize = '12px';
    box.style.lineHeight = '1.4';
    box.style.padding = '10px 12px';
    box.style.border = '1px solid rgba(255,255,255,0.2)';
    box.style.borderRadius = '8px';
    box.style.boxShadow = '0 4px 16px rgba(0,0,0,0.35)';
    box.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <strong>Rating Search</strong>
        <button id="${STATUS_ID}-close" style="cursor:pointer;font-family:inherit;font-size:11px;padding:2px 6px;">✕</button>
      </div>
      <div id="${STATUS_ID}-content" style="margin-top:6px;white-space:pre;"></div>
      <div style="margin-top:6px;display:flex;gap:8px;">
        <button id="${STATUS_ID}-step" style="cursor:pointer;font-size:11px;padding:2px 6px;">Step</button>
        <button id="${STATUS_ID}-stop" style="cursor:pointer;font-size:11px;padding:2px 6px;">Stop</button>
      </div>
    `;
    document.body.appendChild(box);

    document.getElementById(`${STATUS_ID}-close`)?.addEventListener('click', () => box.remove());
    document.getElementById(`${STATUS_ID}-stop`)?.addEventListener('click', () => stopSearch('Stopped.'));
    document.getElementById(`${STATUS_ID}-step`)?.addEventListener('click', () => continueSearchStep());

    return box;
  }

  function setStatus(text) {
    ensureStatusUI();
    const el = document.getElementById(`${STATUS_ID}-content`);
    if (el) el.textContent = text;
  }

  // ------- Search control flow (by rating) -------
  function startSearch(targetRating) {
    const currentPage = getCurrentPage();
    const st = {
      active: true,
      targetRating,
      lo: null,      // page known to be "too early" (ratings too high) → need later page
      hi: null,      // page known to be "too late"  (ratings too low)  → need earlier page
      maxPage: null, // discovered from pagination UI
      steps: 0,
      startedAt: Date.now(),
      last: null
    };
    writeState(st);
    setStatus(`Searching for rating ${targetRating}… starting at page ${currentPage}…`);
    continueSearchStep();
  }

  function stopSearch(msg = 'Search ended.') {
    const st = readState();
    if (st) {
      st.active = false;
      writeState(st);
    }
    setStatus(msg);
  }

  function navigate(nextPage, st) {
    // Clamp to discovered bounds
    const maxPage = st.maxPage || getMaxPageFromUI() || null;
    let target = Math.floor(nextPage);
    if (target < 1) target = 1;
    if (maxPage != null && target > maxPage) {
      st.hi = maxPage;
      writeState(st);
      setStatus(renderStatus(st, `Hit max page (${maxPage}).`));
      return finalizeIfConvergedOrStop(st);
    }
    const url = new URL(location.href);
    url.searchParams.set('page', String(target));
    location.assign(url.toString());
  }

  function renderStatus(st, prefix = '') {
    const last = st.last;
    const lines = [];
    if (prefix) lines.push(prefix);
    lines.push(`target rating: ${st.targetRating}`);
    lines.push(`page:          ${last ? last.page : getCurrentPage()}  steps: ${st.steps}`);
    if (st.lo != null || st.hi != null) {
      lines.push(`bounds (pages): [${st.lo ?? '?'} .. ${st.hi ?? '?'}]`);
    }
    if (last) {
      const rr = `ratings ${last.minRating}–${last.maxRating}`;
      const ranks = `ranks ${last.minRank}–${last.maxRank}`;
      lines.push(`range: ${rr} | ${ranks}`);
      if (st.maxPage) lines.push(`maxPage discovered: ${st.maxPage}`);
    }
    return lines.join('\n');
  }

  async function continueSearchStep() {
    const st = readState();
    if (!st || !st.active) return;

    ensureStatusUI();

    await waitForTable(15000);
    const discoveredMax = await waitForPagination(6000);
    if (discoveredMax != null && st.maxPage !== discoveredMax) {
      st.maxPage = discoveredMax;
      writeState(st);
      // Initialize global bounds if unknown
      if (st.lo == null) st.lo = 1;
      if (st.hi == null) st.hi = discoveredMax;
    }

    const currentPage = getCurrentPage();
    const page = parsePage();
    if (!page) {
      st.steps++;
      writeState(st);
      if (st.steps > MAX_STEPS) return stopSearch('No rows found. Aborting.');
      setStatus(renderStatus(st, `Page ${currentPage}: no rows found.`));
      return;
    }

    const { minRating, maxRating, minRank, maxRank, count } = page;
    st.last = { page: currentPage, minRating, maxRating, minRank, maxRank, rows: count };
    st.steps++;
    writeState(st);

    // Found target page? (ratings are descending with earlier pages)
    if (st.targetRating >= minRating && st.targetRating <= maxRating) {
      setStatus(renderStatus(st, `Found page ${currentPage}.`));
      highlightByRating(st.targetRating);
      st.active = false;
      writeState(st);
      return;
    }

    // Decide direction:
    // - If target > maxRating: need earlier page (smaller page index) → tighten hi
    // - If target < minRating: need later   page (larger page index) → tighten lo
    if (st.targetRating > maxRating) {
      st.hi = currentPage;
      writeState(st);
    } else if (st.targetRating < minRating) {
      st.lo = currentPage;
      writeState(st);
    }

    // Choose next by binary search if we know both bounds; otherwise, try to discover bounds from maxPage.
    let next;
    if (st.lo != null && st.hi != null) {
      next = Math.floor((st.lo + st.hi) / 2);
    } else if (st.maxPage != null) {
      // Fallback to midpoint of [1..maxPage]
      next = Math.floor((1 + st.maxPage) / 2);
    } else {
      // Without maxPage, expand conservatively
      next = st.targetRating > maxRating ? Math.max(1, currentPage - 1) : currentPage + 1;
    }

    setStatus(renderStatus(st, `Narrowing → page ${next}`));
    if (next === currentPage || st.steps > MAX_STEPS) return finalizeIfConvergedOrStop(st);
    return navigate(next, st);
  }

  function finalizeIfConvergedOrStop(st) {
    st.active = false;
    writeState(st);
    setStatus(renderStatus(st, 'Converged on bound. Try an adjacent page if needed.'));
  }

  // ------- Boot -------
  function init() {
    ensureControlUI();
    ensureStatusUI();

    const st = readState();
    if (st && st.active) {
      continueSearchStep();
    } else {
      // Show current page summary
      waitForTable(6000).then(() => {
        const p = getCurrentPage();
        const info = parsePage();
        if (info) {
          setStatus(`Idle. Page ${p} ratings ${info.minRating}–${info.maxRating} (${info.count} rows) | ranks ${info.minRank}–${info.maxRank}`);
        } else {
          setStatus('Idle. Waiting for table…');
        }
        waitForPagination(4000).then(mp => {
          if (mp != null) setStatus(`${document.getElementById(`${STATUS_ID}-content`).textContent}\nmaxPage discovered: ${mp}`);
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-inject if site re-renders
  const mo = new MutationObserver(() => {
    if (!document.getElementById(UI_ID)) ensureControlUI();
    if (!document.getElementById(STATUS_ID)) ensureStatusUI();
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
