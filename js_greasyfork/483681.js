// ==UserScript==
// @name         Change Background to Image
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the background of elements with class .dailyChallengeContainer___udY4u to a specified image
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483681/Change%20Background%20to%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/483681/Change%20Background%20to%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用setTimeout延迟0.5秒执行
    setTimeout(function() {
        // 选择页面上所有指定的元素
        var selectors = ['.dailyChallengeContainer___udY4u', '.wrapper___cSTyt', '.game_container', '.prepare', '.game-container[data-v-67da526c]'];
        selectors.forEach(function(selector) {
            var elements = document.querySelectorAll(selector);

            // 更改这些元素的背景
            elements.forEach(function(element) {
                element.style.backgroundColor = 'transparent'; // 移除原有的背景颜色
                var imageUrl = localStorage.getItem('customBackgroundImageUrl'); // 从localStorage获取URL
                element.style.backgroundImage = 'url("' + imageUrl + '")'; // 设置新的背景图片
                element.style.backgroundSize = 'cover';
                element.style.backgroundRepeat = 'no-repeat'; // 防止背景图片重复
                element.style.backgroundPosition = 'center center'; // 居中背景图片
            });
        });
    }, 500); // 延迟时间为500毫秒
})();
