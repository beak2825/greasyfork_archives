// ==UserScript==
// @name            Untappd Price Sorter
// @name:ru         Untappd Price Sorter - Сортировка по цене
// @namespace       http://tampermonkey.net/
// @description     Adds price sorting functionality to Untappd with full filter support
// @description:ru  Добавляет сортировку по цене на сайте Untappd с полной поддержкой фильтров
// @version         1.1
// @author          Levi Somerset
// @match           https://untappd.com/v/*
// @match           https://untappd.com/venue/*
// @grant           none
// @run-at          document-end
// @license         MIT
// @icon            https://untappd.com/assets/favicon-32x32-v2.png
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/535164/Untappd%20Price%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/535164/Untappd%20Price%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Определение языка интерфейса
    function detectLanguage() {
        // Простой способ определить язык по тексту в интерфейсе
        const menuText = $('.menu-sorting li').first().text().trim();
        return menuText.match(/[а-яА-Я]/) ? 'ru' : 'en';
    }

    // Локализованные строки
    const texts = {
        en: {
            lowToHigh: 'By Price (Low to High)',
            highToLow: 'By Price (High to Low)'
        },
        ru: {
            lowToHigh: 'По цене (от низкой к высокой)',
            highToLow: 'По цене (от высокой к низкой)'
        }
    };

    // Переменные для хранения состояния сортировки
    let priceSort = {
        active: false,
        ascending: true
    };

    // Ждем загрузки страницы и jQuery
    function waitForElements() {
        if (typeof $ !== 'undefined' && $('.menu-sorting').length > 0) {
            initPriceSorting();
        } else {
            setTimeout(waitForElements, 500);
        }
    }

    // Функция извлечения цены из элемента меню
    function extractPrice(item) {
        const priceText = $(item).find('.price').first().text().trim();
        if (!priceText) return Number.MAX_VALUE;

        const match = priceText.match(/(\d+[\.,]?\d*)/);
        if (match && match[1]) {
            return parseFloat(match[1].replace(',', '.'));
        }
        return Number.MAX_VALUE;
    }

    // Функция для получения уникального идентификатора элемента
    function getItemIdentifier(item) {
        const beerName = $(item).find('.beer-details h5 a').first().text().trim();
        const brewery = $(item).find('.beer-details h6 a').first().text().trim();
        const size = $(item).find('.size').first().text().trim();
        return `${beerName}_${brewery}_${size}`;
    }

    // Модификация функции отправки запроса
    function patchSendRequest() {
        // Сохраняем оригинальные функции
        const originalSendRequest = window._sendRequest;
        const originalSendPaginatedRequest = window._sendPaginatedRequest;

        // Переопределяем функцию отправки запроса
        window._sendRequest = function(url, type) {
            originalSendRequest.call(this, url, type);

            // Если активна сортировка по цене, применяем её после загрузки данных
            if (priceSort.active) {
                $(document).one('ajaxComplete', function(event, xhr, settings) {
                    if (settings.url.includes('apireqs')) {
                        setTimeout(function() {
                            sortElements();
                        }, 800);
                    }
                });
            }
        };

        // Переопределяем функцию пагинации
        window._sendPaginatedRequest = function(url, type) {
            originalSendPaginatedRequest.call(this, url, type);

            // Если активна сортировка по цене, сортируем новые элементы
            if (priceSort.active) {
                $(document).one('ajaxComplete', function(event, xhr, settings) {
                    if (settings.url.includes('apireqs')) {
                        setTimeout(function() {
                            sortElements();
                        }, 800);
                    }
                });
            }
        };
    }

    // Основная функция сортировки элементов
    function sortElements() {
        // Проверяем режим отображения
        if ($('.sort-filter-results').is(':visible')) {
            // Режим фильтрации - здесь все элементы в одном контейнере
            const container = $('.sort-filter-results');
            const listContainer = container.find('ul.menu-section-list');

            if (listContainer.length > 0) {
                // Сортировка элементов внутри списка
                const items = listContainer.children('li.sorting-item').toArray();
                if (items.length > 0) {
                    sortAndReplace(items, listContainer);
                }
            } else {
                // Если нет списка, обрабатываем элементы непосредственно в контейнере
                const items = container.children('li.sorting-item').toArray();
                if (items.length > 0) {
                    sortAndReplace(items, container);
                }
            }
        } else {
            // Стандартный режим - множество секций с отдельными списками
            $('.menu-section').each(function() {
                const section = $(this);
                const sectionList = section.find('ul.menu-section-list');

                if (sectionList.length > 0) {
                    const items = sectionList.children('li.menu-item').toArray();
                    if (items.length > 0) {
                        sortAndReplace(items, sectionList);
                    }
                }
            });
        }
    }

    // Функция сортировки элементов и их замены в контейнере
    function sortAndReplace(items, container) {
        // Запоминаем положение прокрутки
        const scrollPosition = $(window).scrollTop();

        // Сортируем элементы по цене
        items.sort(function(a, b) {
            const priceA = extractPrice(a);
            const priceB = extractPrice(b);
            return priceSort.ascending ? priceA - priceB : priceB - priceA;
        });

        // Удаляем дубликаты
        const uniqueItems = [];
        const seenItems = new Set();

        for (const item of items) {
            const identifier = getItemIdentifier(item);
            if (!seenItems.has(identifier)) {
                seenItems.add(identifier);
                uniqueItems.push(item);
            }
        }

        // Очищаем контейнер
        container.empty();

        // Добавляем отсортированные элементы по одному
        for (let i = 0; i < uniqueItems.length; i++) {
            container.append(uniqueItems[i]);
        }

        // Восстанавливаем положение прокрутки
        $(window).scrollTop(scrollPosition);
    }

    // Добавляем опции сортировки по цене и инициализируем функционал
    function initPriceSorting() {
        // Определяем язык
        const lang = detectLanguage();

        // Добавляем новые опции сортировки в меню
        if ($('.sort-items[data-sort-key="price_asc"]').length === 0) {
            $('.menu-sorting').append(
                '<li class="sort-items" data-sort-key="price_asc">' +
                '<span>' + texts[lang].lowToHigh + '</span>' +
                '</li>' +
                '<li class="sort-items" data-sort-key="price_desc">' +
                '<span>' + texts[lang].highToLow + '</span>' +
                '</li>'
            );
        }

        // Модифицируем функции запросов сайта
        patchSendRequest();

        // Проверяем, активна ли уже сортировка по цене
        const currentSort = $('.selected_sort').html().trim();
        if (currentSort === 'price_asc' || currentSort === 'price_desc') {
            priceSort.active = true;
            priceSort.ascending = (currentSort === 'price_asc');

            // Применяем сортировку после полной загрузки страницы
            setTimeout(function() {
                sortElements();
            }, 800);
        }

        // Обработчик для кнопок сортировки
        $(document).off('click', '.menu-sorting li.sort-items').on('click', '.menu-sorting li.sort-items', function(e) {
            const sortKey = $(this).attr('data-sort-key');

            // Обновляем UI
            $('.sort-items span').removeClass('active');
            $(this).find('span').addClass('active');
            $('.selected_sort').html(sortKey);

            // Обновляем состояние сортировки
            priceSort.active = (sortKey === 'price_asc' || sortKey === 'price_desc');
            priceSort.ascending = (sortKey === 'price_asc');

            if (priceSort.active) {
                // Для цены используем клиентскую сортировку, если нет активных фильтров
                if ($('.menu-filter-options').is(':visible') &&
                   ($("#style_picker").val() !== 'all' ||
                    $("#country_picker").val() !== 'all' ||
                    $("#brewery_picker").val() !== 'all' ||
                    $("#hasNotHadBefore").is(':checked') ||
                    $(".search-text").val() !== '')) {
                    // С фильтрами используем стандартный механизм сайта
                    const url = buildUrl();
                    window._sendRequest(url, "menu");
                } else {
                    // Для стандартного режима без фильтров - сортируем сразу
                    setTimeout(function() {
                        sortElements();
                    }, 300);
                }
            } else {
                // Для других типов сортировки используем стандартный механизм
                const url = buildUrl();
                window._sendRequest(url, "menu");
            }
        });

        // Обработчик для кнопки "Show More"
        $('.more-list-items').off('click.pricesorter').on('click.pricesorter', function() {
            if (!priceSort.active) return;

            // Отслеживаем загрузку новых элементов
            $(document).one('ajaxComplete', function() {
                setTimeout(function() {
                    sortElements();
                }, 800);
            });
        });

        console.log('Untappd Price Sorter v4.2: Сортировка по цене успешно добавлена!');
    }

    // Запускаем инициализацию
    waitForElements();
})();