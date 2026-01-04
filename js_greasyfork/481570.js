// ==UserScript==
// @name           Bandcamp: Target Your Track on the List
// @name:en        Bandcamp: Target Your Track on the List
// @name:ru        Bandcamp: Найдите Ваш Трек в Списке
// @name:zh        Bandcamp: 锁定列表中的轨道
// @description    Adds a button to the music bar that scrolls to the track you are currently listening to but have lost it
// @description:en Adds a button to the music bar that scrolls to the track you are currently listening to but have lost it
// @description:ru Добавляет кнопку в музыкальную панель, которая прокручивает страницу к треку, который вы сейчас слушаете, но потеряли его
// @description:zh 在音乐栏中添加一个按钮，滚动到当前正在收听但已丢失的曲目
// @namespace      http://tampermonkey.net/
// @version        1.3
// @author         Grihail
// @match          https://bandcamp.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=bandcamp.com
// @license        CC-BY
// @downloadURL https://update.greasyfork.org/scripts/481570/Bandcamp%3A%20Target%20Your%20Track%20on%20the%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/481570/Bandcamp%3A%20Target%20Your%20Track%20on%20the%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для прокрутки страницы к элементу с учетом процентов
    function scrollToElementWithPercentage(element, percentage) {
        const offsetTop = element.offsetTop - (window.innerHeight * percentage / 100);
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    // Функция для обработки клика по кнопке
    function handleDivClick() {
        // Находим элемент с текстом текущего трека
        const currentTrackElement = document.querySelector('div[data-bind="text: currentTrack().title"]');
        if (!currentTrackElement) return;

        // Получаем текст из текущего трека
        const currentTrackText = currentTrackElement.textContent.trim();

        // Проверяем элементы .dig-deeper-item
        const digDeeperItems = document.querySelectorAll('.dig-deeper-items > div > .dig-deeper-item');
        for (const item of digDeeperItems) {
            const titleElement = item.querySelector('.info > a > .title');
            if (titleElement && titleElement.textContent.trim() === currentTrackText) {
                // Найдено совпадение, прокручиваем страницу к элементу с 50% от высоты
                scrollToElementWithPercentage(item, 20);
                return;
            }
        }

        // Проверяем элементы ol.collection-grid > li
        const collectionItems = document.querySelectorAll('ol.collection-grid > li');
        for (const item of collectionItems) {
            const titleElement = item.querySelector('.collection-item-gallery-container > .collection-title-details > a > .collection-item-title');
            if (titleElement && titleElement.textContent.trim() === currentTrackText) {
                // Найдено совпадение, прокручиваем страницу к элементу с 50% от высоты
                scrollToElementWithPercentage(item, 20);
                return;
            }
        }
    }

    // Функция для добавления кнопки и стиля
    function addButtonAndStyle() {
        const buttonContainer = document.querySelector('.progress-transport');
        if (!buttonContainer) return;

        buttonContainer.style.alignItems = 'center'; // Добавляем стиль

        const button = document.createElement('button');
        button.className = 'target-track'; // Добавляем класс target-track
        button.style.width = '26px';
        button.style.height = '26px';
        button.style.color = 'unset';
        button.style.padding = '6px';
        button.style.boxSizing = 'unset';

        // Добавьте вашу SVG-иконку как innerHTML кнопки
        button.innerHTML = '<svg overflow="visible" width="26" height="26" viewBox="0 0 26 26" fill="none" class="svg-icon" stroke="black" stroke-linecap="round" stroke-linejoin="round"><path d="M14 23C15.1819 23 16.3522 22.7672 17.4442 22.3149C18.5361 21.8626 19.5282 21.1997 20.364 20.364C21.1997 19.5282 21.8626 18.5361 22.3149 17.4442C22.7672 16.3522 23 15.1819 23 14C23 12.8181 22.7672 11.6478 22.3149 10.5558C21.8626 9.46392 21.1997 8.47177 20.364 7.63604C19.5282 6.80031 18.5361 6.13738 17.4442 5.68508C16.3522 5.23279 15.1819 5 14 5C11.6131 5 9.32387 5.94821 7.63604 7.63604C5.94821 9.32387 5 11.6131 5 14C5 16.3869 5.94821 18.6761 7.63604 20.364C9.32387 22.0518 11.6131 23 14 23Z"/><path d="M14 5V1M14 27V23M23 14H27M1 14H5M14 15C14.2652 15 14.5196 14.8946 14.7071 14.7071C14.8946 14.5196 15 14.2652 15 14C15 13.7348 14.8946 13.4804 14.7071 13.2929C14.5196 13.1054 14.2652 13 14 13C13.7348 13 13.4804 13.1054 13.2929 13.2929C13.1054 13.4804 13 13.7348 13 14C13 14.2652 13.1054 14.5196 13.2929 14.7071C13.4804 14.8946 13.7348 15 14 15Z"/></svg>';

        // Добавляем обработчик клика по кнопке
        button.addEventListener('click', handleDivClick);

        // Добавляем кнопку в конец контейнера
        buttonContainer.appendChild(button);

        // Устанавливаем overflow: visible; для элемента с селектором .target-track>svg:not(:root)
        const svgElement = document.querySelector('.target-track>svg:not(:root)');
        if (svgElement) {
            svgElement.style.overflow = 'visible';
        }
    }

    // Вызываем функцию добавления кнопки и стиля после загрузки страницы
    window.addEventListener('load', addButtonAndStyle);

})();