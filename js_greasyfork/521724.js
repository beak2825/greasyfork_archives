// ==UserScript==
// @name         华博59iedu  2024
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动检测进度并点击课程学习按钮
// @author       你的名字
// @match        https://fjysxhpx.59iedu.com/center/myRealClass/* 
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521724/%E5%8D%8E%E5%8D%9A59iedu%20%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/521724/%E5%8D%8E%E5%8D%9A59iedu%20%202024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 点击进度对应的课程学习按钮
    function clickCourseLearnButton(button) {
        if (button) {
            console.log('点击课程学习按钮：', button);
            button.click();
        }
    }

    // 检测进度并点击对应的课程学习按钮
    function checkProgressAndClick() {
        // 获取所有的进度条元素和对应的课程学习按钮
        var progresses = document.querySelectorAll('.process');
        var courseLearnButtons = document.querySelectorAll('a.ui-btn.btn-gr.ui-btn-2[ng-click^="events.tryListen"]');

        // 遍历进度条元素
        for (var i = 0; i < progresses.length; i++) {
            // 获取进度条的百分比数值
            var progressNum = progresses[i].querySelector('.process-num');
            var progressValue = progressNum ? progressNum.textContent.trim() : '0%';
            console.log('进度条 ' + (i + 1) + ' 的数值: ' + progressValue);

            // 根据进度值点击对应的课程学习按钮
            if (progressValue !== '100%' && i < courseLearnButtons.length) {
                // 如果进度不等于100%，则点击对应的课程学习按钮
                clickCourseLearnButton(courseLearnButtons[i]);
                return; // 只点击第一个不等于100%的进度对应的按钮
            } else if (progressValue === '100%' && i < progresses.length - 1) {
                // 如果当前进度等于100%，则点击下一个进度对应的按钮
                if (progresses[i + 1].querySelector('.process-num').textContent.trim() !== '100%') {
                    clickCourseLearnButton(courseLearnButtons[i + 1]);
                    return;
                }
            }
        }
    }

    // 检查是否在指定的页面上
    function startChecking() {
        if (window.location.href.indexOf("https://fjysxhpx.59iedu.com/center/myRealClass/") !== -1) {
            // 立即检查并点击
            setTimeout(checkProgressAndClick, 15000);// 15秒检查并点击一次
            // 每45分钟检查进度条状态
            var intervalId = setInterval(checkProgressAndClick, 2700000);
            // 在页面卸载时清除定时器
            window.addEventListener('beforeunload', function() {
                clearInterval(intervalId);
            });
        }
    }

    // 使用window.addEventListener('load', function() {...})来确保在页面所有资源加载完成后执行
    window.addEventListener('load', startChecking);
})();