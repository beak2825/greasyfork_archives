// ==UserScript==
// @name         치지직 자동 1080p
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  자동으로 1080p로 설정
// @match        *://chzzk.naver.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524394/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%9E%90%EB%8F%99%201080p.user.js
// @updateURL https://update.greasyfork.org/scripts/524394/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%9E%90%EB%8F%99%201080p.meta.js
// ==/UserScript==

(function () {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const hrel = document.querySelector(
                `.pzp-pc-setting-quality-pane__list-container > li:first-child:not(.pzp-pc-ui-setting-item--checked)`
            );
            if (hrel) {
                hrel.click();
                console.log("1080 fix");
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
