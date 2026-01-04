// ==UserScript==
// @name         Оформление форума | VLADIMIR
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Владимирский централ
// @author       Pavel_Bewerly
// @match        https://forum.blackrussia.online/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532421/%D0%9E%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20VLADIMIR.user.js
// @updateURL https://update.greasyfork.org/scripts/532421/%D0%9E%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20VLADIMIR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultSettings = {
        background: '',
        transparency: 0.85,
        useDarkMode: false
    };

    const currentSettings = {
        background: GM_getValue('background', defaultSettings.background),
        transparency: GM_getValue('transparency', defaultSettings.transparency),
        useDarkMode: GM_getValue('useDarkMode', defaultSettings.useDarkMode)
    };

    function createToggleButton() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'br-toggle-btn';
        toggleBtn.title = 'Настройки оформления';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            background: #2196F3;
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        toggleBtn.innerHTML = '⚙️';

        toggleBtn.addEventListener('click', () => {
            const panel = document.getElementById('br-control-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        document.body.appendChild(toggleBtn);
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'br-control-panel';
        panel.style.cssText = `
            display: none;
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(50,50,50,0.95);
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 99998;
            font-family: Arial, sans-serif;
            min-width: 300px;
        `;

        panel.innerHTML = `
            <h3 style="margin:0 0 15px 0; color: #fff;">Настройки оформления</h3>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #888;">Фон:</label>
                <input type="color" id="br-bg-color" style="vertical-align: middle;">
                <input type="file" id="br-bg-image" accept="image/*" style="margin-left: 10px;">
                <button id="br-reset-bg" style="margin-left: 5px;">Сброс</button>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #888;">
                    Прозрачность: <span id="transparency-value">${currentSettings.transparency}</span>
                </label>
                <input type="range" id="br-transparency" min="0.1" max="1" step="0.05"
                       value="${currentSettings.transparency}" style="width: 100%;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; color: #888;">
                    Размытие: <span id="blur-value">${currentSettings.blurRadius}px</span>
                </label>
                <input type="range" id="br-blur" min="0" max="15" step="1"
                       value="${currentSettings.blurRadius}" style="width: 100%;">
            </div>
            <div>
                <label style="display: block; margin-bottom: 5px; color: #888;">
                    <input type="checkbox" id="br-dark-mode" ${currentSettings.useDarkMode ? 'checked' : ''}>
                    Темный режим
                </label>
            </div>
        `;

        document.body.appendChild(panel);
        addEventListeners();
    }

    function updateStyles() {
        const bgColor = currentSettings.useDarkMode
            ? `rgba(0, 0, 0, ${currentSettings.transparency})`
            : `rgba(255, 255, 255, ${currentSettings.transparency})`;

        const styles = `
            body {
                background: ${currentSettings.background} !important;
                background-size: cover !important;
                background-attachment: fixed !important;
                background-repeat: no-repeat !important;
            }

            /* Основные контейнеры XenForo */
            .p-body-main, .p-body-header, .p-body-sidebar,
            .p-nav, .p-footer, .block, .block-container,
            .structItem, .structItem-container, .menu,
            .menu-content, .message-cell, .message-user,
            .message-content, .bbWrapper, .fr-wrapper,
            .quickReply, .formControls, .buttonGroup,
            .thThreads__message-userExtras, .node-body,
            .node--forum, .p-body-pageContent, .node-stats,
            .node-extra, .message-avatar, .message-userDetails,
            .message-signature, .message-footer, .subNodeMenu,
            .p-sectionLinks, .widget-definition, .fr-box,
            .alert, .overlay-container, .tooltip-content,
            .menu-outer, .memberHeader, .memberCard,
            .tabs-tab, .button, .input, .select,
            .cookieNotice, .offCanvasMenu {
                background: ${bgColor} !important;
                backdrop-filter: blur(${currentSettings.blurRadius}px) !important;
                border-radius: 8px !important;
                margin: 8px 0 !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1) !important;
            }

            /* Особые элементы */
            .message-userTitle, .userBanner,
            .pairs.pairs--justified, .fr-toolbar {
                background: ${bgColor.replace(')', ', 0.8)')} !important;
            }

            .message-avatar img {
                box-shadow: 0 0 8px rgba(0,0,0,0.2) !important;
            }

            .node-title, .message-inner {
                background: transparent !important;
                padding-left: 15px !important;
            }

            #br-control-panel {
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0,0,0,0.1);
            }

            /* Анимации */
            .structItem-container {
                transition: all 0.3s ease;
            }

            .button:not(.is-disabled):hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
            }
        `;

        GM_addStyle(styles);
    }

    function addEventListeners() {
        // Обработчики событий для элементов управления
        const elements = {
            '#br-bg-color': (e) => {
                currentSettings.background = e.target.value;
                GM_setValue('background', currentSettings.background);
                updateStyles();
            },
            '#br-transparency': (e) => {
                currentSettings.transparency = e.target.value;
                GM_setValue('transparency', currentSettings.transparency);
                document.getElementById('transparency-value').textContent = e.target.value;
                updateStyles();
            },
            '#br-blur': (e) => {
                currentSettings.blurRadius = e.target.value;
                GM_setValue('blurRadius', currentSettings.blurRadius);
                document.getElementById('blur-value').textContent = `${e.target.value}px`;
                updateStyles();
            },
            '#br-reset-bg': () => {
                currentSettings.background = '';
                GM_setValue('background', '');
                updateStyles();
            },
            '#br-bg-image': function(e) {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    currentSettings.background = `url(${e.target.result})`;
                    GM_setValue('background', currentSettings.background);
                    updateStyles();
                };
                file && reader.readAsDataURL(file);
            },
            '#br-dark-mode': (e) => {
                currentSettings.useDarkMode = e.target.checked;
                GM_setValue('useDarkMode', currentSettings.useDarkMode);
                updateStyles();
            },
            '#br-toggle-btn': () => {
                const panel = document.getElementById('br-control-panel');
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        };

        Object.entries(elements).forEach(([selector, handler]) => {
            document.querySelector(selector).addEventListener(
                selector === '#br-bg-image' ? 'change' : 'input',
                handler
            );
        });
    }

    window.addEventListener('load', () => {
        createToggleButton();
        createControlPanel();
        updateStyles();

        new MutationObserver(updateStyles)
            .observe(document.body, {subtree: true, childList: true});
    });
})();