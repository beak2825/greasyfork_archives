// ==UserScript==
// @name         Prime Video iOS Safari Audio Fix
// @name:ja      Prime Video 音声再生修正スクリプト（iOS Safari用）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fixes audio playback issues on Prime Video for iOS Safari by spoofing UA and triggering AudioContext
// @description:ja iOS SafariでPrime Videoの音声が再生されない問題を回避するため、ユーザーエージェントの偽装とAudioContextの起動を行います。
// @match        https://www.primevideo.com/*
// @match        https://www.amazon.co.jp/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539171/Prime%20Video%20iOS%20Safari%20Audio%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/539171/Prime%20Video%20iOS%20Safari%20Audio%20Fix.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // UA偽装（Mac Safari風）
  const ua = {
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    platform: "MacIntel",
    vendor: "Apple Computer, Inc.",
    maxTouchPoints: 1
  };
  Object.entries(ua).forEach(([k,v]) =>
    Object.defineProperty(navigator, k, { get: () => v, configurable: true })
  );

  // タッチイベント模倣（iOS用）
  window.addEventListener("load", () => {
    document.body.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
  });

  // AudioContextトリガー
  function triggerAudio() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(gain).connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }
  window.addEventListener("DOMContentLoaded", triggerAudio);

  new MutationObserver((muts, obs) => {
    if (document.querySelector('video')) {
      triggerAudio();
      obs.disconnect();
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})();