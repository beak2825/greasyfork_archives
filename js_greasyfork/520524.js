// ==UserScript==
// @name         Auto Click Target on Mouse Accuracy
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Auto click targets in Mouse Accuracy with better accuracy
// @author       HưngVN
// @license      MIT
// @match        https://mouseaccuracy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520524/Auto%20Click%20Target%20on%20Mouse%20Accuracy.user.js
// @updateURL https://update.greasyfork.org/scripts/520524/Auto%20Click%20Target%20on%20Mouse%20Accuracy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const clickedTargets = new Set(); // Lưu các target đã bấm

    // Hàm mô phỏng click chuột
    function simulateMouseEvent(element, eventType) {
        const mouseEvent = new MouseEvent(eventType, {
            bubbles: true,
            cancelable: true,
            view: window,
        });
        element.dispatchEvent(mouseEvent);
    }

    // Hàm tự động click vào target hợp lệ
    function autoClickTarget() {
        const targets = document.querySelectorAll('.target');
        targets.forEach((target) => {
            if (
                document.body.contains(target) && // Kiểm tra target còn tồn tại
                !clickedTargets.has(target) // Đảm bảo chưa click vào target này
            ) {
                simulateMouseEvent(target, 'mousedown');
                simulateMouseEvent(target, 'mouseup');
                simulateMouseEvent(target, 'click');
                clickedTargets.add(target); // Đánh dấu đã click
                console.log('Đã click vào target mới!');
            }
        });

        // Liên tục chạy lại kiểm tra target
        requestAnimationFrame(autoClickTarget);
    }

    // Khởi chạy vòng lặp auto-click
    requestAnimationFrame(autoClickTarget);
})();