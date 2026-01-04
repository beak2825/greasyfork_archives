// ==UserScript==
// @name         Switch Sites V1
// @namespace    http://tampermonkey.net/
// @version      R1
// @description  Быстрый доступ к сайтам через панель сверху
// @author       Jaroslav_Grasso || Ярослав Колмогорцев
// @match        *://*/*
// @grant        none
// @icon         https://forum.blackrussia.online/data/avatars/o/3353/3353722.jpg?1743009661
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536263/Switch%20Sites%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/536263/Switch%20Sites%20V1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация кнопок (название: URL)
    const sites = {
        'Forum BR': 'https://forum.blackrussia.online/',
        'Правила BR': 'https://forum.blackrussia.online/categories/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.50/',
        'Таблицы': 'https://docs.google.com/',
        'ВК': 'https://vk.com/'
    };

    // Создаем панель
    const toolbar = document.createElement('div');
    toolbar.id = 'quick-access-toolbar';

    // Стили для панели
    const css = `
        #quick-access-toolbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #212428;
            padding: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            z-index: 9999;
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        .quick-access-btn {
            padding: 8px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .quick-access-btn:hover {
            background: #45a049;
        }
    `;

    // Добавляем стили
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Создаем кнопки
    for (const [name, url] of Object.entries(sites)) {
        const btn = document.createElement('button');
        btn.className = 'quick-access-btn';
        btn.textContent = name;
        btn.title = url;
        btn.onclick = () => window.location.href = url;
        toolbar.appendChild(btn);
    }

    // Добавляем панель в начало документа
    document.body.prepend(toolbar);

    // Сдвигаем контент страницы вниз чтобы не перекрывался
    document.body.style.marginTop = `${toolbar.offsetHeight}px`;
})();