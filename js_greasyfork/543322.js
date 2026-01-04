// ==UserScript==
// @name         통나무 파워 자동 클릭
// @namespace    http://tampermonkey.net/
// @version      2025-07-22
// @description  치지직 통나무 파워 자동 클릭
// @author       김이박최더보기뿡댕
// @match        https://chzzk.naver.com/live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543322/%ED%86%B5%EB%82%98%EB%AC%B4%20%ED%8C%8C%EC%9B%8C%20%EC%9E%90%EB%8F%99%20%ED%81%B4%EB%A6%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/543322/%ED%86%B5%EB%82%98%EB%AC%B4%20%ED%8C%8C%EC%9B%8C%20%EC%9E%90%EB%8F%99%20%ED%81%B4%EB%A6%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CHECK_INTERVAL_MS = 30 * 1000;

    setInterval(() => {
        const button = document.querySelector("button.live_chatting_power_button__Ov3eJ");
        if (button) {
            button.click();
        }
    }, CHECK_INTERVAL_MS);
})();