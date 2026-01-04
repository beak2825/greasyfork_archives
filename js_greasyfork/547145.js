// ==UserScript==
// @name         TikTok (remove redirect)
// @namespace    http://tampermonkey.net/
// @version      2025-08-23
// @description  Remove TikTok redirect to app store if app is not installed
// @author       You
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain_url=https%3A%2F%2Fwww.tiktok.com%2F%40undercovertourist%2Fvideo%2F7541576461610781982%3F_t%3DZT-8z7ZyNqWbyH%26_r%3D1
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547145/TikTok%20%28remove%20redirect%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547145/TikTok%20%28remove%20redirect%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //https://www.tiktok.com/@undercovertourist/video/7541576461610781982?_t=ZT-8z7ZyNqWbyH&_r=1
    const params = new URLSearchParams(window.location.search);

    if (location.protocol && location.host && location.pathname && params.get('_t')) {
        const url = location.protocol + '//' + location.host + location.pathname;
        window.location.replace(url);
    }
})();