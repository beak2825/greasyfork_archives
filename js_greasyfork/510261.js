// ==UserScript==
// @name         Twitch to Steam Button
// @name:en      Twitch to Steam Button
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Добавляет плавающий значок Steam на страницу трансляции Twitch, ведущий на поиск игры в Steam, в которую играет стример на основе выбранной категории.
// @description:en Adds a floating Steam icon to the Twitch stream page, linking to the game's page on Steam. Updates if the stream category changes. 
// @author       GodinRaider
// @match        https://www.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510261/Twitch%20to%20Steam%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/510261/Twitch%20to%20Steam%20Button.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const STEAM_BUTTON_ID = 'steam-button';
 
    /**
     * Проверяет, находимся ли мы на странице стрима.
     * @returns {boolean} true, если это страница стрима.
     */
    function isStreamPage() {
        return window.location.pathname.match(/^\/[a-zA-Z0-9_]+$/) && document.querySelector('a[href^="/directory/category/"]');
    }
 
    /**
     * Получает название категории стрима **по правильной ссылке**.
     * @returns {string|null} Название игры или null, если не найдено.
     */
    function getGameCategory() {
        const gameCategoryLink = document.querySelector('a[href^="/directory/category/"]');
        return gameCategoryLink ? gameCategoryLink.textContent.trim() : null;
    }
 
    /**
     * Создаёт или обновляет кнопку Steam.
     * @param {string} gameName Название игры
     */
    function addOrUpdateSteamButton(gameName) {
        let button = document.querySelector(`#${STEAM_BUTTON_ID}`);
 
        // Если кнопка уже есть — обновляем ссылку
        if (button) {
            button.href = `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`;
            return;
        }
 
        // Создаём кнопку
        button = document.createElement('a');
        button.id = STEAM_BUTTON_ID;
        button.href = `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`;
        button.target = '_blank';
        button.title = 'Поиск в Steam';
 
        // Стили кнопки
        Object.assign(button.style, {
            position: 'fixed',
            left: '10px',
            top: '10px',
            width: '40px',
            height: '40px',
            backgroundColor: '#1b2838',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1000',
            cursor: 'pointer',
            transition: 'border 0.3s ease, transform 0.3s ease',
        });
 
        // Анимация при наведении
        button.addEventListener('mouseenter', () => {
            button.style.border = '2px solid #66c0f4';
            button.style.transform = 'scale(1.1)';
        });
 
        button.addEventListener('mouseleave', () => {
            button.style.border = 'none';
            button.style.transform = 'scale(1)';
        });
 
        // Создаём иконку Steam
        const img = document.createElement('img');
        img.src = 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg';
        img.alt = 'Steam';
        Object.assign(img.style, {
            width: '24px',
            height: '24px',
        });
 
        // Добавляем иконку в кнопку
        button.appendChild(img);
        document.body.appendChild(button);
    }
 
    /**
     * Обновляет кнопку Steam, если название игры изменилось.
     */
    function updateSteamButton() {
        if (!isStreamPage()) {
            const existingButton = document.querySelector(`#${STEAM_BUTTON_ID}`);
            if (existingButton) existingButton.remove();
            return;
        }
 
        const gameName = getGameCategory();
        if (gameName) addOrUpdateSteamButton(gameName);
    }
 
    /**
     * Инициализация скрипта.
     */
    function init() {
        updateSteamButton(); // Запускаем при загрузке
 
        // Отслеживаем изменения DOM
        const observer = new MutationObserver(() => {
            updateSteamButton();
        });
 
        observer.observe(document.body, { childList: true, subtree: true });
    }
 
    // Запуск скрипта
    init();
})();
