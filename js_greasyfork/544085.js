// ==UserScript==
// @name         수수3
// @namespace    http://tampermonkey.net/
// @version      2025-07-31
// @description  막아버려
// @match        https://www.ticketlink.co.kr/sports/*
// @match        https://facility.ticketlink.co.kr/reserve/product/54833/schedule/*
// @match        https://facility.ticketlink.co.kr/reserve/product/55319/schedule/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544085/%EC%88%98%EC%88%983.user.js
// @updateURL https://update.greasyfork.org/scripts/544085/%EC%88%98%EC%88%983.meta.js
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