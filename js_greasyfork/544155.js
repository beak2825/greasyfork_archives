// ==UserScript==
// @name         俺不登录金山文档
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  关闭金山文档(kdocs.cn)的登录弹窗
// @author       https://greasyfork.org/zh-CN/users/158417-mo-jie (Gemini 更新)
// @match        https://www.kdocs.cn/l/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544155/%E4%BF%BA%E4%B8%8D%E7%99%BB%E5%BD%95%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/544155/%E4%BF%BA%E4%B8%8D%E7%99%BB%E5%BD%95%E9%87%91%E5%B1%B1%E6%96%87%E6%A1%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('金山文档拟真点击脚本已启动 (v1.1)...');

    // 创建一个函数来派发鼠标事件，让参数更标准
    function dispatchMouseEvent(target, eventType) {
        if (!target) return;
        const event = new MouseEvent(eventType, {
            bubbles: true,
            cancelable: true,
            view: window
        });
        target.dispatchEvent(event);
    }

    // 设置一个定时器，持续寻找关闭按钮
    const intervalId = setInterval(() => {
        // 2025-11-09 更新：
        // 原来的选择器 'button.wlcp-close' 已失效
        // 新的策略：通过查找关闭按钮的图标 (class="kd-icon-symbol_cross_two") 来定位按钮
        const closeIcon = document.querySelector('div.wps-login-center-panel i.kd-icon-symbol_cross_two');
        const closeButton = closeIcon ? closeIcon.closest('button') : null;

        if (closeButton) {
            console.log('发现关闭按钮，准备执行拟真点击...');

            // 找到按钮后就停止继续寻找，只执行一次操作
            clearInterval(intervalId);

            // 步骤 1: 将焦点设置到按钮上
            closeButton.focus();

            // 步骤 2: 模拟鼠标按下
            dispatchMouseEvent(closeButton, 'mousedown');

            // 步骤 3: 模拟一个短暂的、类似人类的点击延迟
            setTimeout(() => {
                // 步骤 4: 模拟鼠标抬起
                dispatchMouseEvent(closeButton, 'mouseup');

                // 步骤 5: 触发最终的点击事件
                closeButton.click();

                console.log('拟真点击已执行。');
            }, 100); // 100毫秒的延迟
        }
    }, 500); // 每半秒检查一次

})();