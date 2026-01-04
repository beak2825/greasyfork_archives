// ==UserScript==
// @name           Crypto Regular
// @version        1.00
// @namespace      crypto_regular
// @description    Прювэт
// @include        http*://*virtonomic*.*/crypto/main/*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/373181/Crypto%20Regular.user.js
// @updateURL https://update.greasyfork.org/scripts/373181/Crypto%20Regular.meta.js
// ==/UserScript==

(function () {
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
                    url: units[o],
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
                                if (sales == supply) priceChanged = 1.02 * price;
                                if (sales > 1 * supply) priceChanged = 1.005 * price;
                                if (sales > 1.04 * supply) priceChanged = 1.01 * price;
                                if (sales > 1.08 * supply) priceChanged = 1.02 * price;
                                if (sales > 1.15 * supply) priceChanged = 1.03 * price;
                                if (sales > 1.25 * supply) priceChanged = 1.04 * price;

                                if (storage > 2 * supply && sales < supply) priceChanged = priceChanged * 0.95;
                                if (storage > 3 * supply && sales < supply) priceChanged = priceChanged * 0.92;
                                if (storage > 4 * supply && sales < supply) priceChanged = priceChanged * 0.90;

                                if (priceChanged < (raspPrice * 1)) {
                                    priceChanged = raspPrice * 1;
                                    if (sales < supply) { er6++; }
                                    else { er5++; }
                                }

                                if (minPrice > 0 && priceChanged < minPrice) {
                                    priceChanged = minPrice;
                                    er1 ++;
                                }

                                if (sales > 0 && supply > 0 && price > 0) {
                                    dataSend += '&productData[price]' + contractID + '=' + priceChanged.toFixed(1);
                                }
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

                        /*
                        unitID = units[o].match(/\d+/)[0];
                        $.ajax({
                            url: 'https://virtonomica.ru/api/olga/main/unit/refresh',
                            async: false,
                            dataType: 'json',
                            type: "post",
                            data: "id=" + unitID + "&token=" + token
                        });

                        //Выставление рабов и рекламы
                        $.ajax({
                            url: 'https://virtonomica.ru/api/olga/main/unit/summary?id=' + unitID,
                            async: false,
                            dataType: 'json',
                            type: "get",
                            success: function(json){
                                var storage = $(json);
                                var curEmp = +storage[0].employee_count;
                                var curEmpReq = +storage[0].employee_required;
                                var emp;
                                if (curEmp < 1.05 * curEmpReq || curEmp >= 1.1 * curEmpReq) {
                                    emp = 1.05 * curEmpReq;
                                    $.ajax({
                                        url: 'https://virtonomica.ru/olga/window/unit/employees/engage/' + unitID,
                                        async: false,
                                        type: 'post',
                                        data: 'unitEmployeesData[quantity]=' + emp + '&salary_max=100000&target_level=13&trigger=1'
                                    });
                                }

                                //Запрос уровня города
                                var city = +storage[0].city_id;
                                $.each(cityStorage[0], function(j) {
                                    if (+cityStorage[0][j].id == city) { cityLevel = +cityStorage[0][j].level; cityPopulation = +cityStorage[0][j].population; }
                                });

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
                            }
                        });
                        $.ajax({
                            url: 'https://virtonomica.ru/api/olga/main/unit/refresh',
                            async: false,
                            dataType: 'json',
                            type: "post",
                            data: "id=" + unitID + "&token=" + token
                        });
                        */
                        
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
        var unitsStrShop = `https://virtonomica.ru/crypto/main/unit/view/7864711
https://virtonomica.ru/crypto/main/unit/view/7864709
https://virtonomica.ru/crypto/main/unit/view/7864712
https://virtonomica.ru/crypto/main/unit/view/7864710
https://virtonomica.ru/crypto/main/unit/view/7864707
https://virtonomica.ru/crypto/main/unit/view/7861343
https://virtonomica.ru/crypto/main/unit/view/7862234
https://virtonomica.ru/crypto/main/unit/view/7860584
https://virtonomica.ru/crypto/main/unit/view/7855994`;
        var units = unitsStrShop.split('\n');
        unitsDone = 0;

        $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.5;" />').height($(window).height()).width($(window).width()).prependTo('body');
        $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено: <span id="js-current">0</span>/' + units.length + '<br>Достигнута минимальная цена: <span id="error1-span">0</span><div id="error1-div" style="display: none;"></div><br>Нулевые продажи: <span id="error2-span">0</span><div id="error2-div" style="display: none;"></div><br>Нулевые поставки: <span id="error3-span">0</span><div id="error3-div" style="display: none;"></div><br>Стоит нулевая цена: <span id="error4-span">0</span><div id="error4-div" style="display: none;"></div><br>Низкая цена, но продажи нормальные: <span id="error5-span">0</span><div id="error5-div" style="display: none;"></div><br>Низкая цена, недостаточные продажи: <span id="error6-span">0</span><div id="error6-div" style="display: none;"></div></div>').width($(window).width()).prependTo('body');

        /*
        $.ajax({
            url: 'https://virtonomica.ru/api/olga/main/token',
            async: false,
            dataType: 'json',
            type: "get",
            success: function(json){
                token = $(json).selector;
            }
        });
        */
        
        error1 = 0;
        error2 = 0;
        error3 = 0;
        error4 = 0;
        error5 = 0;
        error6 = 0;

        //Сбор информации о городах
        /*$.ajax({
            url: 'https://virtonomica.ru/api/olga/main/geo/city/browse',
            async: false,
            type: "get",
            success: function(json){
                cityStorage = $(json);
            }
        });*/


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
})(window);