// ==UserScript==
// @name         多邻国 无限红心
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Duolingo Super付费会员无限红心
// @author       Your Name
// @match        *://www.duolingo.com/*
// @match        *://www.duolingo.cn/*
// @grant        unsafeWindow
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/521771/%E5%A4%9A%E9%82%BB%E5%9B%BD%20%E6%97%A0%E9%99%90%E7%BA%A2%E5%BF%83.user.js
// @updateURL https://update.greasyfork.org/scripts/521771/%E5%A4%9A%E9%82%BB%E5%9B%BD%20%E6%97%A0%E9%99%90%E7%BA%A2%E5%BF%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFetch = unsafeWindow.fetch;

    unsafeWindow.fetch = async function(input, init) {
        const response = await originalFetch(input, init);
        if (input.includes('/users')) {
            const data = await response.json();
            if (data && data.health && data.health.hearts !== undefined) {
                data.health.hearts = 999;
            }
            return new Response(JSON.stringify(data), {
                status: response.status,
                statusText: response.statusText,
                headers: response.headers
            });
        }

        return response;
    };

})();
