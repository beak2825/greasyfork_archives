// ==UserScript==
// @name         Kinopoisk - FlicksBar Button for Google
// @namespace    https://t.me/flicksbar
// @version      1.0.2
// @description  Добавляет кнопку "Flicksbar" с подменой ссылки kinopoisk.ru на sspoisk.ru в раздел "Смотреть фильм"
// @author       Devitp001
// @match        https://www.google.com/search*
// @icon         https://www.kinopoisk.ru/favicon.ico
// @icon64       https://www.kinopoisk.ru/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534661/Kinopoisk%20-%20FlicksBar%20Button%20for%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/534661/Kinopoisk%20-%20FlicksBar%20Button%20for%20Google.meta.js
// ==/UserScript==


(function () {
    'use strict';

    if (!location.hostname.includes('google')) return;

    function log(message) {
        console.log(`[FlicksBar]: ${message}`);
    }

    // Поиск кнопки "Хочу посмотреть"
    function findWishlistButton() {
        return Array.from(document.querySelectorAll('*'))
            .flatMap(el => {
            if (el.shadowRoot) {
                return Array.from(
                    el.shadowRoot.querySelectorAll('[aria-label=" Хочу посмотреть "]')
                );
            }
            return [];
        })
            .concat(
            Array.from(document.querySelectorAll('[aria-label=" Хочу посмотреть "]'))
        );
    }

    // Создание кнопки "F" с точной структурой
    function createFlicksBarButton(referenceElement, redirectURL) {
        const outerDiv = document.createElement('a');
        outerDiv.href = redirectURL;
        outerDiv.target = '_blank';
        outerDiv.rel = 'noopener';
        outerDiv.role = 'button';
        outerDiv.tabIndex = '0';

        // Копируем классы из оригинальной кнопки
        const originalClassList = referenceElement.classList;
        outerDiv.className = [...originalClassList].join(' ');

        // Внутренний контейнер VDgVie...
        const innerContainer = document.createElement('div');
        innerContainer.className = 'VDgVie btku5b fCrZyc NQYJvc qVhvac zqrO0 sLl7de OJeuxf';

        // Обёртка niO4u
        const niO4u = document.createElement('div');
        niO4u.className = 'niO4u';

        // kHtcsd
        const kHtcsd = document.createElement('div');
        kHtcsd.className = 'kHtcsd';

        // d3o3Ad gJdC8e
        const iconWrapper = document.createElement('span');
        iconWrapper.className = 'd3o3Ad gJdC8e';

        // RUoEBe... (иконка)
        const svgContainer = document.createElement('span');
        svgContainer.className = '1RUoEBe K5Jxee z1asCe DoJQd';
        svgContainer.style.height = '20px';
        svgContainer.style.lineHeight = '20px';
        svgContainer.style.width = '20px';

        // SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.innerHTML = `<path d="M3 3 h18 v4 H6 v6 h14 v4 H6 v10 H2 zm0"/>`;




        svgContainer.appendChild(svg);
        iconWrapper.appendChild(svgContainer);

        kHtcsd.appendChild(iconWrapper);
        niO4u.appendChild(kHtcsd);

        // Текстовая часть
        const textContainer = document.createElement('div');
        textContainer.className = 'QuU3Wb sjVJQd';
        textContainer.setAttribute('aria-hidden', 'true');
        textContainer.textContent = ' FlicksBar ';

        //const textDiv = document.createElement('div');
        //textDiv.setAttribute('aria-hidden', 'true');
        //textDiv.textContent = ' FlicksBar ';

        //textContainer.appendChild(textDiv);

        // Компоновка
        innerContainer.appendChild(niO4u);
        innerContainer.appendChild(textContainer);
        outerDiv.appendChild(innerContainer);

        return outerDiv;
    }

    // Поиск ссылки на Кинопоиск
    function findKinopoiskLink() {
        return Array.from(document.querySelectorAll('a'))
            .filter(link => {
            const href = link.href || '';
            return (
                href.startsWith('https://www.kinopoisk.ru/film/') ||
                href.startsWith('https://www.kinopoisk.ru/series/')
            );
        })[0];
    }

    // Подмена ссылки kinopoisk.ru на sspoisk.ru
    function getRedirectURL(kinopoiskLink) {
        if (!kinopoiskLink) return null;

        const kinopoiskHref = kinopoiskLink.href;
        const sspoiskHref = kinopoiskHref.replace('kinopoisk.ru', 'sspoisk.ru');

        // Вариант 1: Переход напрямую на sspoisk.ru
        return sspoiskHref;

        // Вариант 2: С редиректом через flicks.bar (если нужно)
    }

    // Вставка кнопки "F"
    function injectFButtonBeforeWishlist(wishlistButton) {
        const container = wishlistButton.closest('div, span')?.parentElement;
        if (!container) return;

        const existing = container.querySelector('a[href*="sspoisk.ru"]');
        if (existing) return;

        // Найдём ссылку на Кинопоиск
        const kinopoiskLink = findKinopoiskLink();
        const redirectURL = getRedirectURL(kinopoiskLink);

        if (!redirectURL) {
            log('Не удалось найти ссылку на Кинопоиск');
            return;
        }

        const fButton = createFlicksBarButton(wishlistButton, redirectURL);
        container.insertBefore(fButton, wishlistButton);
        log('Добавлена кнопка "F" перед "Хочу посмотреть"');
    }

    // Наблюдатель за изменениями DOM
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const wishlistButton = findWishlistButton()[0];
                if (wishlistButton) {
                    injectFButtonBeforeWishlist(wishlistButton);
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Первоначальный запуск
    const wishlistButton = findWishlistButton()[0];
    if (wishlistButton) {
        injectFButtonBeforeWishlist(wishlistButton);
    }
})();