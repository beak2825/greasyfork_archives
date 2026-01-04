// ==UserScript==
// @name         hgamefree.info captcha skip
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  移除瀏覽太快時的人機檢查
// @author       Lin_tsen
// @match        https://hgamefree.info/adult-video-game/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537657/hgamefreeinfo%20captcha%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/537657/hgamefreeinfo%20captcha%20skip.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        // 移除圖片驗證主框
        const captcha = document.getElementById("rc-imageselect");
        if (captcha) captcha.remove();

        // 移除底部黑框
        const footer = document.querySelector(".rc-footer");
        if (footer) footer.remove();

        // 移除含 iframe 的主外殼 div（z-index 非常高）
        const recaptchaBubble = Array.from(document.querySelectorAll("div"))
            .find(div => div.style.zIndex === "2000000000" && div.querySelector("iframe"));
        if (recaptchaBubble) recaptchaBubble.remove();

        // 可選：移除所有包含 "g-recaptcha-bubble-arrow" 的 div
        const arrows = document.querySelectorAll(".g-recaptcha-bubble-arrow");
        arrows.forEach(el => el.remove());
    }

    const observer = new MutationObserver(() => {
        removeElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 預防初始已載入
    removeElements();
})();