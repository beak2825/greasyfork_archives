// ==UserScript==
// @name         SCRIPT | FORUM ФОН by J.Murphy (Градиент)
// @namespace    https://forum.blackrussia.online
// @version      0.1.0.4
// @description  Только для ПК юзеров
// @author       J.Murphy
// @match        https://forum.blackrussia.online/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @icon         https://icons.iconarchive.com/icons/arturo-wibawa/akar/256/bluetooth-icon.png
// @downloadURL https://update.greasyfork.org/scripts/533059/SCRIPT%20%7C%20FORUM%20%D0%A4%D0%9E%D0%9D%20by%20JMurphy%20%28%D0%93%D1%80%D0%B0%D0%B4%D0%B8%D0%B5%D0%BD%D1%82%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533059/SCRIPT%20%7C%20FORUM%20%D0%A4%D0%9E%D0%9D%20by%20JMurphy%20%28%D0%93%D1%80%D0%B0%D0%B4%D0%B8%D0%B5%D0%BD%D1%82%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[BR Style] Инициализация...\n[BR Style] Author: Clarence Stoyn');

    const STYLE_ID = 'blackrussia-custom-style-v33'; 
    const PANEL_ID = 'blackrussia-settings-panel-v33'; 
    const TOP_NAV_ID = 'blackrussia-top-nav-bar-v33';
    const TOP_NAV_HEIGHT = '45px';

    let settingsPanel = null;
    let currentSettings = {};

    const defaultSettings = {
        bgImageUrl: '',
        bgColor: '#333333',
        bgColors: '#111111',
        opacityValue: 0.9,
        borderRadius: '10px',
        imgRadius: '50%',
        enableRounding: true,
        enableEdge: true,
        edgeColor: '#FFFFFF',
        edgeWidth: '1px',
        edgeOpacity: 1
    };

    function hexToRgb(hex) {
        if (!hex || typeof hex !== 'string') return null;
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // --- Управление Настройками ---
    async function loadSettings() {
        console.log('[BR Style] Загрузка настроек...');
        currentSettings = {};
        try {
            for (const key in defaultSettings) {
                const savedValue = await GM_getValue(key, defaultSettings[key]);
                if (typeof defaultSettings[key] === 'boolean') {
                    currentSettings[key] = (savedValue === true || savedValue === 'true');
                } else if (key === 'opacityValue' || key === 'edgeOpacity') {
                    currentSettings[key] = parseFloat(savedValue) || defaultSettings[key];
                 } else if (typeof defaultSettings[key] === 'number') {
                     currentSettings[key] = parseInt(savedValue, 10) || defaultSettings[key];
                } else {
                    currentSettings[key] = savedValue;
                }
            }
            console.log('[BR Style] Настройки загружены:', currentSettings);
        } catch (e) {
            console.error('[BR Style] Ошибка загрузки настроек!', e);
            currentSettings = { ...defaultSettings };
            alert('[BR Style] Ошибка загрузки настроек! Применены стандартные значения.');
       }
    }

    async function saveSettings(settingsToSave) {
        console.log('[BR Style] Сохранение настроек...');
        try {
            for (const key in settingsToSave) {
                if (defaultSettings.hasOwnProperty(key)) {
                    await GM_setValue(key, settingsToSave[key]);
                }
            }
            currentSettings = { ...settingsToSave };
            console.log('[BR Style] Настройки сохранены.');
            return true;
        } catch (e) {
            console.error('[BR Style] Ошибка сохранения настроек!', e);
            alert('[BR Style] Ошибка сохранения настроек!');
            return false;
        }
    }

    // --- Применение Динамических Стилей Форума (на основе настроек) ---
    function applyForumStyles(settings) {
        console.log('[BR Style] Применение динамических стилей...');

        let styleElement = document.getElementById(STYLE_ID);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = STYLE_ID;
            styleElement.type = 'text/css';
            (document.head || document.documentElement).appendChild(styleElement);
            console.log('[BR Style] Создан элемент style для динамических стилей.');
        }

        try {
            const bgRgb = hexToRgb(settings.bgColor);
            const elementBgColor = bgRgb ? `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${settings.opacityValue})` : defaultSettings.bgColor;

            const bgRgbs = hexToRgb(settings.bgColors);
            const elementBgColors = bgRgb ? `rgba(${bgRgbs.r}, ${bgRgbs.g}, ${bgRgbs.b}, ${settings.opacityValue})` : defaultSettings.bgColors;

            const finalBorderRadius = settings.enableRounding ? settings.borderRadius : '0px';

            const edgeRgb = hexToRgb(settings.edgeColor);
            const edgeColorWithOpacity = edgeRgb ? `rgba(${edgeRgb.r}, ${edgeRgb.g}, ${edgeRgb.b}, ${settings.edgeOpacity})` : 'transparent';
            const finalEdgeBoxShadow = settings.enableEdge ? `0 0 0 ${settings.edgeWidth} ${edgeColorWithOpacity}` : 'none';

            const mainElementsSelector = `
                .block-container, .block-filterBar, .message-inner,
                .widget-container .widget, .bbCodeBlock-content, .formPopup .menu-content,
                .tooltip-content, .structItem, .notice-content, .overlay-container .overlay-content
            `;

            const forumCss = `
                body {
                    ${settings.bgImageUrl ? `
                        background-image: url('${settings.bgImageUrl}') !important;
                        background-size: cover !important;
                        background-attachment: fixed !important;
                        background-position: center center !important;
                        background-repeat: no-repeat !important;
                    ` : ''}
                }

                .buttonGroup {
                    border-radius: ${finalBorderRadius} !important;
                    box-shadow: ${finalEdgeBoxShadow} !important;
                }

                .uix_extendedFooter .uix_extendedFooterRow>.block .block-container {
                    padding: 5px;
                }

                h1, h2, h3, h4, h5, h6 {
                    color: #fff;
                    text-shadow: 0px 0px 10px #fff;
                }

                .bgButton {
                    background: transparent;
                    border: 0px;
                    color: ${edgeColorWithOpacity} !important;
                }

                .avatar img:not(.cropImage) {
                    border-radius: ${settings.imgRadius} !important;
                }

                .node--depth2:nth-child(even) .node-body, .node-body, .message-cell.message-cell--user, .message-cell.message-cell--action, .block--messages.block .message, .button.button--link, .memberHeader-main {
                    background-color: rgba(0, 0, 0, 0);
                    background: rgba(0, 0, 0, 0);
                }

                ${mainElementsSelector} {
                    background: linear-gradient(90deg, ${elementBgColor} 0%, ${elementBgColors} 100%) !important;
                    box-shadow: ${finalEdgeBoxShadow} !important;
                    ${settings.enableRounding ? 'overflow: hidden;' : ''
                }
            `;
            styleElement.textContent = forumCss;
            console.log('[BR Style] Динамические стили применены.');
        } catch (e) {
            console.error('[BR Style] Ошибка применения динамических стилей!', e);
            alert(`[BR Style] Ошибка применения динамических стилей! ${e.message}`);
       }
    }

    // --- UI Панель Настроек ---
    function createPanel() {
        console.log('[BR Style] Создание панели настроек...');
        if (document.getElementById(PANEL_ID)) return document.getElementById(PANEL_ID);

        try {
            settingsPanel = document.createElement('div');
            settingsPanel.id = PANEL_ID;

            settingsPanel.innerHTML = `
                <h3>🎨 Настройки Стиля</h3>

                <div class="setting-group">
                    <label for="s_bgImageUrl_simple">URL Фона:</label>
                    <input type="text" id="s_bgImageUrl_simple" name="bgImageUrl" placeholder="Ссылка на картинку...">
                </div>

                <div class="setting-group">
                    <label for="s_bgColor_simple">Цвет Фона Элементов №1:</label>
                    <input type="color" id="s_bgColor_simple" name="bgColor">
                </div>

                <div class="setting-group">
                    <label for="s_bgColors_simple">Цвет Фона Элементов №2:</label>
                    <input type="color" id="s_bgColors_simple" name="bgColors">
                </div>

                <div class="setting-group">
                    <label for="s_opacityValue_simple">Прозрачность Фона Элементов (0-1):</label>
                    <input type="number" id="s_opacityValue_simple" name="opacityValue" min="0" max="1" step="0.05">
                </div>

                <hr>

                <div class="setting-group">
                    <input type="checkbox" id="s_enableRounding_simple" name="enableRounding">
                    <label for="s_enableRounding_simple" class="inline-label">Включить скругление</label>
                    <div class="sub-settings">
                        <label for="s_borderRadius_simple">Радиус Скругления:</label>
                        <input type="text" id="s_borderRadius_simple" name="borderRadius" placeholder="Например: 8px, 10px">
                    </div>
                </div>

                <hr>

                <div class="setting-group">
                    <input type="checkbox" id="s_enableEdge_simple" name="enableEdge">
                    <label for="s_enableEdge_simple" class="inline-label">Цветная Окантовка</label>
                    <div class="sub-settings">
                        <div>
                            <label for="s_edgeColor_simple">Цвет Окантовки:</label>
                            <input type="color" id="s_edgeColor_simple" name="edgeColor">
                        </div>
                        <div style="margin-top: 8px;">
                            <label for="s_edgeWidth_simple">Толщина Окантовки:</label>
                            <input type="text" id="s_edgeWidth_simple" name="edgeWidth" placeholder="Например: 1px, 2px">
                        </div>
                        <div style="margin-top: 8px;">
                            <label for="s_edgeOpacity_simple">Прозрачность Окантовки (0-1):</label>
                            <input type="number" id="s_edgeOpacity_simple" name="edgeOpacity" min="0" max="1" step="0.05">
                        </div>
                    </div>
                </div>

                <div class="button-group">
                    <button id="save-btn-simple">Сохранить</button>
                    <button id="close-btn-simple">Закрыть</button>
                </div>
           `;

           document.body.appendChild(settingsPanel);
           console.log('[BR Style] Панель настроек создана.');

           // Логика кнопок
           settingsPanel.querySelector('#save-btn-simple').addEventListener('click', async () => {
                console.log('[BR Style] Нажата кнопка Сохранить.');
                const newSettings = {};
                const inputs = settingsPanel.querySelectorAll('input[name]');
                inputs.forEach(input => {
                    const key = input.name;
                    if (defaultSettings.hasOwnProperty(key)) {
                        if (input.type === 'checkbox') {
                            newSettings[key] = input.checked;
                        } else if (input.type === 'number') {
                                newSettings[key] = parseFloat(input.value) || defaultSettings[key];
                                if (key === 'opacityValue' || key === 'edgeOpacity') {
                                    newSettings[key] = Math.max(0, Math.min(1, newSettings[key]));
                                }
                        } else {
                                newSettings[key] = input.value;
                        }
                    }
                });

                const success = await saveSettings(newSettings);
                if (success) {
                        applyForumStyles(currentSettings);
                        closePanel();
                }
            });

            settingsPanel.querySelector('#close-btn-simple').addEventListener('click', () => {
                console.log('[BR Style] Нажата кнопка Закрыть.');
                closePanel();
            });

            return settingsPanel;

        } catch (e) {
            console.error('[BR Style] Ошибка создания панели настроек!', e);
            alert('[BR Style] Не удалось создать панель настроек!');
            return null;
        }
   }

    function openPanel() {
        console.log('[BR Style] Открытие панели настроек...');
        try {
            if (!settingsPanel) {
                settingsPanel = createPanel();
                if (!settingsPanel) return;
            }
            const inputs = settingsPanel.querySelectorAll('input[name]');
            inputs.forEach(input => {
               const key = input.name;
               if (currentSettings.hasOwnProperty(key)) {
                    if (input.type === 'checkbox') {
                        input.checked = currentSettings[key];
                    } else {
                        input.value = currentSettings[key] ?? '';
                    }
                }
            });

            settingsPanel.style.display = 'block';
            console.log('[BR Style] Панель настроек открыта.');
        } catch (e) {
            console.error('[BR Style] Ошибка открытия панели настроек!', e);
            alert('[BR Style] Не удалось открыть панель настроек!');
        }
   }

    function closePanel() {
        if (settingsPanel) {
            settingsPanel.style.display = 'none';
            console.log('[BR Style] Панель настроек закрыта.');
        }
    }

    // --- Добавление HTML для верхней навигационной панели ---
    function addTopNavBarHTML() {
        console.log('[BR Style] Добавление HTML верхней панели...');
        if (document.getElementById(TOP_NAV_ID)) return;

        try {
            const topNav = document.createElement('nav');
            topNav.id = TOP_NAV_ID;
            topNav.className = 'br-top-nav-bar';

            // ---------------------------------------
            const link1_href = "https://forum.blackrussia.online/forums/3967/";
            const link1_text = "Жалобы на игроков";
         
            const link4_href = "https://forum.blackrussia.online/threads/312571/";
            const link4_text = "Правила проекта";
              const link5_href = "https://forum.blackrussia.online/forums/Жалобы-на-администрацию.468/";
            const link5_text = "Жалобы на администрацию"
              const link6_href = "https://forum.blackrussia.online/forums/Обжалование-наказаний.471/";
             const link6_text = "Обжалование";
              const link7_href = "https://forum.blackrussia.online/forums/РП-биографии.476//";
             const link7_text = "Рп Био";
            // ---------------------------------------

            topNav.innerHTML = `
                <a href="${link1_href}">${link1_text}</a>
               
                <a href="${link4_href}">${link4_text}</a>
                 <a href="${link5_href}">${link5_text}</a>
                   <a href="${link6_href}">${link6_text}</a>
                    <a href="${link7_href}">${link7_text}</a>
            `;

            document.body.insertBefore(topNav, document.body.firstChild);

            console.log('[BR Style] HTML верхней панели добавлен.');
        } catch (e) {
            console.error('[BR TopNav] Ошибка добавления HTML верхней панели!', e);
            alert('[BR Style] Не удалось добавить верхнюю панель навигации!');
        }
    }

    // --- Внедрение Статичных CSS ---
    function injectStaticStyles() {
        console.log('[BR Style] Внедрение статичных CSS...');
        try {
            const staticCss = `
                /* === Стили для Верхней Навигационной Панели === */
                #${TOP_NAV_ID} {
                    background-color: #222;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                    height: ${TOP_NAV_HEIGHT};
                    width: 100%;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 9998;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0 15px;
                    box-sizing: border-box;
                }
                #${TOP_NAV_ID} a {
                    color: #eee;
                    text-decoration: none;
                    padding: 0 15px;
                    font-size: 16px;
                    font-weight: bold;
                    line-height: ${TOP_NAV_HEIGHT};
                    transition: color 0.2s ease;
                }
                #${TOP_NAV_ID} a:hover {
                    color: #fff;
                }

                .p-pageWrapper {
                     margin-top: ${TOP_NAV_HEIGHT} !important;
                }

                /* === Стили для Панели Настроек === */
                 #${PANEL_ID} {
                     position: fixed; z-index: 9999; bottom: 10px; left: 10px; width: 300px;
                     background: #333; color: #eee; padding: 15px; border-radius: 5px;
                     box-shadow: 0 3px 10px rgba(0,0,0,0.5); display: none; border: 1px solid #555;
                     font-family: sans-serif; font-size: 13px; max-height: calc(100vh - 30px); overflow-y: auto;
                     /* Отключаем глобальное свечение для текста панели настроек для лучшей читаемости */
                     text-shadow: none !important;
                 }
                 #${PANEL_ID} * {
                     text-shadow: none !important;
                 }
                 #${PANEL_ID} h3 { margin: 0 0 15px; text-align: center; font-size: 16px; border-bottom: 1px solid #555; padding-bottom: 8px;}
                 #${PANEL_ID} div.setting-group { margin-bottom: 12px; }
                 #${PANEL_ID} label { display: block; margin-bottom: 4px; font-weight: bold; color: #ccc; }
                 #${PANEL_ID} input[type="text"], #${PANEL_ID} input[type="number"] { width: calc(100% - 12px); padding: 5px; background: #444; border: 1px solid #666; color: #eee; border-radius: 3px; box-sizing: border-box; }
                 #${PANEL_ID} input[type="color"] { padding: 0; border: 1px solid #666; height: 25px; width: 35px; vertical-align: middle; margin-left: 5px; border-radius: 3px; cursor: pointer;}
                 #${PANEL_ID} input[type="checkbox"] { vertical-align: middle; margin-right: 5px; }
                 #${PANEL_ID} label.inline-label { display: inline; font-weight: normal; vertical-align: middle; }
                 #${PANEL_ID} .button-group { margin-top: 15px; text-align: right; border-top: 1px solid #555; padding-top: 10px; }
                 #${PANEL_ID} button { padding: 6px 12px; margin-left: 8px; border: none; border-radius: 3px; cursor: pointer; font-weight: bold;}
                 #${PANEL_ID} #save-btn-simple { background-color: #4CAF50; color: white; }
                 #${PANEL_ID} #close-btn-simple { background-color: #f44336; color: white; }
                 #${PANEL_ID} hr { border: none; border-top: 1px solid #555; margin: 15px 0; }
                 #${PANEL_ID} .sub-settings { margin-left: 20px; padding-left: 10px; border-left: 2px solid #555; margin-top: 8px; }
            `;
            GM_addStyle(staticCss);
            console.log('[BR Style] Статичные CSS внедрены (включая свечение текста).');
        } catch (e) {
            console.error('[BR Style] Ошибка внедрения статичных CSS!', e);
            alert('[BR Style] Ошибка внедрения статичных CSS!');
        }
    }

    // --- Инициализация Скрипта ---
    async function initialize() {
        try {
            injectStaticStyles();
            addTopNavBarHTML();
            await loadSettings();
            applyForumStyles(currentSettings);
            GM_registerMenuCommand('🎨 Настроить стиль', openPanel, 'b');
            console.log('[BR Style] Инициализация завершена.');
        } catch (e) {
            console.error('[BR Style] Ошибка инициализации!', e);
            alert('[BR Style] Ошибка инициализации скрипта!');
        }
    }

    // --- Запуск ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();