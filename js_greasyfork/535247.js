// ==UserScript==
// @name         Cursor-Sheerid-Bypass
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  拦截指定 Fetch 请求并修改URL中的 country=XXX 为 CN
// @author       ZAMBAR
// @match        https://services.sheerid.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535247/Cursor-Sheerid-Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/535247/Cursor-Sheerid-Bypass.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const originalFetch = window.fetch;

    const modifyCountryParam = (url) => {
        if (typeof url !== 'string') return url;
        const urlObj = new URL(url, location.origin);
        if (urlObj.searchParams.has('country')) {
            urlObj.searchParams.set('country', 'CN');
            return urlObj.toString();
        }
        return url;
    };

    window.fetch = function (input, init) {
        if (typeof input === 'string' && input.includes("orgsearch.sheerid.net/rest/organization/search")) {
            console.log("Got input:", input);
            input = modifyCountryParam(input);
            console.log("Modified to:", input);
        } else if (input instanceof Request) {
            const url = input.url;
            if (url.includes("orgsearch.sheerid.net/rest/organization/search")) {
                console.log("Got fetch:", url);
                const newUrl = modifyCountryParam(url);
                console.log("Modified to:", newUrl);

                // Clone
                const newRequest = new Request(newUrl, {
                    method: input.method,
                    headers: input.headers,
                    body: input.body,
                    mode: input.mode,
                    credentials: input.credentials,
                    cache: input.cache,
                    redirect: input.redirect,
                    referrer: input.referrer,
                    integrity: input.integrity,
                    keepalive: input.keepalive,
                    signal: input.signal
                });
                return originalFetch.call(this, newRequest, init);
            }
        }
        return originalFetch.call(this, input, init);
    };
})();