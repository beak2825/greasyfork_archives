// ==UserScript==
// @name         Auto Mining Notifier
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Tự động kiểm tra và thông báo kết quả khai thác
// @match        *://*/*
// @grant        GM.xmlHttpRequest
// @grant        GM_notification
// @connect      api.telegram.org
// @grant        GM.getValue
// @grant        GM.setValue
// @connect      discord.com
// @downloadURL https://update.greasyfork.org/scripts/536606/Auto%20Mining%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/536606/Auto%20Mining%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const isGameDomain = () => {
        return /cmangax\d+\.com|cnovel/.test(location.hostname);
    };

    if (!isGameDomain()) return;

    const priorityItem = {
        "pet_heart_bag": "Túi thú tâm",
        "add_option": "Tinh Luyện Châu",
        "job_exp_3": "Thông Thạo Quyển Lv3",
        "job_exp_2": "Thông Thạo Quyển Lv2",
        "job_exp_1": "Thông Thạo Quyển Lv1",
        "medicinal_exp_1": "Tăng Ích Đan Lv1",
        "medicinal_exp_2": "Tăng Ích Đan Lv2",
        "medicinal_exp_3": "Tăng Ích Đan Lv3",
        "medicinal_exp_4": "Tăng Ích Đan Lv4",
        "equipment_upgrade_2": "Trung phẩm Thiên Mộc Thạch",
        "egg_super_fragment": "Mảnh trứng thần thú",
        "egg_rare": "Trứng hiếm",
        "pet_exp_chest" : "Rương thú đan"
    };

    const priceInMarket = {
        "pet_heart_bag": 100,
        "add_option": 25,
        "job_exp_3": 3,
        "job_exp_2": 0.4,
        "job_exp_1": 0.1,
        "medicinal_exp_1": 1.2,
        "medicinal_exp_2": 2.4,
        "medicinal_exp_3": 5,
        "medicinal_exp_4": 8,
        "equipment_upgrade_2": 25,
        "egg_super_fragment": 5,
        "egg_rare": 35,
        "pet_exp_chest": 5
    };
    const RARE_COLORS = {
        4: { name: '🔥 Truyền Thuyết', color: '#ff0000' },
        3: { name: '📜 Sử Thi', color: '#c700ff' },
        2: { name: '🛡️ Hiếm', color: '#0099ff' },
        1: { name: '⚔️ Thường', color: '#666666' },
        0: { name: '❌ Không xác định', color: '#000000' }
    };

    const NOTIFICATION_CONFIG = {
        TELEGRAM: {
            token: 'Thay bằng token bằng cách tìm botfather rồi nhập /mybots rồi chọn token',
            chatId: 'Thay bằng chat id bằng cách tìm userinfo rồi start là xong'
        },
        DISCORD: {
            webhookUrl: 'https://discord.com/api/webhooks/1374401953374666864/sXgxVbDOPQDBK29JFfNqmBRs_K8ZRSxY5t-EQ9W7TAbzx6QWJKWmyp0ukbGVmMYwfqc6' // Thay thế bằng webhook của bạn
        },
        MIN_VALUE: 1
    };

    let lastAttackTime = 0;
    const attackCooldown = 10 * 60 * 1000; // 5 phút dưới dạng milliseconds
    let isAttackInProgress = false;

    let lastSentHash = ''; // Lưu trạng thái lần gửi cuối
    let isRunning = false; // Cờ kiểm soát quá trình chạy
    const BLACK_LIST = [10,14,3381,18047,401,1909,129,17,2,1291,71,2238,4950,24,149,3804,17603,693,1900,100,1522,10667,10757]
    let baseUrl = location.hostname;
    console.log('domain hien tai:::', baseUrl)

    let fetchStartTime, fetchEndTime;
    let attackStartTime, attackEndTime;

    const getCharacterId = () => {
        const scripts = document.getElementsByTagName('script');
        for (const script of scripts) {
            // Regex cải tiến: Bắt cả trường hợp có khoảng trắng và dấu nháy
            const match = script.textContent.match(/my_character\s*=\s*['"]?(\d+)['"]?/);
            if (match) return parseInt(match[1], 10);
        }
        console.error('Không tìm thấy my_character trong script');
        return null;
    };
    const getMineEnergy = async () => {
        try {
            const characterId = getCharacterId();
            if (!characterId) {
                console.error('Không tìm thấy character ID');
                return 0;
            }

            const response = await fetch(
                `/api/character_energy_mine?character=${characterId}&v=${Date.now()}`
            );
            const data = await response.json();
            return data.current || 0;
        } catch (e) {
            console.error('Lỗi khi check lượt đánh:', e);
            return 0;
        }
    };


    const calculateValue = (reward) => {
        let total = 0;
        const validItems = {};

        for (const itemKey in reward) {
            if (priorityItem[itemKey]) {
                const amount = reward[itemKey].amount || 0;
                const price = priceInMarket[itemKey] || 0;

                if (amount > 0 && price > 0) {
                    const value = amount * price;
                    total += value;
                    const itemName = priorityItem[itemKey]
                    validItems[itemName] = (validItems[itemName] || 0) + amount;
                }
            }
        }

        return { total, validItems };
    };

    const processMiner = async (miner, area, index) => {
        try {
            const data = JSON.parse(miner.data);
            const reward = data.miner?.reward;

            //const isProtect = data.miner?.protect === true;
            const isProtect = !!data.miner?.protect;

            if (!reward || typeof reward !== 'object' || isProtect) return null;

            const { total, validItems } = calculateValue(reward);
            if (total <= 0) return null;

            return {
                area: area,
                rare: data.rare,
                stt: index + 1,
                mine_id: parseInt(miner.id_score, 10),
                character_id: parseInt(miner.target, 10),
                author: data.miner?.info?.name,
                total_value: total,
                valid_items: validItems,
                isProtect:isProtect
            };
        } catch (e) {
            console.error(`Error processing miner: ${e}`);
            return null;
        }
    };



    const processArea = async (area) => {
        try {
            const start = Date.now();
            console.log(`Bắt đầu xử lí dữ liệu:::${start}`)
            const response = await fetch(
                `/api/score_list?type=battle_mine&area=${area}`
            );
            const miners = await response.json();

            const minersPromises = miners.map((miner, index) =>processMiner(miner, area, index));

            const areaResults = await Promise.all(minersPromises);
            fetchEndTime = Date.now();
            console.log(`Kết thúc xử lí dữ liệu::: ${Date.now()}`)
            console.log(`[PERF] Xử lý tầng ${area} mất: ${Date.now() - start}ms`);
            return areaResults.filter(item => item !== null);
        } catch (e) {
            console.error(`Error processing area ${area}: ${e}`);
            GM_notification(`Lỗi khi xử lý tầng ${area}: ${e.message}`, 'Lỗi');
            return [];
        }
    };

    const processBattle = async (mine_id, target) => {
        try {
            const response = await fetch(
                `/assets/ajax/character_activity.php`,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: `action=battle_mine_challenge&mine_id=${mine_id}&target=${target}`
                }
            );
            //attackEndTime = Date.now();

            const responseText = await response.text();
            if (!responseText || responseText.trim() == "" ||responseText.includes("<!--empty-->")) {
                window.location.reload()
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(responseText, "text/html");
            const scripts = doc.getElementsByTagName('script');
            let isWeak = false;
            let battle_id = null;
            let popupData = {};
            let popupDataRaw = {};
            let isSuccess = false;
            let errorMessage = '';
            let battleLoaded = false;
            let status = true;

            for (const script of scripts) {
                const scriptContent = script.textContent;
                const battleIdMatch = scriptContent.match(/battle_id\s*=\s*'([^']+)'/);
                if (battleIdMatch) {
                    battle_id = battleIdMatch[1];
                    console.log(`[DEBUG] Found battle_id: ${battle_id}`);
                }

                if (scriptContent.includes("alertify.success")) {
                    isSuccess = true;
                    console.log("Tấn công thành công");
                } else if (scriptContent.includes("alertify.error")) {
                    isSuccess = false;
                    status = false;
                    const errorMatch = scriptContent.match(/alertify\.error\('([^']+)'\)/);
                    if (errorMatch) {
                        errorMessage = errorMatch[1];
                        console.log('[DEBUG] Lỗi khi khiêu chiến:', errorMessage);
                    }
                }

                const popupMatch = scriptContent.match(/popup_data\s*=\s*({[\s\S]*?})\s*;/);
                if (popupMatch) {
                    try {
                        const rawData = JSON.parse(popupMatch[1]);
                        console.log('[DEBUG] Parsed popup_data:', rawData);
                        popupData = Object.fromEntries(
                            Object.entries(rawData)
                                .filter(([key]) => key !== 'gold' && key !== 'mine_ore')
                                .map(([key, value]) => {
                                    if (value && typeof value === 'object' && 'amount' in value) {
                                        return [key, value.amount];
                                    }
                                    return [key, value];
                                })
                        );
                        popupDataRaw = Object.fromEntries(
                            Object.entries(rawData)
                                .filter(([key]) => key)
                                .map(([key, value]) => {
                                    if (value && typeof value === 'object' && 'amount' in value) {
                                        return [key, value.amount];
                                    }
                                    return [key, value];
                                })
                        );
                        console.log("[processBattle] done parse popup_data");
                    } catch (e) {
                        console.error('[DEBUG] Lỗi parse popup_data:', e);
                    }
                }
            }


            return {
                success: isSuccess,
                popupData: popupData,
                popupDataRaw: popupDataRaw,
                error: errorMessage,
                status: status,
                rawResponse: responseText,
                battle_id: battle_id ? `<battle>${battle_id}</battle>` : null
            };

        } catch (error) {
            console.error('[DEBUG] Lỗi processBattle:', {
                error: error,
                stack: error.stack
            });
            return {
                success: false,
                error: error?.message || error,
                //rawResponse: responseText
            };
        }
    };

    const getHmkLevel = async () => {
        const areas = Array.from({ length: 11 }, (_, i) => i + 1);

        const areaPromises = areas.map(area => processArea(area));
        const allResults = await Promise.all(areaPromises);
        return allResults
            .flatMap(arr => arr)
            .sort((a, b) => b.total_value - a.total_value);
    };

    const sendToTelegram = async (message) => {
        const token = '8178445381:AAEL5AHPsPcsLYZa5qQvnWPI-3EQI3gMj04';
        const chatId = '5709122878';

        return new Promise((resolve) => {
            GM.xmlHttpRequest({
                method: 'POST',
                url: `https://api.telegram.org/bot${token}/sendMessage`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                }),
                onload: (response) => {
                    if (response.status !== 200) {
                        console.error('Lỗi Telegram:', response.responseText);
                    }
                    resolve();
                },
                onerror: (error) => {
                    console.error('Lỗi kết nối Telegram:', error);
                    resolve();
                }
            });
        });
    };
    const sendToDiscord = async (message) => {
        return new Promise((resolve) => {
            GM.xmlHttpRequest({
                method: 'POST',
                url: NOTIFICATION_CONFIG.DISCORD.webhookUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    content: '📢 Thông báo khai thác mới',
                    embeds: [{
                        title: 'Chi tiết kết quả',
                        description: message,
                        color: 0x00ff00,
                        timestamp: new Date().toISOString()
                    }]
                }),
                onload: (response) => {
                    if (response.status < 200 || response.status >= 300) {
                        console.error('Lỗi Discord:', response.responseText);
                    }
                    resolve();
                },
                onerror: (error) => {
                    console.error('Lỗi kết nối Discord:', error);
                    resolve();
                }
            });
        });
    };

    const formatForDiscord = (filtered, now) => {

        let message = `📊 **KẾT QUẢ KHAI THÁC MỚI LÚC ${now.toLocaleString('vi-VN')}**\n\n`;

        console.log(filtered)
        filtered.slice(0, 15).forEach((item, index) => {
            const rare = parseInt(item.rare) || 0;
            const rareInfo = RARE_COLORS[rare] || RARE_COLORS[0];

            message += `🏷 **#${index + 1}**\n`
                + `├ Tầng: ${item.area}\n`
                + `├ Rare: ${rareInfo.name}\n`
                + `├ Vị trí: ${item.stt}\n`
                + `├ Mine id: ${item.mine_id}\n`
                + `├ Tác giả: ${item.author || 'Ẩn danh'} (ID: ${item.character_id})\n`
                + `├ Giá trị: ${item.total_value.toFixed(2)}💰\n`
                + `└ Vật phẩm:\n${Object.entries(item.valid_items)
                                  .map(([name, amount]) => `   ↪ ${name} x${amount}`)
                                  .join('\n')}\n\n`;
        });

        //console.log("message to discord", message)
        return message;
    };

    const formatResults = (filtered, now) => {
        let message = `📊 <b>KẾT QUẢ KHAI THÁC MỚI LÚC ${now.toLocaleString('vi-VN')}</b>\n\n`;
        filtered.slice(0, 15).forEach((item, index) => {
            const rare = parseInt(item.rare) || 0;
            const rareInfo = RARE_COLORS[rare] || RARE_COLORS[0];
            message += `🏷 <b>#${index + 1}</b>\n`
                     + `┣ Tầng: ${item.area}\n`
                     + `┣ Rare: ${rareInfo.name}\n`
                     + `┣ Vị ttrí ${item.stt}\n`
                     + `├ Mine id: ${item.mine_id}\n`
                     + `┣ Tác giả: ${item.author || 'Ẩn danh'} id: ${item.character_id}\n`
                     + `┣ Giá trị: ${item.total_value.toFixed(2)}💰\n`
                     + `┗ Vật phẩm: ${Object.entries(item.valid_items)
                                   .map(([name, amount]) => `${amount}x${name}`)
                                   .join('\n')}\n\n`;
         });

        //console.log("message for tele", message)
        return message;
    };

   const formatAttackResult = (mine, result, remainingAttacks, now) => {
       console.log(result)
       const status = result.success ? '✅ THÀNH CÔNG' : '❌ THẤT BẠI';

       let message = `⚔️ **KẾT QUẢ TẤN CÔNG MỎ ${mine.mine_id}** (${status})\n`
       + `⏰ Thời gian: ${now.toLocaleString('vi-VN')}\n`
       + `🏷 Tầng: ${mine.area} | Rare: ${RARE_COLORS[mine.rare].name}\n`
       + `🎯 Mục tiêu: ${mine.author || 'Ẩn danh'} (ID: ${mine.character_id})\n`;

       if (!result.status) {
           message += `Có lỗi khi khiêu chiến: ${result.error}`;
           return message;
       }

       message += `Kiểm tra dữ liệu tại battle: ${result.battle_id}`;

       // Tạo bản đồ chuyển đổi từ itemKey sang itemName cho vật phẩm nhận được
       const gainedItemsMap = new Map();
       if (result.popupDataRaw) {
           for (const [itemKey, amount] of Object.entries(result.popupDataRaw)) {
               if (priorityItem[itemKey]) {
                   const itemName = priorityItem[itemKey];
                   gainedItemsMap.set(itemName, (gainedItemsMap.get(itemName) || 0) + amount);
               }
           }
       }

       // Phần nhận được
       if (result.success) {
           message += "\n\n📥 **VẬT PHẨM NHẬN ĐƯỢC:**\n";

           if (gainedItemsMap.size === 0) {
               message += "- Không nhận được vật phẩm nào\n";
           } else {
               for (const [itemName, amount] of gainedItemsMap.entries()) {
                   message += `- ${itemName}: ${amount}\n`;
               }
           }

           // Phần mất đi - so sánh với vật phẩm ban đầu trong mỏ

           let hasLoss = false;

           if (mine.valid_items && gainedItemsMap != mine.valid_items) {
               message += "\n📤 **VẬT PHẨM MẤT ĐI:**\n";
               for (const [itemName, originalAmount] of Object.entries(mine.valid_items)) {
                   const gainedAmount = gainedItemsMap.get(itemName) || 0;
                   const lostAmount = originalAmount - gainedAmount;

                   if (lostAmount > 0) {
                       message += `- ${itemName}: ${lostAmount}\n`;
                   }
               }
           } else {
               message += "- Không mất vật phẩm\n";
           }

       } else {
           message += `\n\n📛 **LÝ DO THẤT BẠI:** ${result?.error || 'Do bạn yếu hơn đối thủ'}\n`;
       }

       message += `\n🗡️ Lượt đánh còn lại: ${remainingAttacks}\n`;
       return message;
   };


    const checkAndNotify = async () => {
        if (isRunning || isAttackInProgress) return;
        isRunning = true;

        //await checkDomainChange();
        try {
            const results = await getHmkLevel();
            const filtered = results.filter(item =>
                                            item.total_value >= NOTIFICATION_CONFIG.MIN_VALUE &&
                                            item.isProtect === false &&
                                            !BLACK_LIST.includes(item.character_id)
                                           );

            // Thêm thông tin lượt đánh vào log
            const remainingAttacks = await getMineEnergy();
            console.log(`Lượt đánh còn lại: ${remainingAttacks}`);

            //break point 5p
            //const currentTime = Date.now();

            //const timeSinceLastAttack = currentTime - lastAttackTime;



            const currentHash = JSON.stringify(filtered);
            if (filtered.length > 0 && currentHash !== lastSentHash) {
                lastSentHash = currentHash;
                let messageAttack ='';

                if (remainingAttacks > 10
                    //&& timeSinceLastAttack >= attackCooldown
                   ) {
                    isAttackInProgress = true;
                    const targetMine = filtered[0];
                    const battleResult = await processBattle(targetMine.mine_id, 'private');
                    console.log(`Kết quả tấn công: ${battleResult.success ? 'Thành công' : 'Thất bại'}`);
                    const remainingAttacks = await getMineEnergy()
                    messageAttack = formatAttackResult(targetMine, battleResult, remainingAttacks, new Date());

                    GM_notification(
                        `Tấn công mỏ ${battleResult.success ? 'thành công' : 'thất bại'}!`,
                        'Kết quả tấn công'
                    );
                    //lastAttackTime = currentTime;
                    isAttackInProgress = false;
                }


                //const telegramMessage = formatResults(filtered, new Date());
                const discordMessage = formatForDiscord(filtered, new Date());
                if (!messageAttack) {
                    await sendToDiscord(discordMessage)
                } else {
                    await Promise.all([
                        sendToDiscord(discordMessage),
                        sendToDiscord(messageAttack)
                    ]);
                }
                GM_notification(
                    `Đã gửi thông tin tới discord`
                )

            }

        } catch (e) {
            GM_notification(`Lỗi hệ thống: ${e.message}`, 'Lỗi');
            isAttackInProgress = false;
        } finally {
            isRunning = false;
        }
    };

    setTimeout(function runner() {
        checkAndNotify();
        setTimeout(runner, 60000);
    }, 1000);

})();