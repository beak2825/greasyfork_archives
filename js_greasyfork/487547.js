// ==UserScript==
// @name                YouTube CPU Tamer by AnimationFrame
// @name:zh-TW          YouTube CPU Tamer by AnimationFrame
// @namespace           http://tampermonkey.net/
// @version             2024.02.18.0
// @license             MIT License
// @author              CY Fung
// @match               http*://*.youtube.com/*
// @match               http*://*.youtube-nocookie.com/embed/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/youtube-cpu-tamper-by-animationframe.webp
// @supportURL          https://github.com/cyfung1031/userscript-supports
// @run-at              document-start
// @grant               none
// @unwrap
// @allFrames           true
// @inject-into         page
// @description         Reduce Browser's Energy Impact for playing YouTube Video
// @description:en      Reduce Browser's Energy Impact for playing YouTube Video
// @description:zh-TW   減少YouTube影片所致的能源消耗



// @downloadURL https://update.greasyfork.org/scripts/487547/YouTube%20CPU%20Tamer%20by%20AnimationFrame.user.js
// @updateURL https://update.greasyfork.org/scripts/487547/YouTube%20CPU%20Tamer%20by%20AnimationFrame.meta.js
// ==/UserScript==

/* jshint esversion:8 */

/**
 *
 * This script does not support the following syntax intentionally.
 *
 * - string parameter as TimerHandler
 * e.g. setTimeout("console.log('300ms')", 300)
 * - no delay for `setInterval`
 * e.g. setInterval(f)
 *
 */

/**
    @typedef TimerObject
    @type {Object}
    @property {Function} handler
    @property {number?} timeout
    @property {number?} interval
    @property {number} nextAt

*/

((__CONTEXT__) => {
  'use strict';

  const UNDERCLOCK = +localStorage.cpuTamerUnderclock || 10;
  const win = this instanceof Window ? this : window;

  const hkey_script = 'nzsxclvflluv';
  if (win[hkey_script]) throw new Error('Duplicated Userscript Calling');
  win[hkey_script] = true;

  const { requestAnimationFrame, setTimeout, setInterval, clearTimeout, clearInterval } = __CONTEXT__;

  const $busy = Symbol('$busy');
  const INT_INITIAL_VALUE = 8192;
  const SAFE_INT_LIMIT = 2251799813685248;
  const SAFE_INT_REDUCED = 67108864;

  const sb = new Map();

  const sFunc = prop => (func, ms, ...args) => {
    const mi = ++sb.mi || (sb.mi = INT_INITIAL_VALUE);
    if (mi > SAFE_INT_LIMIT) sb.mi = SAFE_INT_REDUCED;
    if (ms > SAFE_INT_LIMIT) return mi;

    if (typeof func === 'function') {
      const handler = args.length ? func.bind(null, ...args) : func;
      handler[$busy] || (handler[$busy] = 0);
      sb.set(mi, { handler, [prop]: ms, nextAt: Date.now() + (ms > 0 ? ms : 0) });
    }
    return mi;
  };

  const rm = jd => {
    if (!jd) return;
    if (typeof jd === 'string') jd = +jd;
    const o = sb.get(jd);
    if (typeof o !== 'object') return jd <= INT_INITIAL_VALUE ? __CONTEXT__[jd]() : undefined;

    for (const k in o) o[k] = null;
    sb.delete(jd);
  };

  win.setTimeout = sFunc('timeout');
  win.setInterval = sFunc('interval');
  win.clearTimeout = rm.bind({ nativeFn: clearTimeout });
  win.clearInterval = rm.bind({ nativeFn: clearInterval });

  document.addEventListener("yt-navigate-finish", () => {
    sb.toResetFuncHandlers = true;
    Promise.resolve().then(sb.executeNow);
  }, true);

  let clearResolveAt = 0;
  setInterval(() => {
    if (sb.intervalTimerResolve !== null && Date.now() >= clearResolveAt) {
      sb.intervalTimerResolve();
      sb.intervalTimerResolve = null;
    }
  }, 10);

  const pTimerFn = resolve => { sb.intervalTimerResolve = resolve };

  (async () => {
    while (true) {
      const tickerNow = Date.now();
      clearResolveAt = tickerNow + UNDERCLOCK;
      const pTimer = new Promise(pTimerFn);
      sb.bgExecutionAt = tickerNow + 160;
      await Promise.resolve(requestAnimationFrame(sb.infiniteLooper));
      await pTimer;
      if (sb.afInterupter === null) {
        sb.dexActivePage = false;
      } else {
        sb.afInterupter = null;
        if (sb.dexActivePage === false) sb.toResetFuncHandlers = true;
        sb.dexActivePage = true;
      }
      if (sb.toResetFuncHandlers) {
        sb.toResetFuncHandlers = false;
        for (const eb of sb.values()) eb.handler[$busy] = 0;
      }
      const sHandlers = await sb.nextTickExecutionMT1();
      await sb.nextTickExecutionMT2(sHandlers);
    }
  })();

  setInterval(() => {
    if (sb.nonResponsiveResolve !== null) {
      sb.nonResponsiveResolve();
      return;
    }
    const dInterupter = sb.afInterupter;
    let now;
    if (dInterupter !== null && (now = Date.now()) > sb.bgExecutionAt) {
      sb.afInterupter = null;
      sb.bgExecutionAt = now + 230;
      dInterupter();
    }
  }, 125);

})(null);