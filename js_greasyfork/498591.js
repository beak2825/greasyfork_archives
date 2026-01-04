// ==UserScript==
// @name         Рейтинг Кинориума на HDRezka
// @namespace    http://tampermonkey.net/
// @version      5.7.9
// @description  Добавляет кнопку рядом с рейтингом IMDB и Кинопоиск на сайте HDrezka, где показывает рейтинг с Кинориума. При клике можно быстро перейти на страницу фильма на Кинориуме
// @author       CgPT & Vladimir0202
// @license      MIT
// @include      /^https?:\/\/.*rezk.*\/.*$/
// @icon         https://en.kinorium.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498591/%D0%A0%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3%20%D0%9A%D0%B8%D0%BD%D0%BE%D1%80%D0%B8%D1%83%D0%BC%D0%B0%20%D0%BD%D0%B0%20HDRezka.user.js
// @updateURL https://update.greasyfork.org/scripts/498591/%D0%A0%D0%B5%D0%B9%D1%82%D0%B8%D0%BD%D0%B3%20%D0%9A%D0%B8%D0%BD%D0%BE%D1%80%D0%B8%D1%83%D0%BC%D0%B0%20%D0%BD%D0%B0%20HDRezka.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Получаем текущий URL
    const currentUrl = window.location.href;

    // Проверяем, содержится ли в текущем URL подстрока '/person/'
    if (currentUrl.includes('/person/')) {
        console.log('Скрипт не выполняется на этой странице:', currentUrl);
        return; // Прекращаем выполнение скрипта
    }

    // Функция для создания кнопки с рейтингом
    function createRatingButton(ratingText, movieUrl) {
        let button = document.createElement('button');
        button.className = 'kinorium-rating-button';
        button.style.width = 'auto';
        button.style.height = 'auto';
        button.style.padding = '5px 10px';
        button.style.background = getButtonColor(ratingText);
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.display = 'inline-block';
        button.style.verticalAlign = 'middle';
        button.style.marginLeft = '10px';
        button.style.fontWeight = 'bold';
        button.style.transition = 'transform 0.25s ease-in-out';
        button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)'
        button.textContent = `Кинориум: ${ratingText}`;
        button.title = 'Перейти на Kinorium!'; // Подсказка (тултип) для кнопки

        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.02)';
            button.style.textDecoration = 'underline';
            button.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
            button.style.textDecoration = 'none';
            button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)'
        });

        button.addEventListener('click', () => {
            window.open(movieUrl, '_blank');
        });

        return button;
    }

    // Функция для получения цвета кнопки в зависимости от рейтинга
    function getButtonColor(ratingText) {
        const rating = parseFloat(ratingText);
        if (!isNaN(rating)) {
            if (rating >= 7) {
                return 'linear-gradient(to right, #97C321, #4CAF50)';
            } else if (rating >= 5 && rating < 7) {
                return 'linear-gradient(to right, #FF9D35, #FF6347)';
            } else {
                return 'linear-gradient(to right, #FF7A15, #FF0600)';
            }
        } else {
            return 'gray'; // Если нет данных
        }
    }

    function extractYearFromURL() {
        // Получение текущего URL страницы
        const currentURL = window.location.href;

        // Поиск года в формате 4 цифр перед суффиксом .html
        const yearMatch = currentURL.match(/-(\d{4})\.html$/);

        if (yearMatch) {
            // Извлечение года из первой группы захвата регулярного выражения
            const year = yearMatch[1];
            console.log('Год выпуска:', year);
            return year;
        } else {
            console.log('Год не найден в URL. Ищем в классе b-post__info...');

            // Поиск элементов с классом b-post__info
            const infoElements = document.querySelectorAll('.b-post__info a');

            // Перебор найденных элементов
            for (let element of infoElements) {
                // Поиск года в href атрибуте
                const href = element.getAttribute('href');
                const yearInLink = href.match(/\/year\/(\d{4})\//);

                if (yearInLink) {
                    const year = yearInLink[1];
                    console.log('Год выпуска найден в классе b-post__info:', year);
                    return year;
                }
            }

            console.log('Год не найден ни в URL, ни в классе b-post__info.');
            return '';
        }
    }

    // Функция для формирования ссылки для поиска
    function KinoriumLink() {
        let filmTitle = ''; // Объявляем переменную для хранения названия фильма
        const hdRezkaYearFilm = extractYearFromURL();
        const filmTitleElement = document.querySelector('.b-post__title');
        if (filmTitleElement) {
            filmTitle = filmTitleElement.textContent.trim().replace(/\//g, ''); // Убираем все слэши из названия
            console.log('Название фильма (без слэшей):', filmTitle);
        } else {
            console.log('Элемент .b-post__title не найден.');
        }

        let originalTitleText = ''; // Объявляем переменную для хранения оригинального названия фильма
        const OriginalTitleElements = document.querySelector('.b-post__origtitle');

        if (OriginalTitleElements) {
            originalTitleText = OriginalTitleElements.textContent.trim().replace(/\//g, ''); // Убираем все слэши из названия
            console.log('Оригинальное название фильма (без слэшей):', originalTitleText);
        } else {
            console.log('Элемент .b-post__origtitle не найден.');
        }

        const primarySearchUrl = `http://kinorium.com/search/?q=${encodeURIComponent(filmTitle + ' ' + originalTitleText + ' ' + hdRezkaYearFilm)}`;
        const secondarySearchUrl = `http://kinorium.com/search/?q=${encodeURIComponent(originalTitleText + ' ' + hdRezkaYearFilm)}`;

        console.log('Основная ссылка для поиска:', primarySearchUrl);
        console.log('Альтернативная ссылка для поиска:', secondarySearchUrl);

        return {
            primarySearchUrl: primarySearchUrl,
            secondarySearchUrl: secondarySearchUrl
        };
    }

    // Функция для поиска фильма на Кинориуме
    function searchMovieOnKinorium() {
        const kinoriumSearchUrls = KinoriumLink();
        const primarySearchUrl = kinoriumSearchUrls.primarySearchUrl;
        const secondarySearchUrl = kinoriumSearchUrls.secondarySearchUrl;
        let attempt = 0; // Переменная для отслеживания попыток

        //console.log('URL для основного поиска:', primarySearchUrl);
        //console.log('URL для альтернативного поиска:', secondarySearchUrl);

        // Функция для отправки запроса по URL
        function sendRequest(url) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    console.log('Ответ получен');
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    // Проверяем наличие списка результатов поиска
                    const movieList = doc.querySelector('.list.movieList') || doc.querySelector('.filmList');
                    if (movieList) {

                        // Если есть список результатов, выбираем первый элемент
                        const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
                        console.log(isMobile ? 'Мобильное устройство' : 'Десктоп (ПК)');
                        //const firstResultLink = isMobile
                        //? doc.querySelector('.filmList .filmList__item_first a[href^="/"]')
                        //: doc.querySelector('.list.movieList .item .search-page__item-title.link-info-movie a[href^="/"]');

                        const firstResultLink = doc.querySelector('.list.movieList .item .search-page__item-title.link-info-movie a[href^="/"]')
                        || doc.querySelector('.filmList .filmList__item_first a[href^="/"]');

                        console.log('Первый найденный элемент:', firstResultLink);
                        if (firstResultLink) {
                            const movieUrl = `https://www.kinorium.com${firstResultLink.getAttribute('href')}`;
                            console.log('URL фильма на Кинориуме:', movieUrl);
                            fetchRatingFromKinorium(movieUrl); // Вызываем функцию для получения рейтинга
                            return; // Прекращаем выполнение функции после получения рейтинга
                        } else {
                            console.log('Ошибка при поиске на Кинориуме, пробуем второй URL');
                            if (attempt === 0) {
                                attempt++;
                                sendRequest(secondarySearchUrl);
                            } else {
                                addRatingButton('н/д', url); // Показываем кнопку "Нет данных"
                            }
                        }
                    } else {
                        // Если нет списка результатов, отправляем запрос на альтернативный URL
                        const movieUrl = response.finalUrl;
                        console.log('URL единственного найденного фильма на Кинориуме:', movieUrl);
                        // sendRequest(secondarySearchUrl);
                        fetchRatingFromKinorium(movieUrl);
                    }
                },
                onerror: function() {
                    console.log('Ошибка при поиске на Кинориуме');
                    addRatingButton('н/д', url); // Показываем кнопку "Нет данных"
                }
            });
        }

        // Отправляем запрос на основной URL
        sendRequest(primarySearchUrl);
    }

    // Функция для получения рейтинга с Кинориума по URL фильма
    function fetchRatingFromKinorium(movieUrl) {
        console.log('Переход на страницу фильма на Кинориуме:', movieUrl);
        GM_xmlhttpRequest({
            method: "GET",
            url: movieUrl,
            onload: function(response) {
                console.log('Ответ страницы фильма на Кинориуме получен');
                const parser = new DOMParser();
               const doc = parser.parseFromString(response.responseText, 'text/html');

                const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
                console.log(isMobile ? 'Мобильное устройство' : 'Десктоп (ПК)');
                //const ratingElement = isMobile
                //? Array.from(doc.querySelectorAll('.ratingsBlock li'))
                //.find(li => li.textContent.includes('Кинориум'))
                //?.querySelector('.value')
                //: doc.querySelector('.film-page__title-rating');

                const ratingElement = doc.querySelector('.film-page__title-rating')
                || doc.querySelector('.filmList .filmList__item_first .rating_kinorium .rating__value')
                || Array.from(doc.querySelectorAll('.ratingsBlock li'))
                .find(li => li.textContent.includes('Кинориум'))
                ?.querySelector('.value');

                if (ratingElement) {
                    const rating = ratingElement.textContent.trim();
                    addRatingButton(rating, movieUrl);
                } else {
                    addRatingButton('н/д', movieUrl);
                }
            },
            onerror: function() {
                console.log('Ошибка при загрузке страницы фильма на Кинориуме');
                addRatingButton('н/д', movieUrl);

            }
        });
    }

    // Функция для добавления кнопки с рейтингом
    function addRatingButton(ratingText, movieUrl) {
        const infoRates = document.querySelector('.b-post__info_rates');
        const infoSection = document.querySelector('.b-post__info');

        if (infoRates) {
            // Проверяем, существует ли уже кнопка с рейтингом для этого фильма
            if (!infoRates.querySelector('.kinorium-rating-button')) {
                const button = createRatingButton(ratingText, movieUrl);
                infoRates.appendChild(button);
            }
        } else if (infoSection) {
            // Если .b-post__info_rates не найден, добавляем кнопку над .b-post__info
            if (!document.querySelector('.kinorium-rating-button')) {
                const button = createRatingButton(ratingText, movieUrl);
                const strongNode = document.createElement('strong');
                strongNode.textContent = 'Рейтинги: ';
                const wrapper = document.createElement('div');
                button.style.marginLeft = '55px';
                wrapper.style.textAlign = 'left';
                wrapper.appendChild(strongNode);
                wrapper.appendChild(button);
                infoSection.insertAdjacentElement('beforebegin', wrapper);
            }
        } else {
            console.log('Элемент .b-post__info или .b-post__info_rates не найден.');
        }
    }


    // Основная логика: получаем название фильма и ищем его рейтинг на Кинориуме
    const filmTitleElement = document.querySelector('.b-post__title');
    if (filmTitleElement) {
        const filmTitle = filmTitleElement.textContent.trim();
        console.log('Название фильма:', filmTitle);
        searchMovieOnKinorium(filmTitle);
    } else {
        console.log('Элемент .b-post__title не найден.');
    }

})();
