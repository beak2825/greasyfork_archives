// ==UserScript==
// @name         UCalgary Card Counter
// @version      5.1
// @description  Each browser tab has its own independent card counter, always starting at 1. No hotkeys, no totals.
// @match        https://cards.ucalgary.ca/card/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/1331386
// @downloadURL https://update.greasyfork.org/scripts/536238/UCalgary%20Card%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/536238/UCalgary%20Card%20Counter.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ===== Per-tab unique storage ===== */
  const TAB_ID =
    sessionStorage.getItem('ucalgaryTabId') ||
    (crypto?.randomUUID?.() || Math.random().toString(36).slice(2));

  sessionStorage.setItem('ucalgaryTabId', TAB_ID);

  const STORAGE_KEY = `ucalgaryVisitedCards_${TAB_ID}`;
  const visited = new Set(JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]'));
  const saveVisited = () => sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]));

  const isCardPage = () => /^\/card\/[^/]+/i.test(location.pathname);
  const getCardIdFromUrl = () => {
    const m = location.pathname.match(/^\/card\/([^/]+)/i);
    return m ? decodeURIComponent(m[1]) : null;
  };

  /* ===== Seed counter at 1 when a tab first opens ===== */
  if (isCardPage()) {
    const id = getCardIdFromUrl();
    if (id && !visited.has(id)) {
      visited.add(id);
      saveVisited();
    }
  }

  /* ===== Badge UI ===== */
  let badge;
  function ensureBadge() {
    if (badge) return;
    badge = document.createElement('div');
    Object.assign(badge.style, {
      position:'fixed', top:'8px', right:'8px',
      padding:'6px 10px',
      background:'#222', color:'#fff',
      font:'14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      borderRadius:'6px',
      cursor:'pointer',
      zIndex:10000,
      opacity:0.92,
      boxShadow:'0 2px 6px rgba(0,0,0,0.25)',
      userSelect:'none',
    });
    badge.title = 'Click to reset this tab’s counter (resets to 1)';
    //badge.addEventListener('click', resetCounter);
    document.body.appendChild(badge);
  }
  const renderBadge = () => { if (badge) badge.textContent = `Cards: ${visited.size}`; };
  const flashBadge = () => badge?.animate?.([{opacity:0.5},{opacity:0.92}], {duration:200});

  function resetCounter() {
    visited.clear();
    const id = getCardIdFromUrl();
    if (id) visited.add(id); // restart at 1
    saveVisited();
    renderBadge();
    flashBadge();
  }

  /* ===== Count on navigation within this tab ===== */
  let lastPath = '';
  function onRouteChange() {
    ensureBadge();
    if (isCardPage()) {
      const id = getCardIdFromUrl();
      if (id && !visited.has(id)) {
        visited.add(id);
        saveVisited();
        flashBadge();
      }
    }
    renderBadge();
  }

  const _ps = history.pushState;
  const _rs = history.replaceState;
  history.pushState = function() { const r = _ps.apply(this, arguments); queueRouteCheck(); return r; };
  history.replaceState = function() { const r = _rs.apply(this, arguments); queueRouteCheck(); return r; };
  window.addEventListener('popstate', queueRouteCheck);
  window.addEventListener('load', queueRouteCheck);

  let routeTimer;
  function queueRouteCheck() {
    const p = location.pathname + location.search;
    if (p === lastPath) return;
    lastPath = p;
    clearTimeout(routeTimer);
    routeTimer = setTimeout(onRouteChange, 100);
  }

  // Initial
  queueRouteCheck();
})();
