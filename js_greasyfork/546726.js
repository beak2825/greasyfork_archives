// ==UserScript==
// @name         Web Time Hook - 2099-01-01 (normal flow)
// @namespace    tm-time-hook
// @version      1.0.2
// @description  将网页端时间设为 2099-01-01 并以正常速度流逝；钩住 Date/performance/Intl 等
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546726/Web%20Time%20Hook%20-%202099-01-01%20%28normal%20flow%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546726/Web%20Time%20Hook%20-%202099-01-01%20%28normal%20flow%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const FIXED_LOCAL_ISO = '2099-01-01T00:00:00'; // 目标起点（本地时区）
  const FREEZE = false;                           // 正常流逝 => false
  const SPOOF_TIMEZONE = '';                      // 如需伪造时区：'Asia/Tokyo'
  const SPOOF_TZ_OFFSET_MIN = undefined;          // 如需伪造 offset：-540 等
  const HOTKEY_TOGGLE = true;                     // Alt+Shift+T 开/关

  let enabled = true;
  const RealDate = Date;
  const realStartMs = RealDate.now();
  const fixedLocalMs = RealDate.parse(FIXED_LOCAL_ISO);

  const perf = (typeof performance !== 'undefined') ? performance : null;
  const realPerfNow = perf && perf.now ? perf.now.bind(perf) : null;
  const perfStart = realPerfNow ? realPerfNow() : 0;

  function virtNowMs() {
    if (!enabled) return RealDate.now();
    if (FREEZE) return fixedLocalMs; // 这里已设为正常流逝，不走这个分支
    // 正常流逝：以 2099-01-01 为起点，按真实速度推进
    const delta = RealDate.now() - realStartMs;
    return fixedLocalMs + delta;
  }

  function FakeDate(...args) {
    if (this instanceof FakeDate) {
      if (args.length === 0) return new RealDate(virtNowMs());
      return new RealDate(...args);
    }
    return new RealDate(virtNowMs()).toString();
  }
  Object.getOwnPropertyNames(RealDate).forEach(k => { try { FakeDate[k] = RealDate[k]; } catch (_) {} });
  FakeDate.now = () => virtNowMs();
  FakeDate.prototype = RealDate.prototype;
  Object.defineProperty(FakeDate, 'prototype', { writable: false });
  Object.defineProperty(window, 'Date', { value: FakeDate });

  if (perf && realPerfNow) {
    // 正常流逝：让 performance.now() 继续用真实增量，避免页面动画/计时异常
    const fakePerfNow = function() {
      if (!enabled) return realPerfNow();
      return realPerfNow() - perfStart;
    };
    try { Object.defineProperty(performance, 'now', { value: fakePerfNow }); } catch(_) {}
  }

  if (SPOOF_TIMEZONE) {
    const RealIntl = Intl, RealDTF = Intl.DateTimeFormat;
    const FakeDTF = function(...args) { return new RealDTF(...args); };
    FakeDTF.prototype = RealDTF.prototype;
    Object.getOwnPropertyNames(RealDTF).forEach(k => { try { FakeDTF[k] = RealDTF[k]; } catch(_) {} });
    const ro = RealDTF.prototype.resolvedOptions;
    RealDTF.prototype.resolvedOptions = function(...args) {
      const o = ro.apply(this, args);
      try { Object.defineProperty(o, 'timeZone', { value: SPOOF_TIMEZONE, configurable: true }); }
      catch(_) { o.timeZone = SPOOF_TIMEZONE; }
      return o;
    };
    try { Object.defineProperty(Intl, 'DateTimeFormat', { value: FakeDTF }); } catch(_) {}
  }

  if (typeof SPOOF_TZ_OFFSET_MIN === 'number') {
    const orig = RealDate.prototype.getTimezoneOffset;
    RealDate.prototype.getTimezoneOffset = function(...args) {
      try {
        const t = this.getTime();
        if (Math.abs(t - virtNowMs()) < 60000) return SPOOF_TZ_OFFSET_MIN;
      } catch(_) {}
      return orig.apply(this, args);
    };
  }

  try {
    const lm = () => new RealDate(virtNowMs()).toString();
    Object.defineProperty(document, 'lastModified', { get: lm });
  } catch (_) {}

  if (HOTKEY_TOGGLE) {
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.shiftKey && e.code === 'KeyT') {
        enabled = !enabled;
        console.log('[Web Time Hook] ' + (enabled ? 'ON' : 'OFF'),
          new RealDate(virtNowMs()).toString());
      }
    }, { capture: true });
  }
})();
