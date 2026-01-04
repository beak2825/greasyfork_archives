// ==UserScript==
// @name         TikTok SPA Scroll Restore (Safe Version)
// @namespace    TikTok-Scroll-Restore
// @version      1
// @description  Mengembalikan posisi scroll setelah klik tombol X atau tombol kembali di TikTok Web SPA.
// @author       3xploiton3
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?domain=tiktok.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546295/TikTok%20SPA%20Scroll%20Restore%20%28Safe%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546295/TikTok%20SPA%20Scroll%20Restore%20%28Safe%20Version%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Simpan posisi scroll saat klik video
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href*="/video/"]');
    if (anchor) {
      sessionStorage.setItem('tiktok_last_scroll', window.scrollY.toString());
    }
  }, true);

  // Fungsi untuk memastikan video modal sudah tertutup
  function waitForModalClose(callback) {
    const checkInterval = 100;
    const maxAttempts = 30;
    let attempts = 0;

    const interval = setInterval(() => {
      const modal = document.querySelector('div[data-e2e="browse-video-feed"]');
      if (!modal) {
        clearInterval(interval);
        callback();
      } else if (++attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn('TikTok modal close wait timeout.');
        callback(); // tetap lanjut, tapi setelah timeout
      }
    }, checkInterval);
  }

  // Fungsi restore scroll
  function restoreScrollIfNeeded() {
    waitForModalClose(() => {
      const savedScroll = parseInt(sessionStorage.getItem("tiktok_last_scroll"), 10);
      if (!isNaN(savedScroll)) {
        window.scrollTo({ top: savedScroll, behavior: "instant" });
        sessionStorage.removeItem("tiktok_last_scroll");
      }
    });
  }

  // Observer untuk pasang event ke tombol X
  const observer = new MutationObserver(() => {
    const closeBtn = document.querySelector('[data-e2e="browse-close"]');
    if (closeBtn && !closeBtn.dataset.scrollHandled) {
      closeBtn.dataset.scrollHandled = 'true';
      closeBtn.addEventListener('click', restoreScrollIfNeeded);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Tangani tombol kembali di browser
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.href;
    if (!/\/video\//.test(currentUrl)) {
      // Kita baru saja keluar dari halaman video
      restoreScrollIfNeeded();
    }
  });
})();
