// ==UserScript==
// @name         MaruMori - Selected Items in Study List Counter
// @namespace    https://marumori.io
// @version      1.0
// @description  Shows a floating "x selected" counter while scrolling on the study list manage page
// @author       ChatGPT ( Vibe Coded )
// @match        https://marumori.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marumori.io
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546648/MaruMori%20-%20Selected%20Items%20in%20Study%20List%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/546648/MaruMori%20-%20Selected%20Items%20in%20Study%20List%20Counter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const MANAGE_RE = /^https:\/\/marumori\.io\/study-lists\/[^/]+\/manage(?:[/?#]|$)/;

  // ---------- Styles ----------
  const CSS = `
  #mm-selected-floating {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    left: 12px;
    z-index: 99999;
    background: rgba(20, 20, 20, 0.85);
    color: #fff;
    padding: 10px 12px;
    border-radius: 10px;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.2;
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
    pointer-events: none;
    min-width: 120px;
    text-align: center;
  }
  #mm-selected-floating .mm-label {
    display: block;
    opacity: 0.8;
    font-size: 11px;
    margin-bottom: 2px;
  }
  #mm-selected-floating .mm-count {
    font-weight: 700;
    font-size: 16px;
  }
  @media (max-width: 900px) {
    #mm-selected-floating { display: none; }
  }
  `;

  if (typeof GM_addStyle === 'function') {
    GM_addStyle(CSS);
  } else {
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // ---------- Core feature state ----------
  let active = false;
  let selectedSpan = null;
  let spanObserver = null;
  let pageObserver = null;

  function ensureFloatingBox() {
    let box = document.getElementById('mm-selected-floating');
    if (!box) {
      box = document.createElement('div');
      box.id = 'mm-selected-floating';
      box.innerHTML = `
        <span class="mm-label">Selected</span>
        <span class="mm-count">—</span>
      `;
      document.body.appendChild(box);
    }
    return box;
  }

  function removeFloatingBox() {
    const box = document.getElementById('mm-selected-floating');
    if (box && box.parentNode) box.parentNode.removeChild(box);
  }

  function updateFloatingBox(countText) {
    const box = ensureFloatingBox();
    const countEl = box.querySelector('.mm-count');
    if (countEl && countEl.textContent !== countText) {
      countEl.textContent = countText;
    }
  }

  // Robustly find the "x selected" span
  function findSelectedSpan() {
    const spans = Array.from(document.querySelectorAll('span.highlight'));
    for (const sp of spans) {
      const container = sp.closest('div');
      if (!container) continue;
      const h3 = container.querySelector('h3');
      if (!h3) continue;
      const title = (h3.textContent || '').trim();
      if (/^Study Items$/i.test(title)) {
        return sp;
      }
    }
    const fallback = document.querySelector('.header-counter .highlight');
    return fallback || null;
  }

  function extractSelectedText(span) {
    const raw = (span?.textContent || '').trim();
    return raw.replace(/\s+/g, ' ') || '—';
  }

  function disconnectSpanObserver() {
    if (spanObserver) {
      spanObserver.disconnect();
      spanObserver = null;
    }
  }

  function observeSelectedSpan(span) {
    disconnectSpanObserver();
    if (!span) return;
    updateFloatingBox(extractSelectedText(span));
    spanObserver = new MutationObserver(() => {
      updateFloatingBox(extractSelectedText(span));
    });
    spanObserver.observe(span, { characterData: true, subtree: true, childList: true });
  }

  function rebind() {
    if (!active) return;
    const span = findSelectedSpan();
    if (span !== selectedSpan) {
      selectedSpan = span;
      observeSelectedSpan(selectedSpan);
    }
  }

  function installPageObserver() {
    if (pageObserver) pageObserver.disconnect();
    pageObserver = new MutationObserver(() => {
      rebind();
    });
    pageObserver.observe(document.body, { childList: true, subtree: true });
  }

  function uninstallPageObserver() {
    if (pageObserver) {
      pageObserver.disconnect();
      pageObserver = null;
    }
  }

  // ---------- Activate/Deactivate on matching pages ----------
  function activate() {
    if (active) return;
    active = true;
    ensureFloatingBox();
    installPageObserver();
    // First pass + staggered rebinding in case content streams in
    stabilizationRebind();
  }

  function deactivate() {
    if (!active) return;
    active = false;
    disconnectSpanObserver();
    uninstallPageObserver();
    selectedSpan = null;
    removeFloatingBox();
  }

  function reevaluateRoute() {
    if (MANAGE_RE.test(location.href)) {
      activate();
    } else {
      deactivate();
    }
  }

  // After a route change, SvelteKit may render in phases. Try a few times.
  function stabilizationRebind() {
    // Immediate, then a few delayed tries
    const delays = [0, 50, 150, 400, 1000, 2000];
    delays.forEach(d => setTimeout(rebind, d));
  }

  // ---------- SPA navigation detection ----------
  // A) SvelteKit-native events (best signal)
  window.addEventListener('sveltekit:navigation-start', () => {
    // Nothing to do yet; wait for end
  });
  window.addEventListener('sveltekit:navigation-end', () => {
    // URL likely updated; check and rebind in phases
    reevaluateRoute();
    stabilizationRebind();
  });
  window.addEventListener('sveltekit:navigated', () => {
    // Older/newer SvelteKit fires this when hydrated navigation completes
    reevaluateRoute();
    stabilizationRebind();
  });

  // B) History hooks (general SPA fallback)
  (function installHistoryHooks() {
    const origPush = history.pushState;
    const origReplace = history.replaceState;
    const fire = () => {
      reevaluateRoute();
      stabilizationRebind();
    };
    history.pushState = function () {
      const ret = origPush.apply(this, arguments);
      setTimeout(fire, 0);
      return ret;
    };
    history.replaceState = function () {
      const ret = origReplace.apply(this, arguments);
      setTimeout(fire, 0);
      return ret;
    };
    window.addEventListener('popstate', () => setTimeout(fire, 0));
  })();

  // C) Href poller (belt-and-suspenders)
  (function installHrefPoller() {
    let last = location.href;
    setInterval(() => {
      if (location.href !== last) {
        last = location.href;
        reevaluateRoute();
        stabilizationRebind();
      }
    }, 120);
  })();

  // D) Visibility change (tab restored/back-forward cache)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      reevaluateRoute();
      stabilizationRebind();
    }
  });

  // E) Catch internal link clicks (some routers mutate without history in edge flows)
  document.addEventListener('click', (e) => {
    const a = e.target && (e.target.closest ? e.target.closest('a[href]') : null);
    if (!a) return;
    // If it’s a same-origin in-app link, give it a moment then check
    try {
      const u = new URL(a.href, location.href);
      if (u.origin === location.origin) {
        setTimeout(() => { reevaluateRoute(); stabilizationRebind(); }, 0);
      }
    } catch (_) {}
  }, true);

  // ---------- Boot ----------
  function init() {
    reevaluateRoute();
    // If already on a manage page (cold load), ensure we catch late DOM
    if (active) stabilizationRebind();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
