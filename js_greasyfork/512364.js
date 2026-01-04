// ==UserScript==
// @name         Yandex Wikipedia Info
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Добавляет дополнительную информацию из Wikipedia в боковую панель поиска Yandex.
// @author       zzakhar
// @match        *://yandex.ru/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @connect      ru.wikipedia.org
// @license      CC BY-NC-ND
// @downloadURL https://update.greasyfork.org/scripts/512364/Yandex%20Wikipedia%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/512364/Yandex%20Wikipedia%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastQuery = '';

    function sendWikipediaApiRequest(query, callback) {
        const apiUrl = `https://ru.wikipedia.org/w/api.php?action=opensearch&format=json&formatversion=2&search=${encodeURIComponent(query)}&namespace=0&limit=1&origin=*`;
        console.log('Отправляю запрос через API Wikipedia:', apiUrl);

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    if (data[1].length > 0) {
                        const articleUrl = data[3][0]; // Берем первую ссылку
                        callback(null, articleUrl);
                    } else {
                        callback('Ничего не найдено');
                    }
                } else {
                    callback('Ошибка при запросе');
                }
            },
            onerror: function() {
                callback('Ошибка при запросе к Wikipedia API');
            }
        });
    }

    function processWikipediaResponse(articleUrl) {
        const searchResultAside = document.querySelector('#search-result-aside');
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Проверяем, существует ли уже контейнер
        if (document.querySelector("#search-result-aside > div.serp-list.serp-list_right_yes.serp-list_complementary_yes > div")) {
            console.log('Контейнер уже существует, создание нового отменено.');
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: articleUrl,
            onload: function(response) {
                const doc = new DOMParser().parseFromString(response.responseText, 'text/html');

                // Создаем контейнер для результата
                const infoDiv = GM_addElement(searchResultAside, 'div', {
                    role: 'complementary',
                    'aria-label': 'Дополнительная информация по запросу',
                    className: 'serp-list serp-list_right_yes serp-list_complementary_yes',
                    style: `
                        padding: 15px;
                        border-radius: 10px;
                        margin-top: 10px;
                        display: block;
                        max-width: 90%;
                        background-color: ${isDarkMode ? '#0e1011' : '#f9f9f9'};
                        border: 2px solid ${isDarkMode ? '#970e05' : '#007BFF'};
                        color: ${isDarkMode ? 'white' : 'black'};
                    `
                });

                // Заголовок статьи
                GM_addElement(infoDiv, 'h2', {
                    textContent: doc.querySelector('h1').textContent,
                    style: `
                        margin: 0 0 20px;
                        font-size: 18px;
                        font-weight: bold;
                        color: ${isDarkMode ? '#ffcccc' : '#007BFF'};
                    `
                });

                // Логотип инфобокса, если он есть
                const logo = doc.querySelector('.infobox img');
                if (logo) {
                    GM_addElement(infoDiv, 'img', {
                        src: logo.src,
                        alt: doc.querySelector('h1').textContent,
                        style: `
                            max-width: 100px;
                            border-radius: 10px;
                            float: right;
                            margin-left: 10px;
                        `
                    });
                }

                // Основной контент
                const contentElements = doc.querySelectorAll('#mw-content-text p');
                contentElements.forEach((element, index) => {
                    if (index < 3) {
                        GM_addElement(infoDiv, 'p', {
                            textContent: element.textContent,
                            style: `
                                margin-top: 10px;
                                color: ${isDarkMode ? '#e5e5e5' : '#333'};
                            `
                        });
                    }
                });

                // Источник
                GM_addElement(infoDiv, 'p', {
                    textContent: "Источник: Wikipedia",
                    style: `
                        margin-top: 10px;
                        font-size: 12px;
                        text-align: right;
                        color: ${isDarkMode ? '#e5e5e5' : '#333'};
                    `
                });
            },
            onerror: function() {
                console.log('Ошибка при запросе страницы Wikipedia.');
            }
        });
    }

    function handleNoResults(queryText) {
        console.log('Ничего не найдено для:', queryText);

        const words = queryText.split(' ');

        // Проверка одного слова
        if (words.length === 1) {
            sendWikipediaApiRequest(queryText, function(error, articleUrl) {
                if (!error) {
                    processWikipediaResponse(articleUrl);
                }
            });
            return;
        }

        // Проверка запроса без пробелов
        const queryWithoutSpaces = queryText.replace(/\s+/g, '');
        sendWikipediaApiRequest(queryWithoutSpaces, function(error, articleUrl) {
            if (!error) {
                console.log('Нашелся результат:', queryWithoutSpaces);
                processWikipediaResponse(articleUrl);
            } else {
                // Проверка каждого слова отдельно
                for (let i = words.length - 1; i >= 0; i--) {
                    sendWikipediaApiRequest(words[i], function(error, articleUrl) {
                        if (!error) {
                            console.log('Нашелся результат для:', words[i]);
                            processWikipediaResponse(articleUrl);
                            return;
                        }
                        console.log(`Ничего не найдено для: ${words[i]}`);
                    });
                }
            }
        });
    }

    function CreateRightBox() {
        const searchResultAside = document.querySelector('#search-result-aside');
        const queryText = new URLSearchParams(window.location.search).get('text');

        if (queryText && queryText.length < 30 && queryText !== lastQuery) {
            lastQuery = queryText;

            sendWikipediaApiRequest(queryText, function(error, articleUrl) {
                if (!error) {
                    processWikipediaResponse(articleUrl);
                } else {
                    handleNoResults(queryText); // Если ничего не найдено
                }
            });
        }
    }

    function checkAndRun() {
        CreateRightBox();
    }

    function observeUrlChanges() {
        let oldHref = document.location.href;

        const body = document.querySelector("body");
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function() {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    console.log("URL изменен:", oldHref);
                    setTimeout(checkAndRun, 500);
                }
            });
        });

        observer.observe(body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        checkAndRun();
        observeUrlChanges();
    });

})();
