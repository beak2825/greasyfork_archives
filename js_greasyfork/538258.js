// ==UserScript==
// @name         Indeed Joblist Arrow-Key Navigator
// @namespace    https://tampermonkey.net/
// @version      1.1.0
// @description  Arrow or WASD through job cards; each move auto-opens the card so Indeed’s built-in highlight follows along. H = first • E = last.
// @author       Prismaris
// @match        https://*.indeed.com/*
// @match        https://*.indeed.ca/*
// @match        https://*.indeed.co.uk/*
// @match        https://*.indeed.*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538258/Indeed%20Joblist%20Arrow-Key%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/538258/Indeed%20Joblist%20Arrow-Key%20Navigator.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /**
   * Utility: wait until a selector appears, then run a callback.
   * @param {string} selector
   * @param {(node: Element) => void} done
   */
  const waitFor = (selector, done) => {
    const found = document.querySelector(selector);
    if (found) {
      done(found);
      return;
    }
    const observer = new MutationObserver(() => {
      const node = document.querySelector(selector);
      if (node) {
        observer.disconnect();
        done(node);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  /**
   * True if an element is an editable field in which we should not intercept keys.
   * @param {Element} el
   * @returns {boolean}
   */
  const isEditable = (el) => {
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
  };

  waitFor('#mosaic-provider-jobcards ul', (ul) => {
    const getCards = () => [...ul.querySelectorAll('.cardOutline')];

    /**
     * Clicks / focuses / scrolls the ith card.
     * @param {number} i
     */
    const activate = (i) => {
      const list = getCards();
      if (!list.length) return;

      const idx = Math.max(0, Math.min(i, list.length - 1));
      const target = list[idx];
      const link = target.querySelector('a') || target;

      link.click(); // native highlight + pane
      link.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'center', behavior: 'smooth' });

      currentIndex = idx; // eslint-disable-line no-use-before-define
    };

    /* Determine initial index from Indeed’s own aria-pressed flag. */
    let currentIndex = getCards().findIndex((c) => c.querySelector('[aria-pressed="true"]'));
    if (currentIndex < 0) currentIndex = 0;
    activate(currentIndex);

    /* Keep index valid when cards are lazily added/removed. */
    const listObserver = new MutationObserver(() => {
      const len = getCards().length;
      if (!len) return;
      if (currentIndex >= len) currentIndex = len - 1;
    });
    listObserver.observe(ul, { childList: true, subtree: true });

    /* Key listener */
    window.addEventListener(
      'keydown',
      (event) => {
        if (isEditable(event.target)) return;

        const { key } = event;
        const listLen = getCards().length;
        let handled = false;

        if (['ArrowUp', 'ArrowLeft', 'w', 'a'].includes(key)) {
          activate(currentIndex - 1);
          handled = true;
        } else if (['ArrowDown', 'ArrowRight', 's', 'd'].includes(key)) {
          activate(currentIndex + 1);
          handled = true;
        } else if (key === 'h' || key === 'H') {
          activate(0);
          handled = true;
        } else if (key === 'e' || key === 'E') {
          activate(listLen - 1);
          handled = true;
        }

        if (handled) event.preventDefault();
      },
      true
    );
  });
})();