// ==UserScript==
// @name         Активные однодневки в дневнике
// @namespace    https://greasyfork.org/en/users/1261878-twice2750
// @version      1.0
// @description  Добавляет активные однодневки с их описаниями в окно дневника персонажа
// @license      MIT
// @match        https://www.fantasyland.ru/cgi/change_info.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488785/%D0%90%D0%BA%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B5%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%B4%D0%BD%D0%B5%D0%B2%D0%BA%D0%B8%20%D0%B2%20%D0%B4%D0%BD%D0%B5%D0%B2%D0%BD%D0%B8%D0%BA%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/488785/%D0%90%D0%BA%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B5%20%D0%BE%D0%B4%D0%BD%D0%BE%D0%B4%D0%BD%D0%B5%D0%B2%D0%BA%D0%B8%20%D0%B2%20%D0%B4%D0%BD%D0%B5%D0%B2%D0%BD%D0%B8%D0%BA%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Добавляем активные однодневки только в окно с дневником персонажа
    if (!document.querySelector('a[href="open_quests_journal.php"]')) {
        return;
    }

    // Находим место, в котором необходимо поместить активные однодневки (после календаря)
    const iElements = document.querySelectorAll('i');
    for (let i = 0; i < iElements.length; i++) {
        const iElement = iElements[i];
        if (iElement.textContent.includes("Календарь:") &&
            iElement.nextElementSibling.tagName == 'TABLE' &&
            iElement.nextElementSibling.getAttribute('align') === 'center' &&
            iElement.nextElementSibling.getAttribute('width') === '100%' &&
            iElement.nextElementSibling.getAttribute('height') === '12') {
            var line = iElement.nextElementSibling;
            break;
        }
    }
    if (!line) {
        console.error('The calendar was not found.');
        return;
    }

    // Определяем заголовок раздела "Активные однодневки"
    var name = document.createElement('i');
    name.innerHTML = "Активные однодневки:";

    // Определяем содержимое раздела "Активные однодневки"
    var quests = document.createElement('div');

    // Создаём GET запрос для загрузки списка однодневок
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.fantasyland.ru/cgi/open_quests_journal.php?mode=3');
    xhr.onload = function() {

        // Запрос был успешно выполнен
        if (xhr.status === 200) {

            // Находим все однодневки
            var parser = new DOMParser();
            var tables = parser.parseFromString(xhr.responseText, 'text/html').querySelectorAll('table.table5');

            // Определяем активные однодневки и загружаем их описания
            for (var i = 0; i < tables.length; i++) {

                // Находим все однодевки с иконкой "В процессе выполнения", их заголовки и идентификаторы
                var image = tables[i].querySelector('img[src="/images/status/status_yellow.gif"]');
                var title = tables[i].querySelector('b');
                var div = tables[i].querySelector('div[id][name]');
                if (image && title && div) {

                    // Создаём GET запрос для загрузки описания активной однодневки
                    var xhr2 = new XMLHttpRequest();
                    xhr2.open('GET', 'https://www.fantasyland.ru/cgi/show_quest_desc.php?quest_id=' + div.id.substring(1) +
                              '&dv=' + div.getAttribute('name'), false);
                    xhr2.onload = function() {

                        // Запрос был успешно выполнен
                        if (xhr2.status === 200) {

                            // Определяем описание однодневки
                            var description = parser.parseFromString(xhr2.responseText, 'text/html').querySelector('table');

                            // Собираем все необходимые данные, относящиеся к активной однодневке
                            var quest = document.createElement('div');
                            quest.append(image, document.createTextNode( '\u00A0' ), title, description);

                            // Добавляем активную однодневку в общий список
                            quests.append(quest);

                        // Запрос не выполнен
                        } else {
                            console.error('Request failed. Status: ' + xhr2.status);
                            return;
                        }
                    };

                    // Отправляем GET запрос для описаний активных однодневок
                    xhr2.send();
                }

                // Добавляем раздел "Активные однодневки" на страницу
                if ( i === tables.length-1) {

                    // Если не была найдена ни одна активная однодевка, то ставим прочерк
                    if (quests.innerHTML === "") {
                        name.innerHTML += ' -';
                    }
                    line.after(name, quests, line.cloneNode(true));
                }
            }

        // Запрос не выполнен
        } else {
            console.error('Request failed. Status: ' + xhr.status);
            return;
        }
    };

    // Отправляем GET запрос для загрузки списка однодневок
    xhr.send();

})();