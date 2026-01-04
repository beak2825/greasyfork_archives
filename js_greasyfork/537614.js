// ==UserScript==
// @name         VK Avatar Max Opener
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Открывает аватарку VK в максимальном разрешении только на закрытых страницах при клике на неё
// @author       Vierta
// @match        *://vk.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537614/VK%20Avatar%20Max%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/537614/VK%20Avatar%20Max%20Opener.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Навешиваем обработчик кликов
    document.addEventListener('click', function (e) {
        // Проверка на закрытый профиль
        const isClosedProfile = document.querySelector('[class*="ClosedProfileBlock__container"]');
        if (!isClosedProfile) return;

        let target = e.target;

        // Поднимаемся до блока с аватаркой
        while (target && !target.classList.contains('ProfileHeader__ava')) {
            target = target.parentElement;
        }

        if (target) {
            const img = target.querySelector('img.vkuiImageBase__img');
            if (img && img.src.includes('ava=1')) {
                const src = img.src;

                // Извлекаем параметр as=...
                const asMatch = src.match(/as=([^&]+)/);
                if (!asMatch) return;

                const sizes = asMatch[1].split(',').map(s => {
                    const [w, h] = s.split('x').map(Number);
                    return { w, h, str: s };
                });

                // Находим максимальный размер
                const maxSize = sizes.reduce((max, curr) => {
                    const maxPixels = max.w * max.h;
                    const currPixels = curr.w * curr.h;
                    return currPixels > maxPixels ? curr : max;
                });

                // Заменяем cs=... на максимальный размер
                const newUrl = src.replace(/cs=\d+x\d+/, `cs=${maxSize.str}`);
                window.open(newUrl, '_blank');
                e.preventDefault();
            }
        }
    }, true);
})();
