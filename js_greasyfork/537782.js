// ==UserScript==
// @name         Arizona-RP Complete Profile Customizer
// @namespace    https://forum.arizona-rp.com/
// @version      17.0
// @description  Меняет баннеры, стили и сохраняет настройки
// @author       You
// @match        https://forum.arizona-rp.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/537782/Arizona-RP%20Complete%20Profile%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/537782/Arizona-RP%20Complete%20Profile%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Все настройки ролей
    const ROLES = {
        'Основатель': {
            bannerClass: 'osnov',
            usernameClass: 'style3'
        },
        'Главный администратор': {
            bannerClass: 'gadmin',
            usernameClass: 'style71'
        },
        'Заместитель ГА': {
            bannerClass: 'zgadmin',
            usernameClass: 'style73'
        },
        'Куратор': {
            bannerClass: 'curadm',
            usernameClass: 'style76'
        },
        'Администратор': {
            bannerClass: 'adm4',
            usernameClass: 'style74'
        },
        'Мл. Администратор': {
            bannerClass: 'adm3',
            usernameClass: 'style72'
        },
        'ХЕЛПЕР': {
            bannerClass: 'adm1',
            usernameClass: 'style75'
        }
    };

    // Создаем кнопки интерфейса
    function createButtons() {
        // Кнопка для баннера
        const bannerBtn = document.createElement('button');
        bannerBtn.innerHTML = '🏷️ БАННЕР';
        bannerBtn.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: #2196F3;
            color: white;
            padding: 12px 15px;
            border: none;
            border-radius: 20px;
            font-size: 16px;
            font-weight: bold;
            z-index: 99999;
            box-shadow: 0 0 10px blue;
        `;
        bannerBtn.onclick = changeBanner;
        document.body.appendChild(bannerBtn);

        // Кнопка для стиля
        const styleBtn = document.createElement('button');
        styleBtn.innerHTML = '🎨 СТИЛЬ';
        styleBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 15px;
            border: none;
            border-radius: 20px;
            font-size: 16px;
            font-weight: bold;
            z-index: 99999;
            box-shadow: 0 0 10px green;
        `;
        styleBtn.onclick = changeStyle;
        document.body.appendChild(styleBtn);

        // Делаем кнопки всегда видимыми
        setInterval(() => {
            bannerBtn.style.display = 'block';
            styleBtn.style.display = 'block';
        }, 1000);
    }

    // Функция изменения баннера
    function changeBanner() {
        const choice = prompt(`Выберите баннер:\n\n${
            Object.entries(ROLES)
                .map(([name, data], i) => `${i+1} - ${name} (${data.bannerClass})`)
                .join('\n')
        }`);

        if (!choice) return;

        const index = parseInt(choice) - 1;
        const roles = Object.entries(ROLES);
        
        if (index >= 0 && index < roles.length) {
            const [roleName, roleData] = roles[index];
            updateBanner(roleData.bannerClass, roleName);
            GM_setValue('bannerSetting', {class: roleData.bannerClass, name: roleName});
            alert(`Баннер изменен на: ${roleName} (${roleData.bannerClass})`);
        }
    }

    // Функция изменения стиля
    function changeStyle() {
        const choice = prompt(`Выберите стиль:\n\n${
            Object.entries(ROLES)
                .map(([name, data], i) => `${i+1} - ${name} (${data.usernameClass})`)
                .join('\n')
        }`);

        if (!choice) return;

        const index = parseInt(choice) - 1;
        const roles = Object.entries(ROLES);
        
        if (index >= 0 && index < roles.length) {
            const [roleName, roleData] = roles[index];
            updateStyle(roleData.usernameClass);
            GM_setValue('styleSetting', {class: roleData.usernameClass, name: roleName});
            alert(`Стиль изменен на: ${roleName} (${roleData.usernameClass})`);
        }
    }

    // Обновление баннера
    function updateBanner(bannerClass, bannerText) {
        document.querySelectorAll('em[class*="userBanner"]').forEach(el => {
            el.className = 'userBanner ' + bannerClass;
            el.textContent = bannerText;
            el.style.fontStyle = 'normal';
            el.style.fontWeight = 'bold';
        });
    }

    // Обновление стиля
    function updateStyle(styleClass) {
        document.querySelectorAll('[class*="username--style"]').forEach(el => {
            el.className = el.className.split(' ')
                .filter(cls => !cls.startsWith('username--style'))
                .join(' ');
            el.classList.add(`username--${styleClass}`);
        });
    }

    // Восстановление сохраненных настроек
    function restoreSettings() {
        // Восстанавливаем баннер
        const savedBanner = GM_getValue('bannerSetting');
        if (savedBanner) {
            updateBanner(savedBanner.class, savedBanner.name);
        }

        // Восстанавливаем стиль
        const savedStyle = GM_getValue('styleSetting');
        if (savedStyle) {
            updateStyle(savedStyle.class);
        }
    }

    // Инициализация
    window.addEventListener('load', function() {
        createButtons();
        restoreSettings();
        
        // Для динамического контента
        new MutationObserver(restoreSettings).observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();