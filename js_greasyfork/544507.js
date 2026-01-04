// ==UserScript==
// @name         XenForo Style Switcher
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Позволяет применять кастомные стили XenForo
// @author       You
// @match        https://forum.majestic-rp.ru/*
// @include      https://forum.majestic-rp.ru/
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/544507/XenForo%20Style%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/544507/XenForo%20Style%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Сохраненные стили из XenForo
    let customCSS = GM_getValue('xenforo_css', '');
    let isEnabled = GM_getValue('style_enabled', false);

    // Применение стилей
    function applyStyles(css) {
        const styleId = 'XenForoCustomStyle';
        let styleElement = document.getElementById(styleId);

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        styleElement.textContent = css;
    }

    // Переключение стилей
    function toggleStyles(enable) {
        isEnabled = enable;
        GM_setValue('style_enabled', enable);
        
        if (enable && customCSS) {
            applyStyles(customCSS);
        } else {
            const styleElement = document.getElementById('XenForoCustomStyle');
            if (styleElement) styleElement.remove();
        }
    }

    // Загрузка стилей из файла
    function loadStylesFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.css,text/css';

        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = event => {
                customCSS = event.target.result;
                GM_setValue('xenforo_css', customCSS);
                if (isEnabled) applyStyles(customCSS);
                showMessage('Стиль успешно загружен!');
            };

            reader.readAsText(file);
        };

        input.click();
    }

    // Загрузка стилей по URL
    function loadStylesFromURL() {
        const url = prompt('Введите URL CSS файла:', 'https://example.com/path/to/style.css');
        if (!url) return;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    customCSS = response.responseText;
                    GM_setValue('xenforo_css', customCSS);
                    if (isEnabled) applyStyles(customCSS);
                    showMessage('Стиль успешно загружен!');
                } else {
                    showMessage('Ошибка загрузки: ' + response.status);
                }
            },
            onerror: function(error) {
                showMessage('Ошибка: ' + error);
            }
        });
    }

    // Показать сообщение
    function showMessage(text) {
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.position = 'fixed';
        msg.style.bottom = '60px';
        msg.style.right = '20px';
        msg.style.background = '#4CAF50';
        msg.style.color = 'white';
        msg.style.padding = '10px';
        msg.style.borderRadius = '4px';
        msg.style.zIndex = '99999';
        document.body.appendChild(msg);

        setTimeout(() => msg.remove(), 3000);
    }

    // Создание панели управления
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'xenforoStylePanel';
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.right = '20px';
        panel.style.zIndex = '9999';
        panel.style.padding = '10px';
        panel.style.background = '#2c3e50';
        panel.style.borderRadius = '5px';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        panel.style.color = 'white';
        panel.style.fontFamily = 'Arial, sans-serif';

        panel.innerHTML = `
            <h3 style="margin:0 0 10px 0;color:#4ca1af">XenForo Style Switcher</h3>
            <div style="margin-bottom:10px;">
                <button id="toggleBtn" style="${isEnabled ? 'background:#4CAF50' : 'background:#f44336'};color:white;border:none;padding:5px 10px;border-radius:3px;margin-right:5px;cursor:pointer;">
                    ${isEnabled ? 'ON' : 'OFF'}
                </button>
                <span>Стиль: ${customCSS ? 'Загружен' : 'Не загружен'}</span>
            </div>
            <div>
                <button id="loadFileBtn" style="background:#2196F3;color:white;border:none;padding:5px 10px;border-radius:3px;margin-right:5px;cursor:pointer;margin-bottom:5px;">
                    Загрузить из файла
                </button>
                <button id="loadURLBtn" style="background:#2196F3;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;margin-bottom:5px;">
                    Загрузить по URL
                </button>
            </div>
            <div>
                <button id="exportBtn" style="background:#9C27B0;color:white;border:none;padding:5px 10px;border-radius:3px;margin-right:5px;cursor:pointer;">
                    Экспорт
                </button>
                <button id="resetBtn" style="background:#607D8B;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">
                    Сброс
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        // Обработчики событий
        document.getElementById('toggleBtn').addEventListener('click', function() {
            toggleStyles(!isEnabled);
            this.textContent = isEnabled ? 'ON' : 'OFF';
            this.style.background = isEnabled ? '#4CAF50' : '#f44336';
        });

        document.getElementById('loadFileBtn').addEventListener('click', loadStylesFromFile);
        document.getElementById('loadURLBtn').addEventListener('click', loadStylesFromURL);

        document.getElementById('exportBtn').addEventListener('click', function() {
            if (customCSS) {
                GM_setClipboard(customCSS);
                showMessage('CSS скопирован в буфер!');
            } else {
                showMessage('Нет стилей для экспорта');
            }
        });

        document.getElementById('resetBtn').addEventListener('click', function() {
            if (confirm('Сбросить все настройки?')) {
                customCSS = '';
                GM_setValue('xenforo_css', '');
                GM_setValue('style_enabled', false);
                toggleStyles(false);
                showMessage('Настройки сброшены');
                document.getElementById('toggleBtn').textContent = 'OFF';
                document.getElementById('toggleBtn').style.background = '#f44336';
            }
        });
    }

    // Инициализация
    if (isEnabled && customCSS) {
        applyStyles(customCSS);
    }
    createControlPanel();

    // Команды меню Tampermonkey
    GM_registerMenuCommand('Включить/выключить стиль', function() {
        toggleStyles(!isEnabled);
    });

    GM_registerMenuCommand('Загрузить стиль из файла', loadStylesFromFile);

    GM_registerMenuCommand('Загрузить стиль по URL', loadStylesFromURL);
})();