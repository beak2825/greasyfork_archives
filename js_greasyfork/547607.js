// ==UserScript==
// @name        YouTube One-Ear/Mono Audio Fix
// @namespace   danielytuk/YTMONOFIX
// @version     1.0.2
// @description Preserve stereo and fix mono/one-ear audio.
// @author      danielytuk
// @license     Unlicense
// @match       *://www.youtube.com/watch?v=*
// @homepageURL https://github.com/danielytuk/UserScripts
// @supportURL  https://github.com/danielytuk/UserScripts/Issues
// @icon        https://www.youtube.com/yts/img/favicon-vfl8qSV2F.ico
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/547607/YouTube%20One-EarMono%20Audio%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/547607/YouTube%20One-EarMono%20Audio%20Fix.meta.js
// ==/UserScript==

(() => {
  let ctx;
  const fixed = new WeakSet();

  const rms = buf => Math.sqrt(buf.reduce((s, v) => s + ((v - 128) / 128) ** 2, 0) / buf.length);

  const setup = video => {
    if (!video || fixed.has(video)) return;
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    ctx.state === "suspended" && ctx.resume();

    const src = ctx.createMediaElementSource(video),
          split = ctx.createChannelSplitter(2),
          merge = ctx.createChannelMerger(2),
          gain = ctx.createGain(),
          aL = ctx.createAnalyser(),
          aR = ctx.createAnalyser();

    [aL, aR].forEach(a => a.fftSize = 32);
    gain.gain.value = 1;

    src.connect(split);
    merge.connect(ctx.destination);
    split.connect(aL, 0); 
    split.connect(aR, 1);

    fixed.add(video);

    const check = () => {
      const bL = new Uint8Array(aL.fftSize), bR = new Uint8Array(aR.fftSize);
      aL.getByteTimeDomainData(bL); aR.getByteTimeDomainData(bR);

      const silentL = rms(bL) < 0.02, silentR = rms(bR) < 0.02;

      try { split.disconnect(); } catch {}
      try { gain.disconnect(); } catch {}

      if (silentL || silentR) {
        // Merge channels → both ears
        split.connect(gain, 0); 
        split.connect(gain, 1);
        gain.connect(merge, 0, 0);
        gain.connect(merge, 0, 1);
      } else {
        // Keep original stereo
        split.connect(merge, 0, 0);
        split.connect(merge, 1, 1);
      }

      if (!video.paused && !video.ended) setTimeout(check, 1500);
    };

    check();
  };

  new MutationObserver(() => 
    document.querySelectorAll("video").forEach(setup)
  ).observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll("video").forEach(setup);
})();
