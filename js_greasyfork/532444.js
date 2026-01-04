// ==UserScript==
// @name         BlackRussia редактор стиля форума
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Наводит красоту на форуме
// @author       Haytham_Kenway by Vladimir., Pavel_Bewerly
// @match        https://forum.blackrussia.online/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @icon         https://forum.blackrussia.online/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/532444/BlackRussia%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%BE%D1%80%20%D1%81%D1%82%D0%B8%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/532444/BlackRussia%20%D1%80%D0%B5%D0%B4%D0%B0%D0%BA%D1%82%D0%BE%D1%80%20%D1%81%D1%82%D0%B8%D0%BB%D1%8F%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fontOptions = [
        {name: "Стандартный", value: "inherit"},
        {name: "Arial", value: "Arial, sans-serif"},
        {name: "Roboto", value: "'Roboto', sans-serif"},
        {name: "Open Sans", value: "'Open Sans', sans-serif"},
        {name: "Montserrat", value: "'Montserrat', sans-serif"},
        {name: "Courier New", value: "'Courier New', monospace"}
    ];

    const defaultSettings = {
        background: '',
        backgroundUrl: '',
        transparency: 0.08,
        blurRadius: 6,
        useDarkMode: true,
        selectedFont: "'Montserrat', sans-serif",
        textColor: '#ffffff',
        headerTransparency: 0.00,
        menuTransparency: 0.28,
        messageTransparency: 0.06,
        messageContentTransparency: 0.03,
        memberHeaderTransparency: 0.50,
        placeholderTransparency: 0.50,
        customTitle: '',
        bgColor: '#0a0a0a'
    };

    const currentSettings = {
        background: GM_getValue('background', defaultSettings.background),
        backgroundUrl: GM_getValue('backgroundUrl', defaultSettings.backgroundUrl),
        transparency: GM_getValue('transparency', defaultSettings.transparency),
        blurRadius: GM_getValue('blurRadius', defaultSettings.blurRadius),
        useDarkMode: GM_getValue('useDarkMode', defaultSettings.useDarkMode),
        selectedFont: GM_getValue('selectedFont', defaultSettings.selectedFont),
        textColor: GM_getValue('textColor', defaultSettings.textColor),
        headerTransparency: GM_getValue('headerTransparency', defaultSettings.headerTransparency),
        menuTransparency: GM_getValue('menuTransparency', defaultSettings.menuTransparency),
        messageTransparency: GM_getValue('messageTransparency', defaultSettings.messageTransparency),
        messageContentTransparency: GM_getValue('messageContentTransparency', defaultSettings.messageContentTransparency),
        memberHeaderTransparency: GM_getValue('memberHeaderTransparency', defaultSettings.memberHeaderTransparency),
        placeholderTransparency: GM_getValue('placeholderTransparency', defaultSettings.placeholderTransparency),
        customTitle: GM_getValue('customTitle', defaultSettings.customTitle),
        bgColor: GM_getValue('bgColor', defaultSettings.bgColor)
    };

    let currentPage = 'main';

    function createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'br-toggle-btn';
        toggleBtn.title = 'Настройки оформления BlackRussia';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            background: #d10000;
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px rgba(209, 0, 0, 0.7);
            background-image: url('https://forum.blackrussia.online/favicon.ico');
            background-size: 60%;
            background-position: center;
            background-repeat: no-repeat;
        `;
        toggleBtn.innerHTML = '';

        document.body.appendChild(toggleBtn);
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'br-control-panel';
        panel.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            background: rgba(10, 10, 10, 0.95);
            padding: 20px;
            border-radius: 8px;
            z-index: 99998;
            width: 350px;
            max-height: 90vh;
            overflow-y: auto;
            border: 1px solid #d10000;
            box-shadow: 0 0 15px rgba(209, 0, 0, 0.5);
            color: #e0e0e0;
        `;

        // Основная страница
        const mainPageHTML = `
            <div style="margin-bottom: 20px; border-bottom: 1px solid #d10000; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin:0; font-weight: bold; color: #d10000;">ОСНОВНЫЕ НАСТРОЙКИ</h3>
                <div>
                    <button class="br-page-btn" data-page="fonts" style="margin-right: 10px;">Шрифты</button>
                    <button class="br-page-btn" data-page="transparency">Прозрачность</button>
                    <button class="br-page-btn" data-page="about">О скрипте</button>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">Заголовок форума:</label>
                <input type="text" id="br-custom-title" value="${currentSettings.customTitle}" placeholder="Введите свой заголовок" style="width: 100%; padding: 8px; margin-bottom: 10px; background: #1a1a1a; border: 1px solid #333; color: #e0e0e0;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">Фон:</label>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <input type="file" id="br-bg-image" accept="image/*" style="flex-grow: 1; background: #1a1a1a; border: 1px solid #333; color: #e0e0e0;">
                    <button id="br-reset-bg" style="padding: 0 15px; cursor: pointer; background: #d10000; color: white; border: none; border-radius: 4px;">Сброс</button>
                </div>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <input type="text" id="br-bg-url" placeholder="Ссылка на фон" value="${currentSettings.backgroundUrl}" style="flex-grow: 1; padding: 8px; background: #1a1a1a; border: 1px solid #333; color: #e0e0e0;">
                    <button id="br-apply-bg-url" style="padding: 0 15px; cursor: pointer; background: #d10000; color: white; border: none; border-radius: 4px;">Применить</button>
                </div>
                <div style="margin-bottom: 10px;">
                    <label style="display: block; margin-bottom: 8px;">Цвет фона:</label>
                    <input type="color" id="br-bg-color" value="${currentSettings.bgColor}" style="width: 100%; height: 40px;">
                </div>
                <div id="br-bg-preview" style="height: 100px; border-radius: 4px; background: ${currentSettings.background || currentSettings.backgroundUrl ? `url(${currentSettings.backgroundUrl})` : currentSettings.bgColor}; background-size: cover; border: 1px solid #333;"></div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">
                    Размытие: <span id="blur-value">${currentSettings.blurRadius}px</span>
                </label>
                <input type="range" id="br-blur" min="0" max="15" step="1" value="${currentSettings.blurRadius}" style="width: 100%; accent-color: #d10000;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: center; cursor: pointer;">
                    <input type="checkbox" id="br-dark-mode" ${currentSettings.useDarkMode ? 'checked' : ''} style="margin-right: 10px; accent-color: #d10000;">
                    Темная тема
                </label>
            </div>
        `;

        // Страница шрифтов
        const fontOptionsHTML = fontOptions.map(font =>
            `<option value="${font.value}" ${currentSettings.selectedFont === font.value ? 'selected' : ''}>${font.name}</option>`
        ).join('');

        const fontsPageHTML = `
            <div style="margin-bottom: 20px; border-bottom: 1px solid #d10000; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin:0; font-weight: bold; color: #d10000;">НАСТРОЙКИ ШРИФТОВ</h3>
                <div>
                    <button class="br-page-btn" data-page="main" style="margin-right: 10px;">Основные</button>
                    <button class="br-page-btn" data-page="transparency">Прозрачность</button>
                    <button class="br-page-btn" data-page="about">О скрипте</button>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">Выберите шрифт:</label>
                <select id="br-font-select" style="width: 100%; padding: 8px; background: #1a1a1a; border: 1px solid #333; color: #e0e0e0;">
                    ${fontOptionsHTML}
                </select>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">Цвет текста:</label>
                <input type="color" id="br-text-color" value="${currentSettings.textColor}" style="width: 100%; height: 40px;">
            </div>

            <div style="padding: 15px; background: rgba(209, 0, 0, 0.05); border-radius: 4px; border-left: 3px solid #d10000;">
                <p style="margin-top: 0;">Пример текста выбранным шрифтом:</p>
                <p id="font-preview" style="font-size: 16px; margin-bottom: 0;">Этот текст отображается выбранным шрифтом</p>
            </div>
        `;

        // Страница прозрачности
        const transparencyPageHTML = `
            <div style="margin-bottom: 20px; border-bottom: 1px solid #d10000; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin:0; font-weight: bold; color: #d10000;">НАСТРОЙКИ ПРОЗРАЧНОСТИ</h3>
                <div>
                    <button class="br-page-btn" data-page="main" style="margin-right: 10px;">Основные</button>
                    <button class="br-page-btn" data-page="fonts">Шрифты</button>
                    <button class="br-page-btn" data-page="about">О скрипте</button>
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">
                    Общая прозрачность: <span id="transparency-value">${Math.round(currentSettings.transparency * 100)}%</span>
                </label>
                <input type="range" id="br-transparency" min="0" max="100" step="1" value="${Math.round(currentSettings.transparency * 100)}" style="width: 100%; accent-color: #d10000;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">
                    Прозрачность заголовков: <span id="header-transparency-value">${Math.round(currentSettings.headerTransparency * 100)}%</span>
                </label>
                <input type="range" id="br-header-transparency" min="0" max="100" step="1" value="${Math.round(currentSettings.headerTransparency * 100)}" style="width: 100%; accent-color: #d10000;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">
                    Прозрачность меню: <span id="menu-transparency-value">${Math.round(currentSettings.menuTransparency * 100)}%</span>
                </label>
                <input type="range" id="br-menu-transparency" min="0" max="100" step="1" value="${Math.round(currentSettings.menuTransparency * 100)}" style="width: 100%; accent-color: #d10000;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">
                    Прозрачность сообщений: <span id="message-transparency-value">${Math.round(currentSettings.messageTransparency * 100)}%</span>
                </label>
                <input type="range" id="br-message-transparency" min="0" max="100" step="1" value="${Math.round(currentSettings.messageTransparency * 100)}" style="width: 100%; accent-color: #d10000;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">
                    Прозрачность содержимого сообщений: <span id="message-content-transparency-value">${Math.round(currentSettings.messageContentTransparency * 100)}%</span>
                </label>
                <input type="range" id="br-message-content-transparency" min="0" max="100" step="1" value="${Math.round(currentSettings.messageContentTransparency * 100)}" style="width: 100%; accent-color: #d10000;">
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">
                    Прозрачность профиля пользователя: <span id="member-header-transparency-value">${Math.round(currentSettings.memberHeaderTransparency * 100)}%</span>
                </label>
                <input type="range" id="br-member-header-transparency" min="0" max="100" step="1" value="${Math.round(currentSettings.memberHeaderTransparency * 100)}" style="width: 100%; accent-color: #d10000;">
                <div class="br-control-description" style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 3px;">
                    Регулирует прозрачность профиля пользователя (memberHeader)
                </div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px;">
                    Прозрачность плейсхолдера: <span id="placeholder-transparency-value">${Math.round(currentSettings.placeholderTransparency * 100)}%</span>
                </label>
                <input type="range" id="br-placeholder-transparency" min="0" max="100" step="1" value="${Math.round(currentSettings.placeholderTransparency * 100)}" style="width: 100%; accent-color: #d10000;">
                <div class="br-control-description" style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 3px;">
                    Регулирует прозрачность плейсхолдера редактора
                </div>
            </div>

            <div style="padding: 15px; background: rgba(209, 0, 0, 0.05); border-radius: 4px; border-left: 3px solid #d10000;">
                <p style="margin: 0; font-size: 13px;">Настройте прозрачность разных элементов интерфейса отдельно для более точного контроля внешнего вида.</p>
            </div>
        `;

        // Страница о скрипте
        const aboutPageHTML = `
            <div style="margin-bottom: 20px; border-bottom: 1px solid #d10000; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin:0; font-weight: bold; color: #d10000;">О СКРИПТЕ</h3>
                <div>
                    <button class="br-page-btn" data-page="main" style="margin-right: 10px;">Основные</button>
                    <button class="br-page-btn" data-page="fonts">Шрифты</button>
                    <button class="br-page-btn" data-page="transparency">Прозрачность</button>
                </div>
            </div>

            <div id="br-author-tab" style="padding: 15px; margin-bottom: 15px; border-left: 3px solid #d10000;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <div style="width: 40px; height: 40px; background: #d10000; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">HK</div>
                    <div>
                        <div style="font-weight: bold;">Haytham_Kenway</div>
                        <div style="font-size: 12px; opacity: 0.7;">Автор скрипта</div>
                    </div>
                </div>
                <div style="font-size: 13px; line-height: 1.5;">
                    Связь ВК: <a href="https://vk.com/rokkf29" target="_blank" style="text-decoration: none; color: #d10000;">vk.com/rokkf29</a>
                </div>
            </div>

            <div id="br-author-tab" style="padding: 15px; margin-bottom: 15px; border-left: 3px solid #d10000;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <div style="width: 40px; height: 40px; background: #d10000; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">PB</div>
                    <div>
                        <div style="font-weight: bold;">Pavel_Bewerly</div>
                        <div style="font-size: 12px; opacity: 0.7;">Разработчик</div>
                    </div>
                </div>
                <div style="font-size: 13px; line-height: 1.5;">
                    Связь ВК: <a href="https://vk.com/pavelbewerly" target="_blank" style="text-decoration: none; color: #d10000;">vk.com/pavelbewerly</a>
                </div>
            </div>

            <div style="padding: 15px; background: rgba(209, 0, 0, 0.05); border-radius: 4px; border-left: 3px solid #d10000;">
                <h4 style="margin-top: 0; color: #d10000;">Возможности скрипта:</h4>
                <ul style="padding-left: 20px; margin-bottom: 0;">
                    <li>Настройка фона (цвет/изображение/ссылка)</li>
                    <li>Изменение заголовка форума</li>
                    <li>Регулировка прозрачности элементов</li>
                    <li>Индивидуальная прозрачность для разных частей</li>
                    <li>Настройка размытия</li>
                    <li>Выбор шрифта и цвета текста</li>
                    <li>Темная/светлая тема</li>
                    <li>Полная прозрачность сообщений</li>
                    <li>Отдельные настройки прозрачности профилей и плейсхолдеров</li>
                </ul>
            </div>
        `;

        panel.innerHTML = `
            <div id="br-main-page">${mainPageHTML}</div>
            <div id="br-fonts-page" style="display: none;">${fontsPageHTML}</div>
            <div id="br-transparency-page" style="display: none;">${transparencyPageHTML}</div>
            <div id="br-about-page" style="display: none;">${aboutPageHTML}</div>
        `;

        document.body.appendChild(panel);
        addEventListeners();
    }

    function updateStyles() {
        if (currentSettings.customTitle) {
            const titleElement = document.querySelector('.p-title-value');
            if (titleElement) {
                titleElement.textContent = currentSettings.customTitle;
            }
        }

        const bgColor = currentSettings.useDarkMode ? currentSettings.bgColor : '#f5f5f5';
        const textColor = currentSettings.textColor;
        const borderColor = currentSettings.useDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        const linkColor = currentSettings.useDarkMode ? '#ffffff' : '#0066cc';

        const mainOpacity = currentSettings.transparency;
        const menuOpacity = currentSettings.menuTransparency;
        const postOpacity = currentSettings.messageTransparency;
        const headerOpacity = currentSettings.headerTransparency;
        const messageContentOpacity = currentSettings.messageContentTransparency;
        const memberHeaderOpacity = currentSettings.memberHeaderTransparency;
        const placeholderOpacity = currentSettings.placeholderTransparency;

        const mainBgColor = currentSettings.useDarkMode
            ? `rgba(20, 20, 20, ${mainOpacity})`
            : `rgba(240, 240, 240, ${mainOpacity})`;

        const menuBgColor = currentSettings.useDarkMode
            ? `rgba(10, 10, 10, ${menuOpacity})`
            : `rgba(230, 230, 230, ${menuOpacity})`;

        const postBgColor = currentSettings.useDarkMode
            ? `rgba(30, 30, 30, ${postOpacity})`
            : `rgba(250, 250, 250, ${postOpacity})`;

        const headerBgColor = currentSettings.useDarkMode
            ? `rgba(20, 20, 20, ${headerOpacity})`
            : `rgba(230, 230, 230, ${headerOpacity})`;

        const messageContentBgColor = currentSettings.useDarkMode
            ? `rgba(40, 40, 40, ${messageContentOpacity})`
            : `rgba(255, 255, 255, ${messageContentOpacity})`;

        const styles = `
            body {
                background: ${currentSettings.background || (currentSettings.backgroundUrl ? `url(${currentSettings.backgroundUrl})` : bgColor)} !important;
                background-size: cover !important;
                background-attachment: fixed !important;
                background-repeat: no-repeat !important;
                font-family: ${currentSettings.selectedFont} !important;
                color: ${textColor} !important;
            }

            .p-body-main, .p-body-sidebar,
            .p-footer, .block, .block-container,
            .structItem, .structItem-container,
            .widget-definition, .fr-box,
            .alert, .overlay-container, .tooltip-content,
            .memberHeader, .memberCard {
                background: ${mainBgColor} !important;
                backdrop-filter: blur(${currentSettings.blurRadius}px) !important;
                border-radius: 4px !important;
                margin: 8px 0 !important;
                border: 1px solid ${borderColor} !important;
            }

            .p-body-header, .p-nav {
                background: ${headerBgColor} !important;
                backdrop-filter: blur(${currentSettings.blurRadius}px) !important;
                border-radius: 4px !important;
                margin: 8px 0 !important;
                border: 1px solid ${borderColor} !important;
            }

            .menu, .menu-content, .subNodeMenu,
            .p-sectionLinks, .menu-outer {
                background: ${menuBgColor} !important;
                backdrop-filter: blur(${currentSettings.blurRadius}px) !important;
            }

            .message, .message-cell, .message-user,
            .message-inner, .message-main {
                background: ${postBgColor} !important;
                backdrop-filter: blur(${currentSettings.blurRadius}px) !important;
            }

            .message-content, .message-body, .bbWrapper,
            .bbCodeBlock, .bbCodeQuote, .fr-wrapper,
            .quickReply, .formControls, .buttonGroup,
            .thThreads__message-userExtras, .node-body,
            .node--forum, .p-body-pageContent, .node-stats,
            .node-extra, .message-avatar, .message-userDetails,
            .message-signature, .message-footer {
                background: ${messageContentBgColor} !important;
            }

            .memberHeader-content.memberHeader-content--info {
                opacity: ${memberHeaderOpacity} !important;
            }

            .editorPlaceholder-placeholder {
                opacity: ${placeholderOpacity} !important;
            }

            a {
                color: ${linkColor} !important;
                text-decoration: none !important;
            }

            a:hover {
                text-decoration: underline !important;
            }

            .title, .block-title, .block-minorHeader,
            .block-tabHeader, .node-title {
                color: ${textColor} !important;
            }

            .username {
                animation: none !important;
                text-shadow: none !important;
            }

            .br-page-btn {
                background: transparent;
                border: none;
                color: inherit;
                cursor: pointer;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
            }

            .br-page-btn:hover {
                background: rgba(209, 0, 0, 0.2);
            }

            #br-control-panel {
                background: rgba(10, 10, 10, 0.95) !important;
                border: 1px solid #d10000 !important;
                box-shadow: 0 0 15px rgba(209, 0, 0, 0.5) !important;
                color: #e0e0e0 !important;
            }

            #br-control-panel h3 {
                color: #d10000 !important;
            }

            #br-control-panel input[type="text"],
            #br-control-panel input[type="file"],
            #br-control-panel select {
                background: #1a1a1a !important;
                border: 1px solid #333 !important;
                color: #e0e0e0 !important;
            }

            #br-control-panel input[type="range"] {
                accent-color: #d10000 !important;
            }

            #br-toggle-btn {
                background: #d10000 !important;
                box-shadow: 0 0 10px rgba(209, 0, 0, 0.7) !important;
            }
        `;

        GM_addStyle(styles);

        const bgPreview = document.getElementById('br-bg-preview');
        if (bgPreview) {
            bgPreview.style.background = currentSettings.background || (currentSettings.backgroundUrl ? `url(${currentSettings.backgroundUrl})` : currentSettings.bgColor);
            bgPreview.style.backgroundSize = 'cover';
        }

        const fontPreview = document.getElementById('font-preview');
        if (fontPreview) {
            fontPreview.style.fontFamily = currentSettings.selectedFont;
            fontPreview.style.color = currentSettings.textColor;
        }
    }

    function switchPage(page) {
        currentPage = page;
        document.getElementById('br-main-page').style.display = 'none';
        document.getElementById('br-fonts-page').style.display = 'none';
        document.getElementById('br-transparency-page').style.display = 'none';
        document.getElementById('br-about-page').style.display = 'none';

        document.getElementById(`br-${page}-page`).style.display = 'block';
    }

    function addEventListeners() {
        document.getElementById('br-toggle-btn')?.addEventListener('click', () => {
            const panel = document.getElementById('br-control-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        document.querySelectorAll('.br-page-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                switchPage(e.target.dataset.page);
            });
        });

        document.getElementById('br-custom-title')?.addEventListener('change', (e) => {
            currentSettings.customTitle = e.target.value;
            GM_setValue('customTitle', currentSettings.customTitle);
            updateStyles();
        });

        document.getElementById('br-transparency')?.addEventListener('input', (e) => {
            currentSettings.transparency = e.target.value / 100;
            GM_setValue('transparency', currentSettings.transparency);
            document.getElementById('transparency-value').textContent = `${e.target.value}%`;
            updateStyles();
        });

        document.getElementById('br-header-transparency')?.addEventListener('input', (e) => {
            currentSettings.headerTransparency = e.target.value / 100;
            GM_setValue('headerTransparency', currentSettings.headerTransparency);
            document.getElementById('header-transparency-value').textContent = `${e.target.value}%`;
            updateStyles();
        });

        document.getElementById('br-menu-transparency')?.addEventListener('input', (e) => {
            currentSettings.menuTransparency = e.target.value / 100;
            GM_setValue('menuTransparency', currentSettings.menuTransparency);
            document.getElementById('menu-transparency-value').textContent = `${e.target.value}%`;
            updateStyles();
        });

        document.getElementById('br-message-transparency')?.addEventListener('input', (e) => {
            currentSettings.messageTransparency = e.target.value / 100;
            GM_setValue('messageTransparency', currentSettings.messageTransparency);
            document.getElementById('message-transparency-value').textContent = `${e.target.value}%`;
            updateStyles();
        });

        document.getElementById('br-message-content-transparency')?.addEventListener('input', (e) => {
            currentSettings.messageContentTransparency = e.target.value / 100;
            GM_setValue('messageContentTransparency', currentSettings.messageContentTransparency);
            document.getElementById('message-content-transparency-value').textContent = `${e.target.value}%`;
            updateStyles();
        });

        document.getElementById('br-member-header-transparency')?.addEventListener('input', (e) => {
            currentSettings.memberHeaderTransparency = e.target.value / 100;
            GM_setValue('memberHeaderTransparency', currentSettings.memberHeaderTransparency);
            document.getElementById('member-header-transparency-value').textContent = `${e.target.value}%`;
            updateStyles();
        });

        document.getElementById('br-placeholder-transparency')?.addEventListener('input', (e) => {
            currentSettings.placeholderTransparency = e.target.value / 100;
            GM_setValue('placeholderTransparency', currentSettings.placeholderTransparency);
            document.getElementById('placeholder-transparency-value').textContent = `${e.target.value}%`;
            updateStyles();
        });

        document.getElementById('br-text-color')?.addEventListener('input', (e) => {
            currentSettings.textColor = e.target.value;
            GM_setValue('textColor', currentSettings.textColor);
            updateStyles();
        });

        document.getElementById('br-blur')?.addEventListener('input', (e) => {
            currentSettings.blurRadius = e.target.value;
            GM_setValue('blurRadius', currentSettings.blurRadius);
            document.getElementById('blur-value').textContent = `${e.target.value}px`;
            updateStyles();
        });

        document.getElementById('br-reset-bg')?.addEventListener('click', () => {
            currentSettings.background = '';
            currentSettings.backgroundUrl = '';
            currentSettings.bgColor = defaultSettings.bgColor;
            currentSettings.textColor = defaultSettings.textColor;
            document.getElementById('br-bg-color').value = defaultSettings.bgColor;
            document.getElementById('br-text-color').value = defaultSettings.textColor;
            GM_setValue('background', '');
            GM_setValue('backgroundUrl', '');
            GM_setValue('bgColor', defaultSettings.bgColor);
            GM_setValue('textColor', defaultSettings.textColor);
            updateStyles();
        });

        document.getElementById('br-bg-image')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                currentSettings.background = `url(${e.target.result})`;
                currentSettings.backgroundUrl = '';
                GM_setValue('background', currentSettings.background);
                GM_setValue('backgroundUrl', '');
                updateStyles();
            };
            file && reader.readAsDataURL(file);
        });

        document.getElementById('br-apply-bg-url')?.addEventListener('click', () => {
            const url = document.getElementById('br-bg-url').value;
            if (url) {
                currentSettings.backgroundUrl = url;
                currentSettings.background = '';
                GM_setValue('backgroundUrl', currentSettings.backgroundUrl);
                GM_setValue('background', '');
                updateStyles();
            }
        });

        document.getElementById('br-bg-color')?.addEventListener('input', (e) => {
            currentSettings.bgColor = e.target.value;
            GM_setValue('bgColor', currentSettings.bgColor);
            updateStyles();
        });

        document.getElementById('br-dark-mode')?.addEventListener('change', (e) => {
            currentSettings.useDarkMode = e.target.checked;
            GM_setValue('useDarkMode', currentSettings.useDarkMode);
            updateStyles();
        });

        document.getElementById('br-font-select')?.addEventListener('change', (e) => {
            currentSettings.selectedFont = e.target.value;
            GM_setValue('selectedFont', currentSettings.selectedFont);
            updateStyles();
        });
    }

    function loadFonts() {
        const fontStyles = `
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap');
        `;
        GM_addStyle(fontStyles);
    }

    window.addEventListener('load', () => {
        loadFonts();
        createToggleButton();
        createControlPanel();
        updateStyles();

        new MutationObserver(updateStyles)
            .observe(document.body, {subtree: true, childList: true});
    });
})();