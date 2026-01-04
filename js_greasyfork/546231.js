// ==UserScript==
// @name         Facebook play video in background
// @namespace    fb-nopause
// @version      1.1-no-keep
// @description  Impedisce a Facebook di mettere in pausa i video quando cambi scheda (senza keep-alive)
// @author       Leprechaun
// @include      https://*facebook.*
// @include      https://m.facebook.*
// @run-at       document-start
// @inject-into  page
// @grant        none
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/546231/Facebook%20play%20video%20in%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/546231/Facebook%20play%20video%20in%20background.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const FORBIDDEN_EVENTS = new Set([
    'visibilitychange',
    'webkitvisibilitychange',
    'pagehide',
    'freeze',
    'blur'
  ]);

  function nullSetter(obj, prop) {
    try {
      Object.defineProperty(obj, prop, {
        set() {},
        get() { return null; },
        configurable: true
      });
    } catch (_) {}
  }
  nullSetter(window, 'onblur');
  nullSetter(window, 'onfocus');
  nullSetter(window, 'onpagehide');
  nullSetter(document, 'onvisibilitychange');

  try {
    Object.defineProperty(document, 'hidden', {
      get() { return false; },
      configurable: true
    });
    Object.defineProperty(document, 'visibilityState', {
      get() { return 'visible'; },
      configurable: true
    });
  } catch (_) {}

  try {
    Document.prototype.hasFocus = function () { return true; };
  } catch (_) {}

  for (const t of FORBIDDEN_EVENTS) {
    window.addEventListener(t, e => e.stopImmediatePropagation(), true);
    document.addEventListener(t, e => e.stopImmediatePropagation(), true);
  }

  const realAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener, opts) {
    if (FORBIDDEN_EVENTS.has(String(type))) {
      return;
    }
    return realAdd.call(this, type, listener, opts);
  };

  try {
    const PO = window.PerformanceObserver;
    if (PO && PO.supportedEntryTypes) {
      const filtered = PO.supportedEntryTypes.filter(t => t !== 'longtask');
      Object.defineProperty(window.PerformanceObserver, 'supportedEntryTypes', {
        value: filtered,
        configurable: true
      });
    }
  } catch (_) {}

  (function () {
    const proto = HTMLMediaElement.prototype;
    const realPause = proto.pause;
    const realPlay = proto.play;
    let lastUserGesture = 0;
    const bump = () => { lastUserGesture = Date.now(); };

    window.addEventListener('keydown', bump, true);
    window.addEventListener('mousedown', bump, true);
    window.addEventListener('pointerdown', bump, true);
    window.addEventListener('touchstart', bump, true);

    proto.pause = function (...args) {
      const since = Date.now() - lastUserGesture;
      if (since < 1000 || this.dataset.allowPause === '1') {
        return realPause.apply(this, args);
      }
      try { realPlay.call(this); } catch (_) {}
      return;
    };
  })();

  console.log('[FB-NOPAUSE] Hard mode attivo (keep-alive rimosso)');
})();
