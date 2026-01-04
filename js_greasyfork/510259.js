// ==UserScript==
// @name         Steam to SteamDB Redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Автоматическое перенаправление с недоступных страниц Steam на SteamDB и изменение поведения ссылок для открытия в новой вкладке при нажатии Ctrl+клик.
// @author       GodinRaider
// @match        https://store.steampowered.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510259/Steam%20to%20SteamDB%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/510259/Steam%20to%20SteamDB%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для проверки доступности страницы
    function isPageUnavailable() {
        return document.title.includes("Ошибка веб-страницы") || document.body.innerText.includes("Данный товар недоступен в вашем регионе");
    }

    // Функция для перенаправления на SteamDB
    function redirectToSteamDB() {
        let appIdMatch = window.location.href.match(/app\/(\d+)/);
        if (appIdMatch) {
            let appId = appIdMatch[1];
            window.location.href = `https://steamdb.info/app/${appId}/`;
        }
    }

    // Проверяем доступность страницы и перенаправляем при необходимости
    if (isPageUnavailable()) {
        redirectToSteamDB();
    }

    // Обработчик кликов для открытия ссылок в новой вкладке при нажатии Ctrl+клик
    document.addEventListener('click', function(e) {
        if (e.ctrlKey) {
            let target = e.target;
            while (target && target.tagName !== 'A') {
                target = target.parentElement;
            }
            if (target && target.tagName === 'A') {
                window.open(target.href, '_blank');
                e.preventDefault();
            }
        }
    });

    // Обработчик для всех ссылок на странице
    document.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (e.ctrlKey) {
                window.open(link.href, '_blank');
                e.preventDefault();
            }
        });
    });

})();
