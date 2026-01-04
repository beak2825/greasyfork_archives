// ==UserScript==
// @name         bilibili BV 转 AV
// @run-at       document-start
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/s/video/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  BV 号自动转 AV 号
// @author       share121
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458811/bilibili%20BV%20%E8%BD%AC%20AV.user.js
// @updateURL https://update.greasyfork.org/scripts/458811/bilibili%20BV%20%E8%BD%AC%20AV.meta.js
// ==/UserScript==
(() => {
    function BV2AV(BV) {
        return `${(Object.values(BV).map((e, i) =>
            BigInt("fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF".indexOf(e)) * 58n **
            BigInt([6, 2, 4, 8, 5, 9, 3, 7, 1, 0][i])
        ).reduce((prev, curr) => prev + curr) - 100618342136696320n) ^ 177451812n}`;
    }
    function replaceURL(url) {
        return url.replace(/BV([1-9A-HJ-NP-Za-km-z]+)/g, (_, p1) => "av" + BV2AV(p1));
    }
    history.replaceState({}, "", replaceURL(location.href));
    let pushState = history.pushState, replaceState = history.replaceState;
    history.pushState = function (...a) {
        a[a.length - 1] = replaceURL(a[a.length - 1]);
        return pushState.apply(this, a);
    };
    history.replaceState = function (...a) {
        a[a.length - 1] = replaceURL(a[a.length - 1]);
        return replaceState.apply(this, a);
    };
})();