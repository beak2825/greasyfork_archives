// ==UserScript==
// @name         Copy & Select Unlocker
// @namespace    http://shinobu-scripts.local/
// @version      2.2
// @description  Unblock text selection, copy, right‑click but leave video clicks intact
// @author       Shinobu
// @match        *://*/*
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/533101/Copy%20%20Select%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/533101/Copy%20%20Select%20Unlocker.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function injectSelectionStyles() {
    const css = `
      * { user-select: text !important; -webkit-user-select: text !important; }
      [style*="user-select: none"] { user-select: text !important; }
    `;
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function removeOverlays() {
    document.querySelectorAll('div, section').forEach(el => {
      if (el.querySelector('video')) return;        // don’t touch video holders
      const st = getComputedStyle(el);
      const z = parseInt(st.zIndex, 10) || 0;
      if ((st.position==='fixed'||st.position==='absolute') &&
          z > 1000 &&
          el.offsetWidth >= innerWidth * .9 &&
          el.offsetHeight>= innerHeight * .9) {
        el.style.pointerEvents = 'none';           // let clicks pass through
      }
    });
  }

  function observeOverlays() {
    const mo = new MutationObserver(removeOverlays);
    mo.observe(document, { childList: true, subtree: true });
    removeOverlays();
  }

  function restoreEvents() {
    ['onselectstart','onmousedown','ondragstart'].forEach(e => { document[e]=null; });
    if (window.getSelection().empty) window.getSelection().empty = ()=>{};
  }

  function stopProp(e) { e.stopImmediatePropagation(); }

  function init() {
    injectSelectionStyles();
    ['contextmenu','selectstart','copy'].forEach(evt=>{
      document.addEventListener(evt, stopProp, true);
    });
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey||e.metaKey) && e.key==='c') e.stopImmediatePropagation();
    }, true);
    restoreEvents();
    observeOverlays();
    console.log('Copy & Select Unlocker v2.2 running');
  }

  if (document.readyState==='loading')
    window.addEventListener('load', init);
  else init();
})();
