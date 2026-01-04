// ==UserScript==
// @name         SOOSOSOOSOSOO
// @namespace    http://tampermonkey.net/
// @version      2025-07-09
// @description  block unwanted blobs & netfunnel
// @match        https://www.ticketlink.co.kr/*
// @match        https://facility.ticketlink.co.kr/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542083/SOOSOSOOSOSOO.user.js
// @updateURL https://update.greasyfork.org/scripts/542083/SOOSOSOOSOSOO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Worker 차단
    window.Worker = new Proxy(window.Worker, {
        construct(target, args) {
            console.log("[차단됨] Worker 생성 시도", args);
            return null;
        }
    });

    // URL.createObjectURL 차단
    URL.createObjectURL = new Proxy(URL.createObjectURL, {
        apply(target, thisArg, args) {
            console.log("[차단됨] createObjectURL 시도", args);
            return "blob:https://invalid/";
        }
    });

    // fetch 후킹
    const originalFetch = fetch;
    window.fetch = async (...args) => {
        if (args[0].includes("LiveTicketNF") || args[0].includes("blob:")) {
            console.log("[차단됨] fetch 차단됨", args[0]);
            return new Response('', { status: 404 });
        }
        return originalFetch(...args);
    };

    // XMLHttpRequest 후킹
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes("LiveTicketNF") || url.includes("blob:")) {
            console.log("[차단됨] XHR 차단됨", url);
            this.abort(); // 요청 중단
        } else {
            return originalXHROpen.apply(this, arguments);
        }
    };

})();