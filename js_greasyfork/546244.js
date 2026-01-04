// ==UserScript==
// @name         GeoGuessr Fast Move Hotkey
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rebind the fast move button to whichever key you want
// @match        https://www.geoguessr.com/*
// @icon         https://www.geoguessr.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546244/GeoGuessr%20Fast%20Move%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/546244/GeoGuessr%20Fast%20Move%20Hotkey.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /********** CONFIG **********/
  const HOLD_KEY = 'w';            // hold down to move
  const TOGGLE_KEY = 'h';          // press once to start/stop moving
  const INTERVAL_MS = 1;          // ms between clicks (i do not recommend using this script in ranked but if you do keep this at 1 if playing ranked)
  const ARROW_SELECTOR = 'path[aria-label^="Go "]';
  /****************************/

  let lockedArrow = null;
  let repeatTimer = null;
  let toggleActive = false;

  function isTypingTarget(el) {
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
  }

  function isArrow(el) {
    try {
      return el && el.tagName?.toLowerCase() === 'path' &&
             el.getAttribute?.('aria-label')?.startsWith('Go ');
    } catch { return false; }
  }

  // Capture which arrow the user clicked/focused
  document.addEventListener('click', (ev) => {
    let el = ev.target;
    while (el && !isArrow(el)) el = el.parentElement;
    if (isArrow(el)) lockedArrow = el;
  }, true);

  document.addEventListener('focusin', (ev) => {
    if (isArrow(ev.target)) lockedArrow = ev.target;
  });

  function doClickOnLocked() {
    if (!lockedArrow) return;
    if (!document.contains(lockedArrow)) {
      stopRepeating();
      lockedArrow = null;
      return;
    }
    try {
      lockedArrow.click();
    } catch {
      try {
        lockedArrow.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      } catch { /* ignore */ }
    }
  }

  function startRepeating() {
    if (repeatTimer || !lockedArrow) return;
    doClickOnLocked(); // immediate
    repeatTimer = setInterval(doClickOnLocked, INTERVAL_MS);
  }

  function stopRepeating() {
    if (repeatTimer) {
      clearInterval(repeatTimer);
      repeatTimer = null;
    }
  }

  // --- Key handling ---
  document.addEventListener('keydown', (ev) => {
    if (isTypingTarget(ev.target)) return;

    // Hold mode
    if (ev.key?.toLowerCase() === HOLD_KEY) {
      startRepeating();
      ev.preventDefault();
      return;
    }

    // Toggle mode
    if (ev.key?.toLowerCase() === TOGGLE_KEY && ev.repeat === false) {
      toggleActive = !toggleActive;
      if (toggleActive) startRepeating();
      else stopRepeating();
      ev.preventDefault();
    }
  }, false);

  document.addEventListener('keyup', (ev) => {
    if (ev.key?.toLowerCase() === HOLD_KEY) stopRepeating();
  }, false);

  window.addEventListener('blur', stopRepeating);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopRepeating(); });

})();
