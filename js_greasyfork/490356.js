// ==UserScript==
// @name         Сохранение настроек фильтра чата и вкладки информации о персонаже
// @namespace    https://greasyfork.org/en/users/1261878-twice2750
// @version      1.0
// @description  Автоматически настраивает фильтры чата и открывает нужную вкладку с информацией о персонаже при запуске игры, сохраняя последние настройки
// @license      MIT
// @match        https://www.fantasyland.ru/cgi/ch_who.php
// @match        https://www.fantasyland.ru/ch/chout.php
// @match        https://www.fantasyland.ru/cgi/show_info.php
// @match        https://www.fantasyland.ru/cgi/change_info.php
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/490356/%D0%A1%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B5%D0%BA%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%B0%20%D1%87%D0%B0%D1%82%D0%B0%20%D0%B8%20%D0%B2%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D0%B8%20%D0%BE%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%B6%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/490356/%D0%A1%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BD%D0%B0%D1%81%D1%82%D1%80%D0%BE%D0%B5%D0%BA%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%B0%20%D1%87%D0%B0%D1%82%D0%B0%20%D0%B8%20%D0%B2%D0%BA%D0%BB%D0%B0%D0%B4%D0%BA%D0%B8%20%D0%B8%D0%BD%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%86%D0%B8%D0%B8%20%D0%BE%20%D0%BF%D0%B5%D1%80%D1%81%D0%BE%D0%BD%D0%B0%D0%B6%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция сохранения состояния фильтров чата
    function SortListSave() {
        GM_setValue("stateSortSave", stateSort);
        GM_setValue("currentStateSave", currentState);
        GM_setValue("lastSortFuncSave", lastSortFunc.name);
    }

    // Функция сохранения порядкового номера открытого чата
    function curChannelSave() {
        GM_setValue("cur_channel", top.chat.chout.cur_channel);
    }

    // Функция сохранения имени открытой вкладки окна с информацией о персонаже
    function tabSave(name) {
        GM_setValue('tabName', name);
    }

    // При следующем открытии игры, сортируем список игроков, так как это было в последний раз, и изменяем действие задействованных кнопок
    if (window.location.href === "https://www.fantasyland.ru/cgi/ch_who.php") {
        window.addEventListener('load', function () {

            // Загружаем состояние фильтров списка игроков
            stateSort = GM_getValue("stateSortSave", [true, false, false, false]);
            currentState = GM_getValue("currentStateSave", 0);
            lastSortFunc = top.chat.chwho.window[GM_getValue("lastSortFuncSave", "byNick")];

            // Сортируем список игроков
            nList.sort(lastSortFunc);

            // Находим кнопки "А-я", "Lvl", "Клан" и "Гильдия"
            var filters = document.querySelectorAll('button[onclick^="SortList"], button[onclick="CheckClanChat();"]');
            filters.forEach( button => {
                // Добавляем действие при нажатии на кнопки
                button.addEventListener('click', function onclick(event) {
                   SortListSave();
                });
            });
        });

    // При следующем открытии игры, переходим в чат, который был открыт в последний раз, и изменяем действие задействованных кнопок
    } else if (window.location.href === "https://www.fantasyland.ru/ch/chout.php") {
        window.addEventListener('load', function(){

            // Загружаем номер чата
            let savedChannel = GM_getValue("cur_channel", 0);

            // Переходим в чат, который был открыт ранее, если он ещё доступен для персонажа
            if (channels[savedChannel]) {
                set_channel(savedChannel);
            }
            else {
                set_channel(0);
            }

            // Обновляем список игроков в лабиринте или в пустоши в клановом чате, если включен соответствующий скрипт
            if (top.chat.chwho.document.ChRefLoc) {
                top.chat.chwho.document.ChRefLoc();
            }

            // Находим кнопки переключения чатов
            var chats = parent.chch.document.querySelector('#moo');
            if (chats) {
                // Добавляем действие при нажатии на кнопки
                chats.addEventListener('click', function onclick(event) {
                    curChannelSave();
                });
            }
        });

    // При следующем открытии игры, переходим на ту вкладку окна с информацией о персонаже, которая была открыта в последний раз
    } else if (window.location.href === "https://www.fantasyland.ru/cgi/show_info.php") {
        window.addEventListener('load', function(){
            let tabName = 'input[name="' + GM_getValue('tabName', 1) + '"]';
            document.querySelector(tabName).click();
        });

    // Находим кнопки переключения вкладок окна с информацией о персонаже и добавляем действие при нажатии на них
    } else if (window.location.href === "https://www.fantasyland.ru/cgi/change_info.php") {
        window.addEventListener('load', function(){
            var inputs = document.querySelectorAll('input');
            inputs.forEach(button => {
                button.addEventListener('click', function onclick(event) {
                    tabSave(button.name);
                });
            });
        });
    }
})();


