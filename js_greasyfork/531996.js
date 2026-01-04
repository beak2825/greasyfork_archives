// ==UserScript==
// @name         Кнопка перехода на Flicksbar из HDRezka (без использования API Кинопоиска)
// @namespace    http://tampermonkey.net/
// @version      0.9.0.2
// @description  Ищет фильм в Google и автоматически переходит на Flicksbar без использования API Кинопоиска (для правильной работы нужен второй скрипт "Автопереход на Flicksbar с Google")
// @author       Vladimir_0202
// @icon         https://icon2.cleanpng.com/lnd/20240915/sf/f756b06ecd171836c2c3ef125178d4.webp
// @include      /^https?:\/\/.*rezk.*\/.*$/
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/531996/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%B0%20%D0%BD%D0%B0%20Flicksbar%20%D0%B8%D0%B7%20HDRezka%20%28%D0%B1%D0%B5%D0%B7%20%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20API%20%D0%9A%D0%B8%D0%BD%D0%BE%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531996/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%D0%B0%20%D0%BD%D0%B0%20Flicksbar%20%D0%B8%D0%B7%20HDRezka%20%28%D0%B1%D0%B5%D0%B7%20%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F%20API%20%D0%9A%D0%B8%D0%BD%D0%BE%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

// CSS-код
GM.addStyle(`
.b-sidecover {
    margin-bottom: 6px;
}
`);

        const currentUrl = window.location.href;
        // Проверяем, содержится ли в текущем URL подстрока '/person/'
        if (currentUrl.includes('/person/')) {
            console.log('Скрипт не выполняется на этой странице:', currentUrl);
            return; // Прекращаем выполнение скрипта
        }

    function getFilmDetails() {
        const titleElement = document.querySelector('.b-post__title');
        const originalTitleElement = document.querySelector('.b-post__origtitle');
        const yearLink = document.querySelector('.b-post__info a[href*="/year/"]');
        const typeLink = document.querySelector('.b-post__info a[href*="/series/"]');

        const title = titleElement ? titleElement.textContent.trim() : '';
        const originalTitle = originalTitleElement ? originalTitleElement.textContent.trim() : '';
        let year = '';
        if (yearLink) {
            year = yearLink.textContent.trim().replace('года', '').trim();
        }

        const isSeries = typeLink !== null;
        return { title, originalTitle, year, isSeries };
    }

    function createButton() {
        const { title, originalTitle, year } = getFilmDetails();
        const button = document.createElement('button');
        button.textContent = 'Найти на Flicksbar';
        button.style.padding = '9px';
        button.style.marginTop = '5px';
        button.style.marginBottom = '2px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.width = '100%';
        button.style.cursor = 'pointer';
        button.title = `Поиск: ${title} ${originalTitle} ${year}`;

        button.onclick = () => {
            const { title, originalTitle, year, isSeries } = getFilmDetails();
            if (!title) {
                alert('Не удалось извлечь информацию о фильме.');
                return;
            }

            const searchQuery = encodeURIComponent(
                `${title} ${originalTitle} ${year} кинопоиск`
            );
            const flicksbarType = isSeries ? 'series' : 'film';
            const googleUrl = `https://www.google.com/search?q=${searchQuery}&btnK&flcks_type=${flicksbarType}`;

            window.open(googleUrl, '_blank');
        };

        const sideCover = document.querySelector('.b-sidecover');
        if (sideCover) {
            sideCover.appendChild(button);
        }
    }

    window.addEventListener('load', createButton);
})();
