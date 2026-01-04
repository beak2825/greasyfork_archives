// ==UserScript==
// @name         Context Getcourse Widget
// @namespace    https://dev-postnov.ru/
// @version      1.0.6
// @description  Меню в правой верхней панели с полезными ссылками для разработчиков
// @author       Daniil Postnov
// @match        *://*/teach/control/stream/*
// @match        *://*/teach/control/*
// @match        *://*/teach/*
// @match        *://*/teach
// @match        *://*/teach/control
// @match        *://*/pl/teach/*
// @match        *://*/pl/teach/control/*
// @match        *://*/pl/teach/control/lesson/*
// @match        *://*/pl/teach/control/stream/*
// @match        *://*/profile
// @match        *://*/profile/*
// @match        *://*/pl/*
// @match        *://*/sales/*
// @match        *://*/cms/*
// @match        *://*/notifications/*
// @match        *://*/pl/cms/*
// @match        *://*/pl/sales/*
// @match        *://*/pl/notifications/*
// @match        *://*/user/control/*
// @match        *://*/user/session/*
// @match        *://*/orders/*
// @match        *://*/pl/orders/*
// @match        *://*/course/*
// @match        *://*/pl/course/*
// @match        *://*/stream/*
// @match        *://*/pl/stream/*
// @match        *://*/trainings/*
// @match        *://*/pl/trainings/*
// @match        *://*/pl/admin/*
// @match        *://*/admin/*
// @match        *://*/learning/*
// @match        *://*/pl/learning/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524513/Context%20Getcourse%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/524513/Context%20Getcourse%20Widget.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Создаем стили для виджета и меню
    const style = document.createElement('style');
    style.textContent = `
        .widget-button {
            position: fixed;
            top: 0px;
            right: 0px;
            padding: 8px;
            background: #ffffff;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
        }

        .context-menu {
            display: none;
            position: fixed;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 8px 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
        }

        .context-menu h3 {
            margin: 0;
            padding: 5px 15px;
            color: #666;
            font-size: 14px;
            font-weight: bold;
        }

        .context-menu a, .context-menu div {
            display: block;
            padding: 5px 15px;
            text-decoration: none;
            color: #333;
            cursor: pointer;
        }

        .context-menu a:hover, .context-menu div:hover {
            background: #f5f5f5;
        }

        .menu-separator {
            border-top: 1px solid #ddd;
            margin: 5px 0;
        }

        .hide-option {
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Создаем кнопку виджета
    const widgetButton = document.createElement('div');
    widgetButton.className = 'widget-button';
    widgetButton.textContent = '☰';
    document.body.appendChild(widgetButton);

    // Создаем контекстное меню
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';

    // Создаем содержимое меню
    const createMenuContent = () => {
        return `
            <h3>Полезные ссылки</h3>
            <a href="/pl/cms/layout">Темы школы</a>
            <a href="/pl/sales/deal">Заказы</a>
            <a href="/pl/saas/account/settings">Настройки аккаунта</a>

            <div class="menu-separator"></div>
            <h3>Системные страницы</h3>
            ${[
                { name: 'Главная', url: '/teach/control' },
                { name: 'Оплата', url: '/sales/shop/dealPay/id/config/hash/' },
                { name: 'Благодарность за оплату', url: '/sales/shop/dealPaid/id/config/hash/' },
                { name: 'Мои покупки', url: '/sales/control/userProduct/my' },
                { name: 'Вход', url: '/cms/system/login' },
                { name: 'Мои профиль', url: '/profile' },
                { name: 'Настройки уведомлений', url: '/pl/notifications/settings/my' },
                { name: 'Все уведомления', url: '/notifications/notifications/all' },
                { name: 'Актуальные события', url: '/teach/control/schedule' },
            ].map(link => `<a href="${link.url}">${link.name}</a>`).join('')}
            
            <div class="menu-separator"></div>
            <div class="hide-option" data-seconds="10">Скрыть на 10 секунд</div>
            <div class="hide-option" data-seconds="30">Скрыть на 30 секунд</div>
        `;
    };

    contextMenu.innerHTML = createMenuContent();
    document.body.appendChild(contextMenu);

    // Функция скрытия виджета
    const hideWidget = (seconds) => {
        widgetButton.style.display = 'none';
        contextMenu.style.display = 'none';
        setTimeout(() => {
            widgetButton.style.display = 'block';
        }, seconds * 1000);
    };

    // Обработчики событий
    widgetButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = widgetButton.getBoundingClientRect();
        contextMenu.style.display = 'block';
        contextMenu.style.top = (rect.bottom + 5) + 'px';
        contextMenu.style.right = '10px';
    });

    // Делегирование событий для кнопок скрытия
    contextMenu.addEventListener('click', (e) => {
        const hideOption = e.target.closest('.hide-option');
        if (hideOption) {
            const seconds = parseInt(hideOption.dataset.seconds, 10);
            hideWidget(seconds);
        }
    });

    // Скрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!contextMenu.contains(e.target) && e.target !== widgetButton) {
            contextMenu.style.display = 'none';
        }
    });
})();