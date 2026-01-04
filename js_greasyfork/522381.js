// ==UserScript==
// @name         🚀 Enhanced Page Load Speed Test
// @namespace    r1kov
// @version      0.3-speed-test
// @description  🏎️ Улучшает скорость загрузки страниц, скрывая ненужные ресурсы и оптимизируя изображения для быстрого отклика и производительности
// @include      *
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522381/%F0%9F%9A%80%20Enhanced%20Page%20Load%20Speed%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/522381/%F0%9F%9A%80%20Enhanced%20Page%20Load%20Speed%20Test.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Селекторы известных рекламных элементов
    const adSelectors = [
        'script[src*="ads"]',
        'script[src*="doubleclick"]',
        'iframe[src*="ads"]',
        'div[class*="ad"]',
        'div[id*="ad"]'
    ];

    function hideAds() {
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(ad => {
                // Проверяем, не является ли элемент важным, и не скрываем его полностью
                if (!ad.hasAttribute('data-important')) {
                    // Вместо удаления, просто скрываем визуально
                    ad.style.visibility = 'hidden';
                }
            });
        });
    }

    // Отложенная загрузка изображений
    function lazyLoadImages() {
        document.querySelectorAll('img').forEach(img => {
            if (!img.complete && !img.loading) {
                img.loading = 'lazy';
            }
        });
    }

    function optimizePage() {
        hideAds();
        lazyLoadImages();
    }

    // Оптимизация при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizePage);
    } else {
        optimizePage();
    }

    // Наблюдение за изменениями DOM, чтобы применять оптимизацию к динамически загруженным элементам
    const observer = new MutationObserver(optimizePage);
    observer.observe(document.documentElement, { childList: true, subtree: true });

})();