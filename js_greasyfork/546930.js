// ==UserScript==
// @name        Worldguessr 0.1 Flash Mode
// @version     1.0.0
// @description AI-written script for Worldguessr to play 0.1 second / flash mode in single player
// @author      Me and AI
// @license     MIT
// @match       https://www.worldguessr.com/*
// @namespace https://greasyfork.org/users/1508060
// @downloadURL https://update.greasyfork.org/scripts/546930/Worldguessr%2001%20Flash%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/546930/Worldguessr%2001%20Flash%20Mode.meta.js
// ==/UserScript==

(function () {
  const PEEK_TIME = 1550; // ms to show the view
  const STARTUP_SCAN_DURATION = 5000; // ms to keep scanning for round 1 iframe
  const STARTUP_SCAN_INTERVAL = 100; // ms between scans

  const seen = new WeakMap(); // iframe -> { lastSrc }

  function now() { return Date.now(); }

  function isSVIframe(node) {
    return node &&
           node.nodeType === 1 &&
           node.tagName === 'IFRAME' &&
           node.classList.contains('svframe');
  }

  function hideSV(el) {
    el.style.setProperty('display', 'none', 'important');
  }

  function showSV(el) {
    el.style.removeProperty('display');
  }

  function shouldFlash(iframe) {
    const state = seen.get(iframe);
    const src = iframe.getAttribute('src') || '__no_src__';
    // Only flash if we've never seen this iframe OR src changed
    return !state || state.lastSrc !== src;
  }

  function markFlashed(iframe) {
    seen.set(iframe, { lastSrc: iframe.getAttribute('src') || '__no_src__' });
  }

  function flash(iframe) {
    hideSV(iframe);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        showSV(iframe);
        markFlashed(iframe);
        setTimeout(() => hideSV(iframe), PEEK_TIME);
      });
    });
  }

  function primeAndFlash(iframe) {
    if (!iframe || !shouldFlash(iframe)) return;
    hideSV(iframe);
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      flash(iframe);
    };
    iframe.addEventListener('load', finish, { once: true });
    setTimeout(finish, 200); // fallback if already loaded
  }

  function scanExisting() {
    const iframes = document.querySelectorAll('iframe.svframe');
    if (iframes.length) {
      iframes.forEach(primeAndFlash);
      return true;
    }
    return false;
  }

  // MutationObserver for new iframes or src changes
  const obs = new MutationObserver(() => {
    scanExisting();
  });

  obs.observe(document.body, { childList: true, subtree: true });

  // Startup scan loop for round 1
  const startTime = now();
  const startupScan = setInterval(() => {
    if (scanExisting()) {
      clearInterval(startupScan);
    } else if (now() - startTime > STARTUP_SCAN_DURATION) {
      clearInterval(startupScan);
    }
  }, STARTUP_SCAN_INTERVAL);

  console.log('🚀 Street View flash active (round 1 + later rounds, no infinite loop)');
})();
