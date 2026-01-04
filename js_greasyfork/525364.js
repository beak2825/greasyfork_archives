// ==UserScript==
// @name         Nexus Mods Auto Slow Download
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto-triggers the "Slow download" flow on Nexus Mods file pages.
// @author       NewsGuyTor
// @match        https://*.nexusmods.com/*/mods/*?tab=files*
// @match        https://*.nexusmods.com/*/mods/*/files*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525364/Nexus%20Mods%20Auto%20Slow%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/525364/Nexus%20Mods%20Auto%20Slow%20Download.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STOP_AFTER_MS = 15000;   // give it up to 15s on dynamic pages
  const TICK_MS = 400;

  function isVisible(el) {
    if (!el) return false;
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function triggerSlowDownload() {
    const comp = document.querySelector('mod-file-download');
    if (!comp) return false;

    // Easiest & most reliable: dispatch the custom event that the page listens for
    try {
      comp.dispatchEvent(new CustomEvent('slowDownload'));
      console.log('[Nexus Slow DL] Dispatched slowDownload event.');
      return true;
    } catch (_) { /* ignore and try fallback */ }

    // Tiny fallback: click the shadow-DOM button if we can see it
    const root = comp.shadowRoot;
    if (root) {
      const btn = Array.from(root.querySelectorAll('button, a[role="button"], a'))
        .find(el => /slow\s*download/i.test((el.textContent || '').trim()) && isVisible(el) && !el.disabled);
      if (btn) {
        console.log('[Nexus Slow DL] Clicking "Slow download" button (fallback).');
        btn.click();
        return true;
      }
    }
    return false;
  }

  function run() {
    if (triggerSlowDownload()) return;

    // Light-touch polling for dynamic loads
    const start = Date.now();
    const id = setInterval(() => {
      if (triggerSlowDownload() || Date.now() - start > STOP_AFTER_MS) {
        clearInterval(id);
      }
    }, TICK_MS);

    // Also react to DOM mutations without heavy logic
    const mo = new MutationObserver(() => {
      if (triggerSlowDownload()) {
        mo.disconnect();
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), STOP_AFTER_MS);
  }

  // Fire after the page's own listeners are likely attached
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // A tiny delay to land after jQuery ready handlers
    setTimeout(run, 0);
  } else {
    window.addEventListener('DOMContentLoaded', run, { once: true });
  }
})();
