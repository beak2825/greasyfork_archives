// ==UserScript==
// @name         触屏翻页脚本
// @version      2.0
// @description  点击屏幕上方空白处上翻，屏幕空白处下方下翻
// @author       ChatGPT
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/499728/%E8%A7%A6%E5%B1%8F%E7%BF%BB%E9%A1%B5%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/499728/%E8%A7%A6%E5%B1%8F%E7%BF%BB%E9%A1%B5%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clicked = false; // 标记是否点击过屏幕

    document.addEventListener('click', function(e) {
        if (clicked) {
            // 防止连续点击
            return;
        }

        // 检查点击的目标是否是超链接
        var target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentNode;
        }

        if (target && target.tagName === 'A') {
            // 如果点击的是超链接，则取消默认行为
            return;
        }

        clicked = true;
        setTimeout(function() {
            var clickedY = e.clientY; // 获取鼠标点击位置的Y坐标
            var threshold = window.innerHeight / 2; // 判断上下滑动的阈值

            if (clickedY < threshold) {
                // 点击了屏幕上半屏
                window.scrollBy(0, -window.innerHeight / 6 * 5); // 上滑六分之五屏
            } else {
                // 点击了屏幕下半屏
                window.scrollBy(0, window.innerHeight / 6 * 5); // 下滑六分之五屏
            }

            clicked = false;
        }, 200); // 设置延迟时间
    });

})();
