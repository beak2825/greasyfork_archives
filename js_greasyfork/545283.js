// ==UserScript==
// @name         YouTube Always Show More (Subscriptions)
// @namespace    https://yourscripts.example
// @version      1.2.0
// @license      MIT
// @description  Automatically expands the "Show more" link in the left sidebar Subscriptions on YouTube, and keeps it expanded across navigations.
// @author       ezzdev
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545283/YouTube%20Always%20Show%20More%20%28Subscriptions%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545283/YouTube%20Always%20Show%20More%20%28Subscriptions%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Debounce helper
  const debounce = (fn, wait = 200) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  // Utility: find potential "Show more" toggles inside the left guide
  function findShowMoreButtons(guideRoot) {
    if (!guideRoot) return [];

    const candidates = [];

    // 1) Buttons/controls that are collapsed via aria-expanded
    candidates.push(...guideRoot.querySelectorAll(
      'button[aria-expanded="false"], [role="button"][aria-expanded="false"]'
    ));

    // 2) Buttons with an aria-label or title that mentions "Show more" (case-insensitive)
    candidates.push(...Array.from(guideRoot.querySelectorAll('button, [role="button"], yt-button-shape, tp-yt-paper-item')).filter(el => {
      const label = (el.getAttribute?.('aria-label') || el.getAttribute?.('title') || '').trim().toLowerCase();
      return label.includes('show more') || label.includes('more');
    }));

    // 3) Fallback: elements whose visible text says "Show more" (case-insensitive)
    candidates.push(...Array.from(guideRoot.querySelectorAll('button, [role="button"], yt-button-shape, tp-yt-paper-item')).filter(el => {
      const text = (el.textContent || '').trim().toLowerCase();
      // keep it loose but not too loose
      return text === 'show more' || text === 'more' || text.startsWith('show more');
    }));

    // Only keep ones that are actually visible
    const visible = candidates.filter(el => {
      const rect = el.getBoundingClientRect?.();
      const style = window.getComputedStyle?.(el);
      return rect && rect.width > 0 && rect.height > 0 && style && style.visibility !== 'hidden' && style.display !== 'none';
    });

    // Dedupe
    return Array.from(new Set(visible));
  }

  // Try to identify the left guide root (desktop #guide; fallback to drawer guide)
  function getGuideRoot() {
    return document.querySelector('#guide') ||
           document.querySelector('ytd-guide-renderer') ||
           document.querySelector('ytd-mini-guide-renderer') ||
           null;
  }

  let lastClickTs = 0;

  function ensureExpanded() {
    const now = Date.now();
    // throttle: no more than once every 500ms
    if (now - lastClickTs < 500) return;

    const guideRoot = getGuideRoot();
    if (!guideRoot) return;

    // We only want the Subscriptions "Show more" in the left guide.
    // Click any collapsed toggles we can find; usually there is only one relevant.
    const buttons = findShowMoreButtons(guideRoot);

    // Prefer ones that live inside a Subscriptions section if we can spot it
    const prioritized = buttons.sort((a, b) => {
      const aScore = scoreButton(a);
      const bScore = scoreButton(b);
      return bScore - aScore; // higher score first
    });

    for (const btn of prioritized) {
      try {
        btn.click();
        lastClickTs = Date.now();
        // Small break in case there are multiple collapses
        break;
      } catch (_) {}
    }
  }

  // Heuristic: reward buttons near text that says "Subscriptions" (any language-safe-ish hint)
  function scoreButton(el) {
    let score = 0;

    // aria-expanded false is a good sign
    if (el.getAttribute('aria-expanded') === 'false') score += 3;

    // Is it in the guide?
    if (el.closest('#guide, ytd-guide-renderer, ytd-mini-guide-renderer')) score += 2;

    // Nearby text “Subscriptions”
    const nearbyText = (el.closest('ytd-guide-section-renderer') || el.parentElement)?.textContent?.toLowerCase() || '';
    if (/\bsubscription/.test(nearbyText)) score += 3;

    // Label hints
    const label = (el.getAttribute('aria-label') || el.getAttribute('title') || el.textContent || '').toLowerCase();
    if (label.includes('show more')) score += 2;
    if (label === 'more' || label.includes('more')) score += 1;

    return score;
  }

  // Observe changes in the guide so we can re-expand when YouTube re-renders
  const observeGuide = debounce(() => {
    const guideRoot = getGuideRoot();
    if (!guideRoot) return;

    ensureExpanded();

    // MutationObserver to catch SPA updates or reflows of the guide section
    const mo = new MutationObserver(debounce(() => {
      ensureExpanded();
    }, 200));

    mo.observe(guideRoot, { childList: true, subtree: true });
  }, 250);

  // Hook into YouTube’s SPA navigation events if present
  window.addEventListener('yt-navigate-finish', () => {
    observeGuide();
    // Run a few times after navigation just in case
    setTimeout(ensureExpanded, 200);
    setTimeout(ensureExpanded, 600);
    setTimeout(ensureExpanded, 1200);
  }, { passive: true });

  // Initial attempts after page ready
  const kickOff = () => {
    observeGuide();
    // Try a few times early in case the guide loads late
    let tries = 0;
    const t = setInterval(() => {
      ensureExpanded();
      tries++;
      if (tries >= 10) clearInterval(t);
    }, 400);
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    kickOff();
  } else {
    window.addEventListener('DOMContentLoaded', kickOff, { once: true });
  }
})();
