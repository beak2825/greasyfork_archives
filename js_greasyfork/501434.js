// ==UserScript==
// @name         поиск и сортировка в каталоге
// @namespace    http://tampermonkey.net/
// @version      14.89
// @description  добавляет поиск и сортировку в каталог борды
// @author       шабит хапаев
// @match        https://www.ejchan.cc/*/catalog.html
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/501434/%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%B8%20%D1%81%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%B2%20%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/501434/%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%B8%20%D1%81%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%B2%20%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof active_page === 'undefined' || active_page !== 'catalog') {
        return;
    }

    // добавление стилей
    const styles = `
        .catalog_controls {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
        }
        #search_field {
            border: inset 1px;
            margin-left: 10px;
            padding: 5px;
        }
        #sort_by {
            text-decoration: none;
            cursor: pointer;
            padding: 5px 10px;
            border: 1px solid #000;
            border-radius: 5px;
            background-color: #f0f0f0;
            margin-left: 10px;
        }
        #sort_by:hover {
            background-color: #e0e0e0;
        }
    `;
    $('head').append(`<style>${styles}</style>`);

    // функция фильтрации по поисковому термину
    function filter(searchTerm) {
        $('.replies').each(function() {
            let subject = $(this).children('.intro').text().toLowerCase();
            let comment = $(this).clone().children().remove(':lt(2)').end().text().trim().toLowerCase();
            searchTerm = searchTerm.toLowerCase();

            if (subject.indexOf(searchTerm) === -1 && comment.indexOf(searchTerm) === -1) {
                $(this).parents('div[id="Grid"]>.mix').css('display', 'none');
            } else {
                $(this).parents('div[id="Grid"]>.mix').css('display', 'inline-block');
            }
        });
    }

    // добавление элементов управления
    $('.board-name').after(`
        <div class="catalog_controls">
            <input id="search_field" placeholder="введите запрос">
            <select id="sort_by">
                <option value="random">случайно</option>
                <option value="bump">последний бамп</option>
                <option value="time">время создания</option>
            </select>
        </div>
    `);

    // обработка ввода в поле поиска
    let timeoutHandle;
    $('#search_field').on('input', function() {
        let searchTerm = $(this).val();
        clearTimeout(timeoutHandle);
        timeoutHandle = setTimeout(() => filter(searchTerm), 300);
    });

    // функция сортировки
    function sortThreads(sortBy) {
        let sortedThreads = $('.mix').sort(function(a, b) {
            if (sortBy === 'random') {
                return Math.random() - 0.5;
            } else {
                let aValue = $(a).data(sortBy);
                let bValue = $(b).data(sortBy);
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
        $('#Grid').append(sortedThreads);
    }

    // обработка изменения сортировки
    $('#sort_by').change(function() {
        let value = this.value;
        sortThreads(value);
    });

    // восстановление предыдущей сортировки из localStorage
    let catalog = JSON.parse(localStorage.getItem('catalog') || '{}');
    if (catalog.sort_by !== undefined) {
        $('#sort_by').val(catalog.sort_by).trigger('change');
    }

    $('#sort_by').change(function() {
        let value = this.value;
        catalog.sort_by = value;
        localStorage.setItem('catalog', JSON.stringify(catalog));
    });

})();