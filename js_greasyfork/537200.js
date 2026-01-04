// ==UserScript==
// @name         Упоминание поста
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Добавляет кнопку "Упоминание поста" как в мобильном приложении + сразу сортирует по дате от новых к старым.
// @author       Vierta
// @match        https://4pda.to/forum/index.php?showtopic=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537200/%D0%A3%D0%BF%D0%BE%D0%BC%D0%B8%D0%BD%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%BE%D1%81%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/537200/%D0%A3%D0%BF%D0%BE%D0%BC%D0%B8%D0%BD%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BF%D0%BE%D1%81%D1%82%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для извлечения topic_id из URL
    function getTopicId() {
        const url = window.location.href;
        const match = url.match(/showtopic=(\d+)/);
        return match ? match[1] : null;
    }

    // Функция для создания кнопки поиска
    function createSearchButton(postId, topicId) {
        const searchUrl = `https://4pda.to/forum/index.php?topics=${topicId}&act=search&source=pst&query=${postId}&sort=dd&result=posts`;
        const searchButton = document.createElement('a');
        searchButton.href = searchUrl;
        searchButton.textContent = 'Упоминание поста';
        searchButton.className = 'g-btn blue min-mid';
        searchButton.style.marginLeft = '10px';
        return searchButton;
    }

    // Основная функция
    function addSearchButtons() {
        const topicId = getTopicId();
        if (!topicId) return;

        // Находим все элементы с сообщениями
        const postLinks = document.querySelectorAll('a[onclick*="link_to_post"]');

        postLinks.forEach(link => {
            // Извлекаем postId из onclick атрибута
            const postIdMatch = link.onclick.toString().match(/link_to_post\((\d+)\)/);
            if (postIdMatch && postIdMatch[1]) {
                const postId = postIdMatch[1];
                const parentDiv = link.parentElement;

                // Создаем и добавляем кнопку поиска
                const searchButton = createSearchButton(postId, topicId);
                parentDiv.appendChild(searchButton);
            }
        });
    }

    // Запускаем после загрузки страницы
    window.addEventListener('load', addSearchButtons);
})();