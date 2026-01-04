// ==UserScript==
// @name         长按转右击
// @author       ChatGPT
// @version      1.0
// @description  将触屏长按转换为鼠标右击
// @match        *://*/*
// @run-at      document-end
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/503289/%E9%95%BF%E6%8C%89%E8%BD%AC%E5%8F%B3%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/503289/%E9%95%BF%E6%8C%89%E8%BD%AC%E5%8F%B3%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let touchTimer = null;

    document.addEventListener('touchstart', function(e) {
        // 启动计时器，当长按超过500ms时触发右键点击
        touchTimer = setTimeout(function() {
            // 创建并触发右键点击事件
            let evt = new MouseEvent('contextmenu', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            });
            e.target.dispatchEvent(evt);
        }, 500);  // 长按时间阈值，500ms

    }, false);

    document.addEventListener('touchend', function(e) {
        // 取消计时器，如果没有达到长按时间阈值则不触发右键
        clearTimeout(touchTimer);
    }, false);
})();