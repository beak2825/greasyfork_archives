// ==UserScript==
// @name                YouTube - Disable Service Worker
// @name:ja             YouTube - Disable Service Worker
// @name:zh-TW          YouTube - Disable Service Worker
// @name:zh-CN          YouTube - Disable Service Worker
// @namespace           UserScripts
// @version             0.0.4
// @match               https://www.youtube.com/*
// @match               https://www.youtube-nocookie.com/embed/*
// @match               https://studio.youtube.com/live_chat*
// @license             MIT
// @author              CY Fung
// @icon                https://raw.githubusercontent.com/cyfung1031/userscript-supports/main/icons/yt-engine.png
// @grant               none
// @run-at              document-start
// @unwrap
// @inject-into         page
// @allFrames           true
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
//
// @description         To disable Service Worker (sw.js)
// @description:ja      To disable Service Worker (sw.js)
// @description:zh-TW   To disable Service Worker (sw.js)
// @description:zh-CN   To disable Service Worker (sw.js)
//
// @downloadURL https://update.greasyfork.org/scripts/536349/YouTube%20-%20Disable%20Service%20Worker.user.js
// @updateURL https://update.greasyfork.org/scripts/536349/YouTube%20-%20Disable%20Service%20Worker.meta.js
// ==/UserScript==

if (typeof ServiceWorkerContainer === "function" && typeof ServiceWorkerRegistration === "function" && typeof (ServiceWorkerContainer.prototype || 0).getRegistrations === 'function' && !ServiceWorkerContainer.prototype.register767) {
    const filterSW = (e) => {
        const url = typeof e === 'string' ? e : `${((e || 0).active || 0).scriptURL}`;
        return url.endsWith('/sw.js');
    };
    const makeReject = true;
    const unRegisterAll = () => {
        const sw = ((typeof navigator === 'object' ? navigator : null) || 0).serviceWorker || 0;
        if (sw && typeof sw.getRegistrations === 'function') {
            sw.getRegistrations().then(e => e.length >= 1 && Promise.all(e.filter(filterSW).map(e => e.unregister().catch(console.warn)))).catch(console.warn);
        }
    }
    let i = 0;
    const scriptCollection = document.getElementsByTagName('script');
    (new MutationObserver((mutations, observer) => {
        if (typeof yt !== 'object' || scriptCollection.length === 0) return;
        if (i < 394 && document.readyState === "complete") i = 394;
        if (++i > 400) {
            observer.disconnect();
            return;
        }
        if (typeof navigator !== "object") return;
        if (!('serviceWorker' in navigator) || !navigator.serviceWorker) return;
        if (typeof navigator.serviceWorker.getRegistrations !== "function") return;
        unRegisterAll();
    })).observe(document, { subtree: true, childList: true, attributes: true });
    ServiceWorkerContainer.prototype.register767 = ServiceWorkerContainer.prototype.register;
    ServiceWorkerContainer.prototype.register = function (url, ...args) {
        if (!filterSW(`${url}`)) {
            return this.register767(...arguments);
        }
        if (i < 394) i = 394;
        Promise.resolve().then(unRegisterAll);
        return new Promise((resolve, reject) => {
            makeReject && setTimeout(() => {
                reject(new TypeError("Failed to register a ServiceWorker."));
            }, Math.round(1300 + 1700 * Math.random()) + 0.125);
        });
    };
    Promise.resolve().then(unRegisterAll);
    unRegisterAll();
}
