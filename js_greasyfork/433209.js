// ==UserScript==
// @name        iks: virtonomica оптовое строительство
// @namespace   virtonomica
// @description Автоматический запуск постройки нескольких подразделений одного типа, кроме офисов и гос.предприятий
// @include     http*://*virtonomic*.*/*/main/unit/create/*
// @icon            https://www.google.com/s2/favicons?domain=virtonomica.ru
// @version     1.1.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/433209/iks%3A%20virtonomica%20%D0%BE%D0%BF%D1%82%D0%BE%D0%B2%D0%BE%D0%B5%20%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/433209/iks%3A%20virtonomica%20%D0%BE%D0%BF%D1%82%D0%BE%D0%B2%D0%BE%D0%B5%20%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE.meta.js
// ==/UserScript==


/**************************************************/


var run = function () {
    const MAXUNITS=1000;
    let isCreateSeriesBinded = false;
    let seriesCount = 1;
    let seriesCreated = 0;
    let isCreateExec = false;
    let buy_unit;

    let indexouc = document.location.href.indexOf("/unit/create");
    let companyId = document.location.href.substring(indexouc + 13);
    let jn = companyId.match(/\d+/g);
    companyId = jn.join('').trim();
    console.log(companyId);

    let errors = {
        '-100': 'Ошибка при создании предприятия. Возможно, у вас не хватило средств на постройку, покупку и внедрение технологии, или вы ввели некорректные данные.',
        '-10': 'Ошибка при создании предприятия. У компании нет офиса в регионе, где создаётся предприятие.',
        '-20': 'Ошибка при создании предприятия. Компания уже имеет офис в выбранном регионе.',
        '-30': 'Ошибка при создании предприятия. У компании недостаточно средств для покупки земли.',
        '-40': 'Ошибка при создании предприятия. У компании недостаточно средств для покупки технологии.',
        '-50': 'Ошибка при создании предприятия. У компании недостаточно средств для покупки месторождения.',
        '-60': 'Ошибка при создании предприятия. У компании недостаточно средств для въезда в новое помещение.',
        '-70': 'Ошибка при создании предприятия. В выбранном городе нет свободных площадей для создания выбранного предприятия. Возможно, вас опередили другие игроки.',
        '-80': 'Ошибка при создании предприятия. Выбранное месторождение недоступно. Возможно, вас опередили другие игроки.',
        '-90': 'Ошибка при создании предприятия. Недостаточно денег',
    };



    buy_unit = function (args, token) {
        if (seriesCreated < seriesCount && isCreateExec) {
            ApiConnection.post({
                base_url: '/api/',
                url: '?action=company/build&app=adapter_vrt',
                token: token,
                id: companyId,
                kind: UnitCreateWizard.get('unittype').kind,
                name: UnitCreateWizard.name,
                args: args
            }).then(function (res) {
                if (parseInt(res) > 0) {
                    seriesCreated++;
                    console.log('created: ' + seriesCreated);
                    buy_unit(args, token);
                } else {
                    $('.alert_slots .alert').text(errors[res]);
                    $('.alert_slots').show();
                    isCreateExec = false;
                    $('button#createSeriesButton').show();
                    $('button#cancelSeriesButton').hide();
                }
            });
        } else {
            isCreateExec = false;
            $('button#createSeriesButton').show();
            $('button#cancelSeriesButton').hide();
        }

        $("div#createSeriesInfo").html('<span class="margin-5-left"><div class="col-sm-12 unit-name">Создано: ' + seriesCreated + ' </div> </span>');

    }

    let buy_units = function (args) {
        $('button#createSeriesButton').hide();
        $('button#cancelSeriesButton').show();
        isCreateExec = true;
        seriesCreated = 0;

        ApiConnection.get({
            base_url: '/api/',
            url: '?action=token&app=virtonomica',
        }).then(function (res) {
            console.log('token: ' + res);
            buy_unit(args, res);
        });

    };



    $('div#mainContent').bind('DOMSubtreeModified', function () {
        let but = $('div#confirm-modal>div[class^="modal-dialog"]>div[class="modal-content"]>div[class="modal-footer"]>button[class^="btn btn-success"]');
        if (but.length == 1) {

            if (!isCreateSeriesBinded) {
                isCreateSeriesBinded = true;
                let modalBody=$('div#confirm-modal>div[class^="modal-dialog"]>div[class="modal-content"]>div[class="modal-body"]');
                let kind = UnitCreateWizard.get('unittype').kind;
                if (['sawmill', 'fishingbase', 'farm', 'orchard', 'villa', 'mine', 'office'].indexOf(UnitCreateWizard.get('unittype').kind) != -1) {
                    modalBody.append('<div class="row"><div class="col-sm-12 unit-name">Создание серии недопустимо</div></div>');
                    return;
                }                
                modalBody.append('<div class="row"><div class="col-sm-12 unit-name"><span class="margin-5-left">Количество: </span><span class="pull-right width60"><input id="seriesCountInput" type="number" min="1" max="'+MAXUNITS+'" class="form-control" value="' + seriesCount + '"/></span></div></div>');
                modalBody.append('<div class="row"  id="createSeriesInfo"></div>');
                modalBody.append('<div class="row"><div class="col-sm-12 unit-name"><span class="pull-right width60"><button id="createSeriesButton" class="btn btn-sm btn-circle">Создание серии</button><button id="cancelSeriesButton" class="btn btn-sm btn-circle">Отмена серии</button></span></div></div>');



                $("button#createSeriesButton").on("click", function () {

                    buy_units({
                        produce_id: UnitCreateWizard.get('produce') ? UnitCreateWizard.get('produce').id : 0,
                        product_id: UnitCreateWizard.get('product') ? UnitCreateWizard.get('product').id : 0,
                        square: UnitCreateWizard.get('size').square ? UnitCreateWizard.get('size').square : 0,
                        city_id: UnitCreateWizard.get('city').id,
                        size: UnitCreateWizard.get('size').size ? UnitCreateWizard.get('size').size : 0,
                        district_id: UnitCreateWizard.get('district') ? UnitCreateWizard.get('district').id : 0
                    });
                });

                $("button#cancelSeriesButton").on("click", function () {
                    isCreateExec = false;

                    $('button#createSeriesButton').show();
                    $('button#cancelSeriesButton').hide();
                });
                $("button#cancelSeriesButton").hide();

                $("input#seriesCountInput").change(function () {
                    seriesCount = parseInt($("input#seriesCountInput").val());
                    if(seriesCount>MAXUNITS)seriesCount=MAXUNITS;
                    else if(seriesCount<1)seriesCount=1;
                    $("input#seriesCountInput").val(seriesCount);
                });

            }

        } else {
            isCreateSeriesBinded = false;
            seriesCount = 1;
            seriesCreated = 0;
            isCreateExec = false;
        }

    });


}

if (window.top == window && (window.location.href.indexOf('main/unit/create') >= 0)) {
    var script = document.createElement('script');
    script.textContent = ' (' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}