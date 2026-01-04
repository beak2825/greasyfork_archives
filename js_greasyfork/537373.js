// ==UserScript==
// @name         Скрипт для бродяг 78 (Premium)
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Улучшенная панель для форума Black Russia с новыми функциями
// @author       Артемка
// @license      MIT
// @match        https://forum.blackrussia.online/*
// @grant        GM_addStyle
// @icon         https://forum.blackrussia.online/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/537373/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B1%D1%80%D0%BE%D0%B4%D1%8F%D0%B3%2078%20%28Premium%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537373/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%B1%D1%80%D0%BE%D0%B4%D1%8F%D0%B3%2078%20%28Premium%29.meta.js
// ==/UserScript==
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация
    const LINKS = [
        { url: '/threads/vladimir-Система-повышения-администрации-и-Ежедневная-норма-Действует-с-31-03-2025.9639029/', text: 'Норматив', icon: '⚙️' },
        { url: '/threads/vladimir-Ежедневная-отчётность-об-игровом-нормативе.9664927/', text: 'Отчеты', icon: '📊' },
        { url: '/threads/vladimir-Заявление-на-неактив.9664775/', text: 'Неактив', icon: '⏸️' },
        { url: '/forums/Жалобы-на-игроков.3484/', text: 'Жалобы', icon: '⚠️' },
        { url: '/forums/Жалобы-на-администрацию.3482/', text: 'ЖБ НА АДМ', icon: '❗' },
        { url: '/forums/Сервер-№78-vladimir.3465/', text: 'Владимир', icon: '🔹' },
        { url: '/forums/Админ-раздел.3466/', text: 'Админ', icon: '🔒' },
        { url: '/threads/vladimir-Заявление-на-получение-дополнительных-репортов.9932781/', text: 'Репорты', icon: '📌' },
        { url: '/threads/vladimir-Снятие-предупреждений-выговоров.9932735/', text: 'Снятие', icon: '📝' }
    ];

    // Стили в духе Black Russia
    GM_addStyle(`
        .br-panel {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9999;
            font-family: 'Montserrat', sans-serif;
            background: rgba(10, 10, 10, 0.95);
            border-radius: 5px;
            border: 2px solid #ff0000;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
            overflow: hidden;
            transition: all 0.3s ease;
            max-width: 300px;
            width: 100%;
        }

        .br-header {
            background: linear-gradient(to right, #000000, #1a0000);
            padding: 12px 15px;
            color: #fff;
            font-weight: 700;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #ff0000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }

        .br-title {
            color: #ff0000;
            text-shadow: 0 0 5px rgba(255, 0, 0, 0.7);
        }

        .br-toggle {
            color: #ff0000;
            font-size: 18px;
            transition: transform 0.3s;
        }

        .br-panel.collapsed .br-toggle {
            transform: rotate(180deg);
        }

        .br-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            padding: 12px;
            background: rgba(0, 0, 0, 0.7);
        }

        .br-panel.collapsed .br-buttons {
            display: none;
        }

        .br-btn {
            padding: 10px 12px;
            background: rgba(20, 20, 20, 0.9);
            color: #fff;
            border: 1px solid #333;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
            position: relative;
            overflow: hidden;
        }

        .br-btn:hover {
            background: rgba(255, 0, 0, 0.2);
            border-color: #ff0000;
            transform: translateY(-2px);
        }

        .br-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.1), transparent);
            transition: 0.5s;
        }

        .br-btn:hover::before {
            left: 100%;
        }

        @media (max-width: 768px) {
            .br-panel {
                bottom: 10px;
                left: 10px;
                max-width: calc(100% - 20px);
            }
            
            .br-buttons {
                grid-template-columns: 1fr;
            }
        }
    `);

    // Создание элементов
    const panel = document.createElement('div');
    panel.className = 'br-panel';
    
    const header = document.createElement('div');
    header.className = 'br-header';
    
    const title = document.createElement('div');
    title.className = 'br-title';
    title.textContent = 'Black Russia | VLADIMIR';
    
    const toggle = document.createElement('div');
    toggle.className = 'br-toggle';
    toggle.innerHTML = '▼';
    
    const buttons = document.createElement('div');
    buttons.className = 'br-buttons';
    
    // Добавление кнопок
    LINKS.forEach(link => {
        const btn = document.createElement('a');
        btn.className = 'br-btn';
        btn.href = link.url;
        btn.innerHTML = `${link.icon} ${link.text}`;
        buttons.appendChild(btn);
    });
    
    // Сборка структуры
    header.appendChild(title);
    header.appendChild(toggle);
    panel.appendChild(header);
    panel.appendChild(buttons);
    document.body.appendChild(panel);
    
    // Обработчики событий
    header.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
        localStorage.setItem('br-panel-collapsed', panel.classList.contains('collapsed'));
    });
    
    // Восстановление состояния
    if (localStorage.getItem('br-panel-collapsed') === 'true') {
        panel.classList.add('collapsed');
    }
})();