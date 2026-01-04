// ==UserScript==
// @name         bilibili wayback
// @namespace    http://tampermonkey.net/
// @version      2024-09-08
// @description  将b站首页推荐替换成随机老视频(2019之前)
// @author       You
// @match        https://www.bilibili.com/
// @icon         https://p.sda1.dev/19/cfe475595af1b40e42368711ac2acd75
// @grant        none
// @run-at document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507391/bilibili%20wayback.user.js
// @updateURL https://update.greasyfork.org/scripts/507391/bilibili%20wayback.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const { fetch: originalFetch } = window;

    window.fetch = async (...args) => {
        let [resource, config] = args;
        let origin_url;
        if (resource instanceof window.Request) {
            origin_url = resource.url;
        } else {
            origin_url = resource.toString();
        }
        let target_prefix = 'https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd';
        if (!origin_url.startsWith(target_prefix)) {
            return originalFetch(resource, config);
        } else {
            let ps = new URL(origin_url).searchParams.get('ps') || 12;
            return originalFetch(`https://imfeelinglucky.linkpc.net/random_id?ps=${ps}`);
        }
    };

    window.addEventListener('load', function() {
        document.querySelector('.primary-btn.roll-btn').click();
    });
})();