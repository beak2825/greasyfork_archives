// ==UserScript==
// @name            Victory: Очищатор
// @author          BioHazard
// @version         1.03
// @namespace       Victory
// @description     Вывозит лишние расходники со всех услуговых предприятий на заданные в CONST склады
// @include         http*://virtonomica.ru/*/main/company/view/*/unit_list
// @include         /^http.://virtonomica\.ru/\w+/main/company/view/\d+$/
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372044/Victory%3A%20%D0%9E%D1%87%D0%B8%D1%89%D0%B0%D1%82%D0%BE%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/372044/Victory%3A%20%D0%9E%D1%87%D0%B8%D1%89%D0%B0%D1%82%D0%BE%D1%80.meta.js
// ==/UserScript==

let run = function() {
    'use strict';

let i=0,
    units,
    clearAllGoodsButton = $('<button>Очистить склады</button>'),
    goodsID,
    value,
    orderValue,
    shipmentValue,
    warehouse;

const
    CHEM = 7288264,  // Нефте- и химические продукты
    REPAIR = 7288265,// Оборудование, техника, запчасти
    REST = 7288267,  // Продукты питания
    FISH = 7288269,  // Рыбопродукты
    MED = 7288270,   // Медицинские товары
    PROM = 7288272,  // Промышленные товары
    GOODS = 7288273; // Сырье и материалы (только для ткани)

$('.unit-list-2014').before(clearAllGoodsButton);

// warehouse через switch/case в зависимости от страницы предприятий выбирать нужный id склада + для моторного масла, антифриза и омывайки по их id товара - отдельный склад

clearAllGoodsButton.on('click', function () {
units = $('.wborder').filter('[style!="display: none;"]');
    for (i=0; i<units.length; i++) {
        $.ajax({
            url: units[i].children[2].firstElementChild.href + '/consume',
            success: function (data) {
                for (i=0; i<$(data).find('tr > td:nth-child(2) > input').length; i++) {
                    goodsID = $(data).find('tr > td:nth-child(2) > input')[i].name.match(/\d+/)[0];
                    value = parseInt($(data).find('tr > td:nth-child(2) > input')[i].value.match(/\d+/g).join(''));
                    orderValue = parseInt($(data).find('tr > td:nth-child(2) > input').parent().next().next().next().next()[i].innerHTML.match(/\d+/g).join(''));

                    // обработка исключений
                    switch (goodsID) {
                        case '370078': warehouse = CHEM; break;
                        case '422549': warehouse = CHEM; break;
                        case '422550': warehouse = CHEM; break;
                        case '423161': warehouse = PROM; break;
                        case '359856': warehouse = MED; break;
                        case '422433': warehouse = MED; break;
                        case '422432': warehouse = PROM; break;
                        case '1512': warehouse = PROM; break;
                        case '3838': warehouse = PROM; break;
                        case '1499': warehouse = REST; break;
                        case '422552': warehouse = MED; break;
                        case '1482': warehouse = GOODS; break;
                        case '335174': warehouse = FISH; break;
                        default: switch ($('.wborder:nth-child(1) > td:nth-child(3)')[0].className) {
                            case 'info i-repair': warehouse = REPAIR; break;
                            case 'info i-restaurant': warehouse = REST; break;
                            case 'info i-kindergarten': warehouse = PROM; break;
                            case 'info i-medicine': warehouse = MED; break;
                        }
                    }

                    //если условие данного if - true, то склады очистятся полностью (можно заменить === на =)
                    if ($(data).find('tr > td:nth-child(2) > input').parent().next().next().next().next().next().next()[i].innerHTML === "Сырье не используется при текущей специализации предприятия") {
                        shipmentValue = value;
                    }
                    else {
                        shipmentValue = value - orderValue;
                        if (shipmentValue < 0) return;
                    }
                    $.ajax({
                        url: this.url.replace(/consume/,'product_move_to_warehouse/') + goodsID,
                        type: 'POST',
                        data: 'unit=' + warehouse + '&qty=' + shipmentValue + '&doit=ok'
                    });
                }
                console.log(this.url + ' ... done!');
            }

        });
    }
});
};

// Доступ к DOM
let script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);