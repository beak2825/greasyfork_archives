// ==UserScript==
// @name            HotPot.ai show all styles
// @namespace       Wizzergod
// @version         1.0.7
// @description     Добавляет всех стилей
// @icon            https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @license         MIT
// @author          Wizzergod
// @match           *://hotpot.ai/art-generator*
// @match           *://hotpot.ai/remove-background*
// @match           *://hotpot.ai/anime-generator*
// @match           *://hotpot.ai/headshot/train*
// @match           *://hotpot.ai/logo-generator*
// @match           *://hotpot.ai/background-generator*
// @match           *://hotpot.ai/lunar-new-year-headshot*
// @match           *://hotpot.ai/ai-avatar*
// @match           *://hotpot.ai/ai-editor*
// @match           *://hotpot.ai/ai-stock-photo*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/488932/HotPotai%20show%20all%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/488932/HotPotai%20show%20all%20styles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для извлечения названия @match из URL
    function extractMatchName(url) {
        const match = url.match(/hotpot\.ai\/([^\/]+)/);
        return match && match[1];
    }

    // Функция для обновления данных галереи
    function updateData(matchName) {
        const iframe = document.getElementById('hotpotCatalogOverlay');
        if (!iframe) {
            console.error('iframe not found');
            return;
        }

        const iframeContent = iframe.contentDocument || iframe.contentWindow.document;
        const galleryItems = iframeContent.querySelectorAll('.itemBox');
        const galleryData = [];

        galleryItems.forEach(item => {
            const itemId = item.getAttribute('data-itemid');
            const imgElement = item.querySelector('.imageBox img');

            if (imgElement && imgElement.hasAttribute('src')) {
                const imgSrc = imgElement.src;
                const itemName = item.querySelector('.name').textContent;

                if (itemId && itemId !== "null") {
                    galleryData.push({ itemId, imgSrc, itemName });
                }
            }
        });

        const key = `galleryData-${matchName}`;
        localStorage.setItem(key, JSON.stringify(galleryData));
        console.log('Gallery data saved for match:', matchName, galleryData);

        // Обновляем historyBox
        updateHistoryBox(matchName);
    }

    // Функция для обновления истории просмотров
    function updateHistoryBox(matchName) {
        const key = `galleryData-${matchName}`;
        const galleryData = JSON.parse(localStorage.getItem(key));
        const historyBox = document.querySelector('.historyBox');
        if (!historyBox) {
            console.error('historyBox not found');
            return;
        }
        historyBox.innerHTML = '';

        galleryData.forEach(data => {
            const thumbnailBox = document.createElement('div');
            thumbnailBox.className = 'thumbnailBox';
            thumbnailBox.setAttribute('styleid', data.itemId);
            thumbnailBox.setAttribute('stylelabel', data.itemName);

            const img = document.createElement('img');
            img.src = data.imgSrc;

            thumbnailBox.appendChild(img);
            historyBox.appendChild(thumbnailBox);
        });
    }

    // Функция для обновления данных после полной загрузки страницы
    function initialize() {
        const matchName = extractMatchName(window.location.href);
        if (matchName) {
            updateData(matchName);
        }
    }

    // Вызываем функцию для создания кнопки после полной загрузки страницы
    window.addEventListener('load', initialize);
})();