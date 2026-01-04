// ==UserScript==
// @name         Auto Claim Battle Mine Reward - Optimized
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Tự động nhận phần thưởng Battle Mine - Phiên bản tối ưu hóa
// @author       Optimized by KeshiNguyen
// @match        *://*/*
// @run-at       document-idle
// @grant        GM.xmlHttpRequest
// @grant        GM_notification
// @connect      discord.com
// @downloadURL https://update.greasyfork.org/scripts/537816/Auto%20Claim%20Battle%20Mine%20Reward%20-%20Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/537816/Auto%20Claim%20Battle%20Mine%20Reward%20-%20Optimized.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Biến toàn cục để quản lý trạng thái
    const STATE = {
        isRunning: false,
        currentMineId: localStorage.getItem("cmanga_last_mine_id") || "",
        lastState: "",
        lastNotificationTime: 0,
        notificationCooldown: 30000, // 30 giây giữa các thông báo
        checkInterval: null,
        energyCheckInterval: null
    };

    const isGameDomain = () => {
        return /cmangax\d+\.com|cnovel/.test(location.hostname);
    };

    if (!isGameDomain()) return;

    // Hàm tiện ích để tạo delay
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // ======= QUẢN LÝ TIMEOUT VÀ INTERVAL =======
    const clearAllIntervals = () => {
        if (STATE.checkInterval) clearInterval(STATE.checkInterval);
        if (STATE.energyCheckInterval) clearInterval(STATE.energyCheckInterval);
        STATE.checkInterval = null;
        STATE.energyCheckInterval = null;
    };

    const RARE = {
        1: "Thường",
        2: "Hiếm",
        3: "Sử thi",
        4: "Truyền thuyết"
    };

    const NOTIFICATION_CONFIG = {
        DISCORD: {
            webhookUrl: 'https://discord.com/api/webhooks/1374401953374666864/sXgxVbDOPQDBK29JFfNqmBRs_K8ZRSxY5t-EQ9W7TAbzx6QWJKWmyp0ukbGVmMYwfqc6'
        }
    };

    // ======= TỐI ƯU HÓA GỬI THÔNG BÁO =======
    const shouldSendNotification = (type, scoreId) => {
        const now = Date.now();
        const currentState = `${type}_${scoreId || ''}`;

        // Kiểm tra trạng thái trùng lặp và thời gian làm mát
        if (currentState === STATE.lastState &&
            now - STATE.lastNotificationTime < STATE.notificationCooldown) {
            return false;
        }

        STATE.lastState = currentState;
        STATE.lastNotificationTime = now;
        return true;
    };

    const formatForDiscord = (result) => {
        if (!result) return null;

        const now = new Date();
        let embed = {
            title: 'Thông báo khai thác mới',
            color: 0x00ff00,
            timestamp: now.toISOString()
        };

        if (result.type === "miner") {
            if (!shouldSendNotification("mining", result.score_id)) return null;

            embed.description = `📊 **NGỒI KHOÁNG LÚC ${now.toLocaleString('vi-VN')}**\n\n` +
                `Vị trí::: Tầng ${result.area} loại ${result.rare} score_id: ${result.score_id}`;
        }
        else if (result.type === "is_kicked") {
            if (!shouldSendNotification("is_kicked")) return null;

            embed.description = `📊 **BỊ TẤN CÔNG KHOÁNG LÚC ${now.toLocaleString('vi-VN')}**\n\n` +
                `Bị tấn công bởi ${result.attacker ? `${result.attacker} với id ${result.id}` : 'ẩn danh'}`;
        }
        else {
            return null;
        }

        return embed;
    };

    const sendToDiscord = async (message) => {
        try {
            const embed = formatForDiscord(message);
            if (!embed) return;

            // Sử dụng fetch thay vì GM.xmlHttpRequest để giảm phụ thuộc
            const response = await fetch(NOTIFICATION_CONFIG.DISCORD.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ embeds: [embed] })
            });

            if (!response.ok) {
                console.error('Lỗi Discord:', await response.text());
            }
        } catch (error) {
            console.error('Lỗi khi gửi thông báo:', error);
        }
    };

    // ======= TỐI ƯU HÓA REQUEST =======
    const cachedFetch = (() => {
        const cache = new Map();
        return async (url, options = {}, cacheKey = url, ttl = 60000) => {
            const now = Date.now();
            const cached = cache.get(cacheKey);

            if (cached && now - cached.timestamp < ttl) {
                return cached.response.clone();
            }

            const response = await fetch(url, options);
            cache.set(cacheKey, {
                response: response.clone(),
                timestamp: now
            });

            return response;
        };
    })();

    // ======= PHẦN CHÍNH ĐƯỢC TỐI ƯU =======
    function startAutoClaim() {
        if (STATE.isRunning) return;
        STATE.isRunning = true;

        const SCORE_URL = `/api/score_list?type=battle_mine_target&target=1353`;
        const CLAIM_URL = `/assets/ajax/character_activity.php`;
        const ENERGY_URL = `/api/character_energy_mine?character=1353 `;
        const CHARACTER_ACTIVITY_URL = `/assets/ajax/character_activity.php`;
        const OTHER_URL = `/api/get_data_by_id?table=game_character&data=other&id=1353 &v=${Date.now()}`;
        const NOTIFICATION_URL = `/api/user_notification?page=1&limit=50&user=091e87cda5aa92d979a2058163ec219fb196ccae`;

        async function fetchScore() {
            try {
                const res = await cachedFetch(SCORE_URL, {}, SCORE_URL, 10000); // Cache 10 giây
                const json = await res.json();
                const data = json.data
                return Array.isArray(data) && data.length > 0 ? data[0] : null;
            } catch (err) {
                console.error('[x] Lỗi fetchScore:', err);
                return null;
            }
        }

        async function sendRequest(url, action) {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    body: `action=${action},`
                });

                const responseText = await response.text();
                if (/alertify\.error/.test(responseText)) {
                    return { success: false, message: `Fail when sign activity with action ${action}` };
                } else if (/alertify\.success/.test(responseText)) {
                    return { success: true, message: `Sign activity with action ${action} successfully`, data: responseText };
                }

                return { success: false, message: "Unknown response" };
            } catch (err) {
                console.error("❌ Lỗi mạng khi gửi request:", err);
                return { success: false, message: `Network error: ${err}` };
            }
        }

        async function attack(mine_id) {
            if (!mine_id) {
                console.warn('[!] mine_id rỗng khi cố gắng tấn công. Bỏ qua.');
                return false;
            }

            try {
                const attack_res = await sendRequest(CHARACTER_ACTIVITY_URL, `battle_mine_challenge&mine_id=${mine_id}&target=public`);
                return attack_res.success;
            } catch (e) {
                console.error("Lỗi trong quá trình khiêu chiến:", e);
                return false;
            }
        }

        async function claimReward() {
            try {
                const res = await fetch(CLAIM_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        action: 'battle_mine_take_reward',
                        target: 'public',
                        user_id: "5738",
                        user_token: "091e87cda5aa92d979a2058163ec219fb196ccae"
                    })
                });

                const result = await res.json();
                console.log('[✓] Nhận thưởng:', result);

                // Lập lịch kiểm tra lại sau 5 phút thay vì 1 phút
                setTimeout(checkAndClaimReward, 300000);
            } catch (err) {
                console.error('[x] Lỗi claimReward:', err);
                setTimeout(checkAndClaimReward, 60000);
            }
        }

        async function checkAndClaimReward() {
            if (!STATE.isRunning) return;

            try {
                let score_res = await fetchScore();

                if (!score_res) {
                    await handleNoScoreSituation();
                    return;
                }

                await handleScoreSituation(score_res);
            } catch (err) {
                console.error('[x] Lỗi checkAndClaim:', err);
                setTimeout(checkAndClaimReward, 60000);
            }
        }

        async function handleNoScoreSituation() {
            console.log('[!] Đã bị sút khỏi hmk');

            // Kiểm tra thông báo chỉ khi cần thiết
            const notifications = await fetchNotifications();
            if (!notifications || notifications.length === 0) {
                console.log('Không có thông báo nào');
                setTimeout(checkAndClaimReward, 300000); // Kiểm tra lại sau 5 phút
                return;
            }

            // Lấy thông tin bị tấn công
            const otherData = await fetchOtherData();
            const battle_mine_info = otherData?.battle_mine?.war?.info;
            const message = {
                id: battle_mine_info?.id,
                attacker: battle_mine_info?.name,
                type: "is_kicked"
            };

            await sendToDiscord(message);
            console.log("Đã gửi tới discord");

            // Kiểm tra năng lượng và tấn công lại nếu đủ
            const energy = await checkEnergy();
            if (parseInt(energy) > 6 && STATE.currentMineId) {
                const attackSuccess = await attack(STATE.currentMineId);
                if (attackSuccess) {
                    // Nếu tấn công thành công, kiểm tra lại ngay
                    setTimeout(checkAndClaimReward, 5000);
                } else {
                    setTimeout(checkAndClaimReward, 300000);
                }
            } else {
                setTimeout(checkAndClaimReward, 300000);
            }
        }

        async function handleScoreSituation(score_res) {
            STATE.currentMineId = score_res.id_score;
            localStorage.setItem("cmanga_last_mine_id", STATE.currentMineId);

            let data = JSON.parse(score_res.data);
            let miner = data?.miner;

            console.log(`[i] Thời gian hiện tại: ${miner.times} phút`);

            const message = {
                type: 'miner',
                rare: RARE[data?.rare],
                area: data?.area,
                score_id: score_res?.id_score
            };

            await sendToDiscord(message);
            console.log("Đã gửi tới discord");

            if (miner.times >= 60) {
                await claimReward();
            } else {
                const waitMinutes = 60 - miner.times;
                const waitMs = waitMinutes * 60000;
                console.log(`[~] Đợi ${waitMinutes} phút`);
                setTimeout(checkAndClaimReward, waitMs);

                // Thiết lập kiểm tra năng lượng mỗi 5 phút
                if (!STATE.energyCheckInterval) {
                    STATE.energyCheckInterval = setInterval(checkEnergy, 300000);
                }
            }
        }

        async function fetchNotifications() {
            try {
                const res = await cachedFetch(NOTIFICATION_URL, {}, NOTIFICATION_URL, 30000);
                return await res.json();
            } catch (err) {
                console.error('Lỗi fetch notifications:', err);
                return null;
            }
        }

        async function fetchOtherData() {
            try {
                const res = await cachedFetch(OTHER_URL, {}, OTHER_URL, 30000);
                const json = await res.json();
                return JSON.parse(json.other);
            } catch (err) {
                console.error('Lỗi fetch other data:', err);
                return null;
            }
        }

        async function checkEnergy() {
            try {
                const res = await cachedFetch(ENERGY_URL, {}, ENERGY_URL, 60000);
                const json = await res.json();
                console.log("current energy:::", json.current);
                return json.current;
            } catch (err) {
                console.error('Lỗi check energy:', err);
                return 0;
            }
        }

        // Bắt đầu kiểm tra
        console.log('🚀 Bắt đầu tự động nhận thưởng Battle Mine');
        checkAndClaimReward();

        // Thiết lập interval kiểm tra mỗi 5 phút để đảm bảo script vẫn chạy
        STATE.checkInterval = setInterval(checkAndClaimReward, 300000);
    }

    // Khởi động script khi trang tải xong
    window.addEventListener('load', async () => {
        try {

            startAutoClaim();
        } catch (error) {
            console.error('Lỗi khi khởi động script:', error);
        }
    });

    // Dọn dẹp khi trang đóng hoặc reload
    window.addEventListener('beforeunload', () => {
        STATE.isRunning = false;
        clearAllIntervals();
    });
})();