// ==UserScript==
// @name         Auto start LeetCode timer
// @name:zh-tw   自動開始 LeetCode 計時器
// @namespace    https://github.com/zica87/self-made-userscipts
// @version      1.2
// @description  Automatically start LeetCode official timer.
// @description:zh-tw 自動開始 LeetCode 官方計時器。
// @author       zica
// @match        https://leetcode.com/problems/*
// @grant        none
// @license      GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/456982/Auto%20start%20LeetCode%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/456982/Auto%20start%20LeetCode%20timer.meta.js
// ==/UserScript==

(function () {
    "use strict";

    if (document.URL.includes("/solutions/")) return;

    const observer = new MutationObserver((_, observerInstance) => {
        const cur = document.getElementsByClassName("p-2");
        for (const c of cur) {
            if (
                c.classList.contains("flex-none") &&
                c.dataset?.state !== undefined
            ) {
                c.click();
                observerInstance.disconnect();
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
