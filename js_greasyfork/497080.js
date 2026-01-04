// ==UserScript==
// @name         Bilibili直播 快捷键去水印
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Press Shift+P to remove element on live.bilibili.com
// @author       Sucaiking with GPT
// @match        *://live.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497080/Bilibili%E7%9B%B4%E6%92%AD%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/497080/Bilibili%E7%9B%B4%E6%92%AD%20%E5%BF%AB%E6%8D%B7%E9%94%AE%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        // 检查是否按下了Shift+P
        if (event.shiftKey && event.code === 'KeyP') {
            // 删除class为"web-player-module-area-mask"的元素
            removeElementByClass('web-player-module-area-mask');

            // 删除元素后再次检查
            checkElements('web-player-module-area-mask');
        }
    });

    // 删除指定class的元素
    function removeElementByClass(className) {
        const elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    // 检查是否还有指定class的元素
    function checkElements(className) {
        const elements = document.getElementsByClassName(className);
        if (elements.length > 0) {
            console.log('failed');
        } else {
            console.log('success');
        }
    }
})();
