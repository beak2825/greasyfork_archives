// ==UserScript==
// @name         YouTube Low Views Remover — optimized fast-clean 4.0 (improved performance)
// @namespace    http://tampermonkey.net/
// @version      4.4.0
// @description  Clean videos with low views + remove slot continuations (with improved performance)
// @match        https://www.youtube.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545618/YouTube%20Low%20Views%20Remover%20%E2%80%94%20optimized%20fast-clean%2040%20%28improved%20performance%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545618/YouTube%20Low%20Views%20Remover%20%E2%80%94%20optimized%20fast-clean%2040%20%28improved%20performance%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ---------- Настройки ----------
  const MIN_VIEWS = 10000;
  const IMMEDIATE_PREFIX = '1755';
  const CLEAN_DELAY_MS = 2000;
  const FAST_CLEAN_MS = 350;
  const FORCE_REMOVE_DELAY_MS = 400;
  const MAX_CANDIDATES = 1200;
  const DEBUG = false;
  const MUTATION_DEBOUNCE_MS = 150;
  // -------------------------------

  const log = (...a) => { if (DEBUG) console.log('[ytrm]', ...a); };

  const VIEW_SPAN_SELECTOR = [
    'span.yt-content-metadata-view-model-wiz__metadata-text',
    '#metadata-line span',
    'yt-formatted-string.view-count',
    'span.view-count'
  ].join(',');
  const CONTINUATION_SELECTOR = 'ytd-continuation-item-renderer';
  const CONTAINERS_SELECTOR = 'ytd-rich-grid-renderer, ytd-item-section-renderer, #secondary';
  const VIEW_TEXT_RE = /просм|просмотр|views|view/i;

  // CSS моментального скрытия
  if (!document.getElementById('ytrm-hidden-style')) {
    const style = document.createElement('style');
    style.id = 'ytrm-hidden-style';
    style.textContent = `
      .ytrm-hidden-slot { display:block!important; overflow:hidden!important; padding:0!important; margin:0!important; opacity:0!important; }
      .ytrm-hidden-slot:not(.ytrm-continuation-preserve) { height:0!important; min-height:0!important; }
      .ytrm-continuation-preserve { height:12px!important; min-height:12px!important; }
    `;
    document.head.appendChild(style);
  }

  function parseViewsText(s) {
    if (!s || typeof s !== 'string') return null;
    s = s.replace(/\u00A0/g,' ').trim().toLowerCase();
    if (/no views|нет просмотров/.test(s)) return 0;
    const m = s.match(/([\d\s.,]+)\s*(k|m|b|тыс|млн|к|м)?/i);
    if (!m) return null;
    let num = parseFloat(m[1].replace(/[\s,]/g, '').replace(',', '.'));
    if (isNaN(num)) return null;
    const suf = (m[2] || '').toLowerCase();
    if (suf.startsWith('k') || suf === 'тыс' || suf === 'к') num *= 1e3;
    else if (suf.startsWith('m') || suf === 'млн' || suf === 'м') num *= 1e6;
    else if (suf.startsWith('b')) num *= 1e9;
    return Math.round(num);
  }

  const isElementVisible = el => !!(el && el.isConnected && el.offsetWidth > 0 && el.offsetHeight > 0);

  function forceHideSlot(slot, options = {}) {
    if (!slot || !slot.isConnected) return;
    if (slot.dataset.ytrm_forced === '1' && !options.force) return;

    const isContinuation = (slot.matches && slot.matches(CONTINUATION_SELECTOR));
    if (isContinuation) {
      try {
        const ghosts = slot.querySelectorAll('yt-img-shadow, .ghost, .ghost-card, .yt-skeleton, .skeleton');
        ghosts.forEach(g => g.remove());
        slot.dataset.ytrm_forced = '1';
        slot.classList.add('ytrm-hidden-slot', 'ytrm-continuation-preserve');
      } catch {}
      return;
    }

    slot.dataset.ytrm_forced = '1';
    slot.classList.add('ytrm-hidden-slot');
    setTimeout(() => requestAnimationFrame(() => {
      try { if (slot.isConnected) slot.remove(); } catch {}
    }), FORCE_REMOVE_DELAY_MS);
  }

  const wrapperCandidates = new Map(); // Map<Element, timestamp>
  const candidateTimers = new WeakMap();

  function trimCandidatesIfNeeded() {
    while (wrapperCandidates.size > MAX_CANDIDATES) {
      const oldestKey = wrapperCandidates.keys().next().value;
      wrapperCandidates.delete(oldestKey);
      candidateTimers.delete(oldestKey);
    }
  }

  const isSlotEmpty = slot => {
    if (!slot || !slot.isConnected) return true;
    try {
      const cards = slot.querySelectorAll('ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-grid-media, yt-img-shadow');
      if (!cards.length) return true;
      for (let c of cards) {
        if (isElementVisible(c)) {
          const title = c.querySelector('#video-title, a#video-title');
          if (title?.textContent.trim()) return false;
          const img = c.querySelector('img, yt-img-shadow img, ytd-thumbnail img');
          if (img?.naturalWidth > 0) return false;
        }
        if (c.querySelector('.skeleton, .yt-skeleton, yt-img-shadow:not([loaded])')) continue;
      }
      return true;
    } catch {
      return false;
    }
  };

  function fastProcessCandidate(slot) {
    try {
      if (!slot || !slot.isConnected) { wrapperCandidates.delete(slot); return; }
      if (slot.matches?.(CONTINUATION_SELECTOR)) { forceHideSlot(slot); wrapperCandidates.delete(slot); return; }
      const attr = slot.getAttribute?.('data-__yt_candidate_ts');
      if (String(attr || '').startsWith(IMMEDIATE_PREFIX)) { forceHideSlot(slot); wrapperCandidates.delete(slot); return; }
      if (isSlotEmpty(slot)) { forceHideSlot(slot); wrapperCandidates.delete(slot); return; }
    } catch {
      wrapperCandidates.delete(slot);
    } finally {
      candidateTimers.delete(slot);
    }
  }

  function markWrapperCandidate(el, ts = Date.now()) {
    if (!el?.isConnected) return;
    const tag = el.tagName.toLowerCase();
    if (!['ytd-rich-item-renderer', 'ytd-rich-grid-row', 'ytd-item-section-renderer'].includes(tag)) return;
    el.setAttribute('data-__yt_candidate_ts', String(ts));
    wrapperCandidates.set(el, ts);
    trimCandidatesIfNeeded();

    if (!candidateTimers.has(el)) {
      candidateTimers.set(el, setTimeout(() => fastProcessCandidate(el), FAST_CLEAN_MS));
    }

    scheduleCleanup(); // теперь cleanup запускается лениво
  }

  function performCleanupCandidates() {
    if (!wrapperCandidates.size) return;
    const now = Date.now();
    for (let [wrapper, ts] of wrapperCandidates) {
      if (!wrapper?.isConnected || (now - ts >= CLEAN_DELAY_MS && (isSlotEmpty(wrapper) || !isElementVisible(wrapper)))) {
        forceHideSlot(wrapper);
        wrapperCandidates.delete(wrapper);
      }
    }
  }

  function processNodeForViews(node) {
    if (!node) return;
    try {
      if (node.matches?.(CONTINUATION_SELECTOR)) { forceHideSlot(node); return; }
      let spans = node.matches?.(VIEW_SPAN_SELECTOR) ? [node] : node.querySelectorAll?.(VIEW_SPAN_SELECTOR) || [];
      const toRemoveCards = [];
      for (let span of spans) {
        if (!span || span.dataset.ytrm_checked) continue;
        span.dataset.ytrm_checked = '1';
        const txt = span.textContent.trim();
        if (!VIEW_TEXT_RE.test(txt)) continue;
        const v = parseViewsText(txt);
        if (v === null || v >= MIN_VIEWS) continue;
        const card = span.closest('yt-lockup-view-model, ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-grid-media');
        if (card && !card.dataset.ytrm_removed) {
          card.dataset.ytrm_removed = '1';
          const parentSlot = card.closest('ytd-rich-item-renderer');
          const parentRow = card.closest('ytd-rich-grid-row');
          if (parentSlot) markWrapperCandidate(parentSlot);
          if (parentRow) markWrapperCandidate(parentRow);
          toRemoveCards.push({ card, parentSlot, parentRow });
        }
      }
      if (toRemoveCards.length) {
        requestAnimationFrame(() => {
          toRemoveCards.forEach(({card}) => card.remove?.());
          toRemoveCards.forEach(({parentSlot, parentRow}) => {
            if (parentSlot && isSlotEmpty(parentSlot)) markWrapperCandidate(parentSlot, Date.now() - CLEAN_DELAY_MS - 1);
            if (parentRow && isSlotEmpty(parentRow)) markWrapperCandidate(parentRow, Date.now() - CLEAN_DELAY_MS - 1);
          });
        });
      }
    } catch {}
  }

  let cleanupTimer = null;
  function scheduleCleanup() {
    if (cleanupTimer) return;
    cleanupTimer = setTimeout(() => {
      cleanupTimer = null;
      performCleanupCandidates();
      targetedImmediateScan();
      if (wrapperCandidates.size > 0) scheduleCleanup();
    }, CLEAN_DELAY_MS);
  }

  function attachObserver() {
    let targets = document.querySelectorAll(CONTAINERS_SELECTOR);
    if (!targets.length) targets = [document.body];

    let mutationQueue = [];
    let debounceTimer = null;

    const obs = new MutationObserver(mutations => {
      for (let m of mutations) {
        m.addedNodes?.forEach(n => { if (n.nodeType === 1) mutationQueue.push(n); });
      }
      if (!mutationQueue.length || document.visibilityState === 'hidden') return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const nodes = mutationQueue.splice(0, mutationQueue.length);
        nodes.forEach(n => processNodeForViews(n));
      }, MUTATION_DEBOUNCE_MS);
    });

    targets.forEach(t => obs.observe(t, { childList: true, subtree: true }));
    return obs;
  }

  function pickupExistingCandidates() {
    try {
      document.querySelectorAll(CONTINUATION_SELECTOR).forEach(n => forceHideSlot(n));
      const now = Date.now();
      document.querySelectorAll('ytd-rich-item-renderer[data-__yt_candidate_ts], ytd-rich-grid-row[data-__yt_candidate_ts], ytd-item-section-renderer[data-__yt_candidate_ts]')
        .forEach(n => markWrapperCandidate(n, Number(n.getAttribute('data-__yt_candidate_ts')) || now));
    } catch {}
  }

  function targetedImmediateScan() {
    try {
      document.querySelectorAll(`ytd-rich-item-renderer[data-__yt_candidate_ts^="${IMMEDIATE_PREFIX}"], ytd-rich-grid-row[data-__yt_candidate_ts^="${IMMEDIATE_PREFIX}"], ${CONTINUATION_SELECTOR}`)
        .forEach(n => { if (!n.dataset.ytrm_forced) forceHideSlot(n); });
    } catch {}
  }

  // fullScan только для видимых
  const io = new IntersectionObserver(entries => {
    for (let e of entries) if (e.isIntersecting) processNodeForViews(e.target);
  });
  function fullScanForViews() {
    try {
      document.querySelectorAll(VIEW_SPAN_SELECTOR).forEach(span => io.observe(span));
    } catch {}
  }

  const observerInstance = attachObserver();
  pickupExistingCandidates();

  window.__ytrm = { parseViewsText, markWrapperCandidate, wrapperCandidates, performCleanupCandidates, forceHideSlot, targetedImmediateScan, fullScanForViews };

  log('yt-lowviews improved started. MIN_VIEWS=', MIN_VIEWS);
})();
