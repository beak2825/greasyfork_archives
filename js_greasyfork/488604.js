// ==UserScript==
// @name         鼠标连点器
// @version      1.0
// @description  当页面元素被点击后记录该元素，F9触发每5秒点击一次，F12停止触发点击事件。
// @author       fangtiansheng
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/718654
// @downloadURL https://update.greasyfork.org/scripts/488604/%E9%BC%A0%E6%A0%87%E8%BF%9E%E7%82%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/488604/%E9%BC%A0%E6%A0%87%E8%BF%9E%E7%82%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义变量用于存储被点击的元素
    let clickedElement = null;
    // 定义变量用于存储定时器ID
    let intervalId = null;

    // 监听页面中的点击事件
    document.addEventListener('click', function(event) {
        // 更新被点击的元素
        clickedElement = event.target;
        //console.log('clickedElement:', clickedElement);
    }, false);

    // 监听键盘按键事件
    document.addEventListener('keydown', function(event) {
        // 当F9被按下，开始触发点击事件
        if (event.key === 'F9') {
            // 如果已经有定时器在运行，则先清除
            if (intervalId !== null) {
                clearInterval(intervalId);
            }
            // 每隔5秒触发一次点击事件
            intervalId = setInterval(function() {
                if (clickedElement !== null) {
                    clickedElement.click();
                }
            }, 5000);
        }
        // 当F12被按下，停止触发点击事件
        else if (event.key === 'F12') {
            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
    }, false);
})();