 // ==UserScript==
// @name           Victory: регулировка
// @version        4.00
// @namespace      Victory
// @description    Регулировка розничных предприятий
// @include        http*://*virtonomic*.*/olga/main/*
// @downloadURL https://update.greasyfork.org/scripts/29961/Victory%3A%20%D1%80%D0%B5%D0%B3%D1%83%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/29961/Victory%3A%20%D1%80%D0%B5%D0%B3%D1%83%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function () {
    /*function parseInfo(k,p,units) {
        $('body').append('<div id="storage" style="display: none;"><div id="storage1"></div><div id="storage2"></div><div id="storage3"></div><div id="storage4"></div></div>');
        var companyID = $('a.dashboard').attr('href').match(/\d+/)[0];
        var l = 0;

        $.ajax({
            url: 'https://virtonomica.ru/olga/main/common/util/setpaging/reportcompany/serviceReportByType/5000',
            async: false,
        });
        $('#storage1').load('https://virtonomica.ru/olga/main/company/view/' + companyID + '/marketing_report/services/422825 #mainContent', function() {
             l += 1;
            if (l == 4) loop(k,p,units);
        });
        $('#storage2').load('https://virtonomica.ru/olga/main/company/view/' + companyID + '/marketing_report/services/359926 #mainContent', function() {
             l += 1;
            if (l == 4) loop(k,p,units);
        });
        $('#storage3').load('https://virtonomica.ru/olga/main/company/view/' + companyID + '/marketing_report/services/423707 #mainContent', function() {
             l += 1;
            if (l == 4) loop(k,p,units);
        });
        $('#storage4').load('https://virtonomica.ru/olga/main/company/view/' + companyID + '/marketing_report/services/373265 #mainContent', function() {
             l += 1;
            if (l == 4) loop(k,p,units);
        });


        $.ajax({
            url: 'https://virtonomica.ru/olga/main/company/view/' + companyID + '/marketing_report/services/422825',
            async: true,
            success: function(html){
                $('#storage').append(html);
                l += 1;
                if (l == 4) loop(k,p,units);
            }
        });
        $.ajax({
            url: 'https://virtonomica.ru/olga/main/company/view/' + companyID + '/marketing_report/services/359926',
            async: true,
            success: function(html){
                $('#storage').append(html);
                l += 1;
                if (l == 4) loop(k,p,units);
            }
        });
        $.ajax({
            url: 'https://virtonomica.ru/olga/main/company/view/' + companyID + '/marketing_report/services/423707',
            async: true,
            success: function(html){
                $('#storage').append(html);
                l += 1;
                if (l == 4) loop(k,p,units);
            }
        });
        $.ajax({
            url: 'https://virtonomica.ru/olga/main/company/view/' + companyID + '/marketing_report/services/373265',
            async: true,
            success: function(html){
                $('#storage').append(html);
                l += 1;
                if (l == 4) loop(k,p,units);
            }
        });
    };*/

    function regulate(i,units){
        //Найти тдшку через линк
        /*var a = $('#storage * tr > td > a[href="' + units[i] + '"]');
        if ( a.length ) {
            a.parent().parent().each(function () {
                //Найти специализацию
                var spec = $('td:nth-child(4)', this)[0].childNodes[0].data.match(/([а-яёa-z-]+\s*[а-яёa-z-]+?)/gi).join('');;
                switch(spec)
                {
                    case('Чайная'): valueHyp = 50000; priceMin = 7000; break;
                    case('Салон автосигнализаций'): valueHyp = 25000; priceMin = 3000; break;
                    case('Косметологический центр'): valueHyp = 12000; priceMin = 10000; break;
                    case('Больница'): valueHyp = 500; priceMin = 150000; break;
                    case('Устричный ресторан'): valueHyp = 10000; priceMin = 15000; break;
                    case('Диагностический центр'): valueHyp = 20000; priceMin = 5000; break;
                    case('Станция профилактики'): valueHyp = 40000; priceMin = 6000; break;
                    case('Fish and chips'): valueHyp = 30000; priceMin = 8000; break;
                    case('Кофейня'): valueHyp = 30000; priceMin = 6000; break;
                    case('Стейк ресторан'): valueHyp = 22500; priceMin = 4000; break;
                    case('Ресторан мексиканской кухни'): valueHyp = 25000; priceMin = 6000; break;
                }

                //Найти продажи
                var valueFact = +$('td:nth-child(5)', this)[0].childNodes[0].data.replace(/[^\d\.]/g,'');

                //Найти цену
                var priceFact = +$('td:nth-child(6)', this)[0].childNodes[0].data.replace(/[^\d\.]/g,'');

                var priceHyp;
                if (valueFact != 0 && priceFact != 0) {
                    //if (valueFact != valueHyp) priceHyp = priceFact / Math.sqrt(valueHyp / valueFact);
					if (valueFact <= 0.5 * valueHyp) priceHyp = 0.8 * priceFact;
                    if (valueFact > 0.5 * valueHyp) priceHyp = 0.86 * priceFact;
                    if (valueFact > 0.70 * valueHyp) priceHyp = 0.91 * priceFact;
                    if (valueFact > 0.85 * valueHyp) priceHyp = 0.95 * priceFact;
                    if (valueFact > 0.95 * valueHyp) priceHyp = 0.97 * priceFact;
                    if (valueFact >= valueHyp) priceHyp = 1.035 * priceFact;
                    if (valueFact > 1.07 * valueHyp) priceHyp = 1.06 * priceFact;

					if (priceHyp <= priceMin) { $('#pricemin-list').append(units[i]); minPriceUnits ++; $('#minPrice-Units').text(minPriceUnits); }

                    unitID = units[i].match(/\d+/)[0];
                    $.ajax({
                        url: 'https://virtonomica.ru/api/olga/main/unit/refresh',
                        async: false,
                        dataType: 'json',
                        type: "post",
                        data: "id=" + unitID + "&token=" + token
                    });
                    $.ajax({
                        url: 'https://virtonomica.ru/api/olga/main/unit/summary?id=' + unitID,
                        async: false,
                        dataType: 'json',
                        type: "get",
                        success: function(json){
                            var storage = $(json);
                            var curAdvert = +storage[0].advertising_cost;

                            var city = +storage[0].city_id;
                            $.each(cityStorage[0], function(j) {
                                if (+cityStorage[0][j].id == city) { cityLevel = +cityStorage[0][j].level; cityPopulation = +cityStorage[0][j].population; }
                            });

                            var advert = 50 * 0.24 * Math.pow(1.2, cityLevel-1) * cityPopulation;
                            advert = advert.toFixed(0);

                            if (advert != curAdvert) {
                                $.ajax({
                                    url: 'https://virtonomica.ru/olga/main/unit/view/' + unitID + '/virtasement',
                                    async: false,
                                    type: "post",
                                    data: 'advertData[type][]=2264&advertData[totalCost]=' + advert
                                });
                            }
                        }
                    });

                    $.ajax({
                        url: units[i],
                        data: 'servicePrice=' + priceHyp.toFixed(0) + '&setprice=Установить+цены',
                        type: "POST",
                        success: function(){
                            unitsDone ++;
                            $('#js-current').text(unitsDone);
                            if (unitsDone == k && unitsDone != units.length) {
                                k = k + units.length;
                                p = p + units.length;
                                if (k < units.length) { loop(k,p,units) }
                                else { loop(units.length,p,units) };
                            };
                        }
                    });
                }
                else {
                    wrongUnits ++;
                    $('#wrong-Units').text(wrongUnits);
                    $('#wrong-list').append(units[i]);
                    unitsDone ++;
                    $('#js-current').text(unitsDone);
                    if (unitsDone == k && unitsDone != units.length) {
                        k = k + units.length;
                        p = p + units.length;
                        if (k < units.length) { loop(k,p,units) }
                        else { loop(units.length,p,units) };
                    };
                }
            })
        }
        else {
            wrongUnits ++;
            $('#wrong-Units').text(wrongUnits);
            $('#holiday-list').append(units[i]);
            unitsHoliday ++;
            $('#holiday-units').text(unitsHoliday);
            unitsDone ++;
            $('#js-current').text(unitsDone);
            if (unitsDone == k && unitsDone != units.length) {
                k = k + units.length;
                p = p + units.length;
                if (k < units.length) { loop(k,p,units) }
                else { loop(units.length,p,units) };
            };
        };
    };*/

        var storage;
        $.ajax({
            url: units[i],
            type: "GET",
            async: false,
            success: function(html){
                storage = $(html);

                //Задаём необходимую реализацию наборов
                var spec = storage.find("td.title:contains('Специализация')").next().text();
                switch(spec)
                {
                    case('Чайная'): valueHyp = 50000; priceMin = 7000; break;
                    case('Салон автосигнализаций'): valueHyp = 25000; priceMin = 3000; break;
                    case('Косметологический центр'): valueHyp = 12000; priceMin = 10000; break;
                    case('Больница'): valueHyp = 500; priceMin = 150000; break;
                    case('Устричный ресторан'): valueHyp = 10000; priceMin = 15000; break;
                    case('Диагностический центр'): valueHyp = 20000; priceMin = 5000; break;
                    case('Станция профилактики'): valueHyp = 40000; priceMin = 6000; break;
                    case('Fish and chips'): valueHyp = 30000; priceMin = 8000; break;
                    case('Кофейня'): valueHyp = 30000; priceMin = 6000; break;
                    case('Стейк ресторан'): valueHyp = 22500; priceMin = 4000; break;
                    case('Ресторан мексиканской кухни'): valueHyp = 25000; priceMin = 6000; break;
                }

                var valueFact = storage.find("table.infoblock:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)")[0].innerHTML;
                valueFact = valueFact.match(/\d[.\s\d]*(?=)/g);
                valueFact = valueFact[0].replace(/[^\d\.]/g,'');
                var priceFact = parseInt( storage.find("td:contains('Цена на момент пересчёта')").next().text().replace(/[^\d\.]/g,'') );
                var priceHyp;
                if (valueFact != 0 && priceFact != 0) {
                    //if (valueFact != valueHyp) priceHyp = priceFact / Math.sqrt(valueHyp / valueFact);
                    if (valueFact <= 0.5 * valueHyp) priceHyp = 0.8 * priceFact;
                    if (valueFact > 0.5 * valueHyp) priceHyp = 0.86 * priceFact;
                    if (valueFact > 0.70 * valueHyp) priceHyp = 0.91 * priceFact;
                    if (valueFact > 0.85 * valueHyp) priceHyp = 0.95 * priceFact;
                    if (valueFact > 0.95 * valueHyp) priceHyp = 0.97 * priceFact;
                    if (valueFact >= valueHyp) priceHyp = 1.035 * priceFact;
                    if (valueFact > 1.07 * valueHyp) priceHyp = 1.06 * priceFact;

                    if (priceHyp <= priceMin) { $('#pricemin-list').append(units[i]); minPriceUnits ++; $('#minPrice-Units').text(minPriceUnits); }

                    unitID = units[i].match(/\d+/)[0];
                    $.ajax({
                        url: 'https://virtonomica.ru/api/olga/main/unit/refresh',
                        async: false,
                        dataType: 'json',
                        type: "post",
                        data: "id=" + unitID + "&token=" + token
                    });
                    $.ajax({
                        url: 'https://virtonomica.ru/api/olga/main/unit/summary?id=' + unitID,
                        async: false,
                        dataType: 'json',
                        type: "get",
                        success: function(json){
                            var storage = $(json);
                            var curAdvert = +storage[0].advertising_cost;

                            var city = +storage[0].city_id;
                            $.each(cityStorage[0], function(j) {
                                if (+cityStorage[0][j].id == city) { cityLevel = +cityStorage[0][j].level; cityPopulation = +cityStorage[0][j].population; }
                            });

                            var advert = 50 * 0.24 * Math.pow(1.2, cityLevel-1) * cityPopulation;
                            advert = advert.toFixed(0);

                            if (advert != curAdvert) {
                                $.ajax({
                                    url: 'https://virtonomica.ru/olga/main/unit/view/' + unitID + '/virtasement',
                                    async: false,
                                    type: "post",
                                    data: 'advertData[type][]=2264&advertData[totalCost]=' + advert
                                });
                            }
                        }
                    });

                    $.ajax({
                        url: units[i],
                        data: 'servicePrice=' + priceHyp.toFixed(0) + '&setprice=Установить+цены',
                        type: "POST",
                        success: function(){
                            unitsDone ++;
                            $('#js-current').text(unitsDone);
                            if (unitsDone == k && unitsDone != units.length) {
                                k = k + units.length;
                                p = p + units.length;
                                if (k < units.length) { loop(k,p,units) }
                                else { loop(units.length,p,units) };
                            };
                        }
                    });
                }
                else {
                    wrongUnits ++;
                    $('#wrong-Units').text(wrongUnits);
                    $('#wrong-list').append(units[i] + '<br>');
                    unitsDone ++;
                    $('#js-current').text(unitsDone);
                    if (unitsDone == k && unitsDone != units.length) {
                        k = k + units.length;
                        p = p + units.length;
                        if (k < units.length) { loop(k,p,units) }
                        else { loop(units.length,p,units) };
                    };
                }
            }
        });
    }

    function loop(k,p,units){
        for(var i = p; i < k; i++){
            regulate(i,units);
        };
    };

    var supermegaultrabutton = document.createElement('li');
    supermegaultrabutton.innerHTML = '<a>У</a>';
    //$('li.right').before(supermegaultrabutton);
    supermegaultrabutton.onclick = function() {
        //Записываем список предприятий в формате "ссылка,ссылка,ссылка". Примеры ниже. Нужно заменить тот список, что находится на следующей строке - именно он является основным, второй список для Анны прописан. Если что, то исходный вид такой var unitsStr = ``. Важно именно такие кавычки использовать (находятся на букве Ё)
        var unitsStr = ``
        ;
        var units = unitsStr.split('\n');
        unitsDone = 0;
        wrongUnits = 0;
        unitsHoliday = 0;
        minPriceUnits = 0;
        k = units.length;
        p = 0;


        $.ajax({
            url: 'https://virtonomica.ru/api/olga/main/token',
            async: false,
            dataType: 'json',
            type: "get",
            success: function(json){
                token = $(json).selector;
            }
        });

        //Сбор информации о городах
        $.ajax({
            url: 'https://virtonomica.ru/api/olga/main/geo/city/browse',
            async: false,
            type: "get",
            success: function(json){
                cityStorage = $(json);
            }
        });


        $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.5;" />').height($(window).height()).width($(window).width()).prependTo('body');
        $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено: <span id="js-current"></span>/' + units.length + '<br>Предприятий с 0 продаж или 0 ценой: <span id="wrong-Units"></span><br>Из них предприятий в отпуске: <span id="holiday-units"></span><br>Предприятий с низкой ценой: <span id="minPrice-Units"></span></div><div id="holiday-list" style="display: none;"></div><div id="wrong-list" style="display: none;"></div><div id="pricemin-list" style="display: none;"></div>').width($(window).width()).prependTo('body');
        //parseInfo(k,p,units);
        loop(k,p,units);
    };

    function regulateShop(units, o) {
        var storageShop, sales, supply, price, raspPrice, storage, product, minPrice, priceChanged, link, contractID, unitID;
        var er1 = 0;
        var er2 = 0;
        var er3 = 0;
        var er4 = 0;
        var er5 = 0;
        var er6 = 0;
        var curPrice = [];

        var dataSend = 'action=setprice&setprice=Установить цены';
        var dataSendNull = 'action=setprice&setprice=Установить цены';

        //Сохраняем цену, сбрасываем, ставим распродажу
        $.ajax({
            url: units[o] + '/trading_hall',
            type: "get",
            async: false,
            success: function(html, url){
                storageShop = $(html);

                storageShop.find('#mainContent > form > table.grid > tbody > tr').each(function(i) {
                    if (this.childNodes.length == 29) {
                        contractID = $('td:nth-child(2) > input[type="checkbox"]', this).attr('name').substr(21);
                        curPrice[i] = +($('td:nth-child(10) > input', this).attr('value'));
                        dataSendNull += '&productData[price]' + contractID + '=0';
                    }
                });
                $.ajax({
                    url: units[o] + '/trading_hall',
                    data: dataSendNull,
                    type: "POST",
                    async: false
                });
                $.ajax({
                    url: units[o] + '?old',
                    type: "post",
                    data: 'auto_Price=Распродажные+цены',
                    async: false,
                    success: function(html, url){
                        storageShop = $(html);
                        link = this.url;

                        storageShop.find('#mainContent > form > table.grid > tbody > tr').each(function(i) {
                            if (this.childNodes.length == 29) {
                                contractID = $('td:nth-child(2) > input[type="checkbox"]', this).attr('name').substr(21);
                                sales = +($('td:nth-child(4)', this).text().replace(/[^\d\.]/g,''));
                                supply = +($('td:nth-child(5)', this).text().match(/\d[.\s\d]*(?=)/g)[1].replace(/[^\d\.]/g,''));
                                raspPrice = +($('td:nth-child(10) > input', this).attr('value'));
                                storage = +($('td:nth-child(6)', this).text().replace(/[^\d\.]/g,''));
                                price = curPrice[i];

                                product = $('td:nth-child(3)', this).attr('title');
                                product = product.slice(0, product.indexOf(' (кликните'));

                                //Сюда вносятся ограничения минимальной цены, требуется точное соответствие названия товара. Работает и с ТМками. Не обязательно к добавлению - опционально.
                                switch(product)
                                {
                                    case('Говняшка'):
                                        minPrice = 100;
                                        break;
                                    case('Хуйняшка'):
                                        minPrice = 100;
                                        break;
                                    case('Херняшка'):
                                        minPrice = 100;
                                        break;
                                    case('Провентус'):
                                        minPrice = 1;
                                        break;
                                    case('Биохрендель'):
                                        minPrice = 10000;
                                        break;
                                    default:
                                        minPrice = 0;
                                }

                                if (sales <= 0.2 * supply) priceChanged = 0.85 * price;
                                if (sales > 0.2 * supply) priceChanged = 0.88 * price;
                                if (sales > 0.5 * supply) priceChanged = 0.92 * price;
                                if (sales > 0.7 * supply) priceChanged = 0.95 * price;
                                if (sales > 0.8 * supply) priceChanged = 0.97 * price;
                                if (sales > 0.9 * supply) priceChanged = 0.98 * price;
                                if (sales > 0.97 * supply) priceChanged = 0.99 * price;
                                if (sales == supply) priceChanged = 1.04 * price;
                                if (sales > 1 * supply) priceChanged = 1.005 * price;
                                if (sales > 1.04 * supply) priceChanged = 1.01 * price;
                                if (sales > 1.08 * supply) priceChanged = 1.02 * price;
                                if (sales > 1.15 * supply) priceChanged = 1.03 * price;
                                if (sales > 1.25 * supply) priceChanged = 1.04 * price;

                                if (storage > 2 * supply && sales < supply) priceChanged = priceChanged * 0.97;
                                if (storage > 3 * supply && sales < supply) priceChanged = priceChanged * 0.95;
                                if (storage > 4 * supply && sales < supply) priceChanged = priceChanged * 0.93;

                                if (priceChanged < (raspPrice * 1.2)) {
                                    priceChanged = raspPrice * 1.2;
                                    if (sales < supply) { er6++; }
                                    else { er5++; }
                                }
                                if (priceChanged <= price * 0.85) {
                                    priceChanged = price * 0.85;
                                }

                                if (minPrice > 0 && priceChanged < minPrice) {
                                    priceChanged = minPrice;
                                    er1 ++;
                                }

                                if (price == 0) {
                                    priceChanged = raspPrice * 2.5;
                                }

                                //if (sales > 0 && supply > 0 && price > 0) {
                                    dataSend += '&productData[price]' + contractID + '=' + priceChanged.toFixed(1);
                                //}
                                if (sales === 0) {
                                    er2 ++;
                                }
                                if (supply === 0) {
                                    er3 ++;
                                }
                                if (price === 0) {
                                    er4 ++;
                                }
                            }
                        });
                        if (er1 != 0) {
                            error1 ++;
                            $('#error1-span').text(error1);
                            $('#error1-div').append(link + ' ');
                        }
                        if (er2 != 0) {
                            error2 ++;
                            $('#error2-span').text(error2);
                            $('#error2-div').append(link + ' ');
                        }
                        if (er3 != 0) {
                            error3 ++;
                            $('#error3-span').text(error3);
                            $('#error3-div').append(link + ' ');
                        }
                        if (er4 != 0) {
                            error4 ++;
                            $('#error4-span').text(error4);
                            $('#error4-div').append(link + ' ');
                        }
                        if (er5 != 0) {
                            error5 ++;
                            $('#error5-span').text(error5);
                            $('#error5-div').append(link + ' ');
                        }
                        if (er6 != 0) {
                            error6 ++;
                            $('#error6-span').text(error6);
                            $('#error6-div').append(link + ' ');
                        }

                        unitID = units[o].match(/\d+/)[0];
                        /*$.ajax({
                            url: 'https://virtonomica.ru/api/olga/main/unit/refresh',
                            async: false,
                            dataType: 'json',
                            type: "post",
                            data: "id=" + unitID + "&token=" + token
                        });*/

                        //Выставление рабов и рекламы
                        $.ajax({
                            url: 'https://virtonomica.ru/api/olga/main/unit/summary?id=' + unitID,
                            async: false,
                            dataType: 'json',
                            type: "get",
                            success: function(json){
                                let storage = $(json),
                                    curEmp = +storage[0].employee_count,
                                    curEmpReq = +storage[0].employee_required,
                                    emp;

                                if (curEmp < 1.15 * curEmpReq || curEmp >= 1.2 * curEmpReq) {
                                    emp = 1.15 * curEmpReq;
                                    $.ajax({
                                        url: 'https://virtonomica.ru/olga/window/unit/employees/engage/' + unitID,
                                        async: false,
                                        type: 'post',
                                        data: 'unitEmployeesData[quantity]=' + emp + '&salary_max=100000&target_level=13&trigger=1'
                                    });
                                }

                                //Запрос уровня города
                                /*Старый вид
                                var city = +storage[0].city_id;
                                $.each(cityStorage[0], function(j) {
                                    if (+cityStorage[0][j].id == city) { cityLevel = +cityStorage[0][j].level; cityPopulation = +cityStorage[0][j].population; }
                                });

                                let customers = +storage[0].customers_count;

                                var curAdvert = +storage[0].advertising_cost;

                                var advert = 100 * 0.24 * Math.pow(1.2, cityLevel-1) * cityPopulation;
                                advert = advert.toFixed(0);

                                if (advert != curAdvert) {
                                    $.ajax({
                                        url: 'https://virtonomica.ru/olga/main/unit/view/' + unitID + '/virtasement',
                                        async: false,
                                        type: "post",
                                        data: 'advertData[type][]=2264&advertData[totalCost]=' + advert
                                    });
                                }
                                */

                                let city = +storage[0].city_id;

                                $.each(cityStorage[0], function(j) {
                                    if (+cityStorage[0][j].id == city) { cityLevel = +cityStorage[0][j].level; cityPopulation = +cityStorage[0][j].population; }
                                });

                                let current_advert = +storage[0].advertising_cost,
                                    new_advert,
                                    current_fame = +storage[0].fame,
                                    target_fame,
                                    target_customers = 1600000,
                                    current_customers = +storage[0].customers_count,
                                    ratio,
                                    contact_cost = 0.24 * Math.pow(1.2, cityLevel-1),
                                    max_advert = 100 * contact_cost * cityPopulation,
                                    growth_rate = 9;//9 с инновацией, 6 без


                                target_fame = current_fame + Math.log(target_customers / current_customers);

                                ratio = (Math.exp(target_fame) - Math.exp(current_fame - (Math.pow(current_fame, 2) / 200))) / growth_rate;

                                if (ratio > 30) {
                                    ratio = 30 + Math.pow(ratio - 30, 2);
                                }
                                if (ratio > 1600) {
                                    ratio = 1600;
                                }
                                if (ratio < 0) {
                                    ratio = 0;
                                }

                                new_advert = ratio * contact_cost * cityPopulation;

                                if (new_advert > max_advert) {
                                    new_advert = max_advert;
                                }

                                new_advert = new_advert.toFixed(0);

                                if (new_advert != current_advert) {
                                    $.ajax({
                                        url: 'https://virtonomica.ru/olga/main/unit/view/' + unitID + '/virtasement',
                                        async: false,
                                        type: "post",
                                        data: 'advertData[type][]=2264&advertData[totalCost]=' + new_advert
                                    });
                                }
                            }
                        });

                        /*$.ajax({
                            url: 'https://virtonomica.ru/api/olga/main/unit/refresh',
                            async: false,
                            dataType: 'json',
                            type: "post",
                            data: "id=" + unitID + "&token=" + token
                        });*/

                        $.ajax({
                            url: units[o] + '/trading_hall',
                            data: dataSend,
                            type: "POST",
                            async: false,
                            success: function(){
                                unitsDone ++;
                                $('#js-current').text(unitsDone);
                            }
                        });
                    }
                });
            }
        });
    }

    var supermegaultrabuttonshop = document.createElement('li');
    supermegaultrabuttonshop.innerHTML = '<a>М</a>';
    $('li.right').before(supermegaultrabuttonshop);
    supermegaultrabuttonshop.onclick = function() {
        //Записываем список предприятий
        var unitsStrShop = `https://virtonomica.ru/olga/main/unit/view/7584035
https://virtonomica.ru/olga/main/unit/view/7583987
https://virtonomica.ru/olga/main/unit/view/7583993
https://virtonomica.ru/olga/main/unit/view/7583995
https://virtonomica.ru/olga/main/unit/view/7584005
https://virtonomica.ru/olga/main/unit/view/7584000
https://virtonomica.ru/olga/main/unit/view/7584015
https://virtonomica.ru/olga/main/unit/view/7584011
https://virtonomica.ru/olga/main/unit/view/7584025
https://virtonomica.ru/olga/main/unit/view/7584038
https://virtonomica.ru/olga/main/unit/view/7584040
https://virtonomica.ru/olga/main/unit/view/7584057
https://virtonomica.ru/olga/main/unit/view/7584044
https://virtonomica.ru/olga/main/unit/view/7584042
https://virtonomica.ru/olga/main/unit/view/7584054
https://virtonomica.ru/olga/main/unit/view/7584049
https://virtonomica.ru/olga/main/unit/view/7584065
https://virtonomica.ru/olga/main/unit/view/7584068
https://virtonomica.ru/olga/main/unit/view/7584082
https://virtonomica.ru/olga/main/unit/view/7584066
https://virtonomica.ru/olga/main/unit/view/7584075
https://virtonomica.ru/olga/main/unit/view/7584069
https://virtonomica.ru/olga/main/unit/view/7584084
https://virtonomica.ru/olga/main/unit/view/7584095
https://virtonomica.ru/olga/main/unit/view/7584117
https://virtonomica.ru/olga/main/unit/view/7584110
https://virtonomica.ru/olga/main/unit/view/7584099
https://virtonomica.ru/olga/main/unit/view/7584102
https://virtonomica.ru/olga/main/unit/view/7584126
https://virtonomica.ru/olga/main/unit/view/7584147
https://virtonomica.ru/olga/main/unit/view/7584125
https://virtonomica.ru/olga/main/unit/view/7584146
https://virtonomica.ru/olga/main/unit/view/7584179
https://virtonomica.ru/olga/main/unit/view/7584192
https://virtonomica.ru/olga/main/unit/view/7584209
https://virtonomica.ru/olga/main/unit/view/7584145
https://virtonomica.ru/olga/main/unit/view/7584152
https://virtonomica.ru/olga/main/unit/view/7584132
https://virtonomica.ru/olga/main/unit/view/7584135
https://virtonomica.ru/olga/main/unit/view/7584138
https://virtonomica.ru/olga/main/unit/view/7584142
https://virtonomica.ru/olga/main/unit/view/7584151
https://virtonomica.ru/olga/main/unit/view/7584162
https://virtonomica.ru/olga/main/unit/view/7584197
https://virtonomica.ru/olga/main/unit/view/7584201
https://virtonomica.ru/olga/main/unit/view/7584148
https://virtonomica.ru/olga/main/unit/view/7584170
https://virtonomica.ru/olga/main/unit/view/7584196
https://virtonomica.ru/olga/main/unit/view/7584198
https://virtonomica.ru/olga/main/unit/view/7584186
https://virtonomica.ru/olga/main/unit/view/7584187
https://virtonomica.ru/olga/main/unit/view/7584218
https://virtonomica.ru/olga/main/unit/view/7584185
https://virtonomica.ru/olga/main/unit/view/7584193
https://virtonomica.ru/olga/main/unit/view/7584156
https://virtonomica.ru/olga/main/unit/view/7584165
https://virtonomica.ru/olga/main/unit/view/7584181
https://virtonomica.ru/olga/main/unit/view/7584195
https://virtonomica.ru/olga/main/unit/view/7584204
https://virtonomica.ru/olga/main/unit/view/7584206
https://virtonomica.ru/olga/main/unit/view/7583990
https://virtonomica.ru/olga/main/unit/view/7583988
https://virtonomica.ru/olga/main/unit/view/7584032
https://virtonomica.ru/olga/main/unit/view/7583996
https://virtonomica.ru/olga/main/unit/view/7583998
https://virtonomica.ru/olga/main/unit/view/7584001
https://virtonomica.ru/olga/main/unit/view/7584004
https://virtonomica.ru/olga/main/unit/view/7584012
https://virtonomica.ru/olga/main/unit/view/7584013
https://virtonomica.ru/olga/main/unit/view/7584019
https://virtonomica.ru/olga/main/unit/view/7584030
https://virtonomica.ru/olga/main/unit/view/7584007
https://virtonomica.ru/olga/main/unit/view/7584029
https://virtonomica.ru/olga/main/unit/view/7584010
https://virtonomica.ru/olga/main/unit/view/7584020
https://virtonomica.ru/olga/main/unit/view/7584039
https://virtonomica.ru/olga/main/unit/view/7584056
https://virtonomica.ru/olga/main/unit/view/7584051
https://virtonomica.ru/olga/main/unit/view/7584058
https://virtonomica.ru/olga/main/unit/view/7584045
https://virtonomica.ru/olga/main/unit/view/7584062
https://virtonomica.ru/olga/main/unit/view/7584089
https://virtonomica.ru/olga/main/unit/view/7584078
https://virtonomica.ru/olga/main/unit/view/7584085
https://virtonomica.ru/olga/main/unit/view/7584088
https://virtonomica.ru/olga/main/unit/view/7584063
https://virtonomica.ru/olga/main/unit/view/7584072
https://virtonomica.ru/olga/main/unit/view/7584079
https://virtonomica.ru/olga/main/unit/view/7584083
https://virtonomica.ru/olga/main/unit/view/7584092
https://virtonomica.ru/olga/main/unit/view/7584098
https://virtonomica.ru/olga/main/unit/view/7584120
https://virtonomica.ru/olga/main/unit/view/7584101
https://virtonomica.ru/olga/main/unit/view/7584104
https://virtonomica.ru/olga/main/unit/view/7584105
https://virtonomica.ru/olga/main/unit/view/7584097
https://virtonomica.ru/olga/main/unit/view/7584112
https://virtonomica.ru/olga/main/unit/view/7584103
https://virtonomica.ru/olga/main/unit/view/7584107
https://virtonomica.ru/olga/main/unit/view/7584109
https://virtonomica.ru/olga/main/unit/view/7584139
https://virtonomica.ru/olga/main/unit/view/7584115
https://virtonomica.ru/olga/main/unit/view/7584118
https://virtonomica.ru/olga/main/unit/view/7584124
https://virtonomica.ru/olga/main/unit/view/7584144
https://virtonomica.ru/olga/main/unit/view/7584150
https://virtonomica.ru/olga/main/unit/view/7584133
https://virtonomica.ru/olga/main/unit/view/7584141
https://virtonomica.ru/olga/main/unit/view/7584143
https://virtonomica.ru/olga/main/unit/view/7584176
https://virtonomica.ru/olga/main/unit/view/7584199
https://virtonomica.ru/olga/main/unit/view/7584207
https://virtonomica.ru/olga/main/unit/view/7584149
https://virtonomica.ru/olga/main/unit/view/7584171
https://virtonomica.ru/olga/main/unit/view/7584189
https://virtonomica.ru/olga/main/unit/view/7584166
https://virtonomica.ru/olga/main/unit/view/7584175
https://virtonomica.ru/olga/main/unit/view/7584213
https://virtonomica.ru/olga/main/unit/view/7584211
https://virtonomica.ru/olga/main/unit/view/7584212
https://virtonomica.ru/olga/main/unit/view/7584169
https://virtonomica.ru/olga/main/unit/view/7584174
https://virtonomica.ru/olga/main/unit/view/7584178
https://virtonomica.ru/olga/main/unit/view/7584167
https://virtonomica.ru/olga/main/unit/view/7584172
https://virtonomica.ru/olga/main/unit/view/7584164
https://virtonomica.ru/olga/main/unit/view/7584191
https://virtonomica.ru/olga/main/unit/view/7584215
https://virtonomica.ru/olga/main/unit/view/7584216
https://virtonomica.ru/olga/main/unit/view/7584217
https://virtonomica.ru/olga/main/unit/view/7583989
https://virtonomica.ru/olga/main/unit/view/7583991
https://virtonomica.ru/olga/main/unit/view/7584018
https://virtonomica.ru/olga/main/unit/view/7583985
https://virtonomica.ru/olga/main/unit/view/7584008
https://virtonomica.ru/olga/main/unit/view/7583994
https://virtonomica.ru/olga/main/unit/view/7584031
https://virtonomica.ru/olga/main/unit/view/7583999
https://virtonomica.ru/olga/main/unit/view/7584014
https://virtonomica.ru/olga/main/unit/view/7584027
https://virtonomica.ru/olga/main/unit/view/7584026
https://virtonomica.ru/olga/main/unit/view/7584028
https://virtonomica.ru/olga/main/unit/view/7584037
https://virtonomica.ru/olga/main/unit/view/7584047
https://virtonomica.ru/olga/main/unit/view/7584060
https://virtonomica.ru/olga/main/unit/view/7584071
https://virtonomica.ru/olga/main/unit/view/7584081
https://virtonomica.ru/olga/main/unit/view/7584087
https://virtonomica.ru/olga/main/unit/view/7584074
https://virtonomica.ru/olga/main/unit/view/7584076
https://virtonomica.ru/olga/main/unit/view/7584080
https://virtonomica.ru/olga/main/unit/view/7584077
https://virtonomica.ru/olga/main/unit/view/7584090
https://virtonomica.ru/olga/main/unit/view/7584094
https://virtonomica.ru/olga/main/unit/view/7584100
https://virtonomica.ru/olga/main/unit/view/7584096
https://virtonomica.ru/olga/main/unit/view/7584122
https://virtonomica.ru/olga/main/unit/view/7584119
https://virtonomica.ru/olga/main/unit/view/7584163
https://virtonomica.ru/olga/main/unit/view/7584116
https://virtonomica.ru/olga/main/unit/view/7584173
https://virtonomica.ru/olga/main/unit/view/7584182
https://virtonomica.ru/olga/main/unit/view/7584184
https://virtonomica.ru/olga/main/unit/view/7584127
https://virtonomica.ru/olga/main/unit/view/7584128
https://virtonomica.ru/olga/main/unit/view/7584136
https://virtonomica.ru/olga/main/unit/view/7584137
https://virtonomica.ru/olga/main/unit/view/7584153
https://virtonomica.ru/olga/main/unit/view/7584155
https://virtonomica.ru/olga/main/unit/view/7584129
https://virtonomica.ru/olga/main/unit/view/7584134
https://virtonomica.ru/olga/main/unit/view/7584168
https://virtonomica.ru/olga/main/unit/view/7584183
https://virtonomica.ru/olga/main/unit/view/7584188
https://virtonomica.ru/olga/main/unit/view/7584194
https://virtonomica.ru/olga/main/unit/view/7584202
https://virtonomica.ru/olga/main/unit/view/7584205
https://virtonomica.ru/olga/main/unit/view/7584177
https://virtonomica.ru/olga/main/unit/view/7584190
https://virtonomica.ru/olga/main/unit/view/7584214
https://virtonomica.ru/olga/main/unit/view/7583986
https://virtonomica.ru/olga/main/unit/view/7583983
https://virtonomica.ru/olga/main/unit/view/7583992
https://virtonomica.ru/olga/main/unit/view/7584034
https://virtonomica.ru/olga/main/unit/view/7583984
https://virtonomica.ru/olga/main/unit/view/7583997
https://virtonomica.ru/olga/main/unit/view/7584017
https://virtonomica.ru/olga/main/unit/view/7584022
https://virtonomica.ru/olga/main/unit/view/7584003
https://virtonomica.ru/olga/main/unit/view/7584009
https://virtonomica.ru/olga/main/unit/view/7584033
https://virtonomica.ru/olga/main/unit/view/7584002
https://virtonomica.ru/olga/main/unit/view/7584006
https://virtonomica.ru/olga/main/unit/view/7584023
https://virtonomica.ru/olga/main/unit/view/7584024
https://virtonomica.ru/olga/main/unit/view/7584021
https://virtonomica.ru/olga/main/unit/view/7584041
https://virtonomica.ru/olga/main/unit/view/7584043
https://virtonomica.ru/olga/main/unit/view/7584046
https://virtonomica.ru/olga/main/unit/view/7584048
https://virtonomica.ru/olga/main/unit/view/7584050
https://virtonomica.ru/olga/main/unit/view/7584052
https://virtonomica.ru/olga/main/unit/view/7584055
https://virtonomica.ru/olga/main/unit/view/7584059
https://virtonomica.ru/olga/main/unit/view/7584053
https://virtonomica.ru/olga/main/unit/view/7584061
https://virtonomica.ru/olga/main/unit/view/7584067
https://virtonomica.ru/olga/main/unit/view/7584064
https://virtonomica.ru/olga/main/unit/view/7584073
https://virtonomica.ru/olga/main/unit/view/7584091
https://virtonomica.ru/olga/main/unit/view/7584093
https://virtonomica.ru/olga/main/unit/view/7584106
https://virtonomica.ru/olga/main/unit/view/7584108
https://virtonomica.ru/olga/main/unit/view/7584113
https://virtonomica.ru/olga/main/unit/view/7584114
https://virtonomica.ru/olga/main/unit/view/7584123
https://virtonomica.ru/olga/main/unit/view/7584121
https://virtonomica.ru/olga/main/unit/view/7584130
https://virtonomica.ru/olga/main/unit/view/7584131
https://virtonomica.ru/olga/main/unit/view/7584154
https://virtonomica.ru/olga/main/unit/view/7584180
https://virtonomica.ru/olga/main/unit/view/7584617
https://virtonomica.ru/olga/main/unit/view/7584600
https://virtonomica.ru/olga/main/unit/view/7584579
https://virtonomica.ru/olga/main/unit/view/7584582
https://virtonomica.ru/olga/main/unit/view/7584840
https://virtonomica.ru/olga/main/unit/view/7584817
https://virtonomica.ru/olga/main/unit/view/7584814
https://virtonomica.ru/olga/main/unit/view/7584801
https://virtonomica.ru/olga/main/unit/view/7584734
https://virtonomica.ru/olga/main/unit/view/7584721
https://virtonomica.ru/olga/main/unit/view/7584779
https://virtonomica.ru/olga/main/unit/view/7584767
https://virtonomica.ru/olga/main/unit/view/7584741
https://virtonomica.ru/olga/main/unit/view/7584728
https://virtonomica.ru/olga/main/unit/view/7584743
https://virtonomica.ru/olga/main/unit/view/7584736
https://virtonomica.ru/olga/main/unit/view/7584714
https://virtonomica.ru/olga/main/unit/view/7584701
https://virtonomica.ru/olga/main/unit/view/7584690
https://virtonomica.ru/olga/main/unit/view/7584685
https://virtonomica.ru/olga/main/unit/view/7584737
https://virtonomica.ru/olga/main/unit/view/7584735
https://virtonomica.ru/olga/main/unit/view/7584717
https://virtonomica.ru/olga/main/unit/view/7584698
https://virtonomica.ru/olga/main/unit/view/7584703
https://virtonomica.ru/olga/main/unit/view/7584682
https://virtonomica.ru/olga/main/unit/view/7584663
https://virtonomica.ru/olga/main/unit/view/7584697
https://virtonomica.ru/olga/main/unit/view/7584657
https://virtonomica.ru/olga/main/unit/view/7584656
https://virtonomica.ru/olga/main/unit/view/7584654
https://virtonomica.ru/olga/main/unit/view/7584689
https://virtonomica.ru/olga/main/unit/view/7584633
https://virtonomica.ru/olga/main/unit/view/7584666
https://virtonomica.ru/olga/main/unit/view/7584665
https://virtonomica.ru/olga/main/unit/view/7584651
https://virtonomica.ru/olga/main/unit/view/7584638
https://virtonomica.ru/olga/main/unit/view/7584629
https://virtonomica.ru/olga/main/unit/view/7584628
https://virtonomica.ru/olga/main/unit/view/7584623
https://virtonomica.ru/olga/main/unit/view/7584618
https://virtonomica.ru/olga/main/unit/view/7584611
https://virtonomica.ru/olga/main/unit/view/7584608
https://virtonomica.ru/olga/main/unit/view/7584596
https://virtonomica.ru/olga/main/unit/view/7584585
https://virtonomica.ru/olga/main/unit/view/7584593
https://virtonomica.ru/olga/main/unit/view/7584584
https://virtonomica.ru/olga/main/unit/view/7584613
https://virtonomica.ru/olga/main/unit/view/7584609
https://virtonomica.ru/olga/main/unit/view/7584603
https://virtonomica.ru/olga/main/unit/view/7584595
https://virtonomica.ru/olga/main/unit/view/7584588
https://virtonomica.ru/olga/main/unit/view/7584681
https://virtonomica.ru/olga/main/unit/view/7584587
https://virtonomica.ru/olga/main/unit/view/7584720
https://virtonomica.ru/olga/main/unit/view/7584711
https://virtonomica.ru/olga/main/unit/view/7584680
https://virtonomica.ru/olga/main/unit/view/7584677
https://virtonomica.ru/olga/main/unit/view/7584675
https://virtonomica.ru/olga/main/unit/view/7584674
https://virtonomica.ru/olga/main/unit/view/7584667
https://virtonomica.ru/olga/main/unit/view/7584713
https://virtonomica.ru/olga/main/unit/view/7584712
https://virtonomica.ru/olga/main/unit/view/7584702
https://virtonomica.ru/olga/main/unit/view/7584647
https://virtonomica.ru/olga/main/unit/view/7584691
https://virtonomica.ru/olga/main/unit/view/7584635
https://virtonomica.ru/olga/main/unit/view/7584696
https://virtonomica.ru/olga/main/unit/view/7584652
https://virtonomica.ru/olga/main/unit/view/7584640
https://virtonomica.ru/olga/main/unit/view/7584636
https://virtonomica.ru/olga/main/unit/view/7584679
https://virtonomica.ru/olga/main/unit/view/7584668
https://virtonomica.ru/olga/main/unit/view/7584718
https://virtonomica.ru/olga/main/unit/view/7584632
https://virtonomica.ru/olga/main/unit/view/7584678
https://virtonomica.ru/olga/main/unit/view/7584676
https://virtonomica.ru/olga/main/unit/view/7584687
https://virtonomica.ru/olga/main/unit/view/7584644
https://virtonomica.ru/olga/main/unit/view/7584716
https://virtonomica.ru/olga/main/unit/view/7584660
https://virtonomica.ru/olga/main/unit/view/7584658
https://virtonomica.ru/olga/main/unit/view/7584616
https://virtonomica.ru/olga/main/unit/view/7584597
https://virtonomica.ru/olga/main/unit/view/7584760
https://virtonomica.ru/olga/main/unit/view/7584782
https://virtonomica.ru/olga/main/unit/view/7584810
https://virtonomica.ru/olga/main/unit/view/7584749
https://virtonomica.ru/olga/main/unit/view/7584831
https://virtonomica.ru/olga/main/unit/view/7584836
https://virtonomica.ru/olga/main/unit/view/7584731
https://virtonomica.ru/olga/main/unit/view/7584732
https://virtonomica.ru/olga/main/unit/view/7584842
https://virtonomica.ru/olga/main/unit/view/7584849
https://virtonomica.ru/olga/main/unit/view/7584822
https://virtonomica.ru/olga/main/unit/view/7584827
https://virtonomica.ru/olga/main/unit/view/7584694
https://virtonomica.ru/olga/main/unit/view/7584823
https://virtonomica.ru/olga/main/unit/view/7584850
https://virtonomica.ru/olga/main/unit/view/7584846
https://virtonomica.ru/olga/main/unit/view/7584834
https://virtonomica.ru/olga/main/unit/view/7584833
https://virtonomica.ru/olga/main/unit/view/7584793
https://virtonomica.ru/olga/main/unit/view/7584844
https://virtonomica.ru/olga/main/unit/view/7584725
https://virtonomica.ru/olga/main/unit/view/7584686
https://virtonomica.ru/olga/main/unit/view/7584805
https://virtonomica.ru/olga/main/unit/view/7584786
https://virtonomica.ru/olga/main/unit/view/7584750
https://virtonomica.ru/olga/main/unit/view/7584730
https://virtonomica.ru/olga/main/unit/view/7584726
https://virtonomica.ru/olga/main/unit/view/7584707
https://virtonomica.ru/olga/main/unit/view/7584837
https://virtonomica.ru/olga/main/unit/view/7584578
https://virtonomica.ru/olga/main/unit/view/7584828
https://virtonomica.ru/olga/main/unit/view/7584695
https://virtonomica.ru/olga/main/unit/view/7584845
https://virtonomica.ru/olga/main/unit/view/7584839
https://virtonomica.ru/olga/main/unit/view/7584835
https://virtonomica.ru/olga/main/unit/view/7584826
https://virtonomica.ru/olga/main/unit/view/7584756
https://virtonomica.ru/olga/main/unit/view/7584742
https://virtonomica.ru/olga/main/unit/view/7584739
https://virtonomica.ru/olga/main/unit/view/7584738
https://virtonomica.ru/olga/main/unit/view/7584722
https://virtonomica.ru/olga/main/unit/view/7584824
https://virtonomica.ru/olga/main/unit/view/7584724
https://virtonomica.ru/olga/main/unit/view/7584699
https://virtonomica.ru/olga/main/unit/view/7584821
https://virtonomica.ru/olga/main/unit/view/7584727
https://virtonomica.ru/olga/main/unit/view/7584706
https://virtonomica.ru/olga/main/unit/view/7584763
https://virtonomica.ru/olga/main/unit/view/7584729
https://virtonomica.ru/olga/main/unit/view/7584751
https://virtonomica.ru/olga/main/unit/view/7584583
https://virtonomica.ru/olga/main/unit/view/7584601
https://virtonomica.ru/olga/main/unit/view/7584626
https://virtonomica.ru/olga/main/unit/view/7584605
https://virtonomica.ru/olga/main/unit/view/7584630
https://virtonomica.ru/olga/main/unit/view/7584612
https://virtonomica.ru/olga/main/unit/view/7584594
https://virtonomica.ru/olga/main/unit/view/7584604
https://virtonomica.ru/olga/main/unit/view/7584586
https://virtonomica.ru/olga/main/unit/view/7584589
https://virtonomica.ru/olga/main/unit/view/7584615
https://virtonomica.ru/olga/main/unit/view/7584631
https://virtonomica.ru/olga/main/unit/view/7584642
https://virtonomica.ru/olga/main/unit/view/7584643
https://virtonomica.ru/olga/main/unit/view/7584650
https://virtonomica.ru/olga/main/unit/view/7584672
https://virtonomica.ru/olga/main/unit/view/7584673
https://virtonomica.ru/olga/main/unit/view/7584688
https://virtonomica.ru/olga/main/unit/view/7584634
https://virtonomica.ru/olga/main/unit/view/7584648
https://virtonomica.ru/olga/main/unit/view/7584653
https://virtonomica.ru/olga/main/unit/view/7584661
https://virtonomica.ru/olga/main/unit/view/7584664
https://virtonomica.ru/olga/main/unit/view/7584637
https://virtonomica.ru/olga/main/unit/view/7584693
https://virtonomica.ru/olga/main/unit/view/7584740
https://virtonomica.ru/olga/main/unit/view/7584771
https://virtonomica.ru/olga/main/unit/view/7584745
https://virtonomica.ru/olga/main/unit/view/7584708
https://virtonomica.ru/olga/main/unit/view/7584790
https://virtonomica.ru/olga/main/unit/view/7584747
https://virtonomica.ru/olga/main/unit/view/7584715
https://virtonomica.ru/olga/main/unit/view/7584684
https://virtonomica.ru/olga/main/unit/view/7584599
https://virtonomica.ru/olga/main/unit/view/7584591
https://virtonomica.ru/olga/main/unit/view/7584590
https://virtonomica.ru/olga/main/unit/view/7584581
https://virtonomica.ru/olga/main/unit/view/7584598
https://virtonomica.ru/olga/main/unit/view/7584825
https://virtonomica.ru/olga/main/unit/view/7584832
https://virtonomica.ru/olga/main/unit/view/7584841
https://virtonomica.ru/olga/main/unit/view/7584847
https://virtonomica.ru/olga/main/unit/view/7584848
https://virtonomica.ru/olga/main/unit/view/7584580
https://virtonomica.ru/olga/main/unit/view/7584621
https://virtonomica.ru/olga/main/unit/view/7584620
https://virtonomica.ru/olga/main/unit/view/7584619
https://virtonomica.ru/olga/main/unit/view/7584607
https://virtonomica.ru/olga/main/unit/view/7584830
https://virtonomica.ru/olga/main/unit/view/7584829
https://virtonomica.ru/olga/main/unit/view/7584775
https://virtonomica.ru/olga/main/unit/view/7584733
https://virtonomica.ru/olga/main/unit/view/7584700
https://virtonomica.ru/olga/main/unit/view/7584843
https://virtonomica.ru/olga/main/unit/view/7584838
https://virtonomica.ru/olga/main/unit/view/7584797
https://virtonomica.ru/olga/main/unit/view/7584752
https://virtonomica.ru/olga/main/unit/view/7584710
https://virtonomica.ru/olga/main/unit/view/7584705
https://virtonomica.ru/olga/main/unit/view/7584753
https://virtonomica.ru/olga/main/unit/view/7584748
https://virtonomica.ru/olga/main/unit/view/7584746
https://virtonomica.ru/olga/main/unit/view/7584744
https://virtonomica.ru/olga/main/unit/view/7584723
https://virtonomica.ru/olga/main/unit/view/7584719
https://virtonomica.ru/olga/main/unit/view/7584669
https://virtonomica.ru/olga/main/unit/view/7584671
https://virtonomica.ru/olga/main/unit/view/7584670
https://virtonomica.ru/olga/main/unit/view/7584709
https://virtonomica.ru/olga/main/unit/view/7584662
https://virtonomica.ru/olga/main/unit/view/7584655
https://virtonomica.ru/olga/main/unit/view/7584704
https://virtonomica.ru/olga/main/unit/view/7584692
https://virtonomica.ru/olga/main/unit/view/7584659
https://virtonomica.ru/olga/main/unit/view/7584646
https://virtonomica.ru/olga/main/unit/view/7584645
https://virtonomica.ru/olga/main/unit/view/7584683
https://virtonomica.ru/olga/main/unit/view/7584649
https://virtonomica.ru/olga/main/unit/view/7584641
https://virtonomica.ru/olga/main/unit/view/7584627
https://virtonomica.ru/olga/main/unit/view/7584614
https://virtonomica.ru/olga/main/unit/view/7584624
https://virtonomica.ru/olga/main/unit/view/7584622
https://virtonomica.ru/olga/main/unit/view/7584610
https://virtonomica.ru/olga/main/unit/view/7584606
https://virtonomica.ru/olga/main/unit/view/7584602
https://virtonomica.ru/olga/main/unit/view/7584592
https://virtonomica.ru/olga/main/unit/view/7584941
https://virtonomica.ru/olga/main/unit/view/7584853
https://virtonomica.ru/olga/main/unit/view/7584863
https://virtonomica.ru/olga/main/unit/view/7585033
https://virtonomica.ru/olga/main/unit/view/7584891
https://virtonomica.ru/olga/main/unit/view/7584871
https://virtonomica.ru/olga/main/unit/view/7584894
https://virtonomica.ru/olga/main/unit/view/7584927
https://virtonomica.ru/olga/main/unit/view/7584932
https://virtonomica.ru/olga/main/unit/view/7584966
https://virtonomica.ru/olga/main/unit/view/7584886
https://virtonomica.ru/olga/main/unit/view/7584896
https://virtonomica.ru/olga/main/unit/view/7584906
https://virtonomica.ru/olga/main/unit/view/7584910
https://virtonomica.ru/olga/main/unit/view/7584911
https://virtonomica.ru/olga/main/unit/view/7584970
https://virtonomica.ru/olga/main/unit/view/7584858
https://virtonomica.ru/olga/main/unit/view/7584881
https://virtonomica.ru/olga/main/unit/view/7584868
https://virtonomica.ru/olga/main/unit/view/7584874
https://virtonomica.ru/olga/main/unit/view/7584908
https://virtonomica.ru/olga/main/unit/view/7584920
https://virtonomica.ru/olga/main/unit/view/7584922
https://virtonomica.ru/olga/main/unit/view/7584974
https://virtonomica.ru/olga/main/unit/view/7584904
https://virtonomica.ru/olga/main/unit/view/7584914
https://virtonomica.ru/olga/main/unit/view/7584917
https://virtonomica.ru/olga/main/unit/view/7584918
https://virtonomica.ru/olga/main/unit/view/7584944
https://virtonomica.ru/olga/main/unit/view/7584956
https://virtonomica.ru/olga/main/unit/view/7584986
https://virtonomica.ru/olga/main/unit/view/7585003
https://virtonomica.ru/olga/main/unit/view/7585005
https://virtonomica.ru/olga/main/unit/view/7585008
https://virtonomica.ru/olga/main/unit/view/7585013
https://virtonomica.ru/olga/main/unit/view/7585049
https://virtonomica.ru/olga/main/unit/view/7585052
https://virtonomica.ru/olga/main/unit/view/7585053
https://virtonomica.ru/olga/main/unit/view/7584945
https://virtonomica.ru/olga/main/unit/view/7584980
https://virtonomica.ru/olga/main/unit/view/7584978
https://virtonomica.ru/olga/main/unit/view/7584988
https://virtonomica.ru/olga/main/unit/view/7585007
https://virtonomica.ru/olga/main/unit/view/7585024
https://virtonomica.ru/olga/main/unit/view/7585034
https://virtonomica.ru/olga/main/unit/view/7585079
https://virtonomica.ru/olga/main/unit/view/7585021
https://virtonomica.ru/olga/main/unit/view/7585022
https://virtonomica.ru/olga/main/unit/view/7585025
https://virtonomica.ru/olga/main/unit/view/7585040
https://virtonomica.ru/olga/main/unit/view/7585064
https://virtonomica.ru/olga/main/unit/view/7585068
https://virtonomica.ru/olga/main/unit/view/7585069
https://virtonomica.ru/olga/main/unit/view/7585029
https://virtonomica.ru/olga/main/unit/view/7585031
https://virtonomica.ru/olga/main/unit/view/7584873
https://virtonomica.ru/olga/main/unit/view/7584887
https://virtonomica.ru/olga/main/unit/view/7584890
https://virtonomica.ru/olga/main/unit/view/7584923
https://virtonomica.ru/olga/main/unit/view/7584938
https://virtonomica.ru/olga/main/unit/view/7584950
https://virtonomica.ru/olga/main/unit/view/7584983
https://virtonomica.ru/olga/main/unit/view/7585042
https://virtonomica.ru/olga/main/unit/view/7585045
https://virtonomica.ru/olga/main/unit/view/7584862
https://virtonomica.ru/olga/main/unit/view/7584882
https://virtonomica.ru/olga/main/unit/view/7584934
https://virtonomica.ru/olga/main/unit/view/7584967
https://virtonomica.ru/olga/main/unit/view/7585010
https://virtonomica.ru/olga/main/unit/view/7584854
https://virtonomica.ru/olga/main/unit/view/7584880
https://virtonomica.ru/olga/main/unit/view/7584883
https://virtonomica.ru/olga/main/unit/view/7584939
https://virtonomica.ru/olga/main/unit/view/7584977
https://virtonomica.ru/olga/main/unit/view/7584856
https://virtonomica.ru/olga/main/unit/view/7584876
https://virtonomica.ru/olga/main/unit/view/7584919
https://virtonomica.ru/olga/main/unit/view/7584928
https://virtonomica.ru/olga/main/unit/view/7584933
https://virtonomica.ru/olga/main/unit/view/7584936
https://virtonomica.ru/olga/main/unit/view/7584957
https://virtonomica.ru/olga/main/unit/view/7584976
https://virtonomica.ru/olga/main/unit/view/7584915
https://virtonomica.ru/olga/main/unit/view/7584930
https://virtonomica.ru/olga/main/unit/view/7584931
https://virtonomica.ru/olga/main/unit/view/7584958
https://virtonomica.ru/olga/main/unit/view/7584969
https://virtonomica.ru/olga/main/unit/view/7584985
https://virtonomica.ru/olga/main/unit/view/7585032
https://virtonomica.ru/olga/main/unit/view/7585036
https://virtonomica.ru/olga/main/unit/view/7585001
https://virtonomica.ru/olga/main/unit/view/7584946
https://virtonomica.ru/olga/main/unit/view/7584948
https://virtonomica.ru/olga/main/unit/view/7584952
https://virtonomica.ru/olga/main/unit/view/7584953
https://virtonomica.ru/olga/main/unit/view/7584959
https://virtonomica.ru/olga/main/unit/view/7584989
https://virtonomica.ru/olga/main/unit/view/7585002
https://virtonomica.ru/olga/main/unit/view/7585006
https://virtonomica.ru/olga/main/unit/view/7585062
https://virtonomica.ru/olga/main/unit/view/7585078
https://virtonomica.ru/olga/main/unit/view/7585080
https://virtonomica.ru/olga/main/unit/view/7585047
https://virtonomica.ru/olga/main/unit/view/7585051
https://virtonomica.ru/olga/main/unit/view/7585019
https://virtonomica.ru/olga/main/unit/view/7585020
https://virtonomica.ru/olga/main/unit/view/7585027
https://virtonomica.ru/olga/main/unit/view/7585030
https://virtonomica.ru/olga/main/unit/view/7585041
https://virtonomica.ru/olga/main/unit/view/7585066
https://virtonomica.ru/olga/main/unit/view/7585070
https://virtonomica.ru/olga/main/unit/view/7585026
https://virtonomica.ru/olga/main/unit/view/7584864
https://virtonomica.ru/olga/main/unit/view/7584865
https://virtonomica.ru/olga/main/unit/view/7584878
https://virtonomica.ru/olga/main/unit/view/7584898
https://virtonomica.ru/olga/main/unit/view/7584955
https://virtonomica.ru/olga/main/unit/view/7584964
https://virtonomica.ru/olga/main/unit/view/7584971
https://virtonomica.ru/olga/main/unit/view/7585004
https://virtonomica.ru/olga/main/unit/view/7585016
https://virtonomica.ru/olga/main/unit/view/7585038
https://virtonomica.ru/olga/main/unit/view/7585043
https://virtonomica.ru/olga/main/unit/view/7585060
https://virtonomica.ru/olga/main/unit/view/7584852
https://virtonomica.ru/olga/main/unit/view/7584857
https://virtonomica.ru/olga/main/unit/view/7584861
https://virtonomica.ru/olga/main/unit/view/7584884
https://virtonomica.ru/olga/main/unit/view/7584899
https://virtonomica.ru/olga/main/unit/view/7584937
https://virtonomica.ru/olga/main/unit/view/7584984
https://virtonomica.ru/olga/main/unit/view/7584879
https://virtonomica.ru/olga/main/unit/view/7584888
https://virtonomica.ru/olga/main/unit/view/7584892
https://virtonomica.ru/olga/main/unit/view/7584916
https://virtonomica.ru/olga/main/unit/view/7584951
https://virtonomica.ru/olga/main/unit/view/7584867
https://virtonomica.ru/olga/main/unit/view/7584860
https://virtonomica.ru/olga/main/unit/view/7584869
https://virtonomica.ru/olga/main/unit/view/7584872
https://virtonomica.ru/olga/main/unit/view/7584907
https://virtonomica.ru/olga/main/unit/view/7584935
https://virtonomica.ru/olga/main/unit/view/7584973
https://virtonomica.ru/olga/main/unit/view/7584902
https://virtonomica.ru/olga/main/unit/view/7584929
https://virtonomica.ru/olga/main/unit/view/7584949
https://virtonomica.ru/olga/main/unit/view/7584960
https://virtonomica.ru/olga/main/unit/view/7585012
https://virtonomica.ru/olga/main/unit/view/7585044
https://virtonomica.ru/olga/main/unit/view/7585050
https://virtonomica.ru/olga/main/unit/view/7584972
https://virtonomica.ru/olga/main/unit/view/7584979
https://virtonomica.ru/olga/main/unit/view/7585011
https://virtonomica.ru/olga/main/unit/view/7585023
https://virtonomica.ru/olga/main/unit/view/7585035
https://virtonomica.ru/olga/main/unit/view/7585048
https://virtonomica.ru/olga/main/unit/view/7585056
https://virtonomica.ru/olga/main/unit/view/7585065
https://virtonomica.ru/olga/main/unit/view/7585015
https://virtonomica.ru/olga/main/unit/view/7585058
https://virtonomica.ru/olga/main/unit/view/7585073
https://virtonomica.ru/olga/main/unit/view/7585075
https://virtonomica.ru/olga/main/unit/view/7585076
https://virtonomica.ru/olga/main/unit/view/7585017
https://virtonomica.ru/olga/main/unit/view/7585061
https://virtonomica.ru/olga/main/unit/view/7585063
https://virtonomica.ru/olga/main/unit/view/7585067
https://virtonomica.ru/olga/main/unit/view/7584866
https://virtonomica.ru/olga/main/unit/view/7584877
https://virtonomica.ru/olga/main/unit/view/7584893
https://virtonomica.ru/olga/main/unit/view/7584900
https://virtonomica.ru/olga/main/unit/view/7584913
https://virtonomica.ru/olga/main/unit/view/7584924
https://virtonomica.ru/olga/main/unit/view/7584925
https://virtonomica.ru/olga/main/unit/view/7584963
https://virtonomica.ru/olga/main/unit/view/7585037
https://virtonomica.ru/olga/main/unit/view/7584870
https://virtonomica.ru/olga/main/unit/view/7584889
https://virtonomica.ru/olga/main/unit/view/7584895
https://virtonomica.ru/olga/main/unit/view/7584903
https://virtonomica.ru/olga/main/unit/view/7584926
https://virtonomica.ru/olga/main/unit/view/7584968
https://virtonomica.ru/olga/main/unit/view/7584990
https://virtonomica.ru/olga/main/unit/view/7585000
https://virtonomica.ru/olga/main/unit/view/7585009
https://virtonomica.ru/olga/main/unit/view/7585014
https://virtonomica.ru/olga/main/unit/view/7584855
https://virtonomica.ru/olga/main/unit/view/7584885
https://virtonomica.ru/olga/main/unit/view/7584905
https://virtonomica.ru/olga/main/unit/view/7584909
https://virtonomica.ru/olga/main/unit/view/7584965
https://virtonomica.ru/olga/main/unit/view/7584975
https://virtonomica.ru/olga/main/unit/view/7584859
https://virtonomica.ru/olga/main/unit/view/7584875
https://virtonomica.ru/olga/main/unit/view/7584912
https://virtonomica.ru/olga/main/unit/view/7584940
https://virtonomica.ru/olga/main/unit/view/7584897
https://virtonomica.ru/olga/main/unit/view/7584901
https://virtonomica.ru/olga/main/unit/view/7584921
https://virtonomica.ru/olga/main/unit/view/7584942
https://virtonomica.ru/olga/main/unit/view/7584943
https://virtonomica.ru/olga/main/unit/view/7584947
https://virtonomica.ru/olga/main/unit/view/7584982
https://virtonomica.ru/olga/main/unit/view/7585028
https://virtonomica.ru/olga/main/unit/view/7585018
https://virtonomica.ru/olga/main/unit/view/7585055
https://virtonomica.ru/olga/main/unit/view/7584954
https://virtonomica.ru/olga/main/unit/view/7584961
https://virtonomica.ru/olga/main/unit/view/7584962
https://virtonomica.ru/olga/main/unit/view/7584981
https://virtonomica.ru/olga/main/unit/view/7584987
https://virtonomica.ru/olga/main/unit/view/7584999
https://virtonomica.ru/olga/main/unit/view/7585046
https://virtonomica.ru/olga/main/unit/view/7585059
https://virtonomica.ru/olga/main/unit/view/7585077
https://virtonomica.ru/olga/main/unit/view/7585039
https://virtonomica.ru/olga/main/unit/view/7585054
https://virtonomica.ru/olga/main/unit/view/7585057
https://virtonomica.ru/olga/main/unit/view/7585071
https://virtonomica.ru/olga/main/unit/view/7585072
https://virtonomica.ru/olga/main/unit/view/7585074`;
        var units = unitsStrShop.split('\n');
        unitsDone = 0;

        $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.5;" />').height($(window).height()).width($(window).width()).prependTo('body');
        $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено: <span id="js-current">0</span>/' + units.length + '<br>Достигнута минимальная цена: <span id="error1-span">0</span><div id="error1-div" style="display: none;"></div><br>Нулевые продажи: <span id="error2-span">0</span><div id="error2-div" style="display: none;"></div><br>Нулевые поставки: <span id="error3-span">0</span><div id="error3-div" style="display: none;"></div><br>Стоит нулевая цена: <span id="error4-span">0</span><div id="error4-div" style="display: none;"></div><br>Низкая цена, но продажи нормальные: <span id="error5-span">0</span><div id="error5-div" style="display: none;"></div><br>Низкая цена, недостаточные продажи: <span id="error6-span">0</span><div id="error6-div" style="display: none;"></div></div>').width($(window).width()).prependTo('body');

        $.ajax({
            url: 'https://virtonomica.ru/api/olga/main/token',
            async: false,
            dataType: 'json',
            type: "get",
            success: function(json){
                token = $(json).selector;
            }
        });
        error1 = 0;
        error2 = 0;
        error3 = 0;
        error4 = 0;
        error5 = 0;
        error6 = 0;

        //Сбор информации о городах
        $.ajax({
            url: 'https://virtonomica.ru/api/olga/main/geo/city/browse',
            async: false,
            type: "get",
            success: function(json){
                cityStorage = $(json);
            }
        });


        for(var i = 0; i < units.length; i++){
            regulateShop(units, i);
        }

        console.log('Достигнута минимальная цена:\n' + $('#error1-div').text());
        console.log('Нулевые продажи:\n' + $('#error2-div').text());
        console.log('Нулевое снабжение:\n' + $('#error3-div').text());
        console.log('Не выставлен ценник:\n' + $('#error4-div').text());
        console.log('Низкая цена, но продажи нормальные:\n' + $('#error5-div').text());
        console.log('Низкая цена, недостаточные продажи:\n' + $('#error6-div').text());
    };


    //Большие услуги
    function regulateBigService(i,units){
        var storage;
        $.ajax({
            url: units[i] + '?old',
            type: "GET",
            async: false,
            success: function(html){
                storage = $(html);
                var volumeHyp = 100000000;
                var error = 0;

                $.ajax({
                    url: units[i] + '/consume',
                    type: 'get',
                    async: false,
                    success: function (html){
                        var check = 0, checkPrevious = 0;
                        $(html).find('.list > * > tr:not(:last-child)').each(function(i) {
                            var perVisitor = +$(this).find('td:nth-child(4)').text();
                            if (perVisitor == 0) return;
                            var supplyVolume = +$(this).find('td:nth-child(5)').text().replace(/\s/g,'');
                            check = supplyVolume / perVisitor;
                            if (i != 4 && (check > checkPrevious + 10 || check < checkPrevious - 10)) { error = 1; }
                            checkPrevious = check;
							if (volumeHyp > check) volumeHyp = check;
                        })
                    }
                })

                var volumeFact = storage.find("table.infoblock:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)")[0].innerHTML;
                volumeFact = volumeFact.match(/\d[.\s\d]*(?=)/g);
                volumeFact = volumeFact[0].replace(/[^\d\.]/g,'');
                var priceFact = parseInt( storage.find("td:contains('Цена на момент пересчёта')").next().text().replace(/[^\d\.]/g,'') );
                var priceHyp;
                if (volumeFact != 0 && priceFact != 0 && error == 0) {
                    if (volumeFact <= 0.5 * volumeHyp) priceHyp = 0.8 * priceFact;
                    if (volumeFact > 0.5 * volumeHyp) priceHyp = 0.86 * priceFact;
                    if (volumeFact > 0.70 * volumeHyp) priceHyp = 0.91 * priceFact;
                    if (volumeFact > 0.85 * volumeHyp) priceHyp = 0.95 * priceFact;
                    if (volumeFact > 0.95 * volumeHyp) priceHyp = 0.97 * priceFact;
                    if (volumeFact >= volumeHyp) priceHyp = 1.025 * priceFact;
                    if (volumeFact > 1.07 * volumeHyp) priceHyp = 1.04 * priceFact;

                    unitID = units[i].match(/\d+/)[0];
                    $.ajax({
                        url: 'https://virtonomica.ru/api/olga/main/unit/refresh',
                        async: false,
                        dataType: 'json',
                        type: "post",
                        data: "id=" + unitID + "&token=" + token
                    });

                    //Изменение рекламного бюджета на допустимый максимум
                    $.ajax({
                        url: 'https://virtonomica.ru/api/olga/main/unit/summary?id=' + unitID,
                        //async: false,
                        dataType: 'json',
                        type: "get",
                        success: function(json){
                            var storage = $(json);
                            var curAdvert = +storage[0].advertising_cost;

                            var city = +storage[0].city_id;
                            $.each(cityStorage[0], function(j) {
                                if (+cityStorage[0][j].id == city) { cityLevel = +cityStorage[0][j].level; cityPopulation = +cityStorage[0][j].population; }
                            });

                            let competence = 486;

                            var maxAdvert = 200000 * Math.pow(competence, 1.4);

                            var advert = 100 * 0.24 * Math.pow(1.2, cityLevel-1) * cityPopulation;
                            advert = advert.toFixed(0);

                            if (advert != curAdvert) {
                                if (advert > maxAdvert) { advert = maxAdvert; }
                                $.ajax({
                                    url: 'https://virtonomica.ru/olga/main/unit/view/' + unitID + '/virtasement',
                                    async: false,
                                    type: "post",
                                    data: 'advertData[type][]=2264&advertData[totalCost]=' + advert
                                });
                            }
                        }
                    });

                    $.ajax({
                        url: units[i],
                        data: 'servicePrice=' + priceHyp.toFixed(0) + '&setprice=Установить+цены',
                        type: "POST",
						//async: false,
                        success: function(){
							//console.log(priceHyp.toFixed(0));
                            unitsDone ++;
                            $('#js-current').text(unitsDone);
                        }
                    });
                }
                else {
                    wrongUnits ++;
                    $('#wrong-Units').text(wrongUnits);
                    $('#wrong-list').append(units[i] + '&nbsp<br>');
                    unitsDone ++;
                    $('#js-current').text(unitsDone);
                }
            }
        });
    }

    var buttonBigService = $('<li>').append('<a>БУ</a>').click( function() {
        //Записываем список предприятий в формате "ссылка,ссылка,ссылка". Примеры ниже. Нужно заменить тот список, что находится на следующей строке - именно он является основным, второй список для Анны прописан. Если что, то исходный вид такой var unitsStr = ``. Важно именно такие кавычки использовать (находятся на букве Ё)
        var autoservice = `https://virtonomica.ru/olga/main/unit/view/8198232
https://virtonomica.ru/olga/main/unit/view/8057933
https://virtonomica.ru/olga/main/unit/view/8198245
https://virtonomica.ru/olga/main/unit/view/8198234
https://virtonomica.ru/olga/main/unit/view/8057932
https://virtonomica.ru/olga/main/unit/view/8057930
https://virtonomica.ru/olga/main/unit/view/8198233
https://virtonomica.ru/olga/main/unit/view/8057934
https://virtonomica.ru/olga/main/unit/view/8198244
https://virtonomica.ru/olga/main/unit/view/8198236
https://virtonomica.ru/olga/main/unit/view/8057931
https://virtonomica.ru/olga/main/unit/view/8198248
https://virtonomica.ru/olga/main/unit/view/8198246
https://virtonomica.ru/olga/main/unit/view/8198235
https://virtonomica.ru/olga/main/unit/view/8198247
https://virtonomica.ru/olga/main/unit/view/8198251
https://virtonomica.ru/olga/main/unit/view/8198241
https://virtonomica.ru/olga/main/unit/view/8198237
https://virtonomica.ru/olga/main/unit/view/8198238
https://virtonomica.ru/olga/main/unit/view/8198228
https://virtonomica.ru/olga/main/unit/view/8198249
https://virtonomica.ru/olga/main/unit/view/8198227
https://virtonomica.ru/olga/main/unit/view/8198252
https://virtonomica.ru/olga/main/unit/view/8198239
https://virtonomica.ru/olga/main/unit/view/8198231
https://virtonomica.ru/olga/main/unit/view/8198229
https://virtonomica.ru/olga/main/unit/view/8198253
https://virtonomica.ru/olga/main/unit/view/8198250
https://virtonomica.ru/olga/main/unit/view/8198230
https://virtonomica.ru/olga/main/unit/view/8198240`,
            medical = `https://virtonomica.ru/olga/main/unit/view/8201187
https://virtonomica.ru/olga/main/unit/view/8201145
https://virtonomica.ru/olga/main/unit/view/8201025
https://virtonomica.ru/olga/main/unit/view/8201004
https://virtonomica.ru/olga/main/unit/view/8200834
https://virtonomica.ru/olga/main/unit/view/8229925
https://virtonomica.ru/olga/main/unit/view/8229926
https://virtonomica.ru/olga/main/unit/view/8176838
https://virtonomica.ru/olga/main/unit/view/8176872
https://virtonomica.ru/olga/main/unit/view/8200656
https://virtonomica.ru/olga/main/unit/view/8200761
https://virtonomica.ru/olga/main/unit/view/8176809
https://virtonomica.ru/olga/main/unit/view/8201205
https://virtonomica.ru/olga/main/unit/view/8201204
https://virtonomica.ru/olga/main/unit/view/8229917
https://virtonomica.ru/olga/main/unit/view/8229915
https://virtonomica.ru/olga/main/unit/view/8201211
https://virtonomica.ru/olga/main/unit/view/8201212
https://virtonomica.ru/olga/main/unit/view/8229921
https://virtonomica.ru/olga/main/unit/view/8229920
https://virtonomica.ru/olga/main/unit/view/8200160
https://virtonomica.ru/olga/main/unit/view/8200380
https://virtonomica.ru/olga/main/unit/view/8200500
https://virtonomica.ru/olga/main/unit/view/8200326
https://virtonomica.ru/olga/main/unit/view/8200279
https://virtonomica.ru/olga/main/unit/view/8229929
https://virtonomica.ru/olga/main/unit/view/8229928
https://virtonomica.ru/olga/main/unit/view/8176954
https://virtonomica.ru/olga/main/unit/view/8176967
https://virtonomica.ru/olga/main/unit/view/8176994
https://virtonomica.ru/olga/main/unit/view/8200570
https://virtonomica.ru/olga/main/unit/view/8200561
https://virtonomica.ru/olga/main/unit/view/8201207
https://virtonomica.ru/olga/main/unit/view/8201206
https://virtonomica.ru/olga/main/unit/view/8229919
https://virtonomica.ru/olga/main/unit/view/8229918
https://virtonomica.ru/olga/main/unit/view/8201213
https://virtonomica.ru/olga/main/unit/view/8201214
https://virtonomica.ru/olga/main/unit/view/8229923
https://virtonomica.ru/olga/main/unit/view/8229922`,
            restaurant = `https://virtonomica.ru/olga/main/unit/view/8248893
https://virtonomica.ru/olga/main/unit/view/8248874
https://virtonomica.ru/olga/main/unit/view/8248872
https://virtonomica.ru/olga/main/unit/view/8248873
https://virtonomica.ru/olga/main/unit/view/8248896
https://virtonomica.ru/olga/main/unit/view/8248892
https://virtonomica.ru/olga/main/unit/view/8248895
https://virtonomica.ru/olga/main/unit/view/8248871
https://virtonomica.ru/olga/main/unit/view/8248894
https://virtonomica.ru/olga/main/unit/view/8248875
https://virtonomica.ru/olga/main/unit/view/8248891
https://virtonomica.ru/olga/main/unit/view/8248887
https://virtonomica.ru/olga/main/unit/view/8248880
https://virtonomica.ru/olga/main/unit/view/8248889
https://virtonomica.ru/olga/main/unit/view/8248877
https://virtonomica.ru/olga/main/unit/view/8248890
https://virtonomica.ru/olga/main/unit/view/8248878
https://virtonomica.ru/olga/main/unit/view/8248879
https://virtonomica.ru/olga/main/unit/view/8248876
https://virtonomica.ru/olga/main/unit/view/8248888
https://virtonomica.ru/olga/main/unit/view/8075497
https://virtonomica.ru/olga/main/unit/view/8075495
https://virtonomica.ru/olga/main/unit/view/8075494
https://virtonomica.ru/olga/main/unit/view/8075498
https://virtonomica.ru/olga/main/unit/view/8075496
https://virtonomica.ru/olga/main/unit/view/8075503
https://virtonomica.ru/olga/main/unit/view/8075500
https://virtonomica.ru/olga/main/unit/view/8075499
https://virtonomica.ru/olga/main/unit/view/8075502
https://virtonomica.ru/olga/main/unit/view/8075501
https://virtonomica.ru/olga/main/unit/view/8075505
https://virtonomica.ru/olga/main/unit/view/8075507
https://virtonomica.ru/olga/main/unit/view/8075506
https://virtonomica.ru/olga/main/unit/view/7272302
https://virtonomica.ru/olga/main/unit/view/8075504`,
            unitsStr = autoservice + '\n' + medical + '\n' + restaurant,
            units = unitsStr.split('\n');

        unitsDone = 0;
        wrongUnits = 0;
        unitsHoliday = 0;
        minPriceUnits = 0;
        k = units.length;
        p = 0;

        //Получение токена для работы с API
        $.ajax({
            url: 'https://virtonomica.ru/api/olga/main/token',
            async: false,
            dataType: 'json',
            type: "get",
            success: function(json){
                token = $(json).selector;
            }
        });

        //Сбор информации о городах для последующей настройки рекламы
        $.ajax({
            url: 'https://virtonomica.ru/api/olga/main/geo/city/browse',
            async: false,
            type: "get",
            success: function(json){
                cityStorage = $(json);
            }
        });

        $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.5;" />').height($(window).height()).width($(window).width()).prependTo('body');
        $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено: <span id="js-current"></span>/' + units.length + '<br>Предприятий с ошибкой: <span id="wrong-Units"></span><div id="wrong-list" style="display: none;"></div>').width($(window).width()).prependTo('body');

        for(var i = 0; i < units.length; i++){
            regulateBigService(i,units);
        }

        console.log($('#wrong-list').text());
    });
    $('li.right').before(buttonBigService);
})(unsafeWindow);