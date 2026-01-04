// ==UserScript==
// @name         NYT Crossword For Small Phones With a Keyboard + XWordInfo Shortcut
// @namespace    some.random.tool
// @version      1.0
// @description  Deletes the three rows of letters from the pop-up, hard-coded mobile keyboard on the NYT's crossword website. Also turns the lifesaver icon into a XWordInfo link (daily full crossword only).
// @match        https://www.nytimes.com/crosswords/game/daily/*
// @match        https://www.nytimes.com/crosswords/game/mini*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546488/NYT%20Crossword%20For%20Small%20Phones%20With%20a%20Keyboard%20%2B%20XWordInfo%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/546488/NYT%20Crossword%20For%20Small%20Phones%20With%20a%20Keyboard%20%2B%20XWordInfo%20Shortcut.meta.js
// ==/UserScript==

(function () {
  function trimKeyboard() {
    const rowsContainer = document.querySelector('.xwd__keyboard .hg-rows');
    if (!rowsContainer) return;
    const rows = rowsContainer.querySelectorAll(':scope > .hg-row');
    if (rows.length <= 1) return;        // already trimmed or not mobile
    for (let i = 0; i < rows.length - 1; i++) {
      rows[i].remove();
    }
  }
  const mo = new MutationObserver(() => {
    trimKeyboard();
    attachXWordInfo();
  });
  mo.observe(document.documentElement, { subtree: true, childList: true });

  trimKeyboard();

  /** Optional: Makes the “lifesaver” (condensed menu) icon open XWordInfo on daily crossword pages. */
  function buildXWIfromURL() {
    // Expect /crosswords/game/daily/YYYY/MM/DD
    const parts = location.pathname.split('/').filter(Boolean);
    const i = parts.indexOf('daily');
    if (i === -1 || parts.length < i + 4) return null;

    const yyyy = parts[i + 1];
    const mm = String(parseInt(parts[i + 2], 10)); // strip leading zeros
    const dd = String(parseInt(parts[i + 3], 10));
    return `https://www.xwordinfo.com/Crossword?date=${encodeURIComponent(`${mm}/${dd}/${yyyy}`)}`;
  }
  
  function attachXWordInfo() {
    if (!/\/crosswords\/game\/daily\//.test(location.pathname)) return;

    const lifesaver = document.querySelector('div.xwd__toolbar--condensedMenu');
    if (!lifesaver || lifesaver.dataset.xwiHooked === '1') return;

    const xwi = buildXWIfromURL();
    if (!xwi) return;
    lifesaver.dataset.xwiHooked = '1';
    lifesaver.style.cursor = 'pointer';
    lifesaver.title = 'Open solution on XWordInfo';

    lifesaver.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      window.open(xwi, '_blank');
    }, true);
  }

  attachXWordInfo();

/** End lifesaver */

  const pushState = history.pushState;
  history.pushState = function () {
    pushState.apply(this, arguments);
    setTimeout(() => { trimKeyboard(); attachXWordInfo(); }, 0);
  };
  window.addEventListener('popstate', () => {
    setTimeout(() => { trimKeyboard(); attachXWordInfo(); }, 0);
  });
})();