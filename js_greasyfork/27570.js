// ==UserScript==
// @name           Victory: максимальная реклама
// @namespace      Victory_max_advert
// @description    Установка максимальной рекламы
// @version        2.0.0
// @include        *virtonomic*.*/*/main/unit/view/*/virtasement*
// @downloadURL https://update.greasyfork.org/scripts/27570/Victory%3A%20%D0%BC%D0%B0%D0%BA%D1%81%D0%B8%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/27570/Victory%3A%20%D0%BC%D0%B0%D0%BA%D1%81%D0%B8%D0%BC%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D0%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';


    // Функция обновления выставленной суммы рекламы
    // function set_advertising_budget (budget) {
    //     let token = '',
    //         unit_id = document.location.href.replace(/\D+/g,''),
    //         city_id = 0,
    //         type_id = 0;
    //
    //     // Получаем токен
    //     $.ajax({
    //         url: 'https://virtonomica.ru/api/?app=system&action=token&format=json&base_url=%2Fapi%2F&method=GET',
    //         type: "get",
    //         async: false,
    //         success: function (data) {
    //             token = data;
    //         }
    //     });
    //
    //     // Загружаем апи предприятия
    //     $.ajax({
    //         url: 'https://virtonomica.ru/api/olga/main/unit/summary?id=' + unit_id,
    //         type: "get",
    //         async: false,
    //         success: function (data) {
    //             city_id = +data['city_id'];
    //         }
    //     });
    // }

    // Функция выставления значения рекламы
    function calculate_advertising_budget (modifier, max_advert_budget) {
        let price = +$("input[name='cost']").val().replace(/\s/g, "") / +$("span[data-name='countact_count']").text().replace(/\s/g, ""),// стоимость одного контакта. Вычисляем косвенно
            people = +$("span[data-name='population']").text().replace(/\s/g, ""),// количество жителей в городе
            advert_budget = Math.floor((price - 0.0005) * 10000) / 10000 * modifier * people;// выставляемый рекламный бюджет

        if (advert_budget > max_advert_budget) {
            advert_budget = max_advert_budget;
        }

        $("input[name='cost']").val(advert_budget.toFixed(0));

        $("button[id='unit-marketing-set-button']").trigger('click');
        //location.reload();
    }


    // Промис получает значение квалификации Маркетинга
    new Promise(function (resolve) {
        $.getJSON('https://virtonomica.ru/api/olga/main/user/competences/browse'
                  , function(data){
            resolve(data);
        })
    }).then(function (data) {
        let competence = +data['2234']['value']+data['2234']['bonus'],
            max_advert_budget = 200000 * Math.pow(competence, 1.4);


        // Выставление максимальной рекламы по квале
        var max = $('<button>').append('Макс').click( function() {
            $("input[name='cost']").val(max_advert_budget.toFixed(0));

            $("button[id='unit-marketing-set-button']").trigger('click');
            //location.reload();
        });


        // Кнопки под различный размер бюджета
        let x3100 = $('<button>').append('x3100').on('click', function() {
            calculate_advertising_budget (3100, max_advert_budget);
        }),
            x1600 = $('<button>').append('x1600').on('click', function() {
            calculate_advertising_budget (1600, max_advert_budget);
        }),
            x250 = $('<button>').append('x250').on('click', function() {
            calculate_advertising_budget (250, max_advert_budget);
        }),
            x100 = $('<button>').append('x100').on('click', function() {
            calculate_advertising_budget (100, max_advert_budget);
        }),
            x50 = $('<button>').append('x50').on('click', function() {
            calculate_advertising_budget (50, max_advert_budget);
        }),
            x25 = $('<button>').append('x25').on('click', function() {
            calculate_advertising_budget (25, max_advert_budget);
        }),
            x10 = $('<button>').append('x10').on('click', function() {
            calculate_advertising_budget (10, max_advert_budget);
        }),
            x5 = $('<button>').append('x5').on('click', function() {
            calculate_advertising_budget (5, max_advert_budget);
        }),
            minus = $('<button>').append('-100kk').on('click', function() {
            let number = -5000000000000000;
            $("input[name='cost']").val(number);

            $("button[id='unit-marketing-set-button']").trigger('click');
            //location.reload();
        });

        $("button[id='unit-marketing-stop-button']").after('<br>',max, x3100, x1600, x250, x100, x50, x25, x10, x5, minus);

    })

})(window);