// ==UserScript==
// @name         Lanzou-Auto-Verify
// @namespace    https://happy0853077.github.io
// @version      0.2
// @description  auto click verify and download in verify pages of lanzou
// @author       happy0853077
// @match        https://developer-oss.lanrar.com/file/*
// @run-at       document-end
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/544484/Lanzou-Auto-Verify.user.js
// @updateURL https://update.greasyfork.org/scripts/544484/Lanzou-Auto-Verify.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitUntilReady(callback, timeout = 10000) {
    const startTime = Date.now();
    const check = () => {
      const loadingGone = document.getElementById('load2')?.style.display === 'none';
      const buttonVisible = document.querySelector('#sub div[onclick], #sub2 div[onclick], #go div[onclick]');
      const downRReady = typeof down_r === 'function';

      if (loadingGone && buttonVisible && downRReady) {
        callback();
      } else if (Date.now() - startTime < timeout) {
        setTimeout(check, 300);
      }
    };
    check();
  }

  function observeDownloadLink() {
    const goBox = document.getElementById('go');
    if (!goBox) return;

    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1 && node.tagName === 'A' && node.href) {
            window.location.href = node.href;
            observer.disconnect();
            return;
          }
        }
      }
    });
    observer.observe(goBox, { childList: true });
  }

  function autoVerify() {
    try {
      down_r(2);
    } catch (e) {
      const btn = document.querySelector('#sub div[onclick], #sub2 div[onclick], #go div[onclick]');
      if (btn) {
        btn.click();
      }
    }
    observeDownloadLink();
  }

  function main() {
    waitUntilReady(autoVerify);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();