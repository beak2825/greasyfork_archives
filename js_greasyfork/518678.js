// ==UserScript==
// @name 签到脚本
// @description 用于自动签到的脚本
// @namespace https://www.xianyudanji.net/user
// @match https://www.xianyudanji.net/user
// @match https://www.switch520.org/user
// @grant none
// @version 1.1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518678/%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/518678/%E7%AD%BE%E5%88%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 第一步
    window.location.href = 'https://www.xianyudanji.net/user';

    // 等待一段时间，确保页面加载完成
    setTimeout(() => {
        // 第二步
        const todaySignBtn = document.querySelector('每日签到');
        if (todaySignBtn) {
            todaySignBtn.click();
        }

        // 再等待一段时间，然后跳转到第二个网站
        setTimeout(() => {
            window.location.href = 'https://www.switch520.org/user';
        }, 1000);
    }, 2000);

    // 第三步
    setTimeout(() => {
        // 第四步
        const dailySignBtn = document.querySelector('每日签到');
        if (dailySignBtn) {
            dailySignBtn.click();
        }
    }, 3000);
})();