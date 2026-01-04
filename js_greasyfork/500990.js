// ==UserScript==
// @name         1Win RunWEB
// @version      1.3
// @namespace mrW
// @match        *://cryptocklicker-frontend-rnd-prod.100hp.app/*
// @icon         https://img.cryptorank.io/coins/w_coin1718038816897.png
// @run-at       document-start
// @grant        none
// @license MIT
// @description run 1win token app in web
// @downloadURL https://update.greasyfork.org/scripts/500990/1Win%20RunWEB.user.js
// @updateURL https://update.greasyfork.org/scripts/500990/1Win%20RunWEB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для замены URL скрипта
    function replaceScriptUrl() {
        // Список URL-адресов для замены
        const urlsToReplace = [
            'https://telegram.org/js/telegram-web-app.js'
        ];
        const newUrl = 'https://ktnff.tech/hamsterkombat/telegram-web-app.js';

        // Получаем все теги <script> на странице
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            // Проверяем, содержит ли src один из URL-адресов для замены
            if (urlsToReplace.includes(script.src)) {
                // Создаем новый тег <script> с новым URL
                const newScript = document.createElement('script');
                newScript.src = newUrl;
                newScript.type = 'text/javascript';

                // Заменяем старый тег на новый
                script.parentNode.replaceChild(newScript, script);
                console.log('Script URL replaced:', newScript.src);
            }
        }
    }

    // Наблюдатель за изменениями в DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                replaceScriptUrl();
            }
        });
    });

    // Настройки наблюдателя
    const config = {
        childList: true,
        subtree: true
    };

    // Начинаем наблюдение за изменениями в DOM
    observer.observe(document.body, config);

    // Первоначальный запуск замены URL
    replaceScriptUrl();
})();