// ==UserScript==
// @name         DSG (Drag Search & Go) v1.7
// @namespace    https://deeone.blog
// @version      1.7
// @description  Boosts productivity by letting you have selected text or links to instantly search or open
// @author       deoone
// @match        *://*/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/536879/DSG%20%28Drag%20Search%20%20Go%29%20v17.user.js
// @updateURL https://update.greasyfork.org/scripts/536879/DSG%20%28Drag%20Search%20%20Go%29%20v17.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const SEARCH_BASE = 'https://www.google.com/search?q=';
  let isMouseDown    = false;
  let startX, startY;
  let moved          = false;
  let hadSelection   = false;
  let startTarget    = null;

  document.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    isMouseDown  = true;
    moved        = false;
    startX       = e.clientX;
    startY       = e.clientY;
    startTarget  = e.target;
    hadSelection = !window.getSelection().isCollapsed;
  });

  document.addEventListener('mousemove', e => {
    if (!isMouseDown || moved) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.hypot(dx, dy) > 5) {
      moved = true;  // considered a drag if movement exceeds 5px?
    }
  });

  document.addEventListener('mouseup', e => {
    if (!isMouseDown) return;
    isMouseDown = false;
    if (!moved) return;  // was trying to make it so it only works if i drag but seems like that doesnt work

    let url = null;
    const sel = window.getSelection().toString().trim();

    if ((hadSelection || sel) && sel) {
      url = SEARCH_BASE + encodeURIComponent(sel);
    } else {
      // Otherwise, check if they dragged a link
      const link = e.target.closest('a') || (startTarget.closest && startTarget.closest('a'));
      if (link && link.href) {
        url = link.href;
      }
    }

    if (!url) return;

    // Handle how the URL is opened based on key modifiers
    if (e.ctrlKey && e.shiftKey) {
      // we use gm_openInTab to open a background tab, useful for saving tabs to look at later
      GM_openInTab(url, { active: false });
    } else if (e.ctrlKey) {
      // redirect to current tab
      window.location.href = url;
    } else {
      // open in new tab but move to that tab
      GM_openInTab(url, { active: true });
    }
  });
})();
