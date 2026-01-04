// ==UserScript==
// @name         腾讯课堂马屁精
// @namespace    Yangjianwen
// @author       Yangjianwen
// @match        https://ke.qq.com/*
// @grant        none
// @version      1.0.0
// @description  腾讯课堂自动送花
// @license      MIT
// @original-author yangjianwen
// @original-license MIT
// @downloadURL https://update.greasyfork.org/scripts/426607/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E9%A9%AC%E5%B1%81%E7%B2%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/426607/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E9%A9%AC%E5%B1%81%E7%B2%BE.meta.js
// ==/UserScript==

(function () {
    // 定时器
    setInterval(() => {
        document.querySelectorAll(".toolbar-icon")[2].click()
        }, 3000)
})();