// ==UserScript==
// @name        华博2 59iedu.com
// @namespace   Violentmonkey Scripts
// @match       https://fjysxhpx.59iedu.com/*
// @version     1.0
// @author      -
// @description 2024/12/23 16:20:41
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521725/%E5%8D%8E%E5%8D%9A2%2059ieducom.user.js
// @updateURL https://update.greasyfork.org/scripts/521725/%E5%8D%8E%E5%8D%9A2%2059ieducom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 点击进度对应的课程学习按钮
    function clickCourseLearnButton(index) {
        // 获取所有的课程学习按钮
        var courseLearnButtons = document.querySelectorAll('.ui-btn.btn-gr.ui-btn-2:nth-child(3)');

        // 检查索引是否在按钮范围内
        if (index < courseLearnButtons.length) {
            var button = courseLearnButtons[index];
            console.log('点击第 ' + (index + 1) + ' 个进度对应的课程学习按钮：', button);

            // 尝试获取 ng-click 绑定的函数
            var ngClickAttr = button.getAttribute("ng-click");
            if (ngClickAttr) {
                try {
                    // 创建一个点击事件对象
                    var event = new MouseEvent('click', {
                        'bubbles': true,
                        'cancelable': true,
                        'view': window
                    });

                    // 触发 ng-click 事件
                    button.dispatchEvent(event);
                } catch (e) {
                    console.error('调用 ng-click 函数失败:', e);
                }
            } else {
                console.warn('未找到 ng-click 属性');
            }
        } else {
            console.log('没有更多的进度对应的课程学习按钮可以点击');
        }
    }

    // 检测进度并点击对应的课程学习按钮
    function checkProgressAndClick() {
        // 获取所有的进度条元素
        var progresses = document.querySelectorAll('.process .current');
        // 获取所有的进度数值元素
        var progressNums = document.querySelectorAll('.process-num');

        // 遍历进度条元素
        for (var i = 0; i < progresses.length; i++) {
            // 获取进度条的百分比数值
            var progressValue = progressNums[i].textContent.trim();
            console.log('进度条 ' + (i + 1) + ' 的数值: ' + progressValue);

            // 根据进度值点击对应的课程学习按钮
            if (progressValue !== '100%') {
                clickCourseLearnButton(i);
                return; // 如果当前进度不等于100%，则点击当前进度对应的按钮并退出函数
            }
        }

        // 如果所有进度都等于100%，则无需点击任何按钮
        console.log('所有进度都已完成');
    }

    // 检查是否在指定的页面上
    if (window.location.href.indexOf("https://fjysxhpx.59iedu.com/center/myRealClass/") !== -1) {
        // 立即检查并点击，然后每隔一定时间检查进度条状态
        setTimeout(checkProgressAndClick, 15000);// 秒检查并点击一次
        setInterval(checkProgressAndClick, 2700000); // 每5秒检查并点击一次
    }
})();

