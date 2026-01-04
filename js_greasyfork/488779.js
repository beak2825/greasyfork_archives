// ==UserScript==
// @name         Доп. расположения полоски здоровья
// @namespace    https://greasyfork.org/en/users/1261878-twice2750
// @version      1.2
// @description  Добавляет полоску здоровья на все вкладки окна с информацией о персонаже и на страницу входа в игру, после нажатия на кнопку выход
// @license      MIT
// @match        https://www.fantasyland.ru/cgi/change_info.php
// @match        https://www.fantasyland.ru/ch/inp.php
// @match        https://www.fantasyland.ru/
// @match        https://www.fantasyland.ru/main.php
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/488779/%D0%94%D0%BE%D0%BF%20%D1%80%D0%B0%D1%81%D0%BF%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%BF%D0%BE%D0%BB%D0%BE%D1%81%D0%BA%D0%B8%20%D0%B7%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%D1%8C%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/488779/%D0%94%D0%BE%D0%BF%20%D1%80%D0%B0%D1%81%D0%BF%D0%BE%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%BF%D0%BE%D0%BB%D0%BE%D1%81%D0%BA%D0%B8%20%D0%B7%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%D1%8C%D1%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Функция отрисовки полоски здоровья
    function drawHPBar(url) {

        // Отрисовка полоски здоровья производится на странице входа в игру
        if (url === "https://www.fantasyland.ru/?e") {

            // Находим место, в котором необходимо поместить полоску здоровья
            var target = document.querySelector('.content2');

            // Определяем полоску здоровья
            var hpbar = document.createElement('table');
            hpbar.innerHTML = GM_getValue('hpbar', 'empty');

            // Определяем скрипт обновления полоски здоровья
            var script = document.createElement('script');
            script.innerHTML = GM_getValue('script');

            // Добавляем на страницу полоску здоровья и скрипт
            target.insertBefore(hpbar, target.firstChild);
            document.body.appendChild(script);
        }

        // Отрисовка полоски здоровья производится в окне с информацией о персонаже
        else {

            // Находим линию, после которой необходимо поместить полоску здоровья
            var line = document.querySelector('table[align="center"][width="100%"][height="12"]');

            // Определяем полоску здоровья
            var hpbar = document.createElement('table');
            hpbar.innerHTML = GM_getValue('hpbar');

            // Определяем скрипт обновления полоски здоровья
            var script = document.createElement('script');
            script.innerHTML = GM_getValue('script');

            // Добавляем на страницу полоску здоровья, дополнительную линию и скрипт
            if (hpbar) {
                line.after(hpbar, line.cloneNode(true), script);
            }
        }
    }

    // Функция получения данных для отображения полоски здоровья
    function getHPBar(url) {

        // Создаём POST запрос для загрузки данных о персонаже
        var formData = new FormData();
        formData.append('1.x', '');
        formData.append('1.y', '');
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.fantasyland.ru/cgi/change_info.php');
        xhr.onload = function() {

            // Запрос был успешно выполнен
            if (xhr.status === 200) {

                // Создаём скрытий элемент div и помещаем в него результаты запроса
                var hiddenDiv = document.createElement('div');
                hiddenDiv.innerHTML = xhr.responseText;

                // Определяем полоску здоровья
                var hpbar = hiddenDiv.querySelector('td#hp1').closest('table').innerHTML;
                GM_setValue('hpbar', hpbar);

                // Определяем скрипт обновления полоски здоровья
                var script = hiddenDiv.querySelector('script[language=javascript]').innerHTML;
                GM_setValue('script', script);

                // Данные получены для отображения полоски здоровья на странице входа после выхода из игры
                if (url === "https://www.fantasyland.ru/ch/inp.php") {

                    // Включаем отображение полоски здоровья на странице входа в игру
                    GM_setValue('loginpage', 'true');

                    // Выходим из игры
                    document.location.href = '../cgi/exit.php';
                }

                // Данные получены для отображения полоски здоровья в окне с информацией о персонаже
                else {
                    drawHPBar(url);
                }

            // Запрос не выполнен
            } else {
                console.error('Request failed. Status: ' + xhr.status);

                // Если при получении данных была ошибка, то всё равно выходим из игры
                if (url === "https://www.fantasyland.ru/ch/inp.php") {
                    document.location.href = '../cgi/exit.php';
                }
            }
        };

        // Отправляем POST запрос
        xhr.send(formData);
    }

    // Получаем данные для полоски здоровья перед выходом из игры
    if (window.location.href === "https://www.fantasyland.ru/ch/inp.php") {

        // Находим кнопку выхода из игры
        var exit = document.querySelector('img[name="Chat_Exit"]');

        // Меняем действие при нажатии на кнопку
        exit.onclick = null;
        exit.addEventListener('click', function () {
            if (confirm('Выйти из игры?')) {
                getHPBar(window.location.href);
        }});
    }

    // Добавляем полоску здоровья на страницу входа после выхода из игры
    else if (window.location.href === "https://www.fantasyland.ru/?e") {

        // Отображаем полоску здоровья на странице входа сразу после выхода из игры
        // В противном случае она будет отображать некорректные цифры
        if (GM_getValue('loginpage', 'false') === 'true') {
            drawHPBar(window.location.href);
            GM_setValue('loginpage', 'false');
        }
    }

    // Добавляем полоску здоровья в окно с информацией о персонаже
    else if (window.location.href === "https://www.fantasyland.ru/cgi/change_info.php") {

        // Если в окне уже имеется полоска здоровья, то ничего не делаем
        if (document.querySelector('img[WIDTH="20"][HEIGHT="20"][title="Здоровье"]')) {
            return;
        }
        getHPBar(window.location.href);
    }

    // Раздвигаем окно с инфомацией о персонаже так, чтобы всё влезло
    else if (window.location.href === "https://www.fantasyland.ru/main.php") {
        storedLocHeight = locHeight + 20;
        resize(storedLocHeight);
    }
})();