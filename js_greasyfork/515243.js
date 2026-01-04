// ==UserScript==
// @name         치지직 1080p 고정
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  치지직 1080p 고정합니다
// @match        *://chzzk.naver.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515243/%EC%B9%98%EC%A7%80%EC%A7%81%201080p%20%EA%B3%A0%EC%A0%95.user.js
// @updateURL https://update.greasyfork.org/scripts/515243/%EC%B9%98%EC%A7%80%EC%A7%81%201080p%20%EA%B3%A0%EC%A0%95.meta.js
// ==/UserScript==

(function () {
    const interval = setInterval(() => {
        const hrel = document.querySelectorAll(
            `.pzp-pc-setting-quality-pane__list-container > li:first-child:not(.pzp-pc-ui-setting-item--checked)`
        )[0];
        if (hrel) {
            hrel.click();
            console.log("1080 fix");
        }
    }, 500);
})();
