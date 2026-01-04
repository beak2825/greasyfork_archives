// ==UserScript==
// @name         Video Preload
// @namespace    none
// @version      0.1
// @description  Minimal video optimizer: lightweight preload, ad blocking
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542512/Video%20Preload.user.js
// @updateURL https://update.greasyfork.org/scripts/542512/Video%20Preload.meta.js
// ==/UserScript==
Preload
(() => {
  'use strict';
  
  const AD_KEYWORDS = ['ad', 'sponsor', 'banner', 'promo'];
  const SCAN_DELAY = 3000;
  const OBSERVE_DELAY = 500;

  const isVideo = src => src && (src.includes('.mp4') || src.startsWith('blob:') || src.startsWith('data:'));
  const isAd = src => AD_KEYWORDS.some(k => src.toLowerCase().includes(k));

  function boost(video) {
    if (video.dataset.boosted) return;
    video.dataset.boosted = true;
    
    const src = video.currentSrc || video.src;
    if (!src || isAd(src)) return video.remove();
    if (isVideo(src) && src.startsWith('http')) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = src;
      document.head.append(link);
    }
    
    video.preload = 'auto';
    video.playsInline = true;
  }

  let lastScan = 0;
  const scan = () => {
    if (Date.now() - lastScan < SCAN_DELAY) return;
    lastScan = Date.now();
    document.querySelectorAll('video:not([data-boosted])').forEach(boost);
  };

  new MutationObserver(() => setTimeout(scan, OBSERVE_DELAY))
    .observe(document.body, { childList: true, subtree: true });

  window.addEventListener('DOMContentLoaded', scan);
  scan();
})();