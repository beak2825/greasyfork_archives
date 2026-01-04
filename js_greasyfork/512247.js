// ==UserScript==
// @name         Bypass DevTools Detection, Unlock Functionality, and Auto Check-in
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Bỏ qua phát hiện DevTools, mở khóa các chức năng và tự động điểm danh trên https://loulxgame.com/
// @author       hieuck
// @match        https://loulxgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=loulxgame.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/512247/Bypass%20DevTools%20Detection%2C%20Unlock%20Functionality%2C%20and%20Auto%20Check-in.user.js
// @updateURL https://update.greasyfork.org/scripts/512247/Bypass%20DevTools%20Detection%2C%20Unlock%20Functionality%2C%20and%20Auto%20Check-in.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Toggle states
    let isDevToolsDetectionBypassed = GM_getValue('isDevToolsDetectionBypassed', true);
    let isAutoCheckInEnabled = GM_getValue('isAutoCheckInEnabled', true);
    let isRightClickEnabled = GM_getValue('isRightClickEnabled', true);
    let isAbsoluteRightClickEnabled = GM_getValue('isAbsoluteRightClickEnabled', true);
    let isKeyboardShortcutsEnabled = GM_getValue('isKeyboardShortcutsEnabled', true);

    // Hàm hiển thị thông báo
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerHTML = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'black';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    const menu = {
        ids: [], // Lưu trữ ID của các menu

        register() {
            // Xóa các lệnh trước đó
            this.ids.forEach(id => GM_unregisterMenuCommand(id));
            this.ids = []; // Đặt lại danh sách ID menu

            // Đăng ký các lệnh với trạng thái hiện tại
            this.ids.push(GM_registerMenuCommand(`${isDevToolsDetectionBypassed ? '✔️' : '❌'} Bật/Tắt Bỏ Qua Phát Hiện DevTools`, () => {
                isDevToolsDetectionBypassed = !isDevToolsDetectionBypassed;
                GM_setValue('isDevToolsDetectionBypassed', isDevToolsDetectionBypassed);
                showNotification(`Bỏ Qua Phát Hiện DevTools đã ${isDevToolsDetectionBypassed ? 'bật' : 'tắt'}`);
                this.register(); // Cập nhật menu
            }));

            this.ids.push(GM_registerMenuCommand(`${isAutoCheckInEnabled ? '✔️' : '❌'} Bật/Tắt Tự Động Điểm Danh`, () => {
                isAutoCheckInEnabled = !isAutoCheckInEnabled;
                GM_setValue('isAutoCheckInEnabled', isAutoCheckInEnabled);
                showNotification(`Tự Động Điểm Danh đã ${isAutoCheckInEnabled ? 'bật' : 'tắt'}`);
                this.register(); // Cập nhật menu
            }));

            this.ids.push(GM_registerMenuCommand(`${isAbsoluteRightClickEnabled ? '✔️' : '❌'} Bật/Tắt Chuột Phải Tuyệt Đối`, () => {
                isAbsoluteRightClickEnabled = !isAbsoluteRightClickEnabled; // Toggle trạng thái
                GM_setValue('isAbsoluteRightClickEnabled', isAbsoluteRightClickEnabled); // Lưu trạng thái
                showNotification(`Chế độ Chuột Phải Tuyệt Đối đã ${isAbsoluteRightClickEnabled ? 'bật' : 'tắt'}`); // Thông báo người dùng
                this.register(); // Cập nhật menu
                location.reload(); // Tải lại trang để áp dụng thay đổi
            }));

            this.ids.push(GM_registerMenuCommand(`${isKeyboardShortcutsEnabled ? '✔️' : '❌'} Bật/Tắt Phím Chức Năng`, () => {
                isKeyboardShortcutsEnabled = !isKeyboardShortcutsEnabled;
                GM_setValue('isKeyboardShortcutsEnabled', isKeyboardShortcutsEnabled);
                showNotification(`Phím Chức Năng đã ${isKeyboardShortcutsEnabled ? 'bật' : 'tắt'}`);
                this.register(); // Cập nhật menu
                location.reload();
            }));
        }
    };

    menu.register(); // Đăng ký menu ban đầu

    // Bỏ qua hạn chế chuột phải
    if (isRightClickEnabled) {
        document.addEventListener('contextmenu', function(event) {
            event.stopPropagation(); // Ngăn chặn hành động mặc định
            event.preventDefault(); // Bổ sung để ngăn hoàn toàn việc hiển thị menu mặc định
        }, true);
    }

    // Chế độ Chuột Phải Tuyệt Đối
    function enableAbsoluteRightClickMode() {
        const css = document.createElement('style');
        css.type = 'text/css';
        css.innerText = `* {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }`;
        document.head.appendChild(css);

        const eventsToDisable = [
            'contextmenu', 'selectstart', 'dragstart', 'mousedown', 'cut', 'copy', 'paste'
        ];

        eventsToDisable.forEach(event => {
            document.addEventListener(event, function(e) {
                e.stopPropagation();
            }, true);
        });

        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.key === '`') { // Ctrl + `
                if (confirm('Activate Absolute Right Click Mode!')) {
                    enableAbsoluteRightClick();
                }
            }
        });

        function enableAbsoluteRightClick() {
            eventsToDisable.forEach(event => {
                document.addEventListener(event, function(e) {
                    e.stopPropagation();
                }, true);
            });
        }
    }

    // Kiểm tra trạng thái chế độ chuột phải tuyệt đối
    if (isAbsoluteRightClickEnabled) {
        enableAbsoluteRightClickMode();
    }

    // Bỏ qua hạn chế phím tắt
    if (isKeyboardShortcutsEnabled) {
        document.addEventListener('keydown', function(event) {
            // Danh sách các phím tắt bị vô hiệu hóa
            const disabledKeys = [
                { keyCode: 123 }, // F12
                { ctrlKey: true, shiftKey: true, keyCode: 73 }, // Ctrl+Shift+I
                { ctrlKey: true, shiftKey: true, keyCode: 74 }, // Ctrl+Shift+J
                { ctrlKey: true, shiftKey: true, keyCode: 67 }, // Ctrl+Shift+C
                { ctrlKey: true, keyCode: 85 }, // Ctrl+U
                { ctrlKey: true, keyCode: 83 }, // Ctrl+S
                { ctrlKey: true, keyCode: 80 }, // Ctrl+P
                { ctrlKey: true, keyCode: 65 }, // Ctrl+A
                { ctrlKey: true, keyCode: 67 }, // Ctrl+C
                { ctrlKey: true, keyCode: 86 }, // Ctrl+V
                { ctrlKey: true, shiftKey: true, keyCode: 86 } // Ctrl+Shift+V
            ];

            // Kiểm tra nếu phím được nhấn là một trong các phím bị vô hiệu hóa
            for (const key of disabledKeys) {
                if (Object.keys(key).every(prop => event[prop] === key[prop])) {
                    event.stopPropagation(); // Ngăn chặn hành động mặc định
                    return true; // Trả về true để cho phép phím tắt
                }
            }
        });
    }
  
    // Hàm kiểm tra xem người dùng đã điểm danh hay chưa
    function hasCheckedIn() {
        const checkinMessage = document.querySelector('.checkin-details-link'); // Thay thế bằng lớp thực tế
        return checkinMessage && checkinMessage.textContent.includes('Hôm nay đã điểm danh');
    }

    // Hàm kiểm tra xem người dùng đã đăng nhập hay chưa
    function isLoggedIn() {
        const userElement = document.querySelector('.display-name'); // Lớp chứa tên hiển thị của người dùng
        return userElement !== null; // Kiểm tra xem phần tử có tồn tại không
    }

    // Đợi cho đến khi trang được tải hoàn toàn
    window.addEventListener('load', function() {
        // Kiểm tra xem đã điểm danh hay chưa
        if (hasCheckedIn()) {
            showNotification('Người dùng đã điểm danh.');
            return; // Dừng lại nếu đã điểm danh
        }

        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        if (!isLoggedIn()) {
            showNotification('Người dùng chưa đăng nhập.');
            return; // Dừng lại nếu chưa đăng nhập
        }

        // Chọn nút "Điểm danh"
        const checkInButton = document.querySelector('a.initiate-checkin');

        // Nhấp vào nút nếu tồn tại
        if (checkInButton) {
            checkInButton.click(); // Nhấp vào nút
            showNotification('Nút điểm danh đã được nhấn');
        } else {
            showNotification('Không tìm thấy nút điểm danh');
        }
    });
})();