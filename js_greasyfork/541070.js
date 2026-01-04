// ==UserScript==
// @name         STC CMANGA
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Chỉ hiển thị vào thứ 5 từ 18:50 đến 19:00 (giờ VN) để kiểm tra STC gian lận
// @author       bạn
// @match        https://cmangax2.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541070/STC%20CMANGA.user.js
// @updateURL https://update.greasyfork.org/scripts/541070/STC%20CMANGA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', () => {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const vnTime = new Date(utc + 7 * 60 * 60 * 1000);
        const isThursday = vnTime.getDay() === 4; // Thứ 5
        const totalMinutes = vnTime.getHours() * 60 + vnTime.getMinutes();
        const startMinute = 0 * 60 + 50;
        const endMinute = 19 * 60 + 15

        const isWithinTimeRange = totalMinutes >= startMinute && totalMinutes < endMinute;

        if (!(isThursday && isWithinTimeRange)) {
            console.log("⏳ Không trong thời gian được phép hiển thị của sinh tử chiến.");
            return;
        }

        // ==== SCRIPT CHÍNH ====

        let dataContainer = document.getElementById('character-data-container');
        if (!dataContainer) {
            dataContainer = document.createElement('div');
            dataContainer.id = 'character-data-container';
            dataContainer.style.position = 'relative';
            dataContainer.style.marginTop = '10px';
            dataContainer.style.padding = '20px';
            dataContainer.style.paddingTop = '100px';
            dataContainer.style.background = 'white';
            dataContainer.style.zIndex = '1';
            dataContainer.style.borderBottom = '1px solid #ccc';

            const header = document.querySelector('header');
            if (header) {
                header.insertAdjacentElement('afterend', dataContainer);
            } else {
                document.body.insertBefore(dataContainer, document.body.firstChild);
            }
        }

        async function getCharactersData(ids) {
            const baseUrl = "https://cmangax2.com/api/get_data_by_id?table=game_character&data=info,data&id=";

            const fetchCharacter = async (id) => {
                try {
                    const res = await fetch(`${baseUrl}${id}&t=${Date.now()}`, { cache: "no-store" });
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);

                    const json = await res.json();
                    const info = JSON.parse(json.info);
                    const data = JSON.parse(json.data);

                    return {
                        id: info.id,
                        name: info.name,
                        stats: data.stats,
                        set: data?.set_bonus || 0,
                        skill: data?.equipment?.skill?.sign
                    };
                } catch (err) {
                    console.warn(`❌ ID ${id} failed:`, err.message);
                    return null;
                }
            };

            const fetches = ids.map(fetchCharacter);
            const results = await Promise.allSettled(fetches);
            return results.filter(r => r.status === "fulfilled" && r.value !== null).map(r => r.value);
        }

        function displayCharacterTable(characters) {
            const statsConfig = [
                { key: 'hp', label: 'Máu (HP)', isImportant: true },
                { key: 'm_attack', label: 'STVL', isImportant: false },
                { key: 'p_attack', label: 'STMP', isImportant: true },
                { key: 'm_def', label: 'PTVL', isImportant: false },
                { key: 'p_def', label: 'PTMP', isImportant: false },
                { key: 'speed', label: 'Tốc độ', isImportant: true },
                { key: 'skill_atk', label: 'STKN', isImportant: true },
                { key: 'skill_def', label: 'PTKN', isImportant: true },
                { key: 'critical', label: 'Chí mạng', isImportant: true },
                //{ key: 'skill', label: 'Kỹ năng', isImportant: true },
            ];

            const now = new Date();
            const vn = new Date(now.getTime() + 7 * 3600000);
            const timeStr = vn.toISOString().slice(11, 23);

            let table = `
                <style>
                    .character-table { border-collapse: collapse; width: 100%; margin: 20px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 2px 15px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; font-size: 20px; }
                    .character-table th, .character-table td { border: 1px solid #e0e0e0; padding: 12px 15px; text-align: left; color: black}
                    .character-table th { background-color: #4a6baf; color: white; font-weight: 600; }
                    .character-table tr:nth-child(even) { background-color: #f8f9ff; }
                    .character-table tr:nth-child(odd) { background-color: white; }
                    .character-table tr:hover { background-color: #e6f7ff; transform: scale(1.005); transition: all 0.2s ease; }
                    .important-stat { font-weight: bold; color: #d32f2f !important; }
                    .status-info { background-color: #f5f5f5; padding: 10px; border-radius: 4px; margin-bottom: 10px; font-family: monospace; font-size: 20px; color: #d32f2f !important; }
                    .set-value { color: blue; font-weight: 600; }
                    .removed-item { color: red; font-weight: 600; animation: blinker 1s linear infinite; }
                    @keyframes blinker { 50% { opacity: 0; } }
                </style>
                <div class="status-info">
                    <div><strong>Tổng số nhân vật:</strong> ${characters.length}</div>
                    <div><strong>Thời gian kiểm tra lần cuối:</strong> ${timeStr}</div>
                </div>
                <table class="character-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên nhân vật</th>
                            ${statsConfig.map(stat => `<th>${stat.label}</th>`).join('')}
                            <th>Skill</th>
                            <th>Set</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            characters.forEach(char => {
                const setBonusContent = char.set !== 0
                    ? `<span class="set-value">${char.set}</span>`
                    : `<span class="removed-item">Đã tháo đồ</span>`;

                table += `
                    <tr>
                        <td>${char.id}</td>
                        <td>${char.name}</td>
                        ${statsConfig.map(stat => {
                            const value = char.stats[stat.key]?.total ?? 'N/A';
                            const cellClass = stat.isImportant ? 'class="important-stat"' : '';
                            return `<td ${cellClass}>${value}</td>`;
                        }).join('')}
                        <td style="color: blue; font-weight: 600">${char?.skill}</td>
                        <td>${setBonusContent}</td>
                    </tr>
                `;
            });

            table += `</tbody></table>`;

            const container = document.getElementById('character-data-container');
            if (container) container.innerHTML = table;
        }

        function scheduleDataUpdate() {
            const checkInterval = 500;
            const updateIntervalMs = 500;
            let endTime;

            setInterval(() => {
                const now = Date.now();
                const current = new Date();
                const start = new Date(current);
                start.setHours(0, 50, 0, 0); // 18:50 VN
                const startTime = start.getTime();

                if (!endTime) {
                    const end = new Date(current);
                    end.setHours(19, 1, 0, 0); // 19:01 VN
                    endTime = end.getTime();
                }

                if (now >= endTime) {
                    if (window.updateInterval) {
                        clearInterval(window.updateInterval);
                        window.updateInterval = null;
                        console.log("🛑 Dừng cập nhật vì hết thời gian.");
                    }
                    return;
                }

                if (now >= startTime && now < endTime) {
                    if (!window.updateInterval) {
                        console.log("✅ Bắt đầu cập nhật dữ liệu...");
                        updateData();
                        window.updateInterval = setInterval(() => {
                            const currentMs = Date.now();
                            if (currentMs >= endTime) {
                                clearInterval(window.updateInterval);
                                window.updateInterval = null;
                                console.log("🛑 Dừng cập nhật vì hết thời gian.");
                                return;
                            }
                            if (endTime - currentMs < 200) {
                                console.log("⚠️ Bỏ qua lần cập nhật cuối sát mốc.");
                                return;
                            }
                            updateData();
                        }, updateIntervalMs);
                    }
                }
            }, checkInterval);
        }

        async function updateData() {
            console.time("update-data");
            const characterIds = [14, 401, 10, 149, 3804, 3381, 693, 18047, 47028, 17603, 30082, 129, 2, 17, 44885];

            try {
                const data = await getCharactersData(characterIds);
                displayCharacterTable(data);
            } catch (error) {
                console.error("❌ Error fetching character data:", error);
                const container = document.getElementById('character-data-container');
                if (container) {
                    container.innerHTML = `<p style="color: red;">Lỗi tải dữ liệu: ${error.message}</p>`;
                }
            } finally {
                console.timeEnd("update-data");
            }
        }

        scheduleDataUpdate();
        updateData();
    });
})();
