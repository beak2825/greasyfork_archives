// ==UserScript==
// @name         ipleak 自动刷新
// @namespace    https://greasyfork.org/users/1171320
// @version      0.11
// @description  维护个鸡脖，刷新看看。自动刷新 ipleak.net 页面当显示 "Under maintenance" 时,Auto Refresh ipleak.net When Under Maintenance
// @author       yzcjd
// @author2     Lama AI 辅助瞎写
// @match        https://ipleak.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528513/ipleak%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/528513/ipleak%20%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义刷新间隔时间（以毫秒为单位），这里设置为 1 秒
    const REFRESH_INTERVAL = 1000;

    // 检查页面内容是否显示 "Under maintenance" 或 "维护中"
    function checkMaintenance() {
        const bodyText = document.body.innerText || ""; // 获取页面正文内容
        if (bodyText.includes("Under maintenance") || bodyText.includes("维护中")) {
            console.log("检测到页面显示维护信息，将在 " + REFRESH_INTERVAL / 1000 + " 秒后刷新...");
            setTimeout(() => {
                location.reload(); // 刷新页面
            }, REFRESH_INTERVAL);
        }
    }

    // 页面加载完成后立即检查
    checkMaintenance();
})();