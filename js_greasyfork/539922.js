// ==UserScript==
// @name         DAZN FanZone Remover
// @namespace    https://github.com/ImElio/dazn-fanzone-remover
// @version      1.0.1
// @description  Hides the DAZN FanZone
// @author       Elio & Shokkino
// @license      MIT
// @homepageURL  https://github.com/ImElio/dazn-fanzone-remover
// @supportURL   https://github.com/ImElio/dazn-fanzone-remover/issues
// @match        https://www.dazn.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549475/DAZN%20FanZone%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/549475/DAZN%20FanZone%20Remover.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** Set to true for verbose diagnosis in the console (no runtime impact when false). */
  const DEBUG = false;

  /** Attribute used to mark already-hidden containers (idempotency). */
  const HIDDEN_ATTR = 'data-fz-hidden';

  /**
   * DEPRECATED (old, brittle literal match):
   *   const FANZONE_RE = null; // not used (strict equality only)
   *
   * FIX: Accept both "FanZone" and "Fan Zone" (any case), because some UIs compose the label inside sentences.
   */
  const FANZONE_RE  = /\bfan\s?zone\b/i;

  /**
   * FIX: Secondary signal — chat input placeholders are localized but stable (“Inizia a scrivere…”, “Write a message…”).
   * This helps when the visible label isn't an isolated "FanZone" node.
   */
  const INPUT_RE    = /(scriv|write|message|messag)/i;

  const log = (...args) => { if (DEBUG) console.info('[DAZN FanZone Remover]', ...args); };
  const isVisible = (el) => !!el && el.offsetParent !== null;

  /**
   * pickContainer(from)
   *
   * DEPRECATED (oversimplified; risk of blank screen):
   *   // const container = from.closest('aside') || from.closest('div');
   *   // container.style.display = 'none';
   * Reason: climbing blindly to 'div' could target a large layout wrapper that also hosts the <video> player.
   *
   * FIX: Prefer semantic sidebars (ASIDE / role="complementary") when they do NOT contain <video>.
   *      Otherwise, climb a few levels and pick the first wrapper that does NOT include <video>.
   *      This preserves the player layout, preventing black screens.
   */
  function pickContainer(from) {
    if (!from) return null;

    // Prefer semantic wrappers (most UIs wrap sidebars as <aside> or role="complementary").
    const prefer = from.closest('aside, [role="complementary"]');
    if (prefer && !prefer.querySelector('video')) return prefer;

    // Climb conservatively; stop early at the first safe wrapper.
    let cur = from;
    for (let i = 0; i < 6 && cur; i++) {
      cur = cur.parentElement;
      if (!cur) break;
      if (!cur.querySelector('video')) return cur;
    }

    // Last resort (still avoid <body> and any node that includes <video>).
    const fallback = from.closest('div, section, nav');
    if (fallback && !fallback.querySelector('video') && fallback !== document.body) return fallback;

    return null;
  }

  /**
   * hide(el)
   *
   * DEPRECATED (no idempotency; noisy console):
   *   // el.style.display = 'none';
   *   // console.log('FanZone removed:', el);
   *
   * FIX: Apply display:none with an attribute marker to avoid repeated work/logs across re-renders.
   */
  function hide(el) {
    if (!el || el.hasAttribute(HIDDEN_ATTR)) return;
    el.style.setProperty('display', 'none', 'important');
    el.setAttribute(HIDDEN_ATTR, '1');
    log('hidden:', el);
  }

  /**
   * sweep()
   * Single pass that:
   *  A) finds explicit "FanZone" signals (text or aria-label),
   *  B) uses chat input placeholder as a robust backup signal (localized).
   *
   * DEPRECATED (strict-only text match, misses embedded labels):
   *   // if (node.textContent?.trim() === 'FanZone') { ... }
   *
   * FIX: Combine exact, regex, and aria-label; then pick a safe container via pickContainer().
   */
  function sweep() {
    try {
      document.querySelectorAll('*').forEach(node => {
        if (!isVisible(node)) return;

        const txt  = (node.textContent || '').trim();
        const aria = node.getAttribute ? (node.getAttribute('aria-label') || '') : '';

        // DEPRECATED (strict-only):
        // if (txt === 'FanZone') { const c = node.closest('aside') || node.closest('div'); c.style.display = 'none'; }

        // FIX: tolerate different casings and placements + aria-label
        if (txt === 'FanZone' || aria === 'FanZone' || FANZONE_RE.test(txt)) {
          const container = pickContainer(node);
          if (container) hide(container);
        }
      });

      document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(inp => {
        if (!isVisible(inp)) return;
        const ph = inp.getAttribute('placeholder') || '';
        if (INPUT_RE.test(ph)) {
          const container = pickContainer(inp);
          if (container) hide(container);
        }
      });

    } catch (err) {
      // NOTE: tolerate occasional DOM access errors without breaking the loop.
      if (DEBUG) console.warn('[DAZN FanZone Remover] sweep error:', err);
    }
  }

  /**
   * DEPRECATED (observer only; may miss virtualized updates):
   *   // new MutationObserver(sweep).observe(document.body, { childList: true, subtree: true });
   *
   * FIX: Combine MutationObserver (reactive) with a periodic sweep (proactive),
   *      mirroring the original "observer + setInterval" resiliency but with safer targeting.
   */
  const mo = new MutationObserver(() => sweep());

  function start() {
    if (!document.body) { setTimeout(start, 50); return; }
    mo.observe(document.body, { childList: true, subtree: true });
    sweep();
    setInterval(sweep, 1500);
  }

  start();
})();