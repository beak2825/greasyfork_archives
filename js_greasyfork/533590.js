// ==UserScript==
// @name         Amazon CPU Tamer PRO 🧠✨
// @namespace    https://github.com/koyasi777/amazon-cpu-tamer-pro
// @version      3.0.1
// @description  AmazonのCPU負荷を劇的に削減！DOM非改変・アフィなし・軽量＆安全設計の高効率ユーザースクリプト。
// @author       koyasi777
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.it/*
// @exclude      https://www.amazon.com/cart/*
// @exclude      https://www.amazon.co.jp/cart/*
// @exclude      https://www.amazon.co.uk/cart/*
// @exclude      https://www.amazon.es/cart/*
// @exclude      https://www.amazon.fr/cart/*
// @exclude      https://www.amazon.de/cart/*
// @exclude      https://www.amazon.it/cart/*
// @exclude      https://www.amazon.com/buy/*
// @exclude      https://www.amazon.co.jp/buy/*
// @exclude      https://www.amazon.co.uk/buy/*
// @exclude      https://www.amazon.es/buy/*
// @exclude      https://www.amazon.fr/buy/*
// @exclude      https://www.amazon.de/buy/*
// @exclude      https://www.amazon.it/buy/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/koyasi777/amazon-cpu-tamer-pro
// @supportURL   https://github.com/koyasi777/amazon-cpu-tamer-pro/issues
// @run-at       document-start
// @icon         https://www.amazon.co.jp/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/533590/Amazon%20CPU%20Tamer%20PRO%20%F0%9F%A7%A0%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533590/Amazon%20CPU%20Tamer%20PRO%20%F0%9F%A7%A0%E2%9C%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SCRIPT_ID = 'AmazonCpuTamerPRO';
  const FOREGROUND_INTERVAL = 125;
  const BACKGROUND_INTERVAL = 60000;
  const MIN_IFRAME_TIMEOUT = 1000;

  const safeWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

  let isUserActive = true;
  let isTabHidden = document.hidden;

  document.addEventListener('visibilitychange', () => {
    isTabHidden = document.hidden;
  });
  document.addEventListener('keydown', () => isUserActive = true, true);
  document.addEventListener('click', () => isUserActive = true, true);

  // Task bundler (Top window only)
  if (safeWindow === safeWindow.top) {
    const taskMap = new Map();
    let taskIdCounter = 0;

    const scheduleIdle = (fn) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(fn, { timeout: 500 });
      } else {
        requestAnimationFrame(fn);
      }
    };

    const originalSetInterval = safeWindow.setInterval.bind(safeWindow);
    const originalClearInterval = safeWindow.clearInterval.bind(safeWindow);

    safeWindow.setInterval = function (fn, delay, ...args) {
      const id = taskIdCounter++;
      taskMap.set(id, {
        fn: () => fn(...args),
        interval: delay,
        lastExecution: 0
      });
      return id;
    };

    safeWindow.clearInterval = function (id) {
      taskMap.delete(id);
    };

    const bundledLoop = () => {
      const now = Date.now();
      const intervalLimit = isTabHidden ? BACKGROUND_INTERVAL : FOREGROUND_INTERVAL;

      if (!isUserActive && isTabHidden) {
        scheduleIdle(bundledLoop);
        return;
      }

      for (const [id, task] of taskMap.entries()) {
        if (now - task.lastExecution >= task.interval) {
          try {
            task.fn();
          } catch (e) {
            console.warn(`[${SCRIPT_ID}] Error in interval task:`, e);
          }
          task.lastExecution = now;
        }
      }

      isUserActive = false;
      scheduleIdle(bundledLoop);
    };

    scheduleIdle(bundledLoop);
  }

  // Timeout throttler for iframes
  if (safeWindow !== safeWindow.top) {
    const originalSetTimeout = safeWindow.setTimeout.bind(safeWindow);

    safeWindow.setTimeout = function (fn, timeout, ...args) {
      if (document.hidden) return;
      const adjusted = Math.max(timeout, MIN_IFRAME_TIMEOUT);
      return originalSetTimeout(fn, adjusted, ...args);
    };
  }

  // Optional: URL cleaner to remove tracking parameters
  if (safeWindow === safeWindow.top) {
    const cleanTrackingParams = () => {
      const url = new URL(location.href);
      const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'ref', 'tag'];

      let modified = false;
      for (const param of paramsToRemove) {
        if (url.searchParams.has(param)) {
          url.searchParams.delete(param);
          modified = true;
        }
      }

      if (modified) {
        history.replaceState(null, document.title, url.toString());
        console.info(`[${SCRIPT_ID}] Tracking parameters removed`);
      }
    };

    document.addEventListener('DOMContentLoaded', cleanTrackingParams, { once: true });
  }
})();
