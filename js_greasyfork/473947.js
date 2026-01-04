// ==UserScript==
// @name         Сбор ссылок на фото и видео
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Собирает ссылки на фото и видео с сайта и позволяет переключаться между ними.
// @author       You
// @match        https://rule34.xxx/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/473947/%D0%A1%D0%B1%D0%BE%D1%80%20%D1%81%D1%81%D1%8B%D0%BB%D0%BE%D0%BA%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%82%D0%BE%20%D0%B8%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/473947/%D0%A1%D0%B1%D0%BE%D1%80%20%D1%81%D1%81%D1%8B%D0%BB%D0%BE%D0%BA%20%D0%BD%D0%B0%20%D1%84%D0%BE%D1%82%D0%BE%20%D0%B8%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const storageKey = 'collectedLinks';
    const storageIndexKey = 'currentIndex';
    const storageMaxIndexKey = 'maxIndex'; // Добавленное хранилище для максимального индекса
    const storageNextLinkKey = 'nextLink';
    const storagePrevLinkKey = 'prevLink';
    const storageTagsKey = 'tagsValue';

    let links = JSON.parse(localStorage.getItem(storageKey)) || [];
    let currentIndex = parseInt(localStorage.getItem(storageIndexKey)) || 0;
    let maxIndex = parseInt(localStorage.getItem(storageMaxIndexKey)) || 0; // Инициализация максимального индекса
    let nextLink = localStorage.getItem(storageNextLinkKey) || '';
    let prevLink = localStorage.getItem(storagePrevLinkKey) || '';
    let tagsValue = localStorage.getItem(storageTagsKey)

    function collectLinks() {
        links = [];
        currentIndex = 0;
        nextLink = '';
        prevLink = '';
        maxIndex = 0; // Сброс максимального индекса

        const linkElements = document.querySelectorAll('a[id^="p"]');
        linkElements.forEach(linkElement => {
            const href = linkElement.getAttribute('href');
            links.push(href);
        });

        const nextLinkElement = document.querySelector('a[alt="next"]');
        if (nextLinkElement) {
            nextLink = nextLinkElement.getAttribute('href');
        }

        const prevLinkElement = document.querySelector('a[alt="prev"]');
        if (prevLinkElement) {
            prevLink = prevLinkElement.getAttribute('href');
        }

        maxIndex = links.length - 1; // Обновление максимального индекса

        localStorage.setItem(storageKey, JSON.stringify(links));
        localStorage.setItem(storageIndexKey, currentIndex);
        localStorage.setItem(storageNextLinkKey, nextLink);
        localStorage.setItem(storagePrevLinkKey, prevLink);
        localStorage.setItem(storageMaxIndexKey, maxIndex); // Сохранение максимального индекса
        alert('Ссылки успешно собраны!');
    }


    function addToFavorites() {
        const currentURL = window.location.href;
        const match = currentURL.match(/id=(\d+)/);

        if (match) {
            const linkId = match[1];
            const link = document.querySelector(`a[onclick*="addFav('${linkId}')"]`);

            if (link) {
                link.click();
            } else {
                alert('Link not found.');
            }
        } else {
            alert('Link ID not found in the URL.');
        }
    }

    function goToIndex(index) {
        if (index >= 0 && index <= maxIndex) {
            currentIndex = index;
            localStorage.setItem(storageIndexKey, currentIndex);
            window.location.href = links[currentIndex];
        } else {
            alert('Неверный индекс.');
        }
    }

    function showNextLink() {
        if (currentIndex < links.length) {
            const currentLink = links[currentIndex];
            localStorage.setItem(storageIndexKey, currentIndex + 1);
            window.location.href = currentLink; // Переход по текущей ссылке
        } else if (nextLink) {
            localStorage.removeItem(storageIndexKey); // Удалить индекс при переходе на следующую страницу
            window.location.href = nextLink; // Переход по следующей странице
        } else {
            alert('Больше ссылок нет.');
        }
    }

    // function showPrevLink() {
    //     if (currentIndex > 0) {
    //         currentIndex -= 1;
    //         const currentLink = links[currentIndex];
    //         localStorage.setItem(storageIndexKey, currentIndex);
    //         window.location.href = currentLink; // Переход на предыдущую ссылку
    //     } else if (prevLink) {
    //         localStorage.setItem(storageIndexKey, links.length); // Восстанавливаем индекс
    //         window.location.href = prevLink; // Переход на предыдущую страницу
    //     } else {
    //         alert('Больше ссылок нет.');
    //     }
    // }


    function clearTagsValue() {
        tagsValue = '';
        localStorage.setItem(storageTagsKey, tagsValue);
        tagsInput.value = tagsValue;
    }

    function clearAllData() {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(storageIndexKey);
        localStorage.removeItem(storageMaxIndexKey);
        localStorage.removeItem(storageNextLinkKey);
        localStorage.removeItem(storagePrevLinkKey);
        localStorage.removeItem(storageTagsKey);
        links = [];
        currentIndex = 0;
        maxIndex = 0;
        nextLink = '';
        prevLink = '';
        tagsValue = '';
        tagsInput.value = '';

        // Refresh the page to reflect the changes
        location.reload();
    }

    function createButtons() {
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.position = 'fixed';
        buttonsContainer.style.bottom = '20px';
        buttonsContainer.style.left = '50%';
        buttonsContainer.style.transform = 'translateX(-50%)';
        buttonsContainer.style.textAlign = 'center';




        const startButton = document.createElement('button');
        startButton.innerText = 'Начать';
        startButton.style.marginRight = '10px';
        startButton.addEventListener('click', collectLinks);

        const nextButton = document.createElement('button');
        nextButton.innerText = 'Далее';
        nextButton.style.marginRight = '10px';
        nextButton.addEventListener('click', showNextLink);

        // const prevButton = document.createElement('button');
        // prevButton.innerText = 'Назад';
        // prevButton.style.marginRight = '10px';
        // prevButton.addEventListener('click', showPrevLink);


        const clearTagsButton = document.createElement('button');
        clearTagsButton.innerText = 'Очистить теги';
        clearTagsButton.addEventListener('click', clearTagsValue);


        const currentIndexDisplay = document.createElement('div');
        currentIndexDisplay.innerText = `Текущий индекс: ${currentIndex} / ${maxIndex}`;
        currentIndexDisplay.style.marginTop = '10px';

        const indexInput = document.createElement('input');
        indexInput.type = 'number';
        indexInput.min = 0;
        indexInput.max = maxIndex;
        indexInput.placeholder = 'Индекс...';
        indexInput.style.marginTop = '10px';

        const goToIndexButton = document.createElement('button');
        goToIndexButton.innerText = 'Перейти';
        goToIndexButton.style.marginTop = '5px';
        goToIndexButton.addEventListener('click', () => {
            const desiredIndex = parseInt(indexInput.value);
            goToIndex(desiredIndex);
        });

        buttonsContainer.appendChild(currentIndexDisplay);
        buttonsContainer.appendChild(indexInput);
        buttonsContainer.appendChild(goToIndexButton);



        buttonsContainer.appendChild(startButton);
        buttonsContainer.appendChild(nextButton);
        // buttonsContainer.appendChild(prevButton);
        buttonsContainer.appendChild(clearTagsButton);

        document.body.appendChild(buttonsContainer);
    const clearDataButton = document.createElement('button');
    clearDataButton.innerText = 'Очистить все данные';
    clearDataButton.addEventListener('click', clearAllData);



        const addToFavoritesButton = document.createElement('button');
        addToFavoritesButton.innerText = 'Добавить в избранное';
        addToFavoritesButton.addEventListener('click', addToFavorites);

        buttonsContainer.appendChild(addToFavoritesButton);
buttonsContainer.appendChild(clearDataButton); // Adding the new button
        document.body.appendChild(buttonsContainer);
    }

    createButtons();

    // Получение и вставка значения тегов
    const tagsInput = document.querySelector('input[name="tags"]');
    if (tagsInput) {
        tagsInput.value = tagsValue;
        tagsInput.addEventListener('input', function() {
            tagsValue = tagsInput.value;
            localStorage.setItem(storageTagsKey, tagsValue);
        });

        // Если поле тегов пустое, вставляем ранее запомненное значение
        if (tagsValue === '') {
            tagsInput.value = localStorage.getItem(storageTagsKey) || '';
        }
    }
})();