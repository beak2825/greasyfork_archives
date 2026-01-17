// ==UserScript==
// @name         Hide Unread Counter in WhatsApp Archived Chat
// @namespace    https://yourdomain.com/
// @version      1.1
// @description  Hides the unread message counter in the "Archived" chat row in WhatsApp Web without removing the archive itself. Icon-based for reliability.
// @author       DiCK
// @match        https://web.whatsapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534537/Hide%20Unread%20Counter%20in%20WhatsApp%20Archived%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/534537/Hide%20Unread%20Counter%20in%20WhatsApp%20Archived%20Chat.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Identify the Archived row button by its archive icon (WhatsApp changes icon names over time).
  const isArchiveButton = (btn) => {
    if (!btn || btn.tagName !== 'BUTTON') return false;

    // Primary: data-icon on the icon wrapper span.
    const iconSpan = btn.querySelector('span[data-icon]');
    const iconName = iconSpan?.getAttribute('data-icon') || '';
    if (/archive/i.test(iconName)) return true;

    // Fallback: svg <title> often carries the icon name as well.
    const svgTitle = btn.querySelector('svg title');
    const titleText = svgTitle?.textContent || '';
    if (/archive/i.test(titleText)) return true;

    return false;
  };

  const hideArchiveCounter = (root = document) => {
    const buttons = root.querySelectorAll ? root.querySelectorAll('button') : [];
    for (const btn of buttons) {
      if (!isArchiveButton(btn)) continue;

      // Hide badge containers whose aria-label starts with a number (language-agnostic).
      const labelled = btn.querySelectorAll('span[aria-label]');
      for (const el of labelled) {
        const al = (el.getAttribute('aria-label') || '').trim();
        if (/^\d+\b/.test(al)) el.style.display = 'none';
      }

      // Extra fallback: hide spans whose text is only digits (e.g., "1").
      const allSpans = btn.querySelectorAll('span');
      for (const s of allSpans) {
        if (/^\s*\d+\s*$/.test(s.textContent || '')) s.style.display = 'none';
      }
    }
  };

  // Run once on load.
  hideArchiveCounter(document);

  // Throttle DOM observer work to avoid excessive reruns.
  let scheduled = false;
  const scheduleRun = (node) => {
    if (scheduled) return;
    scheduled = true;

    const run = () => {
      scheduled = false;
      hideArchiveCounter(node || document);
    };

    (window.requestIdleCallback || window.requestAnimationFrame)(run);
  };

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.addedNodes && m.addedNodes.length) {
        scheduleRun(m.target || document);
        break;
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
