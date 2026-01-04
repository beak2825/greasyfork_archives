// ==UserScript==
// @name         Smarter Repost Hider for X
// @namespace    https://github.com/xechostormx/repost-hider
// @version      2.1.1
// @description  Efficiently hides reposts on X with optional keyword filtering
// @match        https://x.com/*
// @match        https://www.x.com/*
// @match        https://mobile.x.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542238/Smarter%20Repost%20Hider%20for%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/542238/Smarter%20Repost%20Hider%20for%20X.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ———————— CONFIG ————————
  const config = {
    debug: false,            // true → console.debug logs
    keywordFilter: []        // e.g. ['spam','ad'] to only hide reposts containing those
  };

  const sel = {
    tweet:    '[data-testid="cellInnerDiv"]',
    repost:   '[data-testid="socialContext"]',
    tweetTxt: '[data-testid="tweetText"]'
  };

  let hiddenCount = 0;
  const log = (...args) => config.debug && console.debug('[RepostHider]', ...args);

  // ———————— CORE LOGIC ————————
  function isRepost(el) {
    return !!el.querySelector(sel.repost);
  }

  function matchesKeywords(el) {
    if (!config.keywordFilter.length) return true;
    const txtEl = el.querySelector(sel.tweetTxt);
    const text  = txtEl?.textContent.toLowerCase() || '';
    return config.keywordFilter.some(k => text.includes(k.toLowerCase()));
  }

  function processTweet(el) {
    // skip if already seen
    if (el.dataset.repostHandled) return;
    el.dataset.repostHandled = '1';

    if (isRepost(el) && matchesKeywords(el)) {
      el.style.display = 'none';
      hiddenCount++;
      log(`Hid repost #${hiddenCount}`, el);
    }
  }

  function scanRoot(root = document.body) {
    root.querySelectorAll(sel.tweet).forEach(processTweet);
  }

  // ———————— DYNAMIC OBSERVER ————————
  const obs = new MutationObserver(muts => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        // if the node itself is a tweet
        if (node.matches && node.matches(sel.tweet)) {
          processTweet(node);
        } else {
          // or contains tweets
          node.querySelectorAll?.(sel.tweet).forEach(processTweet);
        }
      }
    }
  });

  function initObserver() {
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // ———————— SPA NAV HANDLER ————————
  function watchUrlChange() {
    let last = location.href;
    new MutationObserver(() => {
      if (location.href !== last) {
        last = location.href;
        log('URL changed, rescanning feed');
        scanRoot();
      }
    }).observe(document, { childList: true, subtree: true });
  }

  // ———————— BOOTSTRAP ————————
  function init() {
    scanRoot();
    initObserver();
    watchUrlChange();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
