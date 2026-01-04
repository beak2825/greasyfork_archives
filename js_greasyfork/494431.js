// ==UserScript==
// @name         add Колонки
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add missing columns to the table if they don't exist when task count is 5 or less
// @author       You
// @match        https://tngadmin.triplenext.net/Admin/MyCurrentTask/Active
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494431/add%20%D0%9A%D0%BE%D0%BB%D0%BE%D0%BD%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/494431/add%20%D0%9A%D0%BE%D0%BB%D0%BE%D0%BD%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для извлечения информации о размере, категории и тэге из ссылок
    function extractInfoFromLinks() {
        // Проверяем, равно ли значение в <span id="task-count-total"> 8 или меньше
        var taskCountElement = document.getElementById('task-count-total');
        if (taskCountElement) {
            var taskCount = parseInt(taskCountElement.textContent);
            // Проверяем, содержит ли строка <h3>Moderation tasks:</h3> именно "Moderation tasks:" или "Image Update Tasks:"
            var moderationTasksHeader = document.querySelector('h3');
            if (moderationTasksHeader &&
               (moderationTasksHeader.textContent.trim() === "Moderation tasks:" ||
                moderationTasksHeader.textContent.trim() === "Image Update Tasks:")) {
                // Если оба условия выполнены, продолжаем выполнение скрипта
                if (taskCount <= 5) {
                    // Если задач 5 или меньше, добавляем все три колонки
                    addColumnsToTable(true, moderationTasksHeader.textContent.trim() === "Image Update Tasks:");
                }
            }
        }
    }

    // Функция для добавления колонок в таблицу
    function addColumnsToTable(includeSizeAndCategory, isImageUpdateTasks) {
        // Находим таблицу на странице
        var table = document.querySelector('table');
        if (table) {
            // Находим все строки таблицы
            var rows = table.querySelectorAll('tr');
            // Проходим по каждой строке
            rows.forEach(function(row, index) {
                // Создаем переменные для размера, категории, тэга и ссылки на PDP
                var size = '';
                var category = '';
                var tag = '';
                var pdpLink = '';
                // На первой строке добавляем указанные значения
                if (index === 0) {
                    if (includeSizeAndCategory) {
                        size = 'HxWxD (см)';
                        category = 'Category';
                        tag = 'Gender';
                    } else {
                        size = 'HxWxD (см)';
                    }
                } else {
                    // Находим все ссылки в строке row
                    var links = row.querySelectorAll('a');

                    // Создаем Set для хранения уникальных ссылок
                    var uniqueLinks = new Set();

                    // Проходимся по каждой ссылке
                    links.forEach(function(link) {
                        // Проверяем, содержит ли ссылка подстроку "/Admin/CompareBag/EditBag/"
                        if (link.href.includes("/Admin/CompareBag/EditBag/")) {
                            // Добавляем ссылку в Set для уникальности
                            uniqueLinks.add(link.href);
                        }
                    });

                    // Преобразуем Set обратно в массив, если необходимо
                    var uniqueLinksArray = Array.from(uniqueLinks);

                    // Теперь работаем с уникальными ссылками
                    uniqueLinksArray.forEach(function(uniqueLink) {
                        // Запрашиваем страницу по ссылке
                        fetch(uniqueLink)
                            .then(response => response.text())
                            .then(html => {
                                // Создаем временный элемент для парсинга HTML
                                var tempDiv = document.createElement('div');
                                tempDiv.innerHTML = html;

                                // Извлекаем информацию о тэге продукта
                                var tagElement = tempDiv.querySelector('#product-tag-list');
                                if (tagElement) {
                                    tag = tagElement.textContent.trim().toLowerCase();
                                    tag = tag.charAt(0).toUpperCase() + tag.slice(1); // Первая буква в верхнем регистре
                                }

                                // Извлекаем размеры
                                var depthElement = tempDiv.querySelector('#CurrentDepth');
                                var widthElement = tempDiv.querySelector('#CurrentWidth');
                                var heightElement = tempDiv.querySelector('#CurrentHeight');
                                if (depthElement && widthElement && heightElement) {
                                    var depth = depthElement.value.trim();
                                    var width = widthElement.value.trim();
                                    var height = heightElement.value.trim();
                                    size = height + ' x ' + width + ' x ' + depth;
                                }

                                // Извлекаем информацию о категории
                                var categoryIdElement = tempDiv.querySelector('#CategoryId');
                                if (categoryIdElement) {
                                    category = categoryIdElement.options[categoryIdElement.selectedIndex].text;
                                }

                                // Если это задача "Image Update Tasks", извлекаем ссылку на PDP
                                if (isImageUpdateTasks) {
                                    var pdpElement = tempDiv.querySelector('.Link input#SourceUrl');
                                    if (pdpElement) {
                                        pdpLink = pdpElement.value;
                                    }
                                }

                                // Проверяем наличие Room markings
                                var auditLinkElement = tempDiv.querySelector('.auditLink a');
                                if (auditLinkElement) {
                                    fetch(auditLinkElement.href)
                                        .then(response => response.text())
                                        .then(auditHtml => {
                                            var tempAuditDiv = document.createElement('div');
                                            tempAuditDiv.innerHTML = auditHtml;
                                            var roomMarkingsText = tempAuditDiv.textContent.includes("Room markings were added");
                                            var roomMarkingsStatus = roomMarkingsText ? 'Room added' : 'no Room((';
                                            var roomMarkingsColor = roomMarkingsText ? 'green' : 'red';

                                            // Если категория содержит "Bracelets", проверяем флажок гравитации
                                            if (category.includes("Bracelets")) {
                                                var gravityElement = tempDiv.querySelector('#IsGravityAvailable');
                                                if (gravityElement) {
                                                    var gravityStatus = gravityElement.checked ? 'Gravity on' : 'Gravity off';
                                                    updateRowWithInfo(row, size, category, tag, pdpLink, includeSizeAndCategory, gravityStatus, roomMarkingsStatus, roomMarkingsColor);
                                                } else {
                                                    updateRowWithInfo(row, size, category, tag, pdpLink, includeSizeAndCategory, '', roomMarkingsStatus, roomMarkingsColor);
                                                }
                                            } else {
                                                updateRowWithInfo(row, size, category, tag, pdpLink, includeSizeAndCategory, '', '', '');
                                            }
                                        })
                                        .catch(error => {
                                            console.error('Ошибка получения данных с URL аудита:', error);
                                        });
                                } else {
                                    // Если категория не содержит "Bracelets", обновляем информацию без гравитации и Room markings
                                    updateRowWithInfo(row, size, category, tag, pdpLink, includeSizeAndCategory, '', '', '');
                                }
                            })
                            .catch(error => {
                                console.error('Ошибка получения данных с URL:', error);
                            });
                    });
                }

                // Обновляем первую строку таблицы с указанными значениями
                if (index === 0) {
                    if (includeSizeAndCategory) {
                        var sizeCell = document.createElement('td');
                        sizeCell.textContent = size;
                        var categoryCell = document.createElement('td');
                        categoryCell.textContent = category;
                        var tagCell = document.createElement('td');
                        tagCell.textContent = tag;
                        row.appendChild(sizeCell);
                        row.appendChild(categoryCell);
                        row.appendChild(tagCell);
                    } else {
                        var sizeCell = document.createElement('td');
                        sizeCell.textContent = size;
                        row.appendChild(sizeCell);
                    }
                }
            });
        }
    }

    // Функция для обновления текущей строки таблицы с извлеченной информацией
    function updateRowWithInfo(row, size, category, tag, pdpLink, includeSizeAndCategory, gravityStatus, roomMarkingsStatus, roomMarkingsColor) {
        if (includeSizeAndCategory) {
            var sizeCell = document.createElement('td');
            sizeCell.textContent = size;
            var categoryCell = document.createElement('td');
            categoryCell.innerHTML = category; // Используем innerHTML для возможности вставки дополнительного текста
            var tagCell = document.createElement('td');
            tagCell.textContent = tag;
            row.appendChild(sizeCell);
            row.appendChild(categoryCell);
            row.appendChild(tagCell);
            // Добавляем цветовое оформление для тэга в зависимости от гендера
            var gender = tag.toLowerCase();
            if (gender === "female" || gender === "male" || gender === "unisex" || gender === "infant") {
                tagCell.classList.add(`highlight-${gender}`);
            }

            // Добавляем ссылку на PDP, если она существует
            if (pdpLink) {
                var pdpCell = row.cells[4] || row.insertCell(4);
                pdpCell.innerHTML = ''; // Очистка ячейки перед вставкой
                var pdpLinkElement = document.createElement('a');
                pdpLinkElement.href = pdpLink;
                pdpLinkElement.target = '_blank';
                pdpLinkElement.textContent = 'Source URL';
                pdpCell.appendChild(pdpLinkElement);
            }

            // Добавляем статус гравитации, если он существует, внутрь ячейки категории
            if (gravityStatus) {
                var gravityStatusDiv = document.createElement('div');
                gravityStatusDiv.textContent = gravityStatus;
                gravityStatusDiv.style.color = gravityStatus === 'Gravity on' ? 'green' : 'red';
                gravityStatusDiv.style.fontStyle = 'italic';
                categoryCell.appendChild(gravityStatusDiv);
            }

            // Добавляем статус Room markings, если он существует
            if (roomMarkingsStatus) {
                var roomMarkingsDiv = document.createElement('div');
                roomMarkingsDiv.textContent = roomMarkingsStatus;
                roomMarkingsDiv.style.color = roomMarkingsColor;
                roomMarkingsDiv.style.fontStyle = 'italic';
                categoryCell.appendChild(roomMarkingsDiv);
            }
        } else {
            var sizeCell = document.createElement('td');
            sizeCell.textContent = size;
            row.appendChild(sizeCell);
        }
    }

    // Вызываем функцию при загрузке страницы
    extractInfoFromLinks();
})();