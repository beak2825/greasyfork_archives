// ==UserScript==
// @name         Блокировщик рекламы Яндекса
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Блокирует надоедливую рекламу Яндекса, включая рекламу в поисковике
// @author       ezTripper (Fanfizi)
// @match        *://yandex.ru/*
// @match        *://*.yandex.ru/*
// @match        *://yandex.com/*
// @match        *://*.yandex.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537296/%D0%91%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D1%89%D0%B8%D0%BA%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/537296/%D0%91%D0%BB%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D1%89%D0%B8%D0%BA%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для блокировки рекламы
    function blockYandexAds() {
        // Блокируем рекламные баннеры с классом AdvRsyaCrossPage
        const ads = document.querySelectorAll('.AdvRsyaCrossPage, .Root[data-state*="rsya_guarantee"], .AdvRsya-Slot, .DirectInlineContainer[id^="rsya-"]');
        ads.forEach(ad => {
            ad.style.display = 'none';
            console.log('Рекламный баннер Яндекса заблокирован');
        });

        // Также можно удалить родительский элемент, если реклама не исчезает
        const adContainers = document.querySelectorAll('.JustifierRowLayout-Incut, [id^="advRsyaReact_"]');
        adContainers.forEach(container => {
            if (container.querySelector('.AdvRsyaCrossPage, .AdvRsya-Slot, .DirectInlineContainer[id^="rsya-"]')) {
                container.remove();
                console.log('Контейнер с рекламой Яндекса удален');
            }
        });

        // Блокируем конкретный блок рекламы в поисковике
        const searchAds = document.querySelectorAll('#advRsyaReact_rsya-guarantee-PSDp0k8');
        searchAds.forEach(ad => {
            ad.remove();
            console.log('Реклама в поисковике Яндекса заблокирована');
        });
    }

    // Запускаем функцию сразу после загрузки страницы
    blockYandexAds();

    // Также запускаем при изменениях в DOM (на случай динамической загрузки рекламы)
    const observer = new MutationObserver(blockYandexAds);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();