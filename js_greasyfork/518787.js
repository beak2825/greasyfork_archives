// ==UserScript==
// @name        Switch520 跳过入站弹窗
// @author       hihi427
// @description  Switch520自动关闭入站弹窗
// @match       https://*.gamer520.com/*
// @version      0.2
// @icon        https://www.google.com/s2/favicons?sz=64&domain=gamer520.com
// @license MIT
// @namespace https://greasyfork.org/users/1299761
// @downloadURL https://update.greasyfork.org/scripts/518787/Switch520%20%E8%B7%B3%E8%BF%87%E5%85%A5%E7%AB%99%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/518787/Switch520%20%E8%B7%B3%E8%BF%87%E5%85%A5%E7%AB%99%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() { // 使用 IIFE 包裹，避免全局变量污染
    'use strict';

    window.onload = function() {
        // 添加一个短暂的延迟，确保弹窗有时间渲染
        setTimeout(function() {
            // 修改为正确且简洁的选择器，直接选择具有 'swal2-close' 类的按钮
            var btn = document.querySelector('.swal2-close');

            // 检查按钮是否存在再尝试点击，避免再次报错
            if (btn) {
                console.log("找到并点击关闭按钮");
                btn.click();
            } else {
                console.log("未找到关闭按钮，可能弹窗结构已更改或尚未加载");
            }
        }, 0); // 500毫秒延迟，可根据实际情况调整
    };
})();