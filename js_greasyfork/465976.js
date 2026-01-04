// ==UserScript==
// @name         使用 4 键修改多个元素的值（延迟执行）V0.1
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  当按下 4 键时，延迟半秒后更改 ID 为 height_value、weight_value 和 long_value 的元素的 value
// @author       You
// @match        http://renwu.cloud-label.changan.com.cn/tools/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465976/%E4%BD%BF%E7%94%A8%204%20%E9%94%AE%E4%BF%AE%E6%94%B9%E5%A4%9A%E4%B8%AA%E5%85%83%E7%B4%A0%E7%9A%84%E5%80%BC%EF%BC%88%E5%BB%B6%E8%BF%9F%E6%89%A7%E8%A1%8C%EF%BC%89V01.user.js
// @updateURL https://update.greasyfork.org/scripts/465976/%E4%BD%BF%E7%94%A8%204%20%E9%94%AE%E4%BF%AE%E6%94%B9%E5%A4%9A%E4%B8%AA%E5%85%83%E7%B4%A0%E7%9A%84%E5%80%BC%EF%BC%88%E5%BB%B6%E8%BF%9F%E6%89%A7%E8%A1%8C%EF%BC%89V01.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改元素 value 的函数
    function changeValue(id, newValue) {
        const element = document.getElementById(id);

        if (element) {
            element.value = newValue; // 设置新的值
        } else {
            console.error(`未找到具有 ID "${id}" 的元素`);
        }
    }

    // 在延迟时间后调用 changeValue 函数
    function delayedChange() {
        setTimeout(() => {
            changeValue('height_value', '1.7');
            changeValue('width_value', '1.9');
            changeValue('long_value', '4.91');
            simulateClick('min_long');
        }, 500); // 延迟 500 毫秒（半秒）
    }

    // 模拟点击事件
    function simulateClick(id) {
        const element = document.getElementById(id);

        if (element) {
            element.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        } else {
            console.error(`未找到具有 ID "${id}" 的元素`);
        }
    }

    // 监听键盘事件
    document.addEventListener('keydown', (event) => {
        if (event.key === 'F1') {
            // 按下 4 键时调用 delayedChange 函数
            delayedChange();
        }
    });
})();
