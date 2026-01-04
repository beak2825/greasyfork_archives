// ==UserScript==
// @name         Sáng Tác Việt - Tích Tất Cả & Tải Lại (v3.0 - Can Thiệp Sớm)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Can thiệp ở document-start để ẩn bảng trước khi render, giúp tải trang siêu nhanh. Tích chương rồi tự động tải lại.
// @author       ChatGPT & AI-assisted
// @match        *://sangtacviet.com/uploader/list-chapter/*
// @match        *://sangtacviet.app/uploader/list-chapter/*
// @icon         https://sangtacviet.app/favicon.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541615/S%C3%A1ng%20T%C3%A1c%20Vi%E1%BB%87t%20-%20T%C3%ADch%20T%E1%BA%A5t%20C%E1%BA%A3%20%20T%E1%BA%A3i%20L%E1%BA%A1i%20%28v30%20-%20Can%20Thi%E1%BB%87p%20S%E1%BB%9Bm%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541615/S%C3%A1ng%20T%C3%A1c%20Vi%E1%BB%87t%20-%20T%C3%ADch%20T%E1%BA%A5t%20C%E1%BA%A3%20%20T%E1%BA%A3i%20L%E1%BA%A1i%20%28v30%20-%20Can%20Thi%E1%BB%87p%20S%E1%BB%9Bm%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === Cấu hình ===
    const SECONDS_BEFORE_RELOAD = 5; // Có thể giảm thời gian chờ vì trang tải cực nhanh
    const SCRIPT_STATE_KEY = 'stv_isActive_v30'; // Key mới cho phiên bản 3.0

    // === PHẦN 1: Chạy ở document-start để can thiệp sớm ===
    // Chỉ thực hiện khi script đang trong quá trình tự động
    if (GM_getValue(SCRIPT_STATE_KEY, false)) {
        console.log('[v3.0] Script đang hoạt động. Thêm CSS để ẩn bảng trước khi render.');
        // Thêm CSS để ẩn phần thân bảng. Đây là chìa khóa để tăng tốc
        // Trình duyệt sẽ không tốn tài nguyên để render hàng ngàn dòng này
        GM_addStyle('.main > .table > tbody { display: none !important; }');
    }


    // === PHẦN 2: Chạy sau khi DOM đã sẵn sàng để tương tác ===
    // Toàn bộ logic tương tác với trang phải nằm trong đây
    window.addEventListener('DOMContentLoaded', () => {

        // CSS cho giao diện nút bấm
        GM_addStyle(`
            .stv-control-btn { margin-left: 5px !important; margin-bottom: 5px !important; }
            .stv-status-span { margin-left: 10px; font-style: italic; color: #555; font-weight: bold; }
        `);

        // Hàm dừng quá trình, dọn dẹp trạng thái
        function stopProcess(finalMessage = "Đã dừng. Tải lại trang để xem nội dung.") {
            GM_setValue(SCRIPT_STATE_KEY, false);
            const button = document.getElementById('tickAllBtn');
            const statusSpan = document.getElementById('tickAllStatus');
            if (button) {
                button.textContent = `Tích Nhanh & Tải Lại`;
                button.classList.remove('btn-danger');
                button.classList.add('btn-primary');
            }
            if (statusSpan) {
                statusSpan.textContent = finalMessage;
            }
            console.log(`Script đã dừng. Lý do: ${finalMessage}`);

            // Nếu quá trình hoàn tất, tự động tải lại lần cuối để hiển thị bảng
            if (finalMessage.includes("Hoàn thành")) {
                setTimeout(() => location.reload(), 1500);
            }
        }

        // Hàm chính để xử lý công việc
        function runProcess() {
            const button = document.getElementById('tickAllBtn');
            const statusSpan = document.getElementById('tickAllStatus');
            // Dù bảng bị ẩn, các phần tử vẫn tồn tại trong DOM và có thể được query
            const allUncheckedCheckboxes = document.querySelectorAll('input[type="checkbox"][edit="open"]:not(:checked)');

            if (allUncheckedCheckboxes.length === 0) {
                stopProcess("Hoàn thành! Tất cả chương đã được mở. Đang tải lại...");
                return;
            }

            button.textContent = "Dừng";
            button.classList.remove('btn-primary');
            button.classList.add('btn-danger');
            statusSpan.textContent = `Đã tích ${allUncheckedCheckboxes.length} chương. Chuẩn bị tải lại sau ${SECONDS_BEFORE_RELOAD}s...`;

            console.log(`Chuẩn bị tích ${allUncheckedCheckboxes.length} chương.`);
            allUncheckedCheckboxes.forEach(checkbox => checkbox.click());

            setTimeout(() => {
                console.log(`Đã tích xong. Đợi ${SECONDS_BEFORE_RELOAD} giây rồi tải lại trang...`);
                location.reload();
            }, SECONDS_BEFORE_RELOAD * 1000);
        }

        // Hàm xử lý sự kiện click nút
        function toggleProcess() {
            const isActive = GM_getValue(SCRIPT_STATE_KEY, false);
            if (isActive) {
                stopProcess();
            } else {
                GM_setValue(SCRIPT_STATE_KEY, true);
                // Tải lại trang để bắt đầu quá trình với việc ẩn bảng từ đầu
                location.reload();
            }
        }

        // Hàm thêm nút vào giao diện
        function addControlButton() {
            if (document.getElementById('tickAllBtn')) return;
            const menuContainer = document.querySelector('.menu.bg-light .d-grid.d-md-block');
            if (menuContainer) {
                const button = document.createElement('button');
                button.innerHTML = `Tích Nhanh & Tải Lại`;
                button.id = 'tickAllBtn';
                button.className = 'btn btn-primary stv-control-btn';
                button.onclick = toggleProcess;

                const statusSpan = document.createElement('span');
                statusSpan.id = 'tickAllStatus';
                statusSpan.className = 'stv-status-span';

                menuContainer.appendChild(button);
                menuContainer.appendChild(statusSpan);
                console.log('[v3.0] Đã thêm nút chức năng.');
            }
        }

        // Logic chính
        function main() {
            addControlButton();

            if (GM_getValue(SCRIPT_STATE_KEY, false)) {
                const button = document.getElementById('tickAllBtn');
                const statusSpan = document.getElementById('tickAllStatus');

                if (button) {
                    button.textContent = "Dừng";
                    button.classList.remove('btn-primary');
                    button.classList.add('btn-danger');
                    statusSpan.textContent = "Trang đã được tối ưu, đang tiếp tục...";
                }

                // Chờ một chút để đảm bảo mọi thứ ổn định rồi mới chạy
                setTimeout(runProcess, 500);
            }
        }

        // Bắt đầu logic tương tác
        main();
    });

})();