// ==UserScript==
// @name         SteamDB Floating Search Buttons
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Добавляет плавающие кнопки для поиска игры на online-fix.me, rustorka.com, rutracker.org.
// @author       GodinRaider
// @license      MIT
// @match        https://steamdb.info/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510275/SteamDB%20Floating%20Search%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/510275/SteamDB%20Floating%20Search%20Buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Функция для создания кнопки
    function createButton(label, url, tooltip) {
        let button = document.createElement('a');
        button.href = url;
        button.target = '_blank'; // Открывать в новой вкладке
        button.textContent = label;
        button.title = tooltip;
        button.style.cssText = `
            display: inline-block;
            background-color: #4C6EF5;
            color: white;
            text-align: center;
            text-decoration: none;
            font-size: 14px;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        `;
        button.onmouseover = () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
        };
        button.onmouseout = () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        };
        return button;
    }

    // Получаем название игры из элемента <h1 itemprop="name">
    let gameNameElement = document.querySelector('h1[itemprop="name"]');
    if (!gameNameElement) return; // Если элемент не найден, прекращаем выполнение
    let gameName = encodeURIComponent(gameNameElement.textContent.trim());

    // Проверяем наличие тега NSFW
    let tagsContainer = document.querySelector('.store-tags');
    let isNSFW = tagsContainer && tagsContainer.textContent.includes('NSFW');

    // Создаем кнопки
    let buttons = [
        createButton('Online-Fix', `https://online-fix.me/?do=search&subaction=search&story=${gameName}`, 'Поиск на online-fix.me'),
        createButton('Rustorka', `http://rustorka.com/forum/tracker.php?nm=${gameName}&o=10&s=2`, 'Поиск на rustorka.com'),
        createButton('RuTracker', `https://rutracker.org/forum/tracker.php?nm=${gameName}&o=10&s=2`, 'Поиск на rutracker.org')
    ];

    // Если игра NSFW, добавляем кнопку для Pornolab
    if (isNSFW) {
        buttons.push(createButton('Pornolab', `https://pornolab.net/forum/tracker.php?nm=${gameName}`, 'Поиск на pornolab.net'));
    }

    // Создаем контейнер для кнопок
    let container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 100px;
        left: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 1000;
    `;

    // Добавляем кнопки в контейнер
    buttons.forEach(button => container.appendChild(button));

    // Добавляем контейнер на страницу
    document.body.appendChild(container);
})();
