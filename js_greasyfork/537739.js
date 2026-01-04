// ==UserScript==
// @name         Sharewood Dark Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Полноценная темная тема для Sharewood
// @author       Ahqa
// @match        https://s1.sharewood.co/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537739/Sharewood%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/537739/Sharewood%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Добавляем стили с более высоким приоритетом
    GM_addStyle(`
        /* Основные цвета */
        html, body, body * {
            background-color: #121212 !important;
            color: #e0e0e0 !important;
        }

        /* Шапка и навигация */
        .navbar, .navbar *, .header, .header *,
        .top-bar, .top-bar *, .menu, .menu * {
            background-color: #1e1e1e !important;
            border-color: #333 !important;
        }

        /* Карточки и контейнеры */
        .card, .panel, .container, .box,
        .content, .main-content, .wrapper,
        .modal, .modal *, .popup, .popup * {
            background-color: #1e1e1e !important;
            border-color: #333 !important;
        }

        /* Текст и ссылки */
        a, a *, .link, .link *,
        p, span, div, h1, h2, h3, h4, h5, h6 {
            color: #bb86fc !important;
        }

        a:hover, a:hover *, .link:hover, .link:hover * {
            color: #3700b3 !important;
        }

        /* Формы */
        input, textarea, select,
        .form-control, .input, .search-box {
            background-color: #333 !important;
            color: #fff !important;
            border-color: #555 !important;
        }

        /* Кнопки */
        button, .btn, .button,
        .submit, .action-btn {
            background-color: #333 !important;
            color: #fff !important;
            border-color: #555 !important;
        }

        button:hover, .btn:hover {
            background-color: #444 !important;
        }

        /* Таблицы */
        table, .table, tr, th, td {
            background-color: #1e1e1e !important;
            border-color: #333 !important;
        }

        /* Особые элементы Sharewood */
        .file-item, .folder-item,
        .item-list, .browse-item {
            background-color: #1e1e1e !important;
            border-color: #333 !important;
        }

        .progress-bar, .status-bar {
            background-color: #333 !important;
        }

        /* Переопределение inline-стилей */
        [style*="background-color"]:not(.no-dark-theme),
        [style*="background"]:not(.no-dark-theme) {
            background-color: #1e1e1e !important;
        }

        [style*="color"]:not(.no-dark-theme) {
            color: #e0e0e0 !important;
        }
    `);

    // Кнопка переключения темы
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '🌓';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #333;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;

    // Сохранение состояния темы
    const themeState = localStorage.getItem('sharewoodDarkTheme');
    if (themeState === 'disabled') {
        document.head.lastChild.disabled = true;
    }

    toggleBtn.onclick = function() {
        const style = document.head.lastChild;
        style.disabled = !style.disabled;
        localStorage.setItem('sharewoodDarkTheme', style.disabled ? 'disabled' : 'enabled');
    };

    document.body.appendChild(toggleBtn);
})();