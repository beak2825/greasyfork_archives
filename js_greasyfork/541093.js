// ==UserScript==
// @name         Ultimate Browser Enhancer (Lite)
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Stream ads skip, cookie accept, reader tools, smart shopping – no API keys needed. With settings & update check.
// @author       Møth (a.k.a. DoctorPeriodtt)
// @match        *://*.youtube.com/*
// @match        *://*.twitch.tv/*
// @match        *://*.netflix.com/*
// @match        *://*.amazon.*/*
// @match        *://*.aliexpress.*/*
// @match        *://*.shein.*/*
// @match        *://*.wish.com/*
// @match        *://*.webtoons.com/*
// @match        *://*.tapas.io/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/541093/Ultimate%20Browser%20Enhancer%20%28Lite%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541093/Ultimate%20Browser%20Enhancer%20%28Lite%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SETTINGS = {
    youtubeAds: true,
    twitchAds: true,
    netflixSkip: true,
    shoppingHints: true,
    webtoonScroll: true,
    scrollSpeed: 2,
    autoCookies: true,
    darkToggle: true,
    scrollButton: true
  };

  const log = (...args) => console.log('[EnhancerLite by Møth 🐾]', ...args);
  let userMuted = false;
  let autoScrollInterval = null;

  // === BRANDING ===
  window.addEventListener('load', () => {
    console.log('%c👁️ Ultimate Browser Enhancer (Lite) by Møth aka DoctorPeriodtt', 'color: violet; font-weight: bold; font-size: 14px;');
    const metaTag = document.createElement('meta');
    metaTag.name = 'generator';
    metaTag.content = 'Ultimate Browser Enhancer by Møth';
    document.head.appendChild(metaTag);
  });

  // === DETECT RENAME ===
  if (typeof GM_info !== 'undefined' && GM_info.script.name !== "Ultimate Browser Enhancer (Lite)") {
    console.warn("⚠️ Script name has been altered. This may not be an official build by Møth.");
  }

  // === STREAMING ===
  function handleYouTubeAds() {
    if (!SETTINGS.youtubeAds) return;
    try {
      const skipBtn = document.querySelector('.ytp-ad-skip-button');
      if (skipBtn) skipBtn.click();
      const overlay = document.querySelector('.ytp-ad-overlay-close-button');
      if (overlay) overlay.click();
      const ad = document.querySelector('.ad-showing');
      const video = document.querySelector('video');
      if (video) {
        if (!userMuted && ad) {
          userMuted = video.muted;
          video.muted = true;
        } else if (!ad && !userMuted) {
          video.muted = false;
        }
      }
    } catch (e) { log('YT Error:', e); }
  }

  function handleTwitchAds() {
    if (!SETTINGS.twitchAds) return;
    try {
      const overlay = document.querySelector('.player-ad-overlay, .ad-banner');
      if (overlay) overlay.style.display = 'none';
      const video = document.querySelector('video');
      if (video && video.duration < 60) video.muted = true;
    } catch (e) { log('Twitch Error:', e); }
  }

  function handleNetflix() {
    if (!SETTINGS.netflixSkip) return;
    try {
      const skip = document.querySelector('[data-uia="player-skip-intro"]');
      if (skip) skip.click();
    } catch (e) { log('Netflix Error:', e); }
  }

  // === SHOPPING ===
  function enhanceShoppingSites() {
    if (!SETTINGS.shoppingHints) return;
    try {
      const host = location.hostname;
      if (/amazon/.test(host)) {
        document.querySelectorAll('[data-component-type="sp-sponsored-result"]').forEach(e => e.style.display = 'none');
      }
      document.querySelectorAll('.coupon, .sale-price, .coupon-box, .coupon-item').forEach(e => {
        e.style.outline = '2px dashed #4caf50';
      });
    } catch (e) { log('Shopping Error:', e); }
  }

  // === READERS ===
  function autoScrollReader() {
    if (!SETTINGS.webtoonScroll || autoScrollInterval !== null) return;
    if (/webtoons|tapas/.test(location.hostname)) {
      autoScrollInterval = setInterval(() => window.scrollBy(0, SETTINGS.scrollSpeed), 100);
    }
  }

  // === COOKIES ===
  function autoAcceptCookies() {
    if (!SETTINGS.autoCookies) return;
    try {
      document.querySelectorAll('button, input[type=button]').forEach(b => {
        const t = (b.innerText || b.value || '').toLowerCase();
        if (/accept|agree|allow/i.test(t)) b.click();
      });
    } catch (e) { log('Cookie Error:', e); }
  }

  // === UI TOOLS ===
  function addDarkModeToggle() {
    if (!SETTINGS.darkToggle) return;
    const btn = document.createElement('button');
    btn.innerText = '🌓';
    btn.style = 'position:fixed;top:10px;right:10px;z-index:10000';
    btn.onclick = () => {
      document.body.style.filter = document.body.style.filter ? '' : 'invert(1) hue-rotate(180deg)';
    };
    document.body.appendChild(btn);
  }

  function addScrollToBottomBtn() {
    if (!SETTINGS.scrollButton) return;
    const btn = document.createElement('button');
    btn.innerText = '⬇️';
    btn.style = 'position:fixed;bottom:20px;right:10px;z-index:10000';
    btn.onclick = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    document.body.appendChild(btn);
  }

  // === UPDATE CHECK ===
  function checkForUpdate() {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://raw.githubusercontent.com/yourusername/yourrepo/main/enhancer.user.js',
      onload: res => {
        if (!res.responseText.includes('@version      4.2')) {
          alert('🆕 New version available! Visit the script page to update.');
        }
      }
    });
  }

  // === SETTINGS MENU ===
  Object.keys(SETTINGS).forEach(k => {
    GM_registerMenuCommand(`Toggle ${k} (Currently ${SETTINGS[k]})`, () => {
      if (typeof SETTINGS[k] === 'boolean') {
        SETTINGS[k] = !SETTINGS[k];
        alert(`${k} set to ${SETTINGS[k]}`);
      } else if (k === 'scrollSpeed') {
        const newSpeed = prompt('Set scroll speed (e.g., 1-10):', SETTINGS[k]);
        const speed = parseInt(newSpeed);
        if (!isNaN(speed) && speed >= 0) {
          SETTINGS[k] = speed;
          alert(`scrollSpeed set to ${speed}`);
        }
      }
    });
  });

  // === MAIN LOOP ===
  function main() {
    const host = location.hostname;
    autoAcceptCookies();

    if (/youtube/.test(host)) handleYouTubeAds();
    else if (/twitch/.test(host)) handleTwitchAds();
    else if (/netflix/.test(host)) handleNetflix();

    if (/amazon|shein|wish|aliexpress/.test(host)) enhanceShoppingSites();
    if (/webtoons|tapas/.test(host)) autoScrollReader();
  }

  window.addEventListener('load', () => {
    addDarkModeToggle();
    addScrollToBottomBtn();
    checkForUpdate();
    setInterval(main, 2000);
  });

})();

// ================================
// 💫 Created by Møth / DoctorPeriodtt
// 🦋 If you fork or share, consider giving credit
// ================================
