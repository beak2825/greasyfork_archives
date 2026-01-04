// ==UserScript==
// @name         Instagram Chronological Feed + Stories
// @namespace    ig-home-following-reels-stories
// @version      3.5
// @description  Home opens the chronological Following feed. Reels shows as “Stories” (keeps the original Reels icon) and opens real Home (/) with posts hidden. Any /reels URL hard-redirects to Stories-only. Stories-only turns off away from "/".
// @match        https://www.instagram.com/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544051/Instagram%20Chronological%20Feed%20%2B%20Stories.user.js
// @updateURL https://update.greasyfork.org/scripts/544051/Instagram%20Chronological%20Feed%20%2B%20Stories.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ───────── Config & helpers ───────── */
  const FOLLOWING_URL = 'https://www.instagram.com/?variant=following';
  const STORY_FLAG_SS = 'tmStoriesOnly';      // sessionStorage flag
  const STORY_FLAG_LS = 'tmStoriesOnlyOnce';  // localStorage one-shot
  const STORY_HASH    = '#tmso';              // URL hash marks stories-only
  const NAME_TAG      = '[TM_SO]';            // window.name marker

  const isRoot        = () => location.pathname === '/';
  const onFollowing   = () => location.search.startsWith('?variant=following');
  const inStoriesOnly = () => sessionStorage.getItem(STORY_FLAG_SS) === '1';
  const log           = (...a) => console.info('[IG-TM]', ...a);

  /* ───────── EARLY: hard-redirect every /reels* path to Stories-only Home ───────── */
  if (/^\/reels(\/|$)/.test(location.pathname)) {
    try {
      sessionStorage.setItem(STORY_FLAG_SS, '1');
      localStorage.setItem(STORY_FLAG_LS, '1');
      if (!String(window.name).includes(NAME_TAG)) window.name = NAME_TAG + window.name;
    } catch {}
    location.replace('/' + STORY_HASH);
    return;
  }

  /* ───────── CSS: hide posts in stories-only ───────── */
  (function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .tm-stories-only main article { display: none !important; }
      .tm-stories-only main { min-height: 0 !important; }
    `;
    document.documentElement.appendChild(style);
  })();

  /* ───────── Hiding engine ───────── */
  let mo = null;

  function hidePostsOnce() {
    if (!document.documentElement.classList.contains('tm-stories-only')) return;
    document.querySelectorAll('main article').forEach(el => {
      if (el.dataset.tmHidden) return;
      el.dataset.tmHidden = '1';
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    });
  }

  function startHiding() {
    hidePostsOnce();
    if (mo) return;
    mo = new MutationObserver(() => { if (inStoriesOnly()) hidePostsOnce(); });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function stopHiding() {
    if (mo) { mo.disconnect(); mo = null; }
    document.querySelectorAll('main article[data-tm-hidden="1"]').forEach(el => {
      el.style.display = '';
      el.removeAttribute('aria-hidden');
      delete el.dataset.tmHidden;
    });
  }

  function clearIntentSignals() {
    sessionStorage.removeItem(STORY_FLAG_SS);
    localStorage.removeItem(STORY_FLAG_LS);
    try { if (String(window.name).includes(NAME_TAG)) window.name = String(window.name).replace(NAME_TAG, ''); } catch {}
  }

  function setStoriesOnly(on) {
    if (on) {
      sessionStorage.setItem(STORY_FLAG_SS, '1');
      document.documentElement.classList.add('tm-stories-only');
      startHiding();
      log('Stories-only ON');
    } else {
      document.documentElement.classList.remove('tm-stories-only');
      stopHiding();
      clearIntentSignals();
      log('Stories-only OFF');
    }
  }

  /* ───────── Multi-signal intent for next “/” ───────── */
  function setIntentForNextRoot() {
    sessionStorage.setItem(STORY_FLAG_SS, '1');   // in-tab
    localStorage.setItem(STORY_FLAG_LS, '1');     // one-shot
    try { if (!String(window.name).includes(NAME_TAG)) window.name = NAME_TAG + window.name; } catch {}
  }
  function hasAndConsumeIntentFromURL() {
    if (location.hash === STORY_HASH) {
      history.replaceState(history.state, '', location.pathname + location.search);
      return true;
    }
    return false;
  }
  function hasAndConsumeIntentFromName() {
    try {
      if (String(window.name).includes(NAME_TAG)) {
        window.name = String(window.name).replace(NAME_TAG, '');
        return true;
      }
    } catch {}
    return false;
  }
  function hasAndConsumeIntentFromLS() {
    if (localStorage.getItem(STORY_FLAG_LS) === '1') {
      localStorage.removeItem(STORY_FLAG_LS);
      return true;
    }
    return false;
  }
  function consumeAnyIntent() {
    const signaled = inStoriesOnly() || hasAndConsumeIntentFromURL()
      || hasAndConsumeIntentFromName() || hasAndConsumeIntentFromLS();
    if (signaled) sessionStorage.setItem(STORY_FLAG_SS, '1');
    return signaled;
  }

  /* ───────── Apply policy for current URL ───────── */
  function applyPolicyForLocation() {
    if (onFollowing()) { setStoriesOnly(false); return; }  // never hide posts on Following
    if (isRoot()) {
      if (consumeAnyIntent()) setStoriesOnly(true);
      else location.replace(FOLLOWING_URL);
      return;
    }
    if (inStoriesOnly()) setStoriesOnly(false);
  }

  /* ───────── Relabel ONLY the primary sidebar Reels (with SVG) ───────── */
  function relabelPrimaryReelsAnchor(a) {
    // Keep classes/href (preserves icon + styling). Only change visible label.
    // Find the first text node inside the anchor that equals "Reels".
    const textHolder = [...a.querySelectorAll('span, div')]
      .find(n => n.childElementCount === 0 && n.textContent.trim() === 'Reels');
    if (textHolder) textHolder.textContent = 'Stories';

    // Keep the SVG as-is so the icon remains the Reels glyph.
    // (Optionally adjust accessibility text—commented out to avoid A/B conflicts)
    // const svg = a.querySelector('svg[aria-label="Reels"]');
    // if (svg) {
    //   svg.setAttribute('aria-label', 'Stories');
    //   const title = svg.querySelector('title'); if (title) title.textContent = 'Stories';
    // }
    a.dataset.tmLabeled = '1';
  }

  /* ───────── Wire Home / Reels (icon item only) ───────── */
  function wireNavOnce(root = document) {
    // HOME → Following
    root.querySelectorAll('a[href="/"]:not([data-tm-wired])').forEach(a => {
      a.dataset.tmWired = '1';
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        setStoriesOnly(false);
        location.assign(FOLLOWING_URL);
      }, { capture: true });
    });

    // PRIMARY REELS ITEM: must contain the Reels SVG → relabel to "Stories", keep icon
    root.querySelectorAll('a[href^="/reels"]:not([data-tm-wired])').forEach(a => {
      const hasIcon = !!a.querySelector('svg[aria-label="Reels"], svg title');
      if (!hasIcon) return; // skip text-only Reels links
      a.dataset.tmWired = '1';
      if (!a.dataset.tmLabeled) relabelPrimaryReelsAnchor(a);

      // Intercept clicks to go to stories-only Home
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        setIntentForNextRoot();
        location.assign('/' + STORY_HASH);
      }, { capture: true });
    });

    // TEXT-ONLY / OTHER Reels links (no SVG): intercept click but do not relabel
    root.querySelectorAll('a[href^="/reels"]:not([data-tm-wired-text])').forEach(a => {
      if (a.querySelector('svg[aria-label="Reels"], svg title')) return; // handled above
      a.dataset.tmWiredText = '1';
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        setIntentForNextRoot();
        location.assign('/' + STORY_HASH);
      }, { capture: true });
    });
  }

  wireNavOnce();
  new MutationObserver(m => {
    for (const rec of m) for (const n of rec.addedNodes || [])
      if (n.nodeType === 1) wireNavOnce(n);
  }).observe(document.documentElement, { childList: true, subtree: true });

  /* ───────── Hook SPA navigation ───────── */
  (function hookHistory() {
    const wrap = (fn) => function (...args) {
      const rv = fn.apply(this, args);
      queueMicrotask(applyPolicyForLocation);
      return rv;
    };
    history.pushState    = wrap(history.pushState.bind(history));
    history.replaceState = wrap(history.replaceState.bind(history));
  })();
  window.addEventListener('popstate', applyPolicyForLocation);

  // Initial pass
  applyPolicyForLocation();

  // Keep enforcing hiding if IG swaps content without URL change
  new MutationObserver(() => {
    if (isRoot() && inStoriesOnly()) startHiding();
  }).observe(document.body, { childList: true, subtree: true });
})();