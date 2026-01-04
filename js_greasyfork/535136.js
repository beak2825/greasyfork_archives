// ==UserScript==
// @name         Navigation for YouTube Shorts
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Navigate YouTube Shorts using your device's next/prev media keys (including headset).
// @author       CHJ85
// @match        https://www.youtube.com/shorts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535136/Navigation%20for%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/535136/Navigation%20for%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Inject code into the page context
  function inject(fn) {
    const s = document.createElement('script');
    s.textContent = '(' + fn.toString() + ')()';
    document.documentElement.appendChild(s);
    s.remove();
  }

  // Code that runs directly in YouTube's JS context
  function pageScript() {
    // Simulate ArrowUp/ArrowDown
    function simulateArrowKey(dir) {
      const key = dir === 'next' ? 'ArrowDown' : 'ArrowUp';
      document.dispatchEvent(new KeyboardEvent('keydown', { key, code: key, bubbles: true }));
      //console.log(`[YS Nav] dispatched ${key}`);
    }

    // Clear & re-apply your handlers
    function applyHandlers() {
      if (!navigator.mediaSession || !location.pathname.includes('/shorts/')) return;
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack',  () => simulateArrowKey('next'));
      navigator.mediaSession.setActionHandler('previoustrack', () => simulateArrowKey('previous'));
      //console.log('[YS Nav] handlers applied');
    }

    // Assign dummy metadata once so the session is live
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title:  'YouTube Short',
        artist: 'Unknown',
        album:  'YouTube Shorts'
      });
    } catch (e) {
      // ignore
    }

    // Every 1 second, re-apply handlers (covers loops, SPA nav, metadata resets)
    setInterval(applyHandlers, 1000);

    console.log('[YS Nav] pageScript initialized (v1.9) – re-applying handlers every second');
  }

  inject(pageScript);
})();