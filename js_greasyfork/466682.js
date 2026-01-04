// ==UserScript==
// @name         禁止网页双击放大
// @author       ChatGPT
// @version      1.1
// @description  可以通过油猴菜单控制当前页面是否启用禁止双击放大功能，默认启用该功能。
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/466682/%E7%A6%81%E6%AD%A2%E7%BD%91%E9%A1%B5%E5%8F%8C%E5%87%BB%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/466682/%E7%A6%81%E6%AD%A2%E7%BD%91%E9%A1%B5%E5%8F%8C%E5%87%BB%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前网站URL，并根据其生成一个唯一的存储键
    var storageKey = window.location.hostname;

    // 根据存储键获取已保存的设置（如果存在）
    var isEnabled = GM_getValue(storageKey, true);

    // 禁止双击放大的函数
    function disableDoubleClickZoom() {
        let lastTouchEnd = 0;
        let body = document.body;

        // 监听touchend事件，阻止事件默认行为
        body.addEventListener("touchend", function(event) {
            let now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // 禁止双击缩放
        body.addEventListener("gesturestart", function(event) {
            event.preventDefault();
        });
    }

    // 启用或禁用双击放大功能
    function toggleDoubleClickZoom(isEnabled) {
        if (isEnabled) {
            disableDoubleClickZoom(); // 启用禁止双击放大
        } else {
            // 如果需要禁用，移除之前的事件监听
            let body = document.body;
            body.removeEventListener("touchend", function() {}, false);
            body.removeEventListener("gesturestart", function() {}, false);
        }
    }

    // 根据保存的设置来启用或禁用功能
    toggleDoubleClickZoom(isEnabled);

    // 创建油猴菜单项，在菜单中添加“启用”和“禁用”选项
    GM_registerMenuCommand(isEnabled ? '点击允许网页双击放大' : '点击禁止网页双击放大', function() {
        isEnabled = !isEnabled;
        GM_setValue(storageKey, isEnabled);
        toggleDoubleClickZoom(isEnabled);
    });
})();
