// ==UserScript==
// @name           Game Jolt Notification Filter Preserver
// @name:ru        Сохранение фильтров уведомлений Game Jolt
// @namespace      http://tampermonkey.net/
// @version        0.1
// @icon           https://s.gjcdn.net/img/favicon.png
// @description    Preserves and restores selected filters on the notifications page of Game Jolt.
// @description:ru Восстанавливает выбранные фильтры на странице уведомлений Game Jolt.
// @author         Deflecta, GKProduction
// @match          https://gamejolt.com/*
// @match          https://*.gamejolt.com/*
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/496893/Game%20Jolt%20Notification%20Filter%20Preserver.user.js
// @updateURL https://update.greasyfork.org/scripts/496893/Game%20Jolt%20Notification%20Filter%20Preserver.meta.js
// ==/UserScript==

(function() {
    // Задаём переменные
    const notifPageUrl = 'https://gamejolt.com/notifications';

    // Сохраняем фильтры
    function saveFilters()
        {
            const urlParams = new URLSearchParams(window.location.search);
            const filters = urlParams.get('f');
            if (filters)
                {
                    localStorage.setItem('gjNotifFilters', filters);
                }
        }

    // Загружаем фильтры
    function loadFilters()
        {
            return localStorage.getItem('gjNotifFilters');
        }

    // Проверяем факт нажатия
    document.addEventListener('click', (event) =>
        {
            const viewAllButton = event.target.closest('a.button.-trans.-block');
            if (viewAllButton && viewAllButton.textContent.trim() === ('View all' || 'Посмотреть всё'))
                {
                    const filters = loadFilters();
                    if (filters)
                        {
                            event.preventDefault();
                            window.location.href = `${notifPageUrl}?f=${filters}`;
                        }
                }
        });

    // Запоминаем фильтры в нужный момент с MutationObserver
    const observer = new MutationObserver(() =>
        {
            if (window.location.href.startsWith(notifPageUrl))
                {
                    saveFilters();
                }
        });

    // Запускаем MutationObserver
    observer.observe(document.body,
        {
            childList: true, subtree: true 
        });

    // Сохраняем фильтры, если мы в уведомлениях
    if (window.location.href.startsWith(notifPageUrl))
        {
            saveFilters();
        }
})();