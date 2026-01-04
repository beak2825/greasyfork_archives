// ==UserScript==
// @name         Twitter(X) search auto update
// @namespace    http://tampermonkey.net/
// @version      2025-01-17
// @description  検索(最新)時に一定時間毎にスクロールさせ更新を誘発させます
// @author       ziopuzzle
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524044/Twitter%28X%29%20search%20auto%20update.user.js
// @updateURL https://update.greasyfork.org/scripts/524044/Twitter%28X%29%20search%20auto%20update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sleep = async(time) => new Promise((r) => setTimeout(r, time));

    const isLiveSearchPage = () => {
        return window.location.hostname === "x.com"
            && window.location.pathname === "/search"
            && new URLSearchParams(window.location.search).get("f") === "live";
    }

    const updateTimeline = async () => {
        if (isLiveSearchPage()) {
            window.scroll({top:500});
            await sleep(10);
            window.scroll({top:0});
        }
    }

    setInterval(updateTimeline, 60 * 1000);

})();