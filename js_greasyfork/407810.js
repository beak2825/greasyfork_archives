// ==UserScript==
// @name           Spacom Alliance Parser for Tih
// @version        1.0.0
// @namespace      Spacom Alliance Parser for Tih
// @description    Копируем инфу об экономике альянсов
// @include        http*://spacom.ru/?act=game/state
// @downloadURL https://update.greasyfork.org/scripts/407810/Spacom%20Alliance%20Parser%20for%20Tih.user.js
// @updateURL https://update.greasyfork.org/scripts/407810/Spacom%20Alliance%20Parser%20for%20Tih.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Общая схема скрипта
    // Создаём кнопку на странице альянсов. После нажатия кнопки:
    // 1. Находим все имеющиеся альянсы
    // 2. Заходим в каждый альянс
    // 3. Составляем таблицу, хранящую информацию об экономике каждого игрока из каждого альянса
    // 4. Подготавливаем таблицу с выходными данными
    // 5. Копируем выходные данные в буфер обмена

    let start_parser = $('<input>').prop('value', 'Собрать данные по альянсам').attr('type', 'button').on('click', function() {
        start_parsing();
    }),
        alliances = {},
        alliances_length = 0;


    // Размещаем кнопку
    $('h2').after(start_parser);


    // Функция запуска парсера
    function start_parsing() {
        parse_alliances_list();
    }


    // Функция парсинга списка всех альянсов
    function parse_alliances_list() {
        // Выдёргиваем айди и названия всех альянсов из общего списка
        $('div#rating > * > a[href*="state&state_id="]').each(function () {
            let alliance_id = $(this).attr('href').replace(/\D+/g,''),
                alliance_name = $(this).text();

            alliances[alliances_length] = {
                'id': alliance_id,
                'name': alliance_name
            };

            alliances_length++;

            // console.log(alliances);
        })

        // Запускаем функцию считывания экономики игроков из каждого альянса
        parse_alliances_players();
    }


    // Функция парсинга экономики игроков всех найденных альянсов
    function parse_alliances_players() {
        // Проходим по странице каждого из найденных альянсов
        for (let alliance in alliances) {
            $.ajax({
                url: 'https://spacom.ru/?act=game/state&state_id=' + alliances[alliance]['id'],
                async: false,
                success: function (data) {
                    alliances[alliance]['players'] = {};

                    // Проходим по каждому игроку альянса и вносим информацию
                    $(data).find('div.viewLine').each(function() {
                        let player_name = $(this).children().eq(0).text().replace(/\s/g,''),
                            player_population = $(this).children().eq(1).text().replace(/\s/g,''),
                            player_credits = $(this).children().eq(2).text().replace(/\s/g,''),
                            player_science = $(this).children().eq(3).text().replace(/\s/g,'');

                        // Заполняем информацию об альянсе данными игроков
                        alliances[alliance]['players'][player_name] = {
                            'name': player_name,
                            'population': player_population,
                            'credits': player_credits,
                            'science': player_science
                        };
                    })
                }
            })
        }

        // Запускаем функцию трансформации объекта с информацией об альянсах в таблицу под Эксель
        transform_to_table();

        console.log(alliances);
    }


    // Функция трансформации из объекта в таблицу
    function transform_to_table() {
        let table = $('<table id="stat_table">');

        // Делаем таблицу из одной строки и нескольких столбцов. В получившиеся ячейки вставим таблицы с разными альянсами
        for (let i = 0; i < alliances_length; i++) {
            let td = $('<td>'),
                inner_table = '<table>';

            // Добавляем название альянса
            inner_table += '<tr><td>' + alliances[i]['name'] + '</td></tr>';

            // Добавляем строку с названиями столбцов
            inner_table += '<tr><td>Игрок</td><td>Население</td><td>Кредиты</td><td>Наука</td></tr>';

            // Добавляем информацию по каждому игроку
            for (let player in alliances[i]['players']) {
                inner_table +=  '<tr><td>' + alliances[i]['players'][player]['name'] + '</td><td>' + alliances[i]['players'][player]['population'] + '</td><td>' + alliances[i]['players'][player]['credits'] + '</td><td>' + alliances[i]['players'][player]['science'] + '</td></tr>';
            }

            // Закрываем таблицу
            inner_table += '</table>';

            //console.log('inner_table = ' + inner_table);

            td.append(inner_table);

            //console.log('td = ' + td);

            table.append(td).append('<td>');
        }

        $('body').after(table);

        selectElementContents(document.getElementById('stat_table'));

        alert('Готово! Жмакай ctrl-c после этого окошка');
    }


    // Функция выделения всей таблицы для последующего копирования
    function selectElementContents(el) {
        var body = document.body, range, sel;
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(el);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(el);
                sel.addRange(range);
            }
        } else if (body.createTextRange) {
            range = body.createTextRange();
            range.moveToElementText(el);
            range.select();
        }
    }

})();