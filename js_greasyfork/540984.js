// ==UserScript==
// @name         Tải lại trang VG
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Làm mới trang mỗi hiển thị trạng thái và đếm ngược phút:giây rõ ràng, có thể dừng/tạm dừng bằng click chuột.
// @author       nhanthanh93
// @match        https://www.youtube.com/watch?v=3F0zv6UkjUk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540984/T%E1%BA%A3i%20l%E1%BA%A1i%20trang%20VG.user.js
// @updateURL https://update.greasyfork.org/scripts/540984/T%E1%BA%A3i%20l%E1%BA%A1i%20trang%20VG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const refreshInterval = 2*60; // thời gian = [số phút] x [60 giây]
    let countdown = refreshInterval;
    let isRunning = true;
    let intervalId;

    // Tạo thanh trạng thái
    const statusBar = document.createElement('div');
    statusBar.style.position = 'fixed';
    statusBar.style.top = '0';
    statusBar.style.left = '0';
    statusBar.style.width = '100%';
    statusBar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    statusBar.style.color = 'white';
    statusBar.style.padding = '10px';
    statusBar.style.fontSize = '16px';
    statusBar.style.fontFamily = 'monospace';
    statusBar.style.zIndex = '9999';
    statusBar.style.textAlign = 'center';
    statusBar.style.cursor = 'pointer';
    document.body.prepend(statusBar);

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const minStr = minutes > 0 ? `${minutes} phút ` : '';
        const secStr = `${secs} giây`;
        return minStr + secStr;
    }

    function updateStatus() {
        statusBar.textContent = isRunning
            ? `⏳ Đang chạy - Làm mới sau ${formatTime(countdown)} (bấm để dừng)`
            : `⏸ Đã dừng - còn lại ${formatTime(countdown)} (bấm để tiếp tục)`;
    }

    function startCountdown() {
        intervalId = setInterval(() => {
            if (isRunning) {
                countdown--;
                updateStatus();
                if (countdown <= 0) {
                    location.reload();
                }
            }
        }, 1000);
    }

    // Toggle trạng thái khi click
    statusBar.addEventListener('click', () => {
        isRunning = !isRunning;
        updateStatus();
    });

    // Khởi chạy
    updateStatus();
    startCountdown();
})();
