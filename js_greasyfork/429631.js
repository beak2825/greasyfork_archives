// ==UserScript==
// @name         Remove fucking modals 移除 coding.net 强制弹窗
// @namespace    https://github.com/cangzhang/tampermoney-scripts
// @version      0.5
// @description  remove all modals that are showed when visiting coding.net
// @author       alcheung
// @match        *://*.coding.net/*
// @match        *://*.coding.com/*
// @match        *://*.coding.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429631/Remove%20fucking%20modals%20%E7%A7%BB%E9%99%A4%20codingnet%20%E5%BC%BA%E5%88%B6%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/429631/Remove%20fucking%20modals%20%E7%A7%BB%E9%99%A4%20codingnet%20%E5%BC%BA%E5%88%B6%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let removed = false;
  const startTime = performance.now();
  const handle = setInterval(() => {
    const modals = document.querySelectorAll(
      `body > [style$=" position: relative;"]`
    );
    if (modals.length > 0 && !removed) {
      [...modals].forEach((modal) => {
        modal.parentNode.removeChild(modal);
      });
      removed = true;
      console.info(`[tampermonkey: Remove fucking modals] 弹窗已移除`);
      window.clearInterval(handle);
    }
    
    const timeout = performance.now() - startTime
    if (timeout > 1000 * 60) {
      window.clearInterval(handle)
    }
  }, 1500);
})();
