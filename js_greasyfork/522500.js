// ==UserScript==
// @name         Network Speed Monitor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hiển thị tốc độ mạng (download/upload) lên màn hình trong thời gian thực.
// @author       Hà Trọng Nguyễn (htrnguyen)
// @match        *://*/*
// @grant        none
// @icon         https://github.com/htrnguyen/Network-Speed-Monitor/raw/main/Network-Speed-Monitor-Logo.png
// @license      MIT
// @homepageURL  https://github.com/htrnguyen/Network-Speed-Monitor
// @supportURL   https://github.com/htrnguyen/Network-Speed-Monitor/issues
// @downloadURL https://update.greasyfork.org/scripts/522500/Network%20Speed%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/522500/Network%20Speed%20Monitor.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Cấu hình
    const CONFIG = {
        position: 'bottom-left', // Vị trí hiển thị: 'bottom-left', 'bottom-right', 'top-left', 'top-right'
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Màu nền
        textColor: 'white', // Màu chữ
        fontSize: '12px', // Kích thước chữ
        padding: '5px', // Khoảng cách đệm
        zIndex: 9999, // Độ ưu tiên hiển thị
        updateInterval: 1000, // Thời gian cập nhật (ms)
    };

    // Tạo div để hiển thị tốc độ mạng
    const speedDiv = document.createElement('div');
    speedDiv.style.position = 'fixed';
    speedDiv.style.zIndex = CONFIG.zIndex;
    speedDiv.style.backgroundColor = CONFIG.backgroundColor;
    speedDiv.style.color = CONFIG.textColor;
    speedDiv.style.padding = CONFIG.padding;
    speedDiv.style.fontSize = CONFIG.fontSize;
    speedDiv.style.borderRadius = '3px';
    speedDiv.style.display = 'flex';
    speedDiv.style.alignItems = 'center';
    speedDiv.style.gap = '5px';

    // Đặt vị trí hiển thị
    switch (CONFIG.position) {
        case 'bottom-right':
            speedDiv.style.bottom = '0';
            speedDiv.style.right = '0';
            break;
        case 'top-left':
            speedDiv.style.top = '0';
            speedDiv.style.left = '0';
            break;
        case 'top-right':
            speedDiv.style.top = '0';
            speedDiv.style.right = '0';
            break;
        default: // bottom-left
            speedDiv.style.bottom = '0';
            speedDiv.style.left = '0';
            break;
    }

    // Thêm logo (tùy chọn)
    const logo = document.createElement('img');
    logo.src = 'https://github.com/htrnguyen/Network-Speed-Monitor/raw/main/Network-Speed-Monitor-Logo.png';
    logo.style.width = '16px';
    logo.style.height = '16px';
    logo.style.borderRadius = '50%';
    speedDiv.appendChild(logo);

    // Thêm thông tin tác giả (tùy chọn)
    const authorInfo = document.createElement('span');
    authorInfo.textContent = 'by Hà Trọng Nguyễn (htrnguyen)';
    speedDiv.appendChild(authorInfo);

    // Thêm div vào body
    document.body.appendChild(speedDiv);

    // Biến lưu trữ dữ liệu
    let totalReceived = 0;
    let totalSent = 0;

    // Hàm định dạng byte sang KB/MB
    function formatBytes(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    // Hàm cập nhật tốc độ mạng
    function updateSpeed() {
        const resources = performance.getEntriesByType('resource');
        const now = performance.now();

        // Tính toán dữ liệu nhận trong 1 giây
        const receivedThisSecond = resources.reduce((acc, entry) => {
            if (now - entry.responseEnd < 1000) acc += entry.transferSize;
            return acc;
        }, 0);

        totalReceived += receivedThisSecond;

        // Hiển thị thông tin
        speedDiv.textContent = `↓ ${formatBytes(receivedThisSecond)}/s | ↑ ${formatBytes(totalSent)}`;
    }

    // Theo dõi sự kiện upload file
    document.body.addEventListener('change', (event) => {
        if (event.target.tagName === 'INPUT' && event.target.type === 'file') {
            const files = event.target.files;
            for (let file of files) totalSent += file.size;
        }
    });

    // Cập nhật tốc độ mạng mỗi giây
    setInterval(updateSpeed, CONFIG.updateInterval);
})();
