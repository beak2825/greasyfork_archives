// ==UserScript==
// @name           Victory: Рассчет требуемого количества работников для заданного выпуска
// @version        0.1
// @namespace      Victory
// @description    Альфа-версия
// @include        https://virtonomica.ru/olga/main/unit/view/*

// @downloadURL https://update.greasyfork.org/scripts/413662/Victory%3A%20%D0%A0%D0%B0%D1%81%D1%81%D1%87%D0%B5%D1%82%20%D1%82%D1%80%D0%B5%D0%B1%D1%83%D0%B5%D0%BC%D0%BE%D0%B3%D0%BE%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B0%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%B2%D1%8B%D0%BF%D1%83%D1%81%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/413662/Victory%3A%20%D0%A0%D0%B0%D1%81%D1%81%D1%87%D0%B5%D1%82%20%D1%82%D1%80%D0%B5%D0%B1%D1%83%D0%B5%D0%BC%D0%BE%D0%B3%D0%BE%20%D0%BA%D0%BE%D0%BB%D0%B8%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%B0%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B4%D0%BB%D1%8F%20%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%B2%D1%8B%D0%BF%D1%83%D1%81%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let realm = location.href.match(/(\w+)\/main/)[1],
        unitID = location.href.match(/\d+/)[0],
        unitInfo = {},
        produceInfo = {};


    $('.unit_box-row:last').after('<div class="unit_box-row">' +
        '<div class="unit_box" style="min-height: 100px; padding: 9px 3px 9px 3px;">' +
        '<h2>Требуемый выпуск</h2>' +
        '<br>' +
        'Требуемый выпуск: <input id="reqOutput" type="text" size="10"> <div id="reqOutputButton" class="unit_button btn-virtonomics-unit">Рассчитать</div>' +
        '</div>' +
        '</div>');


$('#reqOutputButton').click(function () {
    if ($('#makeMagic').length===0) { //если это первое нажатие на кнопку, то прорисовать поля и заполнить объекты с информацией для рассчета
        $('#reqOutputButton').after('<div id="reqWorkers" style="padding: 10px">Требуется работников: <span><img style="display: none" src="https://virtonomica.ru/img/loading/small.gif"></span></div><div id="reqEquip" style="padding: 10px">Требуется оборудования: <span><img style="display: none" src="https://virtonomica.ru/img/loading/small.gif"></span></div><div id="makeMagic" class="unit_button btn-virtonomics-unit">Применить</div>');

        $('#reqWorkers>span>img').show();
        $('#reqEquip>span>img').show();

        $.getJSON('https://virtonomica.ru/api/'+realm+'/main/unit/summary?id='+unitID, function(unitInfoJson){
            unitInfo.produceId = unitInfoJson['unit_type_produce_id'];
            unitInfo.unitTypeId = unitInfoJson['unit_type_id'];
            unitInfo.unitSize = unitInfoJson['size']; //в блоках
            unitInfo.employeeMax = unitInfoJson['employee_max'];
            unitInfo.equipmentMax = unitInfoJson['equipment_max'];
            unitInfo.tech = unitInfoJson['technology_level'];
            $.getJSON('https://virtonomica.ru/api/'+realm+'/main/unittype/produce?id='+unitInfo.unitTypeId, function(produceInfoJson){
                produceInfo.name = produceInfoJson[unitInfo.produceId].name;

                let obj = produceInfoJson[unitInfo.produceId].input;

                produceInfo.input = {};
                for (let key in obj){
                    produceInfo.input[obj[key]['id']] = obj[key]['qty'];
                }

                obj = {};
                obj = produceInfoJson[unitInfo.produceId].output;

                produceInfo.output = {};
                for (let key in obj){
                    produceInfo.output['qty'] = obj[key]['qty'];
                    produceInfo.output['labor'] = obj[key]['labor'];
                    break;
                }

            }).complete(function () {
                $('#reqEquip').after('<div style="padding: 10px">Производимая продукция: '+produceInfo.name+'</div>');
                calculate();
            });
        });
    }
    else {
        calculate();
    }
});

function calculate() {
    $('#reqWorkers>span>img').hide();
    $('#reqEquip>span>img').hide();

    let reqWorkers,
        reqEquip,
        inputValue = $('#reqOutput').val(),
        techMultiplicator = Math.pow(1.05,unitInfo.tech-1);

    reqEquip = Math.ceil(((inputValue/produceInfo.output.qty)*produceInfo.output.labor)/techMultiplicator);

    $('#reqWorkers>span').html(reqEquip*(unitInfo.employeeMax/unitInfo.equipmentMax));
    $('#reqEquip>span').html(reqEquip);
}
    
})(window);