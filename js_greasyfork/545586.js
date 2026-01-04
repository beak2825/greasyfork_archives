// ==UserScript==
// @name         replacing the forum background
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Добавляет панель для смены фона на форуме BlackRussia.online с возможностью сворачивания
// @author       Masik Doxbinov
// @match        https://forum.blackrussia.online/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/545586/replacing%20the%20forum%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/545586/replacing%20the%20forum%20background.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Добавляем основные стили
    GM_addStyle(`
        #customBgPanel {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: rgba(0, 0, 0, 0.8);
            border-radius: 5px;
            color: white;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
            transition: all 0.3s ease;
            overflow: hidden;
        }

        #customBgPanel.collapsed {
            height: 30px;
            width: 120px;
        }

        #customBgPanel.expanded {
            height: auto;
            width: 300px;
            padding: 10px;
        }

        #customBgHeader {
            padding: 5px 10px;
            cursor: pointer;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #customBgContent {
            padding: 10px 0;
        }

        #bgInput {
            width: 100%;
            padding: 5px;
            border-radius: 3px;
            border: none;
            margin-bottom: 10px;
        }

        #bgApply, #bgReset {
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 5px;
        }

        #bgApply {
            background: #4CAF50;
            color: white;
        }

        #bgReset {
            background: #f44336;
            color: white;
        }

        .toggle-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 16px;
        }
    `);

    // Функция применения фона
    function applyBackground(url) {
        // Удаляем старый стиль, если есть
        const oldStyle = document.getElementById('customBgStyle');
        if (oldStyle) oldStyle.remove();

        // Создаем новый стиль
        const style = document.createElement('style');
        style.id = 'customBgStyle';
        style.textContent = `
            body {
                background: url(${url}) center/cover fixed no-repeat !important;
                background-attachment: fixed !important;
            }
            .p-body-main {
                background-color: rgba(0, 0, 0, 0.7) !important;
                backdrop-filter: blur(5px);
            }
            .p-nav {
                background-color: rgba(0, 0, 0, 0.7) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Загрузка сохраненного фона
    const savedBackground = GM_getValue('customBackground', '');
    if (savedBackground) applyBackground(savedBackground);

    // Создание панели
    const panel = document.createElement('div');
    panel.id = 'customBgPanel';
    panel.className = 'collapsed';

    panel.innerHTML = `
        <div id="customBgHeader">
            <span>Фон форума</span>
            <button class="toggle-btn">▼</button>
        </div>
        <div id="customBgContent" style="display: none;">
            <input type="text" id="bgInput" placeholder="Вставьте URL изображения" value="${savedBackground || ''}">
            <div>
                <button id="bgApply">Применить</button>
                <button id="bgReset">Сбросить</button>
            </div>
        </div>
    `;

    document.body.appendChild(panel);

    // Обработчики событий
    const header = panel.querySelector('#customBgHeader');
    const content = panel.querySelector('#customBgContent');
    const toggleBtn = panel.querySelector('.toggle-btn');

    // Переключение панели
    header.addEventListener('click', function() {
        if (panel.classList.contains('collapsed')) {
            panel.classList.remove('collapsed');
            panel.classList.add('expanded');
            content.style.display = 'block';
            toggleBtn.textContent = '▲';
        } else {
            panel.classList.remove('expanded');
            panel.classList.add('collapsed');
            content.style.display = 'none';
            toggleBtn.textContent = '▼';
        }
    });

    // Применить фон
    document.getElementById('bgApply').addEventListener('click', function() {
        const bgUrl = document.getElementById('bgInput').value.trim();
        if (bgUrl) {
            // Проверяем, является ли URL действительным
            const img = new Image();
            img.onload = function() {
                GM_setValue('customBackground', bgUrl);
                applyBackground(bgUrl);
                panel.classList.remove('expanded');
                panel.classList.add('collapsed');
                content.style.display = 'none';
                toggleBtn.textContent = '▼';
            };
            img.onerror = function() {
                alert('Не удалось загрузить изображение. Проверьте URL.');
            };
            img.src = bgUrl;
        } else {
            alert('Пожалуйста, введите URL изображения');
        }
    });

    // Сбросить фон
    document.getElementById('bgReset').addEventListener('click', function() {
        GM_setValue('customBackground', '');
        const oldStyle = document.getElementById('customBgStyle');
        if (oldStyle) oldStyle.remove();
        document.getElementById('bgInput').value = '';
        panel.classList.remove('expanded');
        panel.classList.add('collapsed');
        content.style.display = 'none';
        toggleBtn.textContent = '▼';
    });

    // Обработчик для динамического контента (если форум использует AJAX)
    const observer = new MutationObserver(function(mutations) {
        const savedBg = GM_getValue('customBackground', '');
        if (savedBg) applyBackground(savedBg);
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();