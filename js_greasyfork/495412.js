// ==UserScript==
// @name         Ozon, Wildberries, Simaland и Яндекс.Маркет настройка: сначала плохие отзывы + улучшения интерфейса
// @name:en      Ozon, Wildberries and Simaland customizer: bad reviews first + interface improvements
// @name:ru      Ozon, Wildberries, Simaland и Яндекс.Маркет настройка: сначала плохие отзывы + улучшения интерфейса
// @namespace    http://tampermonkey.net/
// @version      2025-05-11_9-52
// @description  Ozon, Wildberries, Simaland и Яндекс.Маркет: сортировка отзывов по товару по возрастанию рейтинга
// @description:en  Ozon, Wildberries, Simaland and Яндекс.Маркет: sorting reviews by product by ascending rating
// @description:ru  Ozon, Wildberries, Simaland и Яндекс.Маркет: сортировка отзывов по товару по возрастанию рейтинга
// @author       Igor Lebedev
// @license        GPL-3.0-or-later
// @icon         https://raw.githubusercontent.com/LebedevIV/Ozon-Wildberries-Simaland-customizer/main/icons/logo_color.svg
// @match          http://*.ozon.ru/*
// @match          https://*.ozon.ru/*
// @match          http://*.ozon.com/*
// @match          https://*.ozon.com/*
// @match          https://*.ozon.by/*
// @match          http://*.wildberries.ru/*
// @match          https://*.wildberries.ru/*
// @match          https://*.global.wildberries.ru/*
// @match          http://*.sima-land.ru/*
// @match          https://*.sima-land.ru/*
// @match          http://*.market.yandex.ru/*
// @match          https://*.market.yandex.ru/*
// @downloadURL https://update.greasyfork.org/scripts/495412/Ozon%2C%20Wildberries%2C%20Simaland%20%D0%B8%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%D0%9C%D0%B0%D1%80%D0%BA%D0%B5%D1%82%20%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%3A%20%D1%81%D0%BD%D0%B0%D1%87%D0%B0%D0%BB%D0%B0%20%D0%BF%D0%BB%D0%BE%D1%85%D0%B8%D0%B5%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D1%8B%20%2B%20%D1%83%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/495412/Ozon%2C%20Wildberries%2C%20Simaland%20%D0%B8%20%D0%AF%D0%BD%D0%B4%D0%B5%D0%BA%D1%81%D0%9C%D0%B0%D1%80%D0%BA%D0%B5%D1%82%20%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%3A%20%D1%81%D0%BD%D0%B0%D1%87%D0%B0%D0%BB%D0%B0%20%D0%BF%D0%BB%D0%BE%D1%85%D0%B8%D0%B5%20%D0%BE%D1%82%D0%B7%D1%8B%D0%B2%D1%8B%20%2B%20%D1%83%D0%BB%D1%83%D1%87%D1%88%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%D0%B0.meta.js
// ==/UserScript==

/* global GM_config */

(() => {
    'use strict'

    // получаем текущий адрес страницы
    const currentURL = window.location.href
    const config = {
        // advanced: false,
        SettingsOnOff: true,
        isRunningAsExtension: false,
    };
    let api

    // определение среды выполнения скрипта: как пользовательский или в составе расширения
    function isRunningAsExtension() {
        const isChromeExtension = typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.id !== 'undefined';
        const isBrowserExtension = typeof browser !== 'undefined' && browser.runtime && typeof browser.runtime.id !== 'undefined';

        const currentScript = document.currentScript;
        const isInlineScript = currentScript && currentScript.src && currentScript.src.startsWith('chrome-extension://');

        return isChromeExtension || isBrowserExtension || isInlineScript;
    }

    if (isRunningAsExtension()) {
        // console.log('Script is running as a browser extension.');
        config.isRunningAsExtension = true
    } else {
        // console.log('Script is running independently.');
        config.isRunningAsExtension = false
    }

    // опредлеение типа браузера
    function getBrowser() {
        if (typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined") {
            return chrome
        } else if (
            typeof browser !== "undefined" &&
            typeof browser.runtime !== "undefined"
        ) {
            return browser
        }
        else {
            console.log("browser is not supported");
            return false
        }
    }

    if (config.isRunningAsExtension === true) api = getBrowser()


    // Ozon: Функция для добавления к ссылкам на страницах каталогов параметра сортировки рейтинга по возрастанию - на случай если пользователь будет вручную открывать ссылки с карточкой товара в новой вкладке
    // Так же добавление ссылок на отзывы для блоков рейтингов (звёздочек)
    function addOzonSortParamToLinks() {
        if (config.SettingsOnOff) {
            const links = document.querySelectorAll('a[href^="/product/"]:not([href*="&sort=score_asc"])');
            links.forEach(link => {
                link.search = ''
                const linkOrig = link.href
                link.href += '&sort=score_asc';
                // Проверяем, является ли родительский элемент (parentNode) div с классом 'iy6'
                const link_parentNode = link.parentNode
                // Привязка к блоку рейтингов (звёздочек) ссылки на рейтинги
                const nextNode = link.nextElementSibling;

                if (nextNode && nextNode.tagName === 'DIV' && (nextNode.classList.contains('tsBodyMBold') || nextNode.classList.contains('tsCaptionBold'))) {

                    // Определение наличия вложенного элемента, содержащего рейтинги
                    const divStars = link_parentNode.querySelector('div.tsBodyMBold') || link_parentNode.querySelector('div.tsCaptionBold')
                    // + проверка что ссылка уже не была назначена ранее - почему-то происходит двойное срабатывание скрипта
                    if (divStars && divStars.parentNode.nodeName !== 'A') {
                        let url1Base = linkOrig.match(/(^[^\?]+)/g)[0];

                        divStars.addEventListener('click', () => {
                            // Формируем URL
                            const url = `${url1Base}reviews/?sort=score_asc`;
                            // Переходим по ссылке
                            // window.location.href = url;
                            // Открыть в новой вкладке
                            window.open(url, '_blank');
                        });


                        //                         // Создание нового узла <a>
                        //                         let aNode = document.createElement('a');

                        //                         // Установка параметров узла
                        //                         aNode.href = `${url1Base}reviews/?sort=score_asc`;
                        //                         aNode.style.cssText = 'display: flex; width: 100%; height: 100%; cursor: pointer; text-decoration: none;';

                        //                         // Получаем родительский элемент div
                        //                         let parentNode = divStars.parentNode;

                        //                         // Вставляем новый узел перед div1
                        //                         parentNode.insertBefore(aNode, divStars);

                        //                         // Перемещаем узел div внутрь aNode
                        //                         aNode.appendChild(divStars);
                        divStars.style.cursor = 'pointer';

                    }
                }
            });
        }
    }

    // Wildberries: Ожидание загрузки страницы товара до появления элемента сортировки рейтинга и искусственное двойное нажатие этого элемента чтобы добиться сортировки рейтинга по возрастанию
    function sortWildberriesReviews() {
        const interval = setInterval(() => {
            // ожидание загрузки страницы до необходимого значения
            const preloader = document.querySelector('#app > div[data-link="visible{:router.showPreview}"]')
            if (preloader?.style.display === 'none') {
                const sortButton = document.querySelector('a[data-link*="sorterModel.sortingEntries[\'valuationup\']"]')
                if (sortButton) {
                    clearInterval(interval)

                    // Инициируем событие на элементе
                    // Проверяет, содержит ли элемент класс 'sorting__selected'
                    if (sortButton.classList.contains('sorting__selected')) {
                        // Находим элемент <span> внутри найденного <a>
                        let span = sortButton.querySelector('span');
                        // Проверяем, содержит ли <span> класс 'sorting__decor--up'
                        // Если содержит, значит, сортировка по возрастанию уже произведена и никаких действий производить не нужно (всё равно приходится произвести два клика, так как, по-видимому, по мере загрузки происходит последующий сброс настроек) - надо отловить объект, который появляется уже после сброса, и зацепиться за него
                        if (span && span.classList.contains('sorting__decor--up')) {
                            // Первое нажатие производит сортировку по убыванию рейтинга
                            // sortButton.click();
                            // Второе нажатие производит сортировку по возрастанию рейтинга
                            // sortButton.click();
                        } else {
                            // Нажатие производит сортировку по возрастанию рейтинга
                            sortButton.click();
                        }
                    } else {
                        // Первое нажатие производит сортировку по убыванию рейтинга
                        sortButton.click();
                        // Второе нажатие производит сортировку по возрастанию рейтинга
                        sortButton.click();
                    }
                }
            }
        }, 50);
    }

    // Wildberries: Показать блок "Характеристики и описание" и разместить под фото товара()
    function Wildberries__Показать_блок__Характеристики_и_описание__и_разместить_под_фото_товара() {
        // Для Wildberries и WildberriesGlobal
        let popup__content = document.querySelector('div.popup-product-details > div.popup__content') // Всплывающий блок с описанием уже присутствует на загружаемой странице - это маловероятно
        let product_params__table = document.querySelector('div.popup__content > div.product-details > div.product-params > table.product-params__table')
        let factClick_button_product_page__btn_detail = false // факт программного нажатия button_product_page__btn_detail
        let button_product_page__btn_detail // кнопка вызова блока Характеристикаи и описание

        if (product_params__table) { // Всплывающий блок присутствует на загружаемой странице - это маловероятно
            popup_product_details_Replace()
        }
        else { // Всплывающий блок отсутствует
            // Создаем новый экземпляр MutationObserver
            const observer = new MutationObserver((mutationsList, observer) => {
                // Проходимся по списку изменений
                for (let mutation of mutationsList) {
                    // Проверяем, добавлены ли новые узлы
                    if (mutation.type === 'childList') {
                        // Проходимся по списку добавленных узлов
                        for (let node of mutation.addedNodes) {
                            if (node.nodeType === 1) {
                                // Проверяем, является ли узел элементом <div> с классом popup-product-details
                                if (!button_product_page__btn_detail &&
                                    node.matches('button.product-page__btn-detail')) {
                                    button_product_page__btn_detail = node // произошёл вывод кнокпи вызова всплывающего блока Характеристики и описания
                                    button_product_page__btn_detail_click()
                                }
                                // Программное нажатие button_product_page__btn_detail: Последующий вызов всплывающего блока с заполненными Характеристики и описания
                                else if (factClick_button_product_page__btn_detail &&
                                         node.matches('div.popup-product-details')) {
                                    // Выведен полноценный заполненный блок
                                    if (node.querySelector('div.popup__content > div.product-details > div.product-params > table.product-params__table')) {
                                        // Прерываем наблюдение
                                        observer.disconnect()
                                        popup__content = node.querySelector('div.popup__content')
                                        popup_product_details_Replace()
                                        break
                                    }
                                    // Блок ещё не заполнен: такое происходит при навигации по сайту и открытию карточек товара
                                    else {
                                        node.remove()
                                        factClick_button_product_page__btn_detail = false
                                        setTimeout(function() {
                                            button_product_page__btn_detail_click()
                                        }, 1000);

                                    }

                                }
                            }
                        }
                    }
                }
            });

            // Начинаем наблюдение за изменениями внутри элемента <body>
            observer.observe(document.body, { childList: true })
            button_product_page__btn_detail_click()

        }

        // Программное нажатие кнопки вызов всплывающего блока Характеристик и описания
        function button_product_page__btn_detail_click() {
            if (!button_product_page__btn_detail) // Если не успело определиться в обсервере
                button_product_page__btn_detail = document.querySelector('#app button.product-page__btn-detail') // Кнокпа вызова всплывающего блока Характеристики и описания
            if (button_product_page__btn_detail && !factClick_button_product_page__btn_detail) { // Если в обсервере не произошёл факт нажатия
                factClick_button_product_page__btn_detail = true
                button_product_page__btn_detail.click() // вызов всплывающего блока Характеристик и описания
            }
        }
        // Перенос Характеристик и описания из вызываемого всплывающего блока под блок товара
        function popup_product_details_Replace() {
            if (factClick_button_product_page__btn_detail) // при програмном нажатии
                popup__content.parentNode.remove() // удаление вызванного всплывающего блока
            // Wildberries и WildberriesGlobal
            const product_page__grid = document.querySelector('div.product-page__grid')
            if (product_page__grid) {
                product_page__grid.parentNode.querySelectorAll('div.popup__content').forEach(function(element) { // удаление всех ранее внедрённых блоков popup__content, которые сохраняются на страинце при навигации
                    element.remove();
                });
            }
            if (popup__content && product_page__grid) {
                popup__content?.querySelector('div.popup__footer')?.remove() // Удаление лишней информации и элементов из подваала вспывающего блока
                product_page__grid.insertAdjacentElement('afterend', popup__content)
            }
            document.body.classList.remove('body--overflow') // при выводе всплывающего блока добавляется вредный класс body--overflow, скрывающий полосы прокрутки, и при программном закрытии всплывающего блока класс body--overflow не удаляется.
        }
    }
    // TODO:    // Wildberries Global: Показать блок "Характеристики и описание" и разместить под фото товара()
    function WildberriesGlobal__Показать_блок__Характеристики_и_описание__и_разместить_под_фото_товара() {
        // Для Wildberries и WildberriesGlobal
        let popup__content = document.querySelector('div.drawer-wrapper') // Всплывающий блок с описанием уже присутствует на загружаемой странице - это маловероятно
        let product_params__table = document.querySelector('div.full-details__list div.full-details-info')
        let factClick_button_product_page__btn_detail = false // факт программного нажатия button_product_page__btn_detail
        let button_product_page__btn_detail // кнопка вызова блока Характеристикаи и описание

        if (product_params__table) { // Всплывающий блок присутствует на загружаемой странице - это маловероятно
            popup_product_details_Replace()
        }
        else { // Всплывающий блок отсутствует
            // Создаем новый экземпляр MutationObserver
            const observer = new MutationObserver((mutationsList, observer) => {
                // Проходимся по списку изменений
                for (let mutation of mutationsList) {
                    // Проверяем, добавлены ли новые узлы
                    if (mutation.type === 'childList') {
                        // Проходимся по списку добавленных узлов
                        for (let node of mutation.addedNodes) {
                            if (node.nodeType === 1) {
                                // Проверяем, является ли узел элементом <div> с классом popup-product-details
                                if (!button_product_page__btn_detail &&
                                    node.matches('button.product-page__btn-detail')) {
                                    button_product_page__btn_detail = node // произошёл вывод кнокпи вызова всплывающего блока Характеристики и описания
                                    button_product_page__btn_detail_click()
                                }
                                // Программное нажатие button_product_page__btn_detail: Последующий вызов всплывающего блока с заполненными Характеристики и описания
                                else if (factClick_button_product_page__btn_detail &&
                                         node.matches('div.popup-product-details')) {
                                    // Выведен полноценный заполненный блок
                                    if (node.querySelector('div.popup__content > div.product-details > div.product-params > table.product-params__table')) {
                                        // Прерываем наблюдение
                                        observer.disconnect()
                                        popup__content = node.querySelector('div.popup__content')
                                        popup_product_details_Replace()
                                        break
                                    }
                                    // Блок ещё не заполнен: такое происходит при навигации по сайту и открытию карточек товара
                                    else {
                                        node.remove()
                                        factClick_button_product_page__btn_detail = false
                                        setTimeout(function() {
                                            button_product_page__btn_detail_click()
                                        }, 1000);

                                    }

                                }
                            }
                        }
                    }
                }
            });

            // Начинаем наблюдение за изменениями внутри элемента <body>
            observer.observe(document.body, { childList: true })
            button_product_page__btn_detail_click()

        }

        // Программное нажатие кнопки вызов всплывающего блока Характеристик и описания
        function button_product_page__btn_detail_click() {
            if (!button_product_page__btn_detail) // Если не успело определиться в обсервере
                button_product_page__btn_detail = document.querySelector('#app button.product-page__btn-detail') // Кнокпа вызова всплывающего блока Характеристики и описания
            if (button_product_page__btn_detail && !factClick_button_product_page__btn_detail) { // Если в обсервере не произошёл факт нажатия
                factClick_button_product_page__btn_detail = true
                button_product_page__btn_detail.click() // вызов всплывающего блока Характеристик и описания
            }
        }
        // Перенос Характеристик и описания из вызываемого всплывающего блока под блок товара
        function popup_product_details_Replace() {
            if (factClick_button_product_page__btn_detail) // при програмном нажатии
                popup__content.parentNode.remove() // удаление вызванного всплывающего блока
            // Wildberries и WildberriesGlobal
            const product_page__grid = document.querySelector('div.product-main')
            if (product_page__grid) {
                product_page__grid.parentNode.querySelectorAll('div.drawer-wrapper').forEach(function(element) { // удаление всех ранее внедрённых блоков popup__content, которые сохраняются на страинце при навигации
                    element.remove();
                });
            }
            if (popup__content && product_page__grid) {
                popup__content?.querySelector('div.drawer__button')?.remove() // Удаление лишней информации и элементов из подваала вспывающего блока
                product_page__grid.insertAdjacentElement('afterend', popup__content)
            }
            document.body.classList.remove('body--overflow') // при выводе всплывающего блока добавляется вредный класс body--overflow, скрывающий полосы прокрутки, и при программном закрытии всплывающего блока класс body--overflow не удаляется.
        }
    }

    // Wildberries: каталог: добавление ссылок для блоков рейтингов (звёздочек)
    function addWildberriesSortParamToLinks() {
        if (config.SettingsOnOff) {

            // Функция для выполнения действий с новыми элементами
            function handleNewElement(element) {

                const interval_main_page__content = setInterval(() => {
                    // проверка загрузки блока с визитками товаров
                    const main_page__content = document.querySelector('div.main-page__content');
                    if (main_page__content) {
                        clearInterval(interval_main_page__content)
                        const rating_wraps = document.querySelectorAll('p.product-card__rating-wrap');
                        rating_wraps.forEach(rating_wrap => {
                            // ссылка на карточку товара
                            const outerLink = rating_wrap.parentNode.parentNode.querySelector('a')
                            // получение ссылки на отзывы
                            const linkReviews = outerLink.href.replace('/detail.aspx', '/feedbacks')


                            const rating_wrap_parentNode = rating_wrap.parentNode
                            // Привязка к блоку рейтингов (звёздочек) ссылки на рейтинги
                            if(rating_wrap_parentNode.tagName.toLowerCase() === 'div') {


                                // Создание нового узла <a>
                                let aNode = document.createElement('a');

                                // Установка параметров узла
                                aNode.href = linkReviews
                                aNode.style.cssText = 'display: flex; width: 100%; height: 100%; cursor: pointer; text-decoration: none; z-index: 4;'; // z-index: 4 - должен быть больше чем z-index у внешней ссылки для всей визитки (z-index: 3)

                                // Вставляем новый узел aNode перед rating_wrap
                                rating_wrap_parentNode.insertBefore(aNode, rating_wrap);

                                // Перемещаем узел rating_wrap внутрь aNode
                                aNode.appendChild(rating_wrap);

                                rating_wrap.style.cursor = 'pointer';

                            }
                        });
                    }
                });
            }

            // Настройка MutationObserver
            const observer = new MutationObserver((mutationsList) => {
                outerLoop: for (let mutation of mutationsList) {
                    // изменения всего блока визиток товаров
                    if (mutation.type === 'childList' && mutation.target.className === 'main-page__content-wrapper') {
                        // муткация где происходит вставка сразу всех нод - можно сразу выходит из цикла
                        for (let node of mutation.addedNodes) {
                            // if (node.nodeType === Node.ELEMENT_NODE && node.matches('p.product-card__rating-wrap')) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                handleNewElement(node);
                                break outerLoop;
                            }
                        }
                    }
                }
            });

            // Указываем, за какими изменениями наблюдать
            observer.observe(document.body, {
                childList: true,       // Наблюдаем за добавлением/удалением детей
                subtree: true         // Также отслеживаем все поддеревья
            });

        }
    }
    function WildberriesGlobal__Сортировка_отзывов_по_возрастанию() {
        if (!window.location.pathname.includes('&sort=valueup')) {
            const кнопкаРейтинг = document.querySelector('button.switcher__item.has-alternate')
            if (кнопкаРейтинг) {
                кнопкаРейтинг.click()
            }
            else {
                const callback = function (mutationsList, observer) {
                    for (const mutation of mutationsList) {
                        // Проверяем, были ли добавлены новые узлы
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    if (node.matches('button.switcher__item.has-alternate') && !node.matches('button.is-active')) {
                                        node.click()
                                        observer.disconnect()
                                    } else {
                                        // Проверяем вложенные элементы
                                        const switcherItem = node.querySelector('button.switcher__item.has-alternate');
                                        if (switcherItem) {
                                            if (!switcherItem.matches('button.is-active')) {
                                                switcherItem.click()
                                                // После нахождения элемента можно остановить наблюдение
                                                observer.disconnect()
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                };

                // Создаем экземпляр MutationObserver
                const observer = new MutationObserver(callback);

                // Начинаем наблюдение за изменениями в DOM
                observer.observe(document.body, {
                    childList: true, // Отслеживать добавление/удаление дочерних элементов
                    subtree: true,   // Отслеживать изменения во всем поддереве
                });
            }
        }
    }

    // Simaland: Ожидание фрейма с отзывами и его обработка
    function clickLinkReviews() {
        const interval2 = setInterval(() => {
            // отключаем динамический выезд (пока не получается)
            // const frameWithReviews = document.querySelector("#product__root > div > div.Fa76rh > div.iOZqnu > div:nth-child(2) > div > div.dfZ2S8")
            // if (frameWithReviews) {
            // frameWithReviews.style.transition = 'transform 0s';
            // }
            // ожидание дозагрузки страницы до появления ссылки открытия списка сортировки
            // const divGpksVe = document.querySelector("#product__root > div > div.Fa76rh > div.iOZqnu > div:nth-child(2) > div.GpksVe")
            // if (divGpksVe)
            // divGpksVe.style.setProperty("--transition-duration", "0ms");
            const sortButton =
                  document.querySelector('a[role="button"][data-testid="sort"]') ||
                  document.querySelector("button.vuz3sk");
            if (sortButton) {
                clearInterval(interval2);

                if (config.SettingsOnOff) {
                    // проверка что список ещё не раскрыт (Сайт Сималенд этот список может раскрывать заранее)
                    const sortButtonSortingPoint =
                          document.querySelector('div[data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYHidden"] > div:nth-child(4)')
                    document.querySelector('div[data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYHidden"] > div > div > button:nth-child(4)');
                    if (sortButtonSortingPoint) {
                        sortButtonSortingPoint.click();
                    } else {
                        const programmaticClickEvent = new CustomEvent('customClick', { detail: { isProgrammatic: true } });
                        sortButton?.addEventListener('customClick', (event) => {
                            if (event.detail && event.detail.isProgrammatic) {
                                sortButton.click();
                                const interval3 = setInterval(() => {
                                    // ожидание дозагрузки страницы до раскрытия списка сортировки ипоявления пункта сортировки по возрастанию рейтинга
                                    // const sortButtonSortingPoint =
                                    //       document.querySelector('div[data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYHidden"] > div:nth-child(4)') ||
                                    //       document.querySelector('div[data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYHidden"] > div > div > button:nth-child(4)');
                                    // if (sortButtonSortingPoint) {
                                    const sortButtonSorting =
                                          document.querySelector('div[data-overlayscrollbars-viewport="scrollbarHidden overflowXHidden overflowYHidden"]') ;
                                    if (sortButtonSorting) {
                                        // Ищем все div внутри родителя и фильтруем по тексту
                                        const sortButtonSortingPoint = Array.from(sortButtonSorting.querySelectorAll('div'))
                                        .find(div => div.textContent.includes('Сначала с низкой оценкой'));

                                        if (sortButtonSortingPoint) {
                                            // Действия с sortButtonSortingPoint
                                            clearInterval(interval3);
                                            if (config.SettingsOnOff) {
                                                sortButtonSortingPoint.click();
                                            }
                                        }
                                    }
                                }, 50);
                            } else {
                                // console.log('Button was clicked manually.');
                            }

                        });
                        sortButton.dispatchEvent(programmaticClickEvent);
                    }
                }
            }
        }, 50);
    }

    // Simaland: Ожидание загрузки страницы товара до появления элемента сортировки рейтинга и искусственное нажатие этого элемента чтобы добиться сортировки рейтинга по возрастанию
    function sortSimaLandReviews() {

        // Ожидание появления интересующего элемента
        function waitForElement(parentSelector, targetSelector, targetAttributeName, targetAttributeValue, callback) {
            let parent = document.querySelector(parentSelector);

            if (!parent) {
                parent = document.body
            }

            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        const addedNodes = mutation.addedNodes;
                        addedNodes.forEach((node) => {
                            // if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute('data-testid') === 'app-wrapper') {
                            if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute(targetAttributeName) === targetAttributeValue) {
                                callback(node);
                                return;
                            }
                        });


                    }
                }
            });

            // Начинаем наблюдение за изменениями в DOM
            observer.observe(parent, {
                childList: true, // Наблюдаем за добавлением/удалением дочерних элементов
                subtree: true    // Наблюдаем за всеми элементами в поддереве
            });
        }

        // Проверяем, может быть элемент уже есть на странице
        const appWrapper = document.querySelector('#product__root div[data-testid="app-wrapper"]');
        if (appWrapper) {
            clickLinkReviews()
        }
        waitForElement('#product__root', '[data-testid="app-wrapper"]', 'data-testid', 'app-wrapper', (element) => {
            clickLinkReviews()
        });

    }

    // Simaland: страница карточки товара, вызванная из каталога при нажатии ссылки рейтинга
    // Simaland: Ожидание загрузки страницы товара до появления элемента рейтинга и искусственное нажатие этого элемента
    function SimaLandCatalogReviewsOpen() {
        function clickLinkReviews_appWrappers(){
            const interval_appWrappers = setInterval(() => {
                let appWrappers = document.querySelectorAll('[data-testid="app-wrapper"]');
                if (appWrappers) {
                    clearInterval(interval_appWrappers);
                    clickLinkReviews()
                }
            }, 50);
        }
        const interval = setInterval(() => {
            // отключение динамического выезда
            const frameWithReviews = document.querySelector("#product__root > div > div.Fa76rh > div.iOZqnu > div:nth-child(2) > div > div.dfZ2S8")
            if (frameWithReviews) {
                frameWithReviews.style.transition = 'transform 0s';
            }
            // ожидание загрузки страницы до появления ссылки на отзывы
            const aReviews =
                  document.querySelector("#product__root > div > div.Fa76rh > div:nth-child(1) > div > div > div.hb20Nd > div.bcg7Pf > div > div > div.RB0Z2S.vZiVTa > a") ||
                  document.querySelector("#product__root > div > div.k41rqL > div:nth-child(10) > button")
            if (aReviews) {
                clearInterval(interval);
                // если ссылка активна (когда отзывы есть в случае десктопной версии) или счётчик отзывов > 0 (в случае мобильной версии)
                if ((aReviews.tagName === 'A' && aReviews.getAttribute('tabindex') === "0" && !aReviews.classList.contains('HuzmFE'))
                    || (aReviews.tagName === 'BUTTON' && Number(aReviews.querySelector('.WKsLn3 >span.HrbHuT')?.innerText) > 0)
                   ) {
                    aReviews.addEventListener('click', (event) => {
                        clickLinkReviews_appWrappers()
                    });
                    if (config.SettingsOnOff) {
                        aReviews.click();
                    }
                }
            }
        }, 50);
        // Ссылка на отзывы внизу страницы Все отзывы - появляется только при прокрутке вниз и более не исчезает
        const intervalAllReviewsBottom = setInterval(() => {
            // ожидание загрузки страницы до появления ссылки на отзывы
            const AllReviewsBottom = document.querySelector("#product__root > div > div.Fa76rh > div:nth-child(2) > div > div:nth-child(5) > div > div.D5cu9p > div.M0Dw8o > a")
            if (AllReviewsBottom) {
                clearInterval(intervalAllReviewsBottom);
                // если ссылка активна (когда отзывы есть в случае десктопной версии) или счётчик отзывов > 0 (в случае мобильной версии)
                if (AllReviewsBottom.tagName === 'A' && AllReviewsBottom.getAttribute('tabindex') === "0" && AllReviewsBottom.role === 'button') {
                    AllReviewsBottom.addEventListener('click', (event) => {
                        clickLinkReviews_appWrappers()
                    });
                }
            }
        }, 50);
        SimaLandOptimization()
    }

    // Sima-lend: Ожидание загружки страницы каталога привязка к рейтингам ссылок на страницы товара
    function SimaLandCatalogReviews() {
        // выбор всех Рейтинги на странице каталога: div с классом 'YREwlL'
        const interval = setInterval(() => {
            // ожидание загрузки страницы до появления ссылки на отзывы: десктопная и мобильная версии
            const aReviews =
                  // document.querySelector("#category-page__root > div > div.SvXTv3.pPpF_h.Go7gld.MoKdBA.ckfJXr.elXZ47 > div.WBjroC > div.YF_0Ly > div.R4UxqH > div") ||
                  document.querySelector("div.catalog") ||
                  // document.querySelector("div.Jweg1q")
                  document.querySelector('div[data-testid="items-list"]')

            if (aReviews) {
                clearInterval(interval);
                // var divs = document.querySelectorAll('.YREwlL');
                // десктопная версия
                // var divs = document.querySelectorAll('.ulVbvy')
                // var divs = document.querySelectorAll('div[data-testid="feedback-side-bar:count-comments"]')
                var divs = document.querySelectorAll('div[data-testid="rating-counter"]') // для десктопной и мобильной версий одновременно
                // или мобильная
                if (divs.length === 0) { // устарело, на всякий случай
                    divs = document.querySelectorAll('div.Ca1QyR')
                }
                // цикл по каждому div
                divs.forEach((div) => {
                    // если ссылка ранее не была добавлена: повторное добавление после загрузки всей страницы. По каким-то причинам в конце загрузки страницы ссылки удаляются, но их добавление во время загузки необходимо чтобы пльзователь имел возможность нажимать
                    if (!div.querySelector('a')) {
                        // div.parentNode.parentNode.parentNode.querySelector('div[data-testid="item-name"] a')
                        // десктопная и мобильная версии
                        const div_itemName = div.closest('div:has(div[data-testid="item-name"] a)') || div.closest('div[data-testid="catalog-item:row"] a')
                        if (!div_itemName) return
                        let link = div_itemName.querySelector('a')

                        if(link?.tagName === "A") {
                            var href = link.getAttribute('href');

                            // Создание нового узла <a>
                            let aNode = document.createElement('a');

                            // Установка параметров узла
                            aNode.href = `${href}###`;
                            aNode.style.cssText = 'display: flex; width: 100%; height: 100%; cursor: pointer; text-decoration: none;';

                            // Перемещаем все дочерние узлы из div1 в новый узел <a>
                            while (div.firstChild) {
                                aNode.appendChild(div.firstChild);
                            }
                            // Перемещаем узел div внутрь aNode
                            div.appendChild(aNode);
                        }
                    }
                });
            }
        }, 50);
    }

    // Simaland: Оптимизация вида
    function SimaLandOptimization() {
        // Сималенд: Карточка товара: Характеристики
        const interval_Characteristics_mini = setInterval(() => {
            const Characteristics_mini = document.querySelector("#product__root > div > div.Fa76rh > div:nth-child(1) > div > div > div.hb20Nd > div.gnpN7o > div.yV_RnX > div:nth-child(1)")

            if (Characteristics_mini) {
                clearInterval(interval_Characteristics_mini);
                // Блок с: Все товары данной фирмы
                const interval_Prices = setInterval(() => {
                    const Prices = document.querySelector("#product__root > div > div.Fa76rh > div:nth-child(1) > div > div > div.hb20Nd > div.gnpN7o > div.nl50DW")
                    if (Prices) {
                        clearInterval(interval_Prices);
                        // Переместим узел SimilarProducts внутрь узла details в самый конец
                        Prices.append(Characteristics_mini);
                    }

                })
                }
        })

        // Блок с: Похожие товары; Также рекомендуем
        let details
        const interval_SimilarProducts_AlsoRecommend = setInterval(() => {
            const SimilarProducts = document.querySelector('#product__root > div > div.Fa76rh > div:nth-child(2) > div > div[data-testid="similar-recommendations-ref"]')
            const AlsoRecommend = document.querySelector('#product__root > div > div.Fa76rh > div:nth-child(2) > div > div[data-testid="related-recommendations-ref"]')
            const SimilarProducts_AlsoRecommend = SimilarProducts || AlsoRecommend

            if (SimilarProducts_AlsoRecommend && SimilarProducts_AlsoRecommend.children.length > 0) {

                // Если определён только один из двух блоков - details не был создан ранее
                if (!details) {
                    // Создать элемент <details> и установить его в свернутом состоянии по умолчанию
                    details = document.createElement('details');
                    details.style.marginTop = "2em";
                    // Создать элемент <summary> с текстом
                    const summary = document.createElement('summary');
                    summary.classList.add('N6SYKn');
                    summary.textContent = 'Похожие товары + Также рекомендуем';
                    summary.style.cursor = 'pointer';

                    // Добавить элемент <summary> в <details>
                    details.appendChild(summary);

                    // Добавить созданный элемент <details> перед любым из двух блоков, который вывелся первым
                    SimilarProducts_AlsoRecommend.insertAdjacentElement('beforebegin', details);
                    // Переместить SimilarProducts_AlsoRecommend внутрь <details>
                    details.appendChild(SimilarProducts_AlsoRecommend);
                    // определён и второй блок
                } else {
                    clearInterval(interval_SimilarProducts_AlsoRecommend);
                    // Переместим узел SimilarProducts внутрь узла details в самое начало
                    if (SimilarProducts_AlsoRecommend === SimilarProducts) {
                        details.prepend(SimilarProducts);
                    } else if (SimilarProducts_AlsoRecommend === AlsoRecommend) {
                        // Переместим узел SimilarProducts внутрь узла details в самый конец
                        details.append(AlsoRecommend);
                    }
                }
            }
        }, 50);
    }




    // Яндекс.Маркет: Показать блок "Характеристики и описание" и разместить под фото товара()
    function Яндекс_Маркет__Показать_блок__Характеристики_и_описание__и_разместить_под_фото_товара() {
        let popup__content = document.querySelector('div.popup-product-details > div.popup__content') // Всплывающий блок с описанием уже присутствует на загружаемой странице - это маловероятно
        let product_params__table = document.querySelector('div.popup__content > div.product-details > div.product-params > table.product-params__table')
        let factClick_button_product_page__btn_detail = false // факт программного нажатия button_product_page__btn_detail
        let button_product_page__btn_detail // кнопка вызова блока Характеристикаи и описание

        if (product_params__table) { // Всплывающий блок присутствует на загружаемой странице - это маловероятно
            popup_product_details_Replace()
        }
        else { // Всплывающий блок отсутствует
            // Создаем новый экземпляр MutationObserver
            const observer = new MutationObserver((mutationsList, observer) => {
                // Проходимся по списку изменений
                for (let mutation of mutationsList) {
                    // Проверяем, добавлены ли новые узлы
                    if (mutation.type === 'childList') {
                        // Проходимся по списку добавленных узлов
                        for (let node of mutation.addedNodes) {
                            if (node.nodeType === 1) {
                                // Проверяем, является ли узел элементом <div> с классом popup-product-details
                                if (!button_product_page__btn_detail &&
                                    node.matches('button.product-page__btn-detail')) {
                                    button_product_page__btn_detail = node // произошёл вывод кнокпи вызова всплывающего блока Характеристики и описания
                                    button_product_page__btn_detail_click()
                                }
                                // Программное нажатие button_product_page__btn_detail: Последующий вызов всплывающего блока с заполненными Характеристики и описания
                                else if (factClick_button_product_page__btn_detail &&
                                         node.matches('div.popup-product-details')) {
                                    // Выведен полноценный заполненный блок
                                    if (node.querySelector('div.popup__content > div.product-details > div.product-params > table.product-params__table')) {
                                        // Прерываем наблюдение
                                        observer.disconnect()
                                        popup__content = node.querySelector('div.popup__content')
                                        popup_product_details_Replace()
                                        break
                                    }
                                    // Блок ещё не заполнен: такое происходит при навигации по сайту и открытию карточек товара
                                    else {
                                        node.remove()
                                        factClick_button_product_page__btn_detail = false
                                        setTimeout(function() {
                                            button_product_page__btn_detail_click()
                                        }, 1000);

                                    }

                                }
                            }
                        }
                    }
                }
            });

            // Начинаем наблюдение за изменениями внутри элемента <body>
            observer.observe(document.body, { childList: true })
            button_product_page__btn_detail_click()

        }

        // Программное нажатие кнопки вызов всплывающего блока Характеристик и описания
        function button_product_page__btn_detail_click() {
            if (!button_product_page__btn_detail) // Если не успело определиться в обсервере
                button_product_page__btn_detail = document.querySelector('#app button.product-page__btn-detail') // Кнокпа вызова всплывающего блока Характеристики и описания
            if (button_product_page__btn_detail && !factClick_button_product_page__btn_detail) { // Если в обсервере не произошёл факт нажатия
                factClick_button_product_page__btn_detail = true
                button_product_page__btn_detail.click() // вызов всплывающего блока Характеристик и описания
            }
        }
        // Перенос Характеристик и описания из вызываемого всплывающего блока под блок товара
        function popup_product_details_Replace() {
            if (factClick_button_product_page__btn_detail) // при програмном нажатии
                popup__content.parentNode.remove() // удаление вызванного всплывающего блока

            const product_page__grid = document.querySelector('div.product-page__grid')
            if (product_page__grid) {
                product_page__grid.parentNode.querySelectorAll('div.popup__content').forEach(function(element) { // удаление всех ранее внедрённых блоков popup__content, которые сохраняются на страинце при навигации
                    element.remove();
                });
            }
            if (popup__content && product_page__grid) {
                popup__content?.querySelector('div.popup__footer')?.remove() // Удаление лишней информации и элементов из подваала вспывающего блока
                product_page__grid.insertAdjacentElement('afterend', popup__content)
            }
            document.body.classList.remove('body--overflow') // при выводе всплывающего блока добавляется вредный класс body--overflow, скрывающий полосы прокрутки, и при программном закрытии всплывающего блока класс body--overflow не удаляется.
        }
    }







    if (config.SettingsOnOff) {

        // Проверка, является ли страница карточкой товара, содержащей отзывы, и если да - сортировка отзывов по возрастанию рейтинга.
        // Ozon: начинается ли адрес страницы со 'https://www.ozon.ru/product/' и не содержит ли он уже '&sort=score_asc' и прочие варианты сортировки
        if ((window.location.host.endsWith('ozon.ru') || window.location.host.endsWith('ozon.com') || window.location.host.endsWith('ozon.by')) && window.location.pathname.startsWith('/product/') &&
            !currentURL.includes('&sort=score_asc') && !currentURL.includes('?sort=score_asc') && !currentURL.includes('&sort=score_desc') && !currentURL.includes('?sort=score_desc')) {
            // Если условия выполняются - добавляем к адресу параметр и перезагружаем страницу с новым адресом, производящим сортировку рейтингов по возрастанию
            let NewURL
            if (!currentURL.includes('/reviews?sort=score_asc') && !currentURL.includes('/reviews?sort=score_desc')) {
                if (currentURL.includes('/reviews')) {
                    NewURL = currentURL.replace(/\/reviews.*/, '/reviews?sort=score_asc')
                } else {
                    NewURL = `${currentURL}&sort=score_asc`;
                }
                if (config.isRunningAsExtension) {
                    api.runtime.sendMessage({action: "redirect", url: NewURL}); // перезагрузка страницы приводит к оходу данного условия и переходу к следующим условиям
                } else {
                    window.location.href = NewURL; // перезагрузка страницы приводит к оходу данного условия и переходу к следующим условиям
                }
            }
        }
        // Ozon: Страница карточки товара
        else if ((window.location.host.endsWith('ozon.ru') || window.location.host.endsWith('ozon.com') || window.location.host.endsWith('ozon.by')) && window.location.pathname.startsWith('/product/')) {
            // Если условия выполняются - добавляем к адресу параметр и перезагружаем страницу с новым адресом, производящим сортировку рейтингов по возрастанию
            // Мобильная версия
            // Удаление предложения перейти на мобильное приложение
            const webToAppBanner = document.querySelector('div[data-widget="webToAppBanner"]')
            if (webToAppBanner)
                webToAppBanner.style.display = 'none'
            const interval_webToAppBanner = setInterval(() => {
                webToAppBanner = document.querySelector('div[data-widget="webToAppBanner"]')
                if (webToAppBanner)
                    webToAppBanner.style.display = 'none'
            }, 200)
            // Настраиваем наблюдение за изменениями в документе
            const observer = new MutationObserver((mutationsList, observer) => {
                clearInterval(interval_webToAppBanner)
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'DIV') {
                                // Мобильная версия
                                // Удаление предложения перейти на мобильное приложение
                                if (node.dataset.widget === "webToAppBanner") {
                                    node.style.display = 'none'
                                }
                            }
                        });

                    }
                }
            });
            const observer_config = { attributes: true, childList: true, subtree: true }
            observer.observe(document.querySelector('div#__ozon'), observer_config)

            // сокрытие и перестановка мешающих блоков
            // первый блок фото из отзывов - скрываем, так как он дублирует этот же блок в отзывах
            const intervalReviewsFoto = setInterval(() => {
                const ReviewsFoto = document.querySelector("#layoutPage > div.b2 > div:nth-child(7) > div > div.container.b6 > div:nth-child(1)") // фотки из отзывов - скрыть
                if (ReviewsFoto) {
                    clearInterval(intervalReviewsFoto);
                    ReviewsFoto.style.display = 'none'
                }
            }, 50);
            // Блок с: Информация о продавце; Другие предложения от продавцов на Ozon.ru
            const intervalSellers = setInterval(() => {
                const Sellers = document.querySelector("#layoutPage > div.b2 > div:nth-child(7) > div > div.container.b6 > div.d8") // инфа по продавцам
                if (Sellers) {
                    // Другие предложения от продавцов на Ozon.ru - скрываем так как он дублирует аналогичный блок внизу страницы
                    const SellersOtherOffers = Sellers.querySelector("div > div.j6y")
                    if (SellersOtherOffers) {
                        // SellersOtherOffers.style.display = 'none'
                        clearInterval(intervalSellers);
                    }
                }
            }, 50);
            // Блок с: Похожие товары; Покупают вместе
            const interval_AlsoRecommend_BuyTogether = setInterval(() => {
                // const AlsoRecommend_BuyTogether = document.querySelector("#layoutPage > div.b2 > div:nth-child(7) > div > div.container.b6 > div.ml6.l2n.m9l.nl0 > div:nth-child(1)") || document.querySelector("#layoutPage > div.b2.b4 > div:nth-child(10) > div > div > div.pj6")
                // десктопная версия
                const AlsoRecommend_BuyTogether = document.querySelector('div[data-widget="skuShelfGoods"]') // всего два таких лемента, на достаточно выбрать первый
                let AlsoRecommend_BuyTogether_Full
                if (AlsoRecommend_BuyTogether) AlsoRecommend_BuyTogether_Full = AlsoRecommend_BuyTogether.parentNode.parentNode

                // мобильная версия
                const AlsoRecommend_BuyTogether_mobile_Divs = document.querySelectorAll('div[data-widget="skuScroll"]')

                if (AlsoRecommend_BuyTogether || AlsoRecommend_BuyTogether_mobile_Divs.length > 0) {
                    // пока отключаю, потом буду сворачивать
                    clearInterval(interval_AlsoRecommend_BuyTogether);

                    let UseDetails = true
                    const observer = new MutationObserver((mutationsList, observer) => {
                        for (const mutation of mutationsList) {
                            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                                console.log('Изменение содержимого div или атрибутов div обнаружено.');

                                // Дополнительная логика проверки:
                                if (UseDetails) {
                                    // if ((AlsoRecommend_BuyTogether && AlsoRecommend_BuyTogether.children.length === 1 && AlsoRecommend_BuyTogether.children[0].children.length === 1) ||
                                    //     (!AlsoRecommend_BuyTogether && AlsoRecommend_BuyTogether_mobile_Divs.length === 0)) {
                                    if (AlsoRecommend_BuyTogether || AlsoRecommend_BuyTogether_mobile_Divs.length > 0) {
                                        UseDetails = false
                                        // Если нужно остановить наблюдение в будущем:
                                        // Но срабатывает не мгновенно - приходится использовать флаг UseDetails
                                        observer.disconnect();
                                        // Создать элемент <details> и установить его в свернутом состоянии по умолчанию
                                        const details = document.createElement('details');

                                        // Создать элемент <summary> с текстом
                                        const summary = document.createElement('summary');
                                        summary.classList.add('tsHeadline500Medium');
                                        summary.textContent = 'Похожие товары + Покупают вместе';
                                        summary.style.cursor = 'pointer';


                                        // Добавить элемент <summary> в <details>
                                        details.appendChild(summary);
                                        // десктопная версия
                                        if (AlsoRecommend_BuyTogether) {
                                            // Добавить созданный элемент <details> перед элементом AlsoRecommend_BuyTogether
                                            AlsoRecommend_BuyTogether_Full.insertAdjacentElement('beforebegin', details);

                                            // Переместить существующий элемент AlsoRecommend_BuyTogether внутрь <details>

                                            details.appendChild(AlsoRecommend_BuyTogether_Full);
                                            // details перемещаем до блока комментариев
                                            const div_Description = document.querySelector("#comments")
                                            if (div_Description) div_Description.insertAdjacentElement('beforebegin', details);
                                        }
                                        // мобильная версия
                                        if (AlsoRecommend_BuyTogether_mobile_Divs.length > 0) {
                                            // Добавить созданный элемент <details> перед элементом AlsoRecommend_BuyTogether
                                            AlsoRecommend_BuyTogether_mobile_Divs[0].insertAdjacentElement('beforebegin', details);

                                            // Переместить элементы AlsoRecommend_BuyTogether_mobile_Divs внутрь <details>
                                            AlsoRecommend_BuyTogether_mobile_Divs.forEach(div => {
                                                details.appendChild(div);
                                            });

                                            const div_Description = document.querySelector('div[data-widget="webMobTabs"]')
                                            if (div_Description) div_Description.insertAdjacentElement('afterend', details);
                                        }

                                    }
                                }
                            }
                        }
                    });

                    // Указываем, за какими изменениями хотим наблюдать:
                    const config = { attributes: true, childList: true, subtree: true };

                    // Начинаем наблюдение:
                    if (AlsoRecommend_BuyTogether) {
                        observer.observe(AlsoRecommend_BuyTogether_Full, config);
                    } else if (AlsoRecommend_BuyTogether_mobile_Divs.length > 0) {
                        observer.observe(AlsoRecommend_BuyTogether_mobile_Divs[0], config)
                    }

                    // Если нужно остановить наблюдение в будущем:
                    // observer.disconnect();

                }

            }, 50);

            // Блок с рекламой
            function OzonpPoductRemoveElements() {
                // десктопная версия
                document.querySelectorAll('div[data-widget="skuGrid"]').forEach(function(element) {
                    element.remove();
                });
                document.querySelectorAll('div[data-widget="bannerCarousel"]').forEach(function(element) {
                    element.remove();
                });
                // мобильная версия
                document.querySelectorAll('div.q3j_23[data-widget="skuScroll"]').forEach(function(element) {
                    element.remove();
                });
            }
            // Удаление при загрузке содержимого
            OzonpPoductRemoveElements();

            window.addEventListener('load', ()=>{
                // Удаление при прокрутке страницы
                window.addEventListener('scroll', OzonpPoductRemoveElements);

                // Наблюдатель за изменениями в DOM
                const observer = new MutationObserver(OzonpPoductRemoveElements);

                // Настройки наблюдателя
                const config = { childList: true, subtree: true };

                // Наблюдение за изменениями в body
                observer.observe(document.body, config);
            });
            // Ozon: Страница каталога товаров
        } else if ((window.location.host.endsWith('ozon.ru') || window.location.host.endsWith('ozon.com') || window.location.host.endsWith('ozon.by')) &&
                   (window.location.pathname.startsWith('/category/') || window.location.pathname.startsWith('/highlight/'))) {
            addOzonSortParamToLinks() // TODO: вызвыает глюки
            // Ozon: Страница главная
            //         } else if (currentURL==='https://www.ozon.ru/' ) {
            //             // Любая другая страница Ozon
            // Ozon: Страница заказов
            // Изменено: 2025-03-17 18:52, Автор:
        } else if ((window.location.host.endsWith('ozon.ru') || window.location.host.endsWith('ozon.com') || window.location.host.endsWith('ozon.by')) &&
                   (window.location.pathname.startsWith('/my/orderlist') )) {
            const observer = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'DIV') {
                                // Мобильная версия
                                // Удаление предложения перейти на мобильное приложение
                                if (node.dataset.widget === "skuShelfGoods") {
                                    node.style.display = 'none'
                                }
                            }
                        });

                    }
                }
            });
            const observer_config = { attributes: true, childList: true, subtree: true }
            observer.observe(document.querySelector('div#__ozon'), observer_config)

            document.querySelectorAll('div[data-widget="skuShelfGoods"]').forEach(node => {node.remove()})

        } else if (window.location.host.endsWith('ozon.ru') || window.location.host.endsWith('ozon.com') || window.location.host.endsWith('ozon.by')) {
            // Добавление кнопки "Реклама"
            const EspeciallyForYou = CreateEspeciallyForYou('#df0f70')
            // let EspeciallyForYou_factView = false // факт вывода раскрывающегося блока рекламы
            // Перенос верхнего баннера в блок Реклама
            // const targetNode = document.querySelector('div[data-widget="advBanner"]')
            // targetNode?.remove()
            function Add_targetNode_into_EspeciallyForYou(targetNode) {
                if (targetNode && targetNode.parentNode !== EspeciallyForYou) {
                    if (!targetNode.parentNode.contains(EspeciallyForYou)) {
                        targetNode.parentNode.insertBefore(EspeciallyForYou, targetNode)
                    }
                    targetNode.style.marginTop = '0.3rem'
                    EspeciallyForYou?.appendChild(targetNode)
                }
            }
            Add_targetNode_into_EspeciallyForYou(document.querySelector('div[data-widget="seasonWidget"]'))
            Add_targetNode_into_EspeciallyForYou(document.querySelector('div[data-widget="advBanner"]'))
            // Мобильная версия
            // Удаление предложения перейти на мобильное приложение
            document.querySelector('div[data-widget="webToAppBanner"]')?.parentNode.remove()
            const interval_webToAppBanner = setInterval(() => {
                document.querySelector('div[data-widget="webToAppBanner"]')?.parentNode.remove()
            }, 200)

            // Настраиваем наблюдение за изменениями в документе
            const observer = new MutationObserver((mutationsList, observer) => {
                clearInterval(interval_webToAppBanner)
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'DIV') {
                                // Перенос верхнего баннера в блок Реклама
                                if (node.dataset.widget === "seasonWidget" || node.dataset.widget === "advBanner" ) {
                                    Add_targetNode_into_EspeciallyForYou(node)
                                }
                                // Мобильная версия
                                // Удаление предложения перейти на мобильное приложение
                                else if (node.dataset.widget === "webToAppBanner") {
                                    node.parentNode.remove()
                                }
                                // else if (node.classList.contains('tsBodyMBold')){
                                //     div.tsBodyMBold
                                // }
                            }
                        });

                    }
                }
            });
            const observer_config = { attributes: true, childList: true, subtree: true };
            observer.observe(document.querySelector('div#__ozon'), observer_config);
            // Wildberries: карточка товара
        } else if (currentURL.includes('wildberries.ru/catalog/') && currentURL.endsWith('/detail.aspx')) {
            Wildberries__Показать_блок__Характеристики_и_описание__и_разместить_под_фото_товара()
            // Wildberries: отзывы товара
        } else if ((window.location.host === 'wildberries.ru' || window.location.host === 'www.wildberries.ru') && window.location.pathname.startsWith('/catalog/') && window.location.pathname.includes('/feedbacks')) {
            sortWildberriesReviews()
            // Wildberries Global: страница товара, но не отзывы
        } else if (window.location.host === 'global.wildberries.ru' && window.location.pathname.startsWith('/product/') && !window.location.pathname.includes('/feedbacks')) {
            // TODO:            // WildberriesGlobal__Показать_блок__Характеристики_и_описание__и_разместить_под_фото_товара()
            //             // ++ Создание ссылки с параметром-сортировкой отзывов: не сработало
            //             const СсылкаНаОтзывы = document.querySelector('a.reviews__view-all-btn')
            //             if (СсылкаНаОтзывы) {
            //                 if (!СсылкаНаОтзывы.href.includes('&sort=valueup'))
            //                     СсылкаНаОтзывы.href += '&sort=valueup'
            //             }
            //             else {
            //                 // Функция, которая будет вызываться при изменениях в DOM
            //                 const callback = function (mutationsList, observer) {
            //                     for (const mutation of mutationsList) {
            //                         // Проверяем, были ли добавлены новые узлы
            //                         if (mutation.type === 'childList') {
            //                             mutation.addedNodes.forEach(node => {
            //                                 // Проверяем, является ли добавленный узел элементом <a> с классом reviews__view-all-btn
            //                                 // if (node.nodeType === Node.ELEMENT_NODE && node.matches('a.reviews__view-all-btn')) {
            //                                 if (node.nodeType === Node.ELEMENT_NODE) {
            //                                     const кнопкаВсеОтзывы = node.querySelector('a.reviews__view-all-btn');
            //                                     if (кнопкаВсеОтзывы) {
            //                                         observer.disconnect();
            //                                         observeReviewsInnerClassChange(кнопкаВсеОтзывы);
            //                                         if (!кнопкаВсеОтзывы.href.includes('&sort=valueup')) {
            //                                             кнопкаВсеОтзывы.href += '&sort=valueup'
            //                                         }
            //                                     }
            //                                 }
            //                             });
            //                         }
            //                     }
            //                 };

            //                 // Создаем экземпляр MutationObserver
            //                 const observer = new MutationObserver(callback);

            //                 // Начинаем наблюдение за изменениями в DOM
            //                 observer.observe(document.body, {
            //                     childList: true, // Отслеживать добавление/удаление дочерних элементов
            //                     subtree: true,   // Отслеживать изменения во всем поддереве
            //                 });

            //                 // Функция для наблюдения за изменениями в атрибутах элемента
            //                 function observeReviewsInnerClassChange(кнопкаВсеОтзывы) {
            //                     const кнопкаВсеОтзывы_Родитель = кнопкаВсеОтзывы.parentNode

            //                     const observer = new MutationObserver((mutations) => {
            //                         mutations.forEach((mutation) => {
            //                             if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            //                                 const reviewsInner = mutation.target;
            //                                 if (!reviewsInner.classList.contains('hide')) {
            //                                     // После нахождения элемента можно остановить наблюдение
            //                                     observer.disconnect();
            //                                     if (!кнопкаВсеОтзывы.href.includes('&sort=valueup')) {
            //                                         кнопкаВсеОтзывы.href += '&sort=valueup'
            //                                     }
            //                                 }
            //                             }
            //                         });
            //                     });

            //                     const config = { attributes: true };
            //                     observer.observe(кнопкаВсеОтзывы_Родитель, config);
            //                 }
            //             }
            //             // -- Создание ссылки с параметром-сортировкой: не сработало
        } else if (window.location.host === 'global.wildberries.ru' && window.location.pathname.startsWith('/product/') && window.location.pathname.includes('/feedbacks')) {
            WildberriesGlobal__Сортировка_отзывов_по_возрастанию()

        } else if (currentURL.includes('wildberries.ru/')) {
            window.addEventListener('load', addWildberriesSortParamToLinks)
            // Simaland: страница карточки товара
        } else if (currentURL.match(/^https:\/\/www\.sima-land\.ru\/\d+\/.+\/$/)) {
            // } else if (/^https:\/\/www\.sima-land\.ru\/\d{7}\/.*\/$/.test(currentURL)) {
            sortSimaLandReviews();
            SimaLandOptimization()
            // Simaland: страница карточки товара, вызванная из каталога при нажатии ссылки рейтинга
        } else if (currentURL.match(/^https:\/\/www\.sima-land\.ru\/\d+\/.+\/###$/)) {
            // } else if (/^https:\/\/www\.sima-land\.ru\/\d{7}\/.*\/###$/.test(currentURL)) {
            // SimaLandCatalogReviews();
            // приходится ждать загруки страницы так, иначе не подвязываются необходиме функции обработки клика по ссылке рейтинга
            window.addEventListener('load', SimaLandCatalogReviewsOpen)
            // SimaLandCatalogReviewsOpen()
            // Страница каталога товаров
        } else if (currentURL.match(/^https:\/\/www\.sima-land\.ru\/.+\/(.*)$/)) {
            // } else if (/^https:\/\/www\.sima-land\.ru\/.+\/$/.test(currentURL)) {
            SimaLandCatalogReviews()
            window.addEventListener('load', SimaLandCatalogReviews) // в дальнейшем можно разремить при условии проверки на добавленые в div ссылки
        }
        // Яндекс.Маркет: Страница карточки товара
        // else if (currentURL.pathname.startsWith('/product--') && currentURL.includes('&uniqueId=') && currentURL.includes('&do-waremd5=')) {
        // else if (currentURL.includes('market.yandex.ru/product--') && currentURL.includes('&uniqueId=') && currentURL.includes('&do-waremd5=')) {
        else if (window.location.host === 'market.yandex.ru' || window.location.host === 'market.yandex.com') {
            let факт_УдалениеБаннеров = false
            // Если условия выполняются - добавляем к адресу параметр и перезагружаем страницу с новым адресом, производящим сортировку рейтингов по возрастанию
            // Мобильная версия
            // Удаление предложения перейти на мобильное приложение
            function УдалениеБаннеров() {
                let webToAppBanner = document.getElementById('/content/header/headerAppDistributionBanner') || document.getElementById('HeaderAppDistributionBanner')
                if (webToAppBanner)
                    // webToAppBanner.style.display = 'none'
                    webToAppBanner.remove()
                // Баннер верхний
                document.getElementById('/content/header/headerPromo')?.remove()
                document.querySelector('div[data-apiary-widget-id="/content/header/headerPromo"]')?.remove()
                // Десктопная версия: баннер справа
                document.getElementById('/content/page/fancyPage/defaultPage/heroBannerCarousel')?.remove()
                // Баннер-карусель на главной странице
                if (window.location.pathname === '/') {
                    // document.querySelector('div[data-apiary-widget-name="@marketfront/HeroBannerCarousel"]')?.remove()
                    // Добавление кнопки "Реклама"
                    const EspeciallyForYou = CreateEspeciallyForYou('#e35539')
                    // let EspeciallyForYou_factView = false // факт вывода раскрывающегося блока рекламы
                    // Перенос верхнего баннера в блок Реклама
                    const targetNode = document.querySelector('div[data-apiary-widget-name="@marketfront/HeroBannerCarousel"]')
                    // targetNode?.remove()
                    function Add_targetNode_into_EspeciallyForYou(targetNode) {
                        if (targetNode && targetNode.parentNode !== EspeciallyForYou) {
                            if (!targetNode.parentNode.contains(EspeciallyForYou)) {
                                targetNode.parentNode.insertBefore(EspeciallyForYou, targetNode)
                            }
                            targetNode.style.marginTop = '0.3rem'
                            EspeciallyForYou?.appendChild(targetNode)
                        }
                    }
                    Add_targetNode_into_EspeciallyForYou(targetNode)
                }
            }

            // Настраиваем наблюдение за изменениями в документе
            const observer = new MutationObserver((mutationsList, observer) => {
                if (!факт_УдалениеБаннеров) {
                    факт_УдалениеБаннеров = true
                    УдалениеБаннеров()
                }
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'DIV') {
                                // Удаление предложения перейти на мобильное приложение: на всякий случай любой из блоков
                                if (node.id === '/content/header/headerAppDistributionBanner' || node.id === 'headerAppDistributionBanner') {
                                    // node.style.display = 'none'
                                    node.remove()
                                }
                                // Баннер верхний
                                else if (node.id === '/content/header/headerPromo') {
                                    node.remove()
                                }
                                // Десктопная версия: баннер справа
                                else if (node.id === '/content/page/fancyPage/defaultPage/heroBannerCarousel') {
                                    node.remove()
                                }
                                // // Баннер-карусель на главной странице
                                // else if (window.location.pathname === '/' &&
                                //          node.dataset.apiaryWidgetName === '@marketfront/HeroBannerCarousel') {
                                //     node.remove()
                                // }
                            }
                        });

                    }
                }
            });
            const observer_config = { attributes: true, childList: true, subtree: true }
            observer.observe(document.querySelector('div.page'), observer_config)

            // Страница карточки товара
            if (currentURL.includes('&uniqueId=') && currentURL.includes('&do-waremd5=')) {
                // сокрытие и перестановка мешающих блоков
                // Блок с: Ещё может подойти; Вам может понравиться
                const interval_ЕщёМожетПодойти_ВамМожетПонравиться = setInterval(() => {
                    // Ещё может подойти
                    // десктопная версия или мобильная версия
                    const ЕщёМожетПодойти = document.getElementById('/content/page/fancyPage/defaultPage/kkmCarousel') || document.getElementById('/content/page/fancyPage/defaultPage/kkmCommon/kkmRecommendations/kkmCarousel/content')
                    // Вам может понравиться
                    const ВамМожетПонравиться = document.getElementById('/content/page/fancyPage/defaultPage/madvIncutWrapper')

                    if (ЕщёМожетПодойти || ВамМожетПонравиться) {
                        // пока отключаю, потом буду сворачивать
                        clearInterval(interval_ЕщёМожетПодойти_ВамМожетПонравиться);

                        let UseDetails = true

                        // Дополнительная логика проверки:
                        if (UseDetails) {
                            UseDetails = false
                            // Если нужно остановить наблюдение в будущем:
                            // Но срабатывает не мгновенно - приходится использовать флаг UseDetails
                            // Создать элемент <details> и установить его в свернутом состоянии по умолчанию
                            const details = document.createElement('details')

                            // Создать элемент <summary> с текстом
                            const summary = document.createElement('summary')
                            // summary.classList.add('tsHeadline500Medium')
                            summary.textContent = 'Ещё может подойти + Вам может понравиться'
                            summary.style.cursor = 'pointer'


                            // Добавить элемент <summary> в <details>
                            details.appendChild(summary);

                            const div_Отзывы = document.getElementById('/content/page/fancyPage/defaultPage/reviewBlock') || document.querySelector('div[data-auto="product-card-ugc-section"]')
                            // Добавить созданный элемент <details> перед элементом div_Отзывы
                            div_Отзывы.insertAdjacentElement('beforebegin', details)

                            // Переместить существующий элемент ЕщёМожетПодойти внутрь <details>
                            if (ЕщёМожетПодойти)
                                details.appendChild(ЕщёМожетПодойти)
                            // Переместить существующий элемент ВамМожетПонравиться внутрь <details>
                            if (ВамМожетПонравиться)
                                details.appendChild(ВамМожетПонравиться)
                        }

                    }

                }, 200);

                // Получение информации из блока "Все характеристики" для десктопной версии
                // В десктопной версии присутствует нажимаемый span-ссылка
                const targetSpan = document.getElementById('/content/page/fancyPage/defaultPage/productSpecsList')?.querySelector('span[aria-label="Все характеристики"]')
                // Проверка найден ли span - значит, версия десктопная
                if (targetSpan) {
                    // элемент по ширине страницы или её левой части, до которого будет вставка блоков "О товаре" и "Общие характеристики"
                    const kitsOfferSet = document.getElementById('/content/page/fancyPage/defaultPage/kitsOfferSet');
                    if (kitsOfferSet) {
                        // О товаре
                        let О_Товаре = document.getElementById('/content/page/fancyPage/defaultPage/specFridge')?.querySelector('div[data-zone-name="MarketProductDescription"]')?.cloneNode(true);

                        // Общие характеристики
                        let ОбщиеХарактеристики = document.getElementById('/content/page/fancyPage/defaultPage/specFridge')?.querySelector('div[data-zone-name="ProductSpecsList"]')?.cloneNode(true);
                        if (О_Товаре || ОбщиеХарактеристики) {
                            if (О_Товаре) kitsOfferSet.insertAdjacentElement('beforebegin', О_Товаре)
                            if (ОбщиеХарактеристики) kitsOfferSet.insertAdjacentElement('beforebegin', ОбщиеХарактеристики)
                        }
                        else {
                            // Настраиваем наблюдение за изменениями в документе
                            const observer_specFridge = new MutationObserver((mutationsList, observer) => {
                                for (let mutation of mutationsList) {
                                    if (mutation.type === 'childList') {
                                        mutation.addedNodes.forEach(node => {
                                            if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'DIV') {
                                                if (node.getAttribute('data-zone-name') === 'MarketProductDescription') {
                                                    О_Товаре = node.cloneNode(true);
                                                    // почему-то не отслеживается появление
                                                    ОбщиеХарактеристики = document.getElementById('/content/page/fancyPage/defaultPage/specFridge')?.querySelector('div[data-zone-name="ProductSpecsList"]')?.cloneNode(true);
                                                }
                                                else if (node.getAttribute('data-zone-name') === 'ProductSpecsList') {
                                                    ОбщиеХарактеристики = node.cloneNode(true);
                                                }
                                                if (О_Товаре && ОбщиеХарактеристики) {
                                                    observer_specFridge.disconnect()
                                                }
                                            }
                                        });

                                    }
                                }
                                if (О_Товаре || ОбщиеХарактеристики) {
                                    if (О_Товаре) {
                                        const О_Товаре_productDescription = О_Товаре.querySelector('div[aria-label="product-description"]');
                                        if (О_Товаре_productDescription)
                                            О_Товаре_productDescription.style.maxHeight = 'unset'
                                        kitsOfferSet.insertAdjacentElement('beforebegin', О_Товаре)
                                    }
                                    if (ОбщиеХарактеристики) kitsOfferSet.insertAdjacentElement('beforebegin', ОбщиеХарактеристики)
                                    document.querySelector('div[data-apiary-widget-name="@light/StickyFridgeContent"]')?.
                                    nextElementSibling?.
                                    querySelector('button')?.
                                    click()
                                }


                            });
                            const observer_config_specFridge = { attributes: true, childList: true, subtree: true }
                            observer_specFridge.observe(document.getElementById('/content/page/fancyPage/defaultPage/specFridge'), observer_config_specFridge)
                            targetSpan.click()
                        }
                    }
                }
            }
        }
    }

    // Wildberries: определение совершения перехода на карточку товара с разделом отзывов
    // перехват событияй истории (кнопок назад-вперёд)
    window.onpopstate = () => {
        // получаем текущий адрес страницы
        // Wildberries
        if ((window.location.host === 'wildberries.ru' || window.location.host === 'www.wildberries.ru' || window.location.host === 'global.wildberries.ru') && new URL(window.location.href).pathname.startsWith('/catalog/') && window.location.href.includes('/feedbacks')) {
            sortWildberriesReviews();
            if (new URL(window.location.href).pathname.endsWith('/detail.aspx'))
                Wildberries__Показать_блок__Характеристики_и_описание__и_разместить_под_фото_товара()
        }
        else if (window.location.host === 'global.wildberries.ru' && window.location.pathname.startsWith('/product/') && window.location.pathname.includes('/feedbacks')) {
            WildberriesGlobal__Сортировка_отзывов_по_возрастанию()
        }
        // Яндекс.Маркет
        else if ((window.location.host === 'market.yandex.ru' || window.location.host === 'market.yandex.com') && new URL(window.location.href).pathname.startsWith('/product--') && window.location.href.includes('&uniqueId=') && window.location.href.includes('&do-waremd5=')) {
            // Сортировать на карточке товара нет возможсноти и смысла - отзывы по полезности вполне объективны
            Яндекс_Маркет__Показать_блок__Характеристики_и_описание__и_разместить_под_фото_товара()
        }
    };

    const originalPushState = history.pushState;
    history.pushState = function (state, ...args) {
        originalPushState.apply(this, [state, ...args]);
        // Вызываем функцию сортировки после пуша состояния
        if (window.location.host === 'wildberries.ru' || window.location.host === 'www.wildberries.ru') {
            sortWildberriesReviews();
        }
        // if (new URL(window.location.href).pathname.endsWith('/detail.aspx'))
        //     Wildberries__Показать_блок__Характеристики_и_описание__и_разместить_под_фото_товара()
        else if (window.location.host === 'global.wildberries.ru' && window.location.pathname.startsWith('/product/') && window.location.pathname.includes('/feedbacks')) {
            WildberriesGlobal__Сортировка_отзывов_по_возрастанию()
        }
    };

    history.replaceState = new Proxy(history.replaceState, {
        apply: function(target, thisArg, argArray) {
            target.apply(thisArg, argArray);
            if (window.location.host === 'wildberries.ru' || window.location.host === 'www.wildberries.ru') {
                sortWildberriesReviews();
                if (new URL(window.location.href).pathname.endsWith('/detail.aspx'))
                    Wildberries__Показать_блок__Характеристики_и_описание__и_разместить_под_фото_товара()
            }
        }
    });

    if (config.isRunningAsExtension) {
        // событие изменения адреса данной вкладки
        api.runtime.onMessage.addListener((request, sender, sendResponse) => {
            // получаем текущий адрес страницы
            // Wildberries
            if ((window.location.host === 'wildberries.ru' || window.location.host === 'www.wildberries.ru') && new URL(request.url).pathname.startsWith('/catalog/') && request.url.includes('/feedbacks')) {
                sortWildberriesReviews();
                if (new URL(window.location.href).pathname.endsWith('/detail.aspx'))
                    Wildberries__Показать_блок__Характеристики_и_описание__и_разместить_под_фото_товара()
            }
            // Яндекс.Маркет
            else if ((window.location.host === 'market.yandex.ru' || window.location.host === 'market.yandex.com') && new URL(window.location.href).pathname.startsWith('/product--') && window.location.href.includes('&uniqueId=') && window.location.href.includes('&do-waremd5=')) {
                // Сортировать на карточке товара нет возможсноти и смысла - отзывы по полезности вполне объективны
                Яндекс_Маркет__Показать_блок__Характеристики_и_описание__и_разместить_под_фото_товара()
            }
        });
    }

    // Ozon: Замена ссылок на странице на случай если пользователь захочет открыть ссылку карточки товара в новой вкладке. Отработает позднее, после загрузки. Не обязательное действие.
    // Вызываем функцию сразу после загрузки страницы
    if (['ozon.ru', 'ozon.com', 'ozon.by'].includes(window.location.host)) {
        // window.addEventListener('load', addOzonSortParamToLinks) // TODO: вызвыает глюки
    }



    // For extentions
    function initConfig() {
        initializeSettingsOnOff();
    }

    // получение значения при загрузке popup
    function initializeSettingsOnOff() {
        api.storage.local.get(["SettingsOnOff"], (res) => {
            if ("SettingsOnOff" in res){
                handleSettingsOnOffChangeEvent(res.SettingsOnOff)
            }else{
                handleSettingsOnOffChangeEvent(true);
                api.storage.local.set({ SettingsOnOff: true })
            }
        });
    }

    //если в хранилище произошли изменения соответствующего параметра...
    function storageChangeHandler(changes, area) {
        if (area === 'local') {
            if (changes.SettingsOnOff !== undefined) {
                // if (changes.SettingsOnOff?.newValue) {
                handleSettingsOnOffChangeEvent(
                    changes.SettingsOnOff.newValue
                )
            }

        }
    }
    //... происходит установка значения конфига и контрола
    function handleSettingsOnOffChangeEvent(value) {
        config.SettingsOnOff = value;
    }

    if (config.isRunningAsExtension) {
        //добавление прослушивания события изменения хранилища
        api.storage.onChanged.addListener(storageChangeHandler)
    }

    // Добавлекние раскрывающегося блока "Реклама"
    function CreateEspeciallyForYou(summary_font_color = '#ff0000') {
        // Создание стилей с помощью JavaScript
        const style = document.createElement("style")
        style.textContent = `
                details {
                    // display: none;
                    font-family: Arial, sans-serif;
                    font-size: 18px;
                    color: #333;
                    position: relative;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    background-color: #fff;
                    max-height: 50vh;
                    overflow-y: auto;
                }
                summary {
                    cursor: pointer;
                    outline: none;
                    position: relative;
                    z-index: 1;
                    color: ${summary_font_color}; /* Изменение цвета текста */
        display: flex; /*использовали display: flex и align-items: center для summary, чтобы выровнять треугольник и текст по вертикали.*/
        align-items: center;
                }
    summary::before {
        content: '▶'; /* Треугольник вершиной вправо */
        margin-right: 8px;
        font-size: 12px;
    }
    details[open] summary::before {
        content: '▼'; /* Треугольник вершиной вниз */
    }
                .shimmer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%);
                    animation: shimmer 60s linear infinite;
                    pointer-events: none;
                }
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
            `;
        document.head.appendChild(style);

        // Создание элемента details
        const details = document.createElement("details");
        // Добавляем класс my-details-class к элементу <details>
        // details.classList.add('details_EspeciallyForYou'); // не понял зачем это - не могу вспомнить

        // Определение языка браузера
        const browserLanguage = navigator.language || navigator.userLanguage;
        let messageSpecialOffer = 'Реклама'

        switch (browserLanguage) {
            case "uken":
                messageSpecialOffer = 'Реклама'
                break;
            default:
                messageSpecialOffer = 'Реклама'
        }
        const summary = document.createElement("summary");
        summary.textContent = messageSpecialOffer;

        const shimmer = document.createElement("div");
        shimmer.className = "shimmer";

        // const content = document.createElement("p");
        // content.textContent = "Содержимое деталей...";

        details.appendChild(summary);
        details.appendChild(shimmer);
        // details.appendChild(content);

        // document.body.appendChild(details);
        return details
    }

})();
