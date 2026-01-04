// ==UserScript==
// @name         HH3D - Auto Bí Cảnh - Lệ Phi Vũ
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tự động đánh boss Bí Cảnh, hiển thị thông tin chi tiết và thống kê
// @author       Lệ Phi Vũ
// @match        https://hoathinh3d.gg/bi-canh-tong-mon*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/541791/HH3D%20-%20Auto%20B%C3%AD%20C%E1%BA%A3nh%20-%20L%E1%BB%87%20Phi%20V%C5%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/541791/HH3D%20-%20Auto%20B%C3%AD%20C%E1%BA%A3nh%20-%20L%E1%BB%87%20Phi%20V%C5%A9.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // Biến lưu trữ vị trí menu
    const storageKeys = {
        biCanhPos: "autoBiCanhMenuPos"
    };

    // Thêm CSS để ẩn các phần tử không cần thiết
    GM_addStyle(`
        .personal-history-overlay,
        #loading-overlay,
        #boss-damage-screen,
        .current-ranking-overlay {
            display: none !important;
        }
        .boss-damage-hidden {
            opacity: 0;
            height: 0;
            overflow: hidden;
        }
        #auto-bicanh-menu {
            position: fixed;
            background: #111;
            color: gold;
            border-radius: 10px;
            padding: 10px;
            font-family: monospace;
            font-size: 14px;
            z-index: 9999;
            width: 320px;
            box-shadow: 0 0 10px #000;
        }
        #auto-bicanh-menu h3 {
            font-weight: bold;
            cursor: move;
            user-select: none;
            text-align: center;
            margin-bottom: 5px;
            font-size: 16px;
            border-bottom: 1px solid gold;
            padding-bottom: 5px;
        }
        #attack-count-box, #boss-info, #history-info {
            border-radius: 8px;
            padding: 8px;
            margin-bottom: 8px;
        }
        #attack-count-box {
            border: 1px solid lime;
        }
        #boss-info {
            border: 1px solid gold;
        }
        #history-info {
            border: 1px solid orange;
        }
        #rank-info {
            border: 1px solid #00bfff;
            border-radius: 8px;
            padding: 8px;
            margin-bottom: 8px;
        }
        #attack-status {
            margin-top: 5px;
            color: #00ff00;
            font-weight: bold;
            text-align: center;
        }
    `);

    // Biến lưu trữ thông tin
    let currentRank = "Lệ Phi Vũ...";
    let currentDamage = "Lệ Phi Vũ...";
    let currentBossName = "Lệ Phi Vũ...";
    let currentBossLevel = "Lệ Phi Vũ...";
    let currentBossHP = "Lệ Phi Vũ...";
    let attackCount = 0;
    let cooldownTime = "Lệ Phi Vũ...";
    let isAttacking = false;

    // Tạo menu chính
    function createMenu() {
        if (document.querySelector('#auto-bicanh-menu')) return;

        const menu = document.createElement('div');
        menu.id = 'auto-bicanh-menu';
        menu.style.cssText = `
            position: fixed;
            right: ${localStorage.getItem(`${storageKeys.biCanhPos}-right`) || '100px'};
            top: ${localStorage.getItem(`${storageKeys.biCanhPos}-top`) || '100px'};
        `;

        const title = document.createElement('h3');
        title.textContent = '📜 Menu Auto Bí Cảnh - Lệ Phi Vũ';

        const content = document.createElement('div');
        content.id = 'auto-bicanh-content';

        // Box lượt đánh
        const attackBox = document.createElement('div');
        attackBox.id = 'attack-count-box';
        attackBox.innerHTML = `
            <div><strong>🔁 Lượt đánh còn lại:</strong> ${attackCount}</div>
            <div style="margin-top:5px;"><strong>⏳ Thời gian đếm ngược:</strong> ${cooldownTime}</div>
            <div id="attack-status"></div>
        `;

        // Box thông tin boss
        const bossInfo = document.createElement('div');
        bossInfo.id = 'boss-info';
        bossInfo.innerHTML = `
            <div><strong>👹 Tên boss:</strong> ${currentBossName}</div>
            <div><strong>📈 Cấp:</strong> ${currentBossLevel}</div>
            <div><strong>❤️ HP:</strong> ${currentBossHP}</div>
        `;

        // Box thứ hạng
        const rankInfo = document.createElement('div');
        rankInfo.id = 'rank-info';
        rankInfo.innerHTML = `
            <div><strong>🏆 Thứ hạng của tôi:</strong> ${currentRank}</div>
            <div><strong>⚔️ Sát thương:</strong> ${currentDamage}</div>
        `;

        // Box lịch sử
        const historyInfo = document.createElement('div');
        historyInfo.id = 'history-info';
        historyInfo.innerHTML = `
            <div style="text-align:center;color:#888;">Nhấn nút "Lịch sử" trong game để cập nhật</div>
        `;

        content.appendChild(attackBox);
        content.appendChild(bossInfo);
        content.appendChild(rankInfo);
        content.appendChild(historyInfo);

        menu.appendChild(title);
        menu.appendChild(content);
        document.body.appendChild(menu);

        // Thêm chức năng kéo thả cho menu
        makeDraggable(menu, title, storageKeys.biCanhPos);
    }

    // Hàm tạo chức năng kéo thả cho menu
    function makeDraggable(element, header, storageKey) {
        let isDragging = false, offsetX = 0, offsetY = 0;
        header.addEventListener('mousedown', e => {
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging) {
                element.style.left = `${e.clientX - offsetX}px`;
                element.style.top = `${e.clientY - offsetY}px`;
            }
        }

        function onMouseUp() {
            if (isDragging) {
                localStorage.setItem(`${storageKey}-x`, element.style.left);
                localStorage.setItem(`${storageKey}-y`, element.style.top);
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        }
    }

    // Hàm hiển thị thông báo
    function showNotification(message) {
        const $notification = $(`<div style="position:fixed;bottom:20px;right:20px;background:rgba(0,0,0,0.9);color:white;padding:13px 20px;border-radius:6px;z-index:10000;border-left:4px solid #4CAF50;box-shadow:0 0 15px rgba(0,0,0,0.5);font-size:14px;max-width:300px;">${message}</div>`);
        $('body').append($notification);
        setTimeout(() => $notification.remove(), 3000);
    }

    // Hàm kiểm tra và tấn công boss tự động
    function checkAndAttackBoss() {
        if (isAttacking) return;

        updateAttackCount();
        updateCooldownTimer();

        if (attackCount > 0 && cooldownTime === "Có thể tấn công") {
            autoAttack();
        }
    }

    // Hàm tự động tấn công boss
    function autoAttack() {
        const challengeBtn = document.querySelector('#challenge-boss-btn');
        if (!challengeBtn || challengeBtn.disabled) return;

        isAttacking = true;
        updateStatus('⚔️ Đang tấn công boss...');

        // Bấm nút khiêu chiến
        challengeBtn.click();

        // Chờ popup xuất hiện và bấm tấn công
        setTimeout(() => {
            const attackBtn = document.querySelector('#attack-boss-btn');
            if (attackBtn) {
                attackBtn.click();

                // Sau khi tấn công, bấm nút trở lại
                setTimeout(() => {
                    const backBtn = document.querySelector('#back-button');
                    if (backBtn) {
                        backBtn.click();
                    }

                    // Cập nhật lại thông tin sau khi tấn công
                    setTimeout(() => {
                        updateAllInfo();
                        isAttacking = false;
                        updateStatus('');
                    }, 1000);
                }, 2000);
            } else {
                isAttacking = false;
                updateStatus('');
            }
        }, 1500);
    }

    // Cập nhật trạng thái tấn công
    function updateStatus(message) {
        const statusDiv = document.querySelector('#attack-status');
        if (statusDiv) {
            statusDiv.textContent = message;
        }
    }

    // Cập nhật tất cả thông tin
    function updateAllInfo() {
        updateBossInfo();
        updateAttackCount();
        updateCooldownTimer();
        updateRankInfo();
        updateHistoryInfo();

        // Tự động kiểm tra điều kiện tấn công sau khi cập nhật thông tin
        checkAndAttackBoss();
    }

    // Cập nhật thông tin boss
    function updateBossInfo() {
        const bossBtn = document.querySelector('#challenge-boss-btn');
        if (bossBtn && bossBtn.dataset.boss) {
            try {
                const bossData = JSON.parse(bossBtn.dataset.boss);
                currentBossName = bossData.name || "Không xác định";
                currentBossLevel = bossData.level || "0";
                currentBossHP = `${bossData.current_hp || "0"} / ${bossData.max_hp || "0"}`;

                const bossInfoDiv = document.querySelector('#boss-info');
                if (bossInfoDiv) {
                    bossInfoDiv.innerHTML = `
                        <div><strong>👹 Tên boss:</strong> ${currentBossName}</div>
                        <div><strong>📈 Cấp:</strong> ${currentBossLevel}</div>
                        <div><strong>❤️ HP:</strong> ${currentBossHP}</div>
                    `;
                }
            } catch (e) {
                console.error("Lỗi phân tích dữ liệu boss:", e);
            }
        }
    }

    // Cập nhật lượt đánh
    function updateAttackCount() {
        const attackCountEl = document.querySelector('.attack-count');
        if (attackCountEl) {
            attackCount = parseInt(attackCountEl.textContent.trim()) || 0;
            const attackCountDiv = document.querySelector('#attack-count-box');
            if (attackCountDiv) {
                attackCountDiv.querySelector('div:first-child').innerHTML = `<strong>🔁 Lượt đánh còn lại:</strong> ${attackCount}`;
            }
        }
    }

    // Cập nhật thời gian chờ
    function updateCooldownTimer() {
        const challengeBtn = document.querySelector('#challenge-boss-btn');
        if (!challengeBtn) return;

        if (challengeBtn.disabled) {
            const timeText = challengeBtn.textContent.trim();
            const timeMatch = timeText.match(/Còn (\d+):(\d+)/);
            if (timeMatch) {
                cooldownTime = `${timeMatch[1]}:${timeMatch[2].padStart(2, '0')}`;
            } else {
                cooldownTime = "0";
            }
        } else {
            cooldownTime = "Có thể tấn công";
        }

        const cooldownDiv = document.querySelector('#attack-count-box div:nth-child(2)');
        if (cooldownDiv) {
            cooldownDiv.innerHTML = `<strong>⏳ Thời gian đếm ngược:</strong> ${cooldownTime}`;
        }
    }

    // Cập nhật thứ hạng (ẩn popup)
    function updateRankInfo() {
        const rankingBtn = document.querySelector('#view-boss-ranking-btn');
        if (!rankingBtn) return;

        // Lưu trạng thái hiện tại của modal
        const oldModal = document.querySelector('.current-ranking-overlay');
        const wasOpen = oldModal && getComputedStyle(oldModal).display !== 'none';

        // Mở modal ranking nhưng sẽ bị ẩn bởi CSS
        rankingBtn.click();

        setTimeout(() => {
            const rankModal = document.querySelector('.current-ranking-overlay');
            if (rankModal) {
                // Lấy thông tin thứ hạng
                const rankValue = rankModal.querySelector('.user-rank-stats .stat-value')?.textContent.trim() || 'N/A';
                const damageValue = rankModal.querySelector('.user-rank-stats .rank-stat:nth-child(2) .stat-value')?.textContent.trim() || 'N/A';

                currentRank = rankValue;
                currentDamage = damageValue;

                // Cập nhật giao diện
                const rankInfo = document.querySelector('#rank-info');
                if (rankInfo) {
                    rankInfo.innerHTML = `
                        <div><strong>🏆 Thứ hạng của tôi:</strong> ${currentRank}</div>
                        <div><strong>⚔️ Sát thương:</strong> ${currentDamage}</div>
                    `;
                }

                // Đóng modal nếu trước đó nó không mở
                if (!wasOpen) {
                    const closeBtn = rankModal.querySelector('.modal-close');
                    if (closeBtn) closeBtn.click();
                }
            }
        }, 800);
    }

    // Cập nhật lịch sử
    function updateHistoryInfo() {
        const historyBtn = document.querySelector('#view-personal-history-btn');
        const historyBox = document.querySelector('#history-info');
        if (historyBtn && historyBox) {
            historyBtn.click();

            setTimeout(() => {
                const modal = document.querySelector('.personal-history-modal');
                const summary = modal?.querySelector('.history-summary');
                if (modal && summary) {
                    const values = summary.querySelectorAll('.summary-value');
                    if (values.length >= 3) {
                        const totalDmg = values[0].textContent.trim();
                        const attackTimes = values[1].textContent.trim();
                        const avgDmg = values[2].textContent.trim();

                        historyBox.innerHTML = `
                            <div><strong>🔥 Tổng sát thương:</strong> ${totalDmg}</div>
                            <div><strong>🔁 Số lần tấn công:</strong> ${attackTimes}</div>
                            <div><strong>💥 Trung bình mỗi lần:</strong> ${avgDmg}</div>
                        `;

                        // Đóng popup
                        const closeBtn = modal.querySelector('.history-close');
                        if (closeBtn) closeBtn.click();
                    }
                }
            }, 800);
        }
    }

    // Khởi tạo menu và cập nhật thông tin
    setTimeout(() => {
        createMenu();
        updateAllInfo();

        // Kiểm tra thời gian mỗi giây
        setInterval(() => {
            updateCooldownTimer();
            checkAndAttackBoss();
        }, 1000);

        // Kiểm tra tổng thể mỗi 5 giây
        setInterval(updateAllInfo, 5000);
    }, 3000);
})(jQuery);