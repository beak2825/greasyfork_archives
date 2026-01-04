// ==UserScript==
// @name         Sort Reddit home feed by whatever you want, persistently
// @namespace    plennhar-sort-reddit-home-feed-by-whatever-you-want-persistently
// @version      1.0
// @description  Forces Reddit Home to open with your last‑chosen sort (Best, Hot, New, Top, Rising) by replacing the functionality of the existing dropdown on the new Reddit home page.
// @author       Plennhar
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/541114/Sort%20Reddit%20home%20feed%20by%20whatever%20you%20want%2C%20persistently.user.js
// @updateURL https://update.greasyfork.org/scripts/541114/Sort%20Reddit%20home%20feed%20by%20whatever%20you%20want%2C%20persistently.meta.js
// ==/UserScript==
// SPDX-FileCopyrightText: 2025 Plennhar
// SPDX-License-Identifier: GPL-3.0-or-later

(() => {
  const SORT_KEY     = 'preferredHomeSort';
  const DEFAULT_SORT = 'best';                     // first‑install fallback
  const sortMap = {                               // path for each sort
    best:   '/best/?feed=home',
    hot:    '/hot/?feed=home',
    new:    '/new/?feed=home',
    top:    '/top/?feed=home',
    rising: '/rising/?feed=home'
  };

  let preferred = (GM_getValue(SORT_KEY, DEFAULT_SORT) || DEFAULT_SORT).toLowerCase();

  // Redirecting
  function isHomeLike(pathname) {
    const p = pathname.replace(/\/+$/, '').toLowerCase(); // trim trailing slash
    return (
      p === '' ||                               // "/"
      Object.keys(sortMap).some(s => p === '/' + s)
    );
  }

  function enforcePreferred() {
    if (!isHomeLike(location.pathname)) return;
    const target = sortMap[preferred];
    if (!target) return;                         // unknown preference
    const current = location.pathname + location.search;
    if (!current.startsWith(target)) {
      location.replace(target);
    }
  }

  // Run immediately and whenever SPA navigation runs
  enforcePreferred();
  const origPushState = history.pushState;
  history.pushState = function () {
    origPushState.apply(this, arguments);
    setTimeout(enforcePreferred, 0);
  };
  window.addEventListener('popstate', enforcePreferred);

  // Dropdown hook
  function hookDropdown() {
    const dropdown = document.querySelector('shreddit-sort-dropdown');
    if (!dropdown || dropdown.dataset.hooked) return; // not yet or already
    dropdown.dataset.hooked = 'true';

    // Capturing link clicks inside the dropdown BEFORE Reddit's router runs
    dropdown.addEventListener(
      'click',
      (ev) => {
        const anchor = ev.target.closest('a[href*="/?feed=home"]');
        if (!anchor) return;
        const m = anchor.getAttribute('href').match(/^\/([^\/]+)\/\?feed=home/);
        if (m) {
          preferred = m[1].toLowerCase();
          GM_setValue(SORT_KEY, preferred);
        }
        // let the click proceed normally (navigation or pushState)
      },
      true // capture phase so this runs first
    );
  }

  // Observe DOM for the dropdown, then once it exists hook into it once
  const observer = new MutationObserver(hookDropdown);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
