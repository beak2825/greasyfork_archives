// ==UserScript==
// @name         Bypass netflix household
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A script that bypasses Netflix's household verification screen by injecting a valid user cookie, allowing seamless access to your account without repeated logins, ideal for testing and automation scenarios.
// @author       bitbit
// @match        https://www.netflix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534916/Bypass%20netflix%20household.user.js
// @updateURL https://update.greasyfork.org/scripts/534916/Bypass%20netflix%20household.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let currentPath = location.pathname;

  const freezeMainThread = (durationMs = 8000) => {
    const start = performance.now();
    setTimeout(() => {
      while (performance.now() - start < durationMs) {
        // Busy block
      }
    }, 100);
    console.log('%c[BLOCK] JS frozen for 8s', 'color: red; font-weight: bold;');
  };

  const isWatchPage = () => location.pathname.startsWith('/watch');

  const removeModalPopup = () => {
    const modals = document.querySelectorAll('.nf-modal.interstitial-full-screen');
    modals.forEach(modal => {
      if (modal) {
        modal.remove();
        console.log('%c[MODAL] Removed modal popup', 'color: blue; font-weight: bold;');
      }
    });
  };

  const tryFreezeIfReady = (observer) => {
    const video = document.querySelector('video');
    const controls = document.querySelector('[data-uia="controls-standard"]');
    if (video && controls) {
      if (observer) observer.disconnect();
      console.log('%c[INFO] Watch page ready. Freezing...', 'color: orange; font-weight: bold;');
      freezeMainThread(8000);
      return true;
    }
    return false;
  };

  const handleWatchPage = () => {
    if (tryFreezeIfReady()) return;

    const observer = new MutationObserver(() => {
      tryFreezeIfReady(observer);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  const handleOtherPages = () => {
    const observer = new MutationObserver(() => {
      const modal = document.querySelector('[data-uia="nf-modal-background"]');
      if (modal) {
        observer.disconnect();
        removeModalPopup();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  const handleRouteChange = () => {
    console.log('%c[ROUTE] Now at: ' + location.pathname, 'color: purple; font-weight: bold;');

    const newPath = location.pathname;

    if (isWatchPage()) {
      // Kiểm tra đã reload cho đường dẫn này trong session chưa
      const alreadyReloaded = sessionStorage.getItem('reloaded-' + newPath);

      if (!alreadyReloaded) {
        console.log('%c[RELOAD] First time on this watch path. Reloading...', 'color: red; font-weight: bold;');
        sessionStorage.setItem('reloaded-' + newPath, 'true');
        location.reload();
        return;
      }

      handleWatchPage();
    } else {
      // Reset toàn bộ key reloaded nếu không còn ở trang /watch
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('reloaded-/watch')) {
          sessionStorage.removeItem(key);
        }
      });
      handleOtherPages();
    }
  };

  const hookHistory = () => {
    const originalPush = history.pushState;
    const originalReplace = history.replaceState;

    history.pushState = function () {
      originalPush.apply(this, arguments);
      setTimeout(onUrlChange, 50);
    };

    history.replaceState = function () {
      originalReplace.apply(this, arguments);
      setTimeout(onUrlChange, 50);
    };

    window.addEventListener('popstate', onUrlChange);
  };

  const onUrlChange = () => {
    if (location.pathname !== currentPath) {
      currentPath = location.pathname;
      handleRouteChange();
    }
  };

  const init = () => {
    hookHistory();
    handleRouteChange();
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }
})();
