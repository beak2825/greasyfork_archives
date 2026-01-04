// ==UserScript==
// @name                YouTube & Bilibili - Disable SW & Block Blob Workers
// @description     YouTube & Bilibili - Disable SW & Block Blob Workers?
// @version             0.0.6
// @namespace           UserScripts
// @match               https://www.youtube.com/*
// @match               https://www.youtube-nocookie.com/embed/*
// @match               https://studio.youtube.com/live_chat*
// @match               https://www.bilibili.com/*
// @match               https://live.bilibili.com/*
// @match               https://api.bilibili.com/*
// @match               https://passport.bilibili.com/*
// @license MIT
// @grant               none
// @run-at              document-start
// @downloadURL https://update.greasyfork.org/scripts/538373/YouTube%20%20Bilibili%20-%20Disable%20SW%20%20Block%20Blob%20Workers.user.js
// @updateURL https://update.greasyfork.org/scripts/538373/YouTube%20%20Bilibili%20-%20Disable%20SW%20%20Block%20Blob%20Workers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*** —— 一、現有的 Disable SW (sw.js) 代碼 —— ***/
    if (
        typeof ServiceWorkerContainer === "function" &&
        typeof ServiceWorkerRegistration === "function" &&
        typeof (ServiceWorkerContainer.prototype || 0).getRegistrations === 'function' &&
        !ServiceWorkerContainer.prototype.register767
    ) {
        const filterSW = (e) => {
            const url = typeof e === 'string'
                ? e
                : `${((e || 0).active || 0).scriptURL || ''}`;
            return url.endsWith('/sw.js');
        };
        const makeReject = true;
        const unRegisterAll = () => {
            const sw = ((typeof navigator === 'object') ? navigator : 0).serviceWorker || 0;
            if (sw && typeof sw.getRegistrations === 'function') {
                sw.getRegistrations()
                    .then(regs => {
                        if (regs.length >= 1) {
                            const promises = regs
                                .filter(filterSW)
                                .map(reg => reg.unregister().catch(console.warn));
                            return Promise.all(promises);
                        }
                    })
                    .catch(console.warn);
            }
        };
        let i = 0;
        const scriptCollection = document.getElementsByTagName('script');
        (new MutationObserver((mutations, observer) => {
            if ((typeof yt !== 'object' && typeof Bili === 'undefined') || scriptCollection.length === 0) {
                return;
            }
            if (i < 394 && document.readyState === "complete") i = 394;
            if (++i > 400) {
                observer.disconnect();
                return;
            }
            if (typeof navigator !== "object") return;
            if (!('serviceWorker' in navigator) || !navigator.serviceWorker) return;
            if (typeof navigator.serviceWorker.getRegistrations !== "function") return;
            unRegisterAll();
        })).observe(document, {
            subtree: true,
            childList: true,
            attributes: true
        });
        ServiceWorkerContainer.prototype.register767 = ServiceWorkerContainer.prototype.register;
        ServiceWorkerContainer.prototype.register = function (url, ...args) {
            if (!filterSW(`${url}`)) {
                return this.register767(...arguments);
            }
            if (i < 394) i = 394;
            Promise.resolve().then(unRegisterAll);
            return new Promise((resolve, reject) => {
                if (makeReject) {
                    setTimeout(() => {
                        reject(new TypeError("Failed to register a ServiceWorker."));
                    }, Math.round(1300 + 1700 * Math.random()) + 0.125);
                } else {
                    resolve();
                }
            });
        };
        Promise.resolve().then(unRegisterAll);
        unRegisterAll();
    }

    /*** —— 二、攔截 Bilibili 的 Blob Worker 代碼 —— ***/

    // 1. 保留原生 Worker 參考
    const NativeWorker = window.Worker;

    // 2. 判斷式：只要 URL 是「blob:https://www.bilibili.com/…」就攔截
    function filterBiliBlob(url) {
        try {
            return String(url).startsWith('blob:https://www.bilibili.com/');
        } catch (e) {
            return false;
        }
    }

    // 3. 全域覆寫 Window.Worker
    window.Worker = function(scriptURL, options) {
        if (filterBiliBlob(scriptURL)) {
            console.warn('[Bili-Blocker] Blocked Worker:', scriptURL);
            // 建立一個「不執行任何內容」的假 Worker
            const dummy = {
                postMessage: () => {},
                terminate: () => {},
                onmessage: null,
                onerror: null,
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false
            };
            return dummy;
        }
        // 非 Bilibili blob，就按原生Worker 行為
        return new NativeWorker(scriptURL, options);
    };

    // 若想封鎖 YouTube 的 Blob Worker 也只需把這邊改成：
//  function filterYouTubeBlob(url) {
//      return String(url).startsWith('blob:https://www.youtube.com/');
//  }
//  window.Worker = function(scriptURL, options) {
//      if (filterYouTubeBlob(scriptURL)) { /* 同理處理 */ }
//      return new NativeWorker(scriptURL, options);
//  };

})();
