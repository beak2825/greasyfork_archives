// ==UserScript==
// @name         Счётчик тем для ПИЗДАТОГО ГА 17 СЕРВЕРА.
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Счётчик тем.
// @author       Skay_Eagle
// @match        https://forum.blackrussia.online/*
// @grant        none
// @icon https://i.postimg.cc/C5XqDrXY/photo-2021-09-20-17-14-18-2.jpg
// @downloadURL https://update.greasyfork.org/scripts/544733/%D0%A1%D1%87%D1%91%D1%82%D1%87%D0%B8%D0%BA%20%D1%82%D0%B5%D0%BC%20%D0%B4%D0%BB%D1%8F%20%D0%9F%D0%98%D0%97%D0%94%D0%90%D0%A2%D0%9E%D0%93%D0%9E%20%D0%93%D0%90%2017%20%D0%A1%D0%95%D0%A0%D0%92%D0%95%D0%A0%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/544733/%D0%A1%D1%87%D1%91%D1%82%D1%87%D0%B8%D0%BA%20%D1%82%D0%B5%D0%BC%20%D0%B4%D0%BB%D1%8F%20%D0%9F%D0%98%D0%97%D0%94%D0%90%D0%A2%D0%9E%D0%93%D0%9E%20%D0%93%D0%90%2017%20%D0%A1%D0%95%D0%A0%D0%92%D0%95%D0%A0%D0%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SEARCH_ID = '123';
    const isPopup = window.opener && window.name === 'br_topic_counter_popup';

    if (isPopup) {
        runCountingInPopup();
        return;
    }

    // === Главное окно (UI) ===
    const toggleButton = document.createElement('button');
    toggleButton.innerText = '📊 Темы';
    toggleButton.style = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 15px;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toggleButton);

    const panel = document.createElement('div');
    panel.style = `
        display: none;
        position: fixed;
        top: 60px;
        right: 10px;
        width: 300px;
        background: #202020;
        color: #fff;
        border: 1px solid #444;
        padding: 15px;
        z-index: 10000;
        border-radius: 12px;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    `;

    panel.innerHTML = `
        <h3 style="margin-top:0; font-size:16px; text-align:center;">📋 Подсчет тем</h3>
        <label style="font-size:13px;">🔗 Ссылка на профиль:</label>
        <input type="text" id="profileLink" placeholder="https://forum.blackrussia.online/members/skay-eagle.561705/" style="width: 100%; margin-bottom: 10px; padding: 6px; border-radius: 6px; border: none;">
        <label style="font-size:13px;">📅 Начальная дата:</label>
        <input type="date" id="startDate" style="width: 100%; margin-bottom: 10px; padding: 6px; border-radius: 6px; border: none;">
        <label style="font-size:13px;">📅 Конечная дата:</label>
        <input type="date" id="endDate" style="width: 100%; margin-bottom: 15px; padding: 6px; border-radius: 6px; border: none;">
        <button id="startCountBtn" style="width: 100%; background: #2196F3; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer;">
            ▶ Посчитать
        </button>
        <div id="resultCount" style="margin-top: 15px; font-size: 14px; text-align: center;"></div>
    `;
    document.body.appendChild(panel);

    toggleButton.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    function extractUsername(url) {
        try {
            const match = decodeURIComponent(url).match(/members\/([^\.\/\?]+)/);
            if (!match) return null;
            return match[1].replace(/-/g, '+');
        } catch {
            return null;
        }
    }

    document.getElementById('startCountBtn').addEventListener('click', () => {
        const profileUrl = document.getElementById('profileLink').value.trim();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const resultDiv = document.getElementById('resultCount');

        const username = extractUsername(profileUrl);
        if (!username) return alert('⚠️ Не удалось извлечь ник из ссылки');

        if (!startDate || !endDate) return alert('⚠️ Укажите обе даты');

        const searchUrl = `https://forum.blackrussia.online/search/${SEARCH_ID}/?page=1&t=post&c[newer_than]=${startDate}&c[older_than]=${endDate}&c[users]=${username}&o=relevance`;

        resultDiv.innerText = '🔎 Открываю вкладку...';

        const popup = window.open(searchUrl, 'br_topic_counter_popup');

        window.addEventListener('message', function handler(event) {
            if (event.source === popup && event.data?.type === 'br_topic_count_result') {
                const count = event.data.count;
                resultDiv.innerText = `✅ Всего тем: ${count}`;
                popup.close();
                window.removeEventListener('message', handler);
            }
        }, { once: true });
    });

    // === Вкладка (popup) ===
    async function runCountingInPopup() {
        const container = document.createElement('div');
        container.style = `
            position: fixed;
            top: 10px; left: 10px; right: 10px; bottom: auto;
            background: #111; color: white;
            padding: 10px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            z-index: 999999;
            max-height: 250px;
            overflow-y: auto;
        `;
        container.innerHTML = `<b>⏳ Считаем темы...</b><ul id="topicList" style="margin-top: 8px; font-size: 13px; padding-left: 18px;"></ul>`;
        document.body.appendChild(container);
        const topicList = container.querySelector('#topicList');

        const wait = ms => new Promise(r => setTimeout(r, ms));
        const u = new URL(location.href);
        const searchId = location.pathname.match(/search\/(\d+)/)?.[1];
        const baseUrl = `https://forum.blackrussia.online/search/${searchId}/`;
        const newer = u.searchParams.get("c[newer_than]");
        const older = u.searchParams.get("c[older_than]");
        const user = u.searchParams.get("c[users]");
        const o = u.searchParams.get("o") || "relevance";

        let page = 1;
        let topicCount = 0;
        const maxPages = 30;

        while (page <= maxPages) {
            const pageUrl = `${baseUrl}?page=${page}&t=post&c[newer_than]=${newer}&c[older_than]=${older}&c[users]=${user}&o=${o}`;
            const resp = await fetch(pageUrl, {redirect: 'manual'});

            if (resp.status === 303) {
                console.log(`Получен статус 303 на странице ${page}. Останавливаемся.`);
                break;
            }

            if (!resp.ok) {
                console.log(`Ошибка при загрузке страницы ${page}: ${resp.status}`);
                break;
            }

            const text = await resp.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const items = doc.querySelectorAll('li.block-row.js-inlineModContainer');

            if (items.length === 0) break;

            items.forEach(item => {
                const title = item.querySelector('.contentRow-title a');
                if (title) {
                    const text = title.textContent.trim().substring(0, 80);
                    if (page === 1) {
                        const li = document.createElement('li');
                        li.textContent = text;
                        topicList.appendChild(li);
                    }
                    topicCount++;
                }
            });

            if (items.length < 20) break;

            page++;
            await wait(5000);
        }

        window.opener.postMessage({
            type: 'br_topic_count_result',
            count: topicCount
        }, '*');

        container.innerHTML = `✅ Подсчет завершён. Всего тем: <b>${topicCount}</b>`;
        setTimeout(() => window.close(), 1500);
    }

})();
