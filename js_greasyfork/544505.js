// ==UserScript==
// @name         Custom Forum Styler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Персонализация внешнего вида форума
// @author       You
// @match        https://forum.majestic-rp.ru*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/544505/Custom%20Forum%20Styler.user.js
// @updateURL https://update.greasyfork.org/scripts/544505/Custom%20Forum%20Styler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Основные стили
    const defaultCSS = `
        body {
            background-color: #1e1e1e !important;
            color: #e0e0e0 !important;
            font-family: 'Segoe UI', Roboto, sans-serif !important;
        }
        .header, #header {
            background: linear-gradient(135deg, #2c3e50, #4ca1af) !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5) !important;
            border-bottom: none !important;
        }
        .navbar, .nav {
            background-color: #252525 !important;
            border-radius: 4px !important;
        }
        .post, .message {
            background-color: #2d2d2d !important;
            border: 1px solid #444 !important;
            border-radius: 5px !important;
            margin-bottom: 15px !important;
            padding: 15px !important;
        }
        .button, .btn, input[type="submit"] {
            background: linear-gradient(to bottom, #4CAF50, #45a049) !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            padding: 8px 16px !important;
            transition: all 0.3s !important;
        }
        a {
            color: #4ca1af !important;
            text-decoration: none !important;
        }
        a:hover {
            color: #2c3e50 !important;
            text-decoration: underline !important;
        }
    `;

    // Применение стилей
    function applyStyles(css) {
        const styleId = 'CustomForumStyle';
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
        if (enable) {
            applyStyles(defaultCSS);
        } else {
            const styleElement = document.getElementById('CustomForumStyle');
            if (styleElement) styleElement.remove();
        }
        GM_setValue('stylesEnabled', enable);
    }

    // Создание панели управления
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'styleControlPanel';
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
            <h3 style="margin:0 0 10px 0;color:#4ca1af">Custom Styler</h3>
            <label style="display:block;margin-bottom:8px;cursor:pointer;">
                <input type="checkbox" id="styleToggle" ${GM_getValue('stylesEnabled', true) ? 'checked' : ''}>
                Включить стили
            </label>
            <button id="colorPickerBtn" style="background:#4CAF50;color:white;border:none;padding:5px 10px;border-radius:3px;margin-right:5px;cursor:pointer;">
                Выбрать цвет
            </button>
            <button id="resetBtn" style="background:#f44336;color:white;border:none;padding:5px 10px;border-radius:3px;cursor:pointer;">
                Сброс
            </button>
        `;

        document.body.appendChild(panel);

        // Обработчики событий
        document.getElementById('styleToggle').addEventListener('change', function(e) {
            toggleStyles(e.target.checked);
        });

        document.getElementById('colorPickerBtn').addEventListener('click', function() {
            const color = prompt('Введите основной цвет (например, #2c3e50):', '#2c3e50');
            if (color) updateMainColor(color);
        });

        document.getElementById('resetBtn').addEventListener('click', function() {
            toggleStyles(true);
            applyStyles(defaultCSS);
        });
    }

    // Обновление основного цвета
    function updateMainColor(color) {
        const newCSS = defaultCSS.replace(/#2c3e50/g, color)
                                .replace(/#4ca1af/g, lightenColor(color, 20));
        applyStyles(newCSS);
    }

    // Осветление цвета
    function lightenColor(color, percent) {
        const num = parseInt(color.replace('#',''), 16),
              amt = Math.round(2.55 * percent),
              R = (num >> 16) + amt,
              G = (num >> 8 & 0x00FF) + amt,
              B = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    }

    // Инициализация
    toggleStyles(GM_getValue('stylesEnabled', true));
    createControlPanel();

    // Добавляем команду в меню Tampermonkey
    GM_registerMenuCommand('Toggle Forum Styles', function() {
        const currentState = GM_getValue('stylesEnabled', true);
        toggleStyles(!currentState);
    });
})();