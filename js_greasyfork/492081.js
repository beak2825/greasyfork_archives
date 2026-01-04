// ==UserScript==
// @name         ИНФО
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  информацию
// @author       ZV
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492081/%D0%98%D0%9D%D0%A4%D0%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/492081/%D0%98%D0%9D%D0%A4%D0%9E.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Создаем стиль для светло-серой подложки с закругленными краями для панели similar_products
    var similarProductsStyle = document.createElement('style');
    similarProductsStyle.innerHTML = `
        .info-container.similar-products {
            background-color: #f2f2f2;
            border-radius: 10px; /* Добавляем закругление краев */
            padding: 1px 3px;
            margin: 1px 0; /* Устанавливаем минимальный отступ между подложками */
            display: inline-block;
            max-width: 95%; /* Ограничиваем максимальную ширину подложки */
            width: 100%; /* Задаем ширину подложки на всю ширину блока */
            box-sizing: border-box; /* Учитываем padding внутри ширины */
        }
    `;
    document.head.appendChild(similarProductsStyle);
 
    // Создаем стиль для белой подложки для панели similar-bp-products
    var bpSimilarProductsStyle = document.createElement('style');
    bpSimilarProductsStyle.innerHTML = `
        .info-container.bp-similar-products {
            background-color: white;
            border-radius: 10px; /* Добавляем закругление краев */
            padding: 1px 10px;
            margin: 1px 0; /* Устанавливаем минимальный отступ между подложками */
            display: inline-block;
            max-width: 95%; /* Ограничиваем максимальную ширину подложки */
            width: 100%; /* Задаем ширину подложки на всю ширину блока */
            box-sizing: border-box; /* Учитываем padding внутри ширины */
        }
    `;
    document.head.appendChild(bpSimilarProductsStyle);
 
    // Функция для обработки панели similar_products
    function processSimilarProductsPanel() {
        const similarProductsPanel = document.getElementById('similar-products');
        if (similarProductsPanel) {
            const buttons = similarProductsPanel.querySelectorAll('ul li a.btn.btn-primary.btn-small');
            // Используем Promise.all для параллельной обработки
            const fetchPromises = Array.from(buttons).map(button => {
                // Изменяем текст кнопки
                button.textContent = 'PDP';
                return fetch(button.href)
                    .then(response => response.ok ? response.text() : Promise.reject('Ошибка загрузки страницы'))
                    .then(html => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    const sourceUrlInput = tempDiv.querySelector('input#SourceUrl');
                    if (sourceUrlInput) {
                        button.href = sourceUrlInput.value;
                    }
                })
                    .catch(error => {
                    console.error('Ошибка:', error);
                });
            });
 
            Promise.all(fetchPromises).then(() => {
                console.log('Все запросы выполнены');
            });
 
            const otherLinks = similarProductsPanel.querySelectorAll('ul li a:not(.btn.btn-primary.btn-small)');
            otherLinks.forEach(link => {
                link.setAttribute('target', '_blank');
            });
        }
    }
 
    function processPanel(panelId, options) {
        var panel = document.getElementById(panelId);
        if (panel) {
            var links = panel.querySelectorAll('ul li a');
            var uniqueUrls = {};
            links.forEach(function(link) {
                var url = link.href;
                if (uniqueUrls[url]) return;
                uniqueUrls[url] = true;
                fetch(url)
                    .then(response => response.text())
                    .then(html => {
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    let lastInsertedElement = link;
 
                    options.forEach(option => {
                        var element = tempDiv.querySelector(option.selector);
                        if (element) {
                            // Создаем контейнер для информации
                            var infoContainer = document.createElement('div');
                            if (panelId === 'similar-products') {
                                infoContainer.classList.add('info-container', 'similar-products');
                            } else if (panelId === 'similar-bp-products') {
                                infoContainer.classList.add('info-container', 'bp-similar-products');
                            }
 
                            // Извлекаем содержимое, учитывая, что оно может быть как в тексте, так и в атрибуте
                            var content = option.extractor ? option.extractor(element) :
                            option.attribute ? element.getAttribute(option.attribute) :
                            element.textContent.trim();
                            if (content) { // Убедимся, что содержимое существует
                                var contentElement = document.createElement('span');
                                contentElement.textContent = content;
                                Object.assign(contentElement.style, option.style);
                                infoContainer.appendChild(contentElement); // Добавляем содержимое в контейнер
 
                                if (option.addBreak) { // Добавляем перенос строки, если требуется
                                    var br = document.createElement('br');
                                    infoContainer.appendChild(br);
                                }
                            }
                            // Вставляем контейнер с информацией перед последним элементом
                            lastInsertedElement.parentNode.insertBefore(infoContainer, lastInsertedElement.nextSibling);
                            lastInsertedElement = infoContainer; // Обновляем последний вставленный элемент
                        }
                    });
                })
                    .catch(error => console.error('Ошибка получения данных с URL:', error));
            });
        }
    }
 
    // Вызываем функцию для Approve продуктов
    processPanel('similar-products', [
        // Конфигурация для обработки панели similar_products
        // Изменения цветов
        {
            selector: '[id^="td_user_name_"]', // Имя пользователя
            useLastElement: true,
            style: { color: "#007bff", fontWeight: "bold", display: "block" }, // Жирный синий цвет текста
        },
        {
            selector: '#CategoryId', // Категория
            extractor: el => `${el.options[el.selectedIndex].text}`,
            style: { color: "black" }, // Чёрный цвет текста
        },
        {
            selector: '#product-tag-list', // Теги
            style: { color: "black", fontStyle: "italic", display: "block" }, // Курсив чёрный цвет текста
        }
    ]);
 
     // Вызываем функцию для BP продуктов
    processPanel('similar-bp-products', [
        // Конфигурация для обработки панели similar_bp_products
        // Изменения цветов
        {
            selector: '[id^="td_user_name_"]',
            useLastElement: true,
            style: { color: "red", fontWeight: "bold" }, // Жирный красный цвет текста
            addBreak: true // Добавляем перенос строки после имени пользователя
        },
        {
            selector: '#Notes',
            attribute: 'value', // Указываем, что содержимое находится в атрибуте value
            style: { color: "#444" }, // Тёмно-серый цвет текста
            // Не добавляем addBreak: true, если не нужен дополнительный перенос строки после комментария
        }
    ]);
 
    // Вызываем функцию обработки панели similar_products
    processSimilarProductsPanel();
 
})();