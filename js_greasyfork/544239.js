// ==UserScript==
// @name         Anti Focus Pause / Always Focus
// @namespace    https://your.custom.namespace
// @version      1.0
// @description  Trick sites into thinking the tab is always focused and visible
// @author       You
// @match        https://viaplay.*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544239/Anti%20Focus%20Pause%20%20Always%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/544239/Anti%20Focus%20Pause%20%20Always%20Focus.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Override visibility/focus properties
  Object.defineProperty(document, 'hidden', { get: () => false });
  Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
  document.hasFocus = () => true;

  // Constantly dispatch fake focus events to fool detection
  setInterval(() => {
    window.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new Event('visibilitychange'));
  }, 500);

  // Prevent visibility-related events from triggering logic
  const blockEvent = (e) => {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
  };

  ['visibilitychange', 'webkitvisibilitychange', 'blur'].forEach((evt) => {
    window.addEventListener(evt, blockEvent, true);
    document.addEventListener(evt, blockEvent, true);
  });

  // Patch addEventListener to block new focus/blur listeners
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'].includes(type)) {
      console.log(`Blocked addEventListener for: ${type}`);
      return;
    }
    return originalAddEventListener.call(this, type, listener, options);
  };

  // Re-apply patches in case the site tries to override
  new MutationObserver(() => {
    document.hasFocus = () => true;
    Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
    Object.defineProperty(document, 'hidden', { get: () => false });
  }).observe(document, { childList: true, subtree: true });

})();