// ==UserScript==
// @name         触屏转鼠标事件
// @version      1.0
// @description  将触摸事件转换为鼠标事件
// @author       ChatGPT
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/503495/%E8%A7%A6%E5%B1%8F%E8%BD%AC%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/503495/%E8%A7%A6%E5%B1%8F%E8%BD%AC%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建鼠标事件
    function createMouseEvent(type, touchEvent) {
        return new MouseEvent(type, {
            bubbles: true, // 事件是否应该冒泡
            cancelable: true, // 事件是否可以被取消
            view: window, // 事件的视图
            clientX: touchEvent.clientX, // 触摸点的水平坐标
            clientY: touchEvent.clientY // 触摸点的垂直坐标
        });
    }

    // 触摸事件转换为鼠标事件
    function touchToMouse(e) {
        const touches = e.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            const mouseEvent = createMouseEvent(
                e.type === 'touchstart' ? 'mousedown' :
                e.type === 'touchend' ? 'mouseup' :
                'mousemove', touch
            );
            touch.target.dispatchEvent(mouseEvent);
        }
    }

    // 监听触摸事件并转换为鼠标事件
    document.addEventListener('touchstart', touchToMouse, false);
    document.addEventListener('touchend', touchToMouse, false);
    document.addEventListener('touchmove', touchToMouse, false);
})();
