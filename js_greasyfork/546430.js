// ==UserScript==
// @name         Таня_CrossMP(Google shit)
// @match        *://*.wildberries.ru/catalog/*/detail.aspx*
// @match        *://*.ozon.ru/product/*
// @match        *://*.yandex.ru/product/*
// @match        *://*.yandex.ru/card/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        namespace 
// @license      1
// @description  1
// @run-at       document-end
// @version 0.0.1.20250819193301
// @namespace https://greasyfork.org/users/222079
// @downloadURL https://update.greasyfork.org/scripts/546430/%D0%A2%D0%B0%D0%BD%D1%8F_CrossMP%28Google%20shit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546430/%D0%A2%D0%B0%D0%BD%D1%8F_CrossMP%28Google%20shit%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Настройки Google Sheets
    const SHEET_ID = 'ЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖЖ';
    const SHEET_GID = '0';
    const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

    const STORAGE_KEY = 'marketplace_data';
    const LAST_UPDATE_KEY = 'marketplace_last_update';
    const MENU_STATE_KEY = 'marketplace_menu_state';

    // Основные функции
    function loadAndParseSheet() {
        GM_xmlhttpRequest({
            method: "GET",
            url: CSV_URL,
            onload: function(response) {
                try {
                    const lines = response.responseText.split('\n').filter(l => l.trim());
                    if (lines.length < 2) return showAlert('❌ Неверный формат данных в таблице');

                    const headers = lines[0].split(',').map(h => h.trim());
                    const numColumns = headers.length;
                    const map = {};

                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
                        const cleanValues = values.map(v => v.replace(/^"|"$/g, '').trim());

                        if (cleanValues.length < 3) continue;

                        const row = {
                            articul: cleanValues[0],
                            wb: cleanValues[1],
                            ozon: cleanValues[2],
                            ozon_id: numColumns >= 4 ? cleanValues[3] || '' : '',
                            ym_model: numColumns >= 5 ? cleanValues[4] || '' : '',
                            ym_sku: numColumns >= 6 ? cleanValues[5] || '' : ''
                        };

                        if (row.articul) map[row.articul] = row;
                    }

                    // Сохраняем в GM storage вместо localStorage
                    GM_setValue(STORAGE_KEY, JSON.stringify(map));
                    GM_setValue(LAST_UPDATE_KEY, new Date().toLocaleString('ru-RU'));
                    showAlert(`✅ База обновлена! (${Object.keys(map).length} товаров)`);
                    checkAndShowButtons();
                } catch (e) {
                    showAlert('❌ Ошибка обработки данных таблицы');
                    console.error(e);
                }
            },
            onerror: () => showAlert('❌ Ошибка загрузки таблицы. Убедитесь, что таблица опубликована для общего доступа.')
        });
    }

    function getMarketplaceData() {
        const data = GM_getValue(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }

    function extractArticulFromURL() {
        const url = decodeURIComponent(window.location.href);

        // Wildberries
        const wbMatch = url.match(/\/catalog\/(\d+)\/detail\.aspx/);
        if (wbMatch) return { type: 'wb', id: wbMatch[1] };

        // Ozon
        const ozonMatch = url.match(/\/product\/.*?(\d+)(?:\/|$)/);
        if (ozonMatch) return { type: 'ozon', id: ozonMatch[1] };

        // Яндекс (все варианты)
        const ymSkuMatch = url.match(/(?:product|card).*?sku=(\d+)/) || url.match(/\/card\/.*?(\d{10,12})(?:\?|$)/);
        if (ymSkuMatch) return { type: 'ym_sku', id: ymSkuMatch[1] };

        const ymModelMatch = url.match(/\/(?:product|card)\/(\d+)/) || url.match(/\/product--.*?(\d+)/);
        if (ymModelMatch) return { type: 'ym_model', id: ymModelMatch[1] };

        return null;
    }

    function findArticulInMap(id, type) {
        const map = getMarketplaceData();
        if (!map) return null;

        for (const [articul, data] of Object.entries(map)) {
            if (
                (type === 'wb' && data.wb === id) ||
                (type === 'ozon' && data.ozon === id) ||
                (type === 'ym_sku' && data.ym_sku === id) ||
                (type === 'ym_model' && data.ym_model === id)
            ) {
                return { articul, data };
            }
        }
        return null;
    }

    // UI функции
    function createMainWindow() {
        const existingWindow = document.getElementById('marketplace-main-window');
        if (existingWindow) existingWindow.remove();

        const mainWindow = document.createElement('div');
        mainWindow.id = 'marketplace-main-window';
        mainWindow.style.cssText = `
            position: fixed;
            top: 50%;
            right: -300px;
            transform: translateY(-50%);
            z-index: 99999;
            width: 280px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            padding: 15px;
            font-family: Arial, sans-serif;
            max-height: 80vh;
            overflow-y: auto;
            transition: right 0.3s ease;
        `;

        mainWindow.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <button id="close-main-window" style="background: none; border: none; font-size: 18px; cursor: pointer; color: #999;">×</button>
            </div>
            <div id="main-window-content">
                <p style="text-align: center; color: #666; margin: 15px 0; font-size: 14px;">
                    <i>Откройте карточку товара</i>
                </p>
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <button id="update-btn" style="padding: 8px 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    🔄 Обновить базу
                </button>
            </div>
        `;

        document.body.appendChild(mainWindow);
        document.getElementById('close-main-window').onclick = toggleMainWindow;
        document.getElementById('update-btn').onclick = loadAndParseSheet;

        return mainWindow;
    }

    function toggleMainWindow() {
        const mainWindow = document.getElementById('marketplace-main-window');
        const stripe = document.getElementById('marketplace-red-stripe');

        if (mainWindow.style.right === '10px') {
            mainWindow.style.right = '-300px';
            if (stripe) stripe.style.display = 'block';
            GM_setValue(MENU_STATE_KEY, 'closed');
        } else {
            mainWindow.style.right = '10px';
            if (stripe) stripe.style.display = 'none';
            GM_setValue(MENU_STATE_KEY, 'open');
        }
    }

    function createRedStripe() {
        const existingStripe = document.getElementById('marketplace-red-stripe');
        if (existingStripe) existingStripe.remove();

        const stripe = document.createElement('div');
        stripe.id = 'marketplace-red-stripe';
        stripe.style.cssText = `
            position: fixed;
            top: 50%;
            right: 0;
            width: 55px;
            height: 150px;
            background: linear-gradient(to right, #ff0000, #cc0000);
            border-radius: 10px 0 0 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            cursor: pointer;
            z-index: 99997;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            text-align: center;
            padding: 5px;
            transition: all 0.3s ease;
        `;

        stripe.onclick = toggleMainWindow;
        document.body.appendChild(stripe);

        // Скрываем если меню открыто
        if (GM_getValue(MENU_STATE_KEY) === 'open') {
            stripe.style.display = 'none';
        }
    }

    function showButtonsInWindow(articul, data) {
        const content = document.getElementById('main-window-content');
        if (!content) return;

        const currentHost = window.location.hostname;
        const buttons = [];
        const cabinetButtons = [];

        // Кнопки для карточек товаров (только если есть данные)
        if (currentHost.includes('wildberries')) {
            if (data.ozon) buttons.push({ text: 'OZ', url: `https://www.ozon.ru/product/${data.ozon}/`, bg: '#ADD8E6' });
            if (data.ym_sku && data.ym_model) buttons.push({ text: 'YM', url: `https://market.yandex.ru/product/${data.ym_model}?sku=${data.ym_sku}`, bg: '#FFFFE0' });
        }
        else if (currentHost.includes('ozon')) {
            if (data.wb) buttons.push({ text: 'WB', url: `https://www.wildberries.ru/catalog/${data.wb}/detail.aspx`, bg: '#E0BBE4' });
            if (data.ym_sku && data.ym_model) buttons.push({ text: 'YM', url: `https://market.yandex.ru/product/${data.ym_model}?sku=${data.ym_sku}`, bg: '#FFFFE0' });
        }
        else if (currentHost.includes('yandex')) {
            if (data.ozon) buttons.push({ text: 'OZ', url: `https://www.ozon.ru/product/${data.ozon}/`, bg: '#ADD8E6' });
            if (data.wb) buttons.push({ text: 'WB', url: `https://www.wildberries.ru/catalog/${data.wb}/detail.aspx`, bg: '#E0BBE4' });
        }

        // Кнопки для личных кабинетов (только если есть данные)
        if (data.wb) {
            cabinetButtons.push({
                text: 'WB Каб.',
                url: `https://seller.wildberries.ru/new-goods/card?nmID=${data.wb}&type=EXIST_CARD`,
                bg: '#E0BBE4',
            });
        }
        if (data.ozon_id) {
            cabinetButtons.push({
                text: 'OZ Каб.',
                url: `https://seller.ozon.ru/app/products/${data.ozon_id}/edit/all-attrs`,
                bg: '#ADD8E6',
            });
        }
        if (data.articul && data.ym_sku) {
            cabinetButtons.push({
                text: 'YM Каб.',
                url: `https://partner.market.yandex.ru/supplier/73224272/assortment/offer-card?article=${data.articul}`,
                bg: '#FFFFE0',
            });
        }

        let buttonsHTML = buttons.map(btn =>
            `<a href="${btn.url}" target="_blank" style="display: inline-block; margin: 4px 2px; padding: 6px 8px; background: ${btn.bg}; color: black; border-radius: 3px; text-decoration: none; text-align: center; font-size: 12px; width: 50px;">${btn.text}</a>`
        ).join('');

        let cabinetButtonsHTML = cabinetButtons.map(btn =>
            `<a href="${btn.url}" target="_blank" style="display: inline-block; margin: 4px 2px; padding: 6px 8px; background: ${btn.bg}; color: black; border-radius: 3px; text-decoration: none; text-align: center; font-size: 12px; width: 70px;" title="${btn.title}">${btn.text}</a>`
        ).join('');

        content.innerHTML = `
            ${buttons.length ? `
            <div style="margin-bottom: 10px; font-size: 13px;">
                <strong>Другие маркетплейсы:</strong><br>
                ${buttonsHTML}
            </div>
            ` : ''}
            ${cabinetButtons.length ? `
            <div style="margin-bottom: 10px; font-size: 13px;">
                <strong>Личные кабинеты:</strong><br>
                ${cabinetButtonsHTML}
            </div>
            ` : ''}
            ${!buttons.length && !cabinetButtons.length ? `
            <div style="margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-radius: 4px; font-size: 13px;">
                Нет данных для других маркетплейсов
            </div>
            ` : ''}
        `;

        const lastUpdate = GM_getValue(LAST_UPDATE_KEY);
        if (lastUpdate) {
            content.innerHTML += `<div style="margin-top: 10px; font-size: 10px; color: #666; text-align: center;">Обновлено: ${lastUpdate}</div>`;
        }
    }

    function checkAndShowButtons() {
        const extracted = extractArticulFromURL();
        const content = document.getElementById('main-window-content');
        if (!content) return;

        if (!extracted) {
            content.innerHTML = `<p style="text-align: center; color: #666; margin: 15px 0; font-size: 13px;"><i>Не удалось определить ID товара</i></p>`;
            return;
        }

        const result = findArticulInMap(extracted.id, extracted.type);
        if (result) {
            showButtonsInWindow(result.articul, result.data);
        } else {
            content.innerHTML = `
                <div style="margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-radius: 4px; font-size: 13px;">
                    <strong>Товар не найден</strong>
                </div>
                <div style="margin-bottom: 10px; padding: 8px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; font-size: 12px;">
                    <strong>ID:</strong> ${extracted.id}<br>
                    <strong>Тип:</strong> ${extracted.type}
                </div>
            `;
        }

        if (GM_getValue(MENU_STATE_KEY) === 'open') {
            document.getElementById('marketplace-main-window').style.right = '10px';
        }
    }

    function showAlert(message) {
        alert(message + (GM_getValue(LAST_UPDATE_KEY) ? `\nОбновлено: ${GM_getValue(LAST_UPDATE_KEY)}` : ''));
    }

    // Инициализация
    let lastUrl = location.href;
    let observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            checkAndShowButtons();
        }
    });

    // Слушатель изменений в GM storage
    const storageListener = GM_addValueChangeListener(STORAGE_KEY, (name, oldVal, newVal) => {
        checkAndShowButtons();
    });

    // Очистка при закрытии вкладки
    window.addEventListener('unload', () => {
        GM_removeValueChangeListener(storageListener);
    });

    observer.observe(document, { subtree: true, childList: true });

    createRedStripe();
    createMainWindow();

    if (GM_getValue(MENU_STATE_KEY) === 'open') {
        setTimeout(() => {
            const mainWindow = document.getElementById('marketplace-main-window');
            if (mainWindow) mainWindow.style.right = '10px';
        }, 100);
    }

    setTimeout(checkAndShowButtons, 500);
})();