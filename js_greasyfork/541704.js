// ==UserScript==
// @name         Auto Vòng Quay Phúc Vận - Lệ Phi Vũ (YIBO Vương Tạc)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tự động quay Vòng Quay Phúc Vận
// @author       Lệ Phi Vũ
// @match        https://hoathinh3d.gg/vong-*
// @icon         https://hoathinh3d.gg/favicon.ico
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541704/Auto%20V%C3%B2ng%20Quay%20Ph%C3%BAc%20V%E1%BA%ADn%20-%20L%E1%BB%87%20Phi%20V%C5%A9%20%28YIBO%20V%C6%B0%C6%A1ng%20T%E1%BA%A1c%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541704/Auto%20V%C3%B2ng%20Quay%20Ph%C3%BAc%20V%E1%BA%ADn%20-%20L%E1%BB%87%20Phi%20V%C5%A9%20%28YIBO%20V%C6%B0%C6%A1ng%20T%E1%BA%A1c%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Thêm CSS cho giao diện
    GM_addStyle(`
        #autoSpinPanel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            min-width: 200px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        #autoSpinPanel h3 {
            margin: 0 0 10px 0;
            padding: 0;
            color: #4CAF50;
            font-size: 16px;
        }
        #autoSpinPanel div {
            margin: 5px 0;
        }
        #turnsCount {
            color: #FFD700;
            font-weight: bold;
        }
        #spinStatus {
            color: #4CAF50;
            font-style: italic;
        }
    `);

    // Tạo giao diện thông tin
    function createInfoPanel() {
        const panel = document.createElement('div');
        panel.id = 'autoSpinPanel';
        panel.innerHTML = `
            <h3>Auto Spin Lệ Phi Vũ</h3>
            <div>Lượt quay còn lại: <span id="turnsCount">0</span></div>
            <div>Trạng thái: <span id="spinStatus">Đang khởi động...</span></div>
        `;
        document.body.appendChild(panel);
        return panel;
    }

    // Cập nhật thông tin trên panel
    function updatePanel(turns, status) {
        const turnsElement = document.getElementById('turnsCount');
        const statusElement = document.getElementById('spinStatus');

        if (turnsElement) turnsElement.textContent = turns;
        if (statusElement) statusElement.textContent = status;
    }

    // Hàm lấy số lượt quay còn lại
    function getRemainingTurns() {
        try {
            const turnElements = document.querySelectorAll('.turns-count, .user-turns, [id*="turn"], [class*="turn"]');

            for (const el of turnElements) {
                const text = el.textContent || el.innerText;
                const turns = parseInt(text.replace(/\D/g, ''));
                if (!isNaN(turns)) return turns;
            }
            return 0;
        } catch (error) {
            return 0;
        }
    }

    // Hàm thực hiện quay
    function spin() {
        const spinButton = document.getElementById('spinButton');
        if (!spinButton || spinButton.disabled) {
            return false;
        }

        updatePanel(getRemainingTurns(), 'Đang quay...');
        spinButton.click();
        return true;
    }

    // Hàm kiểm tra và quay tự động
    function checkAndSpin() {
        const turns = getRemainingTurns();
        updatePanel(turns, turns > 0 ? 'Sẵn sàng quay...' : 'Hết lượt quay');

        if (turns > 0) {
            setTimeout(() => {
                const spun = spin();
                if (spun) {
                    setTimeout(checkAndSpin, 2000);
                } else {
                    setTimeout(checkAndSpin, 1000);
                }
            }, 500);
        } else {
            setTimeout(checkAndSpin, 3000);
        }
    }

    // Khởi chạy script
    function init() {
        createInfoPanel();

        // Chờ nút quay xuất hiện
        const checkSpinButton = setInterval(() => {
            if (document.getElementById('spinButton')) {
                clearInterval(checkSpinButton);
                updatePanel(getRemainingTurns(), 'Đang kiểm tra...');
                checkAndSpin();
            }
        }, 500);
    }

    // Bắt đầu khi trang sẵn sàng
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();