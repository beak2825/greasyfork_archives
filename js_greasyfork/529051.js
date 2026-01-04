// ==UserScript==
// @name        byrutgame.org
// @namespace   Violentmonkey Scripts
// @match       https://byrutgame.org/*
// @grant       none
// @version     1.2
// @run-at      document-end
// @description 07.03.2025, 07:06:03
// @downloadURL https://update.greasyfork.org/scripts/529051/byrutgameorg.user.js
// @updateURL https://update.greasyfork.org/scripts/529051/byrutgameorg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyPage() {
        // Добавляем спойлер для элемента с описанием игры
        var gameDesc = document.querySelector('.game_desc');
        if (gameDesc) {
            var details = document.createElement('details');
            var summary = document.createElement('summary');
            summary.textContent = 'Показать описание';
            details.appendChild(summary);
            // Вставляем <details> перед gameDesc и перемещаем его внутрь
            gameDesc.parentNode.insertBefore(details, gameDesc);
            details.appendChild(gameDesc);
        }

        // Удаляем ссылки для скачивания
        var linksToRemove = document.querySelectorAll('a.itemtop_games, block_down_game');
        linksToRemove.forEach(function(link) {
            link.remove();
        });

        // Удаляем скрипт Google Tag Manager
        var scriptToRemove = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
        if (scriptToRemove) {
            scriptToRemove.remove();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', modifyPage);
    } else {
        modifyPage();
    }
})();
