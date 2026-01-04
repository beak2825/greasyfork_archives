// ==UserScript==
// @name         Button on Kinopoisk AutoRedirection to Flicksbar
// @namespace    https://t.me/flicksbar
// @version      1.6.30
// @description  Дает возможность быстро перейти на зеркало Flicksbar, появляется слева сверху кнопка перехода на сайт Flicksbar, работает только на www.kinopoisk.ru
// @author       Vladimir0202, Devitp001
// @match        https://www.kinopoisk.ru/series/*
// @match        https://www.kinopoisk.ru/film/*
// @icon         https://www.kinopoisk.ru/favicon.ico
// @icon64       https://www.kinopoisk.ru/favicon.ico
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499314/Button%20on%20Kinopoisk%20AutoRedirection%20to%20Flicksbar.user.js
// @updateURL https://update.greasyfork.org/scripts/499314/Button%20on%20Kinopoisk%20AutoRedirection%20to%20Flicksbar.meta.js
// ==/UserScript==


// Функция для проверки URL и скрытия кнопки при несоответствии условиям
function checkUrlAndToggleButton() {
    const currentUrl = window.location.href;

    // Проверяем, содержится ли в текущем URL подстрока '/name/'
    if (currentUrl.includes('/name/') || currentUrl.includes('/cast/')) {
        console.log('Скрипт не выполняется на этой странице:', currentUrl);
        // Если на странице /name/ или /cast/, то скрываем кнопку
        document.getElementById('myContainer').style.display = 'none';
    } else {
        // Если условия выполняются (страница film или series), показываем кнопку
        document.getElementById('myContainer').style.display = 'block';
    }
}

// Дожидаемся полной загрузки страницы
window.addEventListener('load', function() {
    //const redirectURLaddress = 'https://flicksbar.mom';
    const redirectURLaddress = 'https://flcksbr.top';

    function CreateButtonFlicksBar() {
        const container = document.createElement('div');
        container.id = 'myContainer';

        const button = document.createElement('button');
        button.id = 'myButton';
        button.type = 'button';
        button.textContent = 'Смотреть онлайн на Flicksbar!';

        container.appendChild(button);
        document.body.appendChild(container);

        GM_addStyle(`
        #myContainer {
            position: fixed;
            top: 10px;
            left: 0;
            z-index: 222;
            margin: 5px;
            padding: 7px 22px;
            border-radius: 50px;
            font-size: 20px;
            background: linear-gradient(to right, #4E5FF6, #FC5956);
            cursor: pointer;
            transition: transform 0.2s ease;
            overflow: hidden;
        }
        #myButton {
            border: none;
            background: transparent;
            color: white;
            font-weight: bold;
            text-shadow: 0 0 0 black, 0 0 0 red;
            cursor: pointer;
            position: relative;
            z-index: 1;
            outline: none;
            transition: box-shadow 0.2s ease;
        }
        #myButton::after {
            content: '';
            position: absolute;
            top: 50%;
            left: -10px;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;
            border-left: 12px solid white;
            z-index: 0;
        }
        #myContainer:hover {
            transform: scale(1.02);
        }
    `);

        button.addEventListener("click", ButtonClickAction, false);
    }


    function ButtonClickAction(zEvent) {
        const title = document.title.replace(/ — Кинопоиск/g, '').replace(/ — смотреть онлайн/g, '');
        const flicksbarParseURL = `${redirectURLaddress}${document.location.pathname}?t=${title}`;
        window.open(flicksbarParseURL, '_blank');
    }

    // Проверяем URL и создаём кнопку
    if (window.location.href.includes('https://www.kinopoisk.ru/series/') || window.location.href.includes('https://www.kinopoisk.ru/film/')) {
        console.log('Текущий URL соответствует film или series:', window.location.href);
        CreateButtonFlicksBar();
    } else {
        console.log('Неверный формат ссылки или URL:', window.location.href);
    }

    // Создаём MutationObserver для отслеживания изменений в DOM
    const observer = new MutationObserver(function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                console.log('Произошло изменение в DOM:', mutation);
                // Проверяем URL после каждого изменения в DOM
                checkUrlAndToggleButton();
            }
        }
    });

    // Настраиваем MutationObserver на отслеживание изменений в основном контейнере страницы (body)
    observer.observe(document.body, { childList: true, subtree: true });

    // Вызываем проверку URL сразу после загрузки страницы
    checkUrlAndToggleButton();
});
