// ==UserScript==
// @name         自动确认北京综合素质评价
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击学生发布的动态中“确认活动”按键，自动点击“查看更多圈子动态”按键加载余下的动态，自动完成加载新动态-确认活动的循环
// @author       Laowu
// @match        https://zhsz.bjedu.cn/web/index/index
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522897/%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4%E5%8C%97%E4%BA%AC%E7%BB%BC%E5%90%88%E7%B4%A0%E8%B4%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/522897/%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4%E5%8C%97%E4%BA%AC%E7%BB%BC%E5%90%88%E7%B4%A0%E8%B4%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function confirmActivity() {
        // 查找所有“确认活动”按键并点击
        const confirmButtons = document.querySelectorAll('.check_team');
        confirmButtons.forEach(button => {
            if (button.innerText.includes('确认活动')) {
                button.click();
            }
        });

        // 查找“查看更多圈子动态”按键并点击
        const loadMoreButton = document.querySelector('.add-more-news a');
        if (loadMoreButton && loadMoreButton.innerText.includes('查看圈子更多动态')) {
            loadMoreButton.click();
        }
    }

    // 等待页面加载完成后执行
    window.addEventListener('load', function() {
        // 初次运行
        confirmActivity();

        // 设置定时器，每隔一段时间执行一次
        setInterval(confirmActivity, 5000); // 每5秒执行一次，可以根据需要调整
    });
})();