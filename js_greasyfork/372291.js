// ==UserScript==
// @name           Victory: Госзакупки (яхты)
// @author         BioHazard
// @version        1.00
// @namespace      Victory
// @description    Регулировка цен на складах при продаже яхт через Госзакупки
// @include        https://virtonomica.ru/olga/main/globalreport/goverment
// @include        https://virtonomica.ru/olga/main/globalreport/goverment/133
// @exclude        https://virtonomica.ru/olga/main/globalreport/goverment/380059
// @exclude        https://virtonomica.ru/olga/main/globalreport/goverment/422707
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372291/Victory%3A%20%D0%93%D0%BE%D1%81%D0%B7%D0%B0%D0%BA%D1%83%D0%BF%D0%BA%D0%B8%20%28%D1%8F%D1%85%D1%82%D1%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372291/Victory%3A%20%D0%93%D0%BE%D1%81%D0%B7%D0%B0%D0%BA%D1%83%D0%BF%D0%BA%D0%B8%20%28%D1%8F%D1%85%D1%82%D1%8B%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function toNum(str) {
        return parseInt(str.split(' ').join('').match(/[\d+\s*]+/));
    }

    let maxQuality = 100,
        maxQty,
        regionId,
        companyName = $('.company').html(),
        lastTable = $('table.list:nth-child(9) > tbody:nth-child(1)'),
        firstSellerVal = toNum(lastTable.find('tr:nth-child(2) > td:nth-child(3)').html()),
        secondSellerVal = toNum(lastTable.find('tr:nth-child(3) > td:nth-child(3)').html()),
        thirdSellerVal = toNum(lastTable.find('tr:nth-child(4) > td:nth-child(3)').html()),
        firstSellerPrice = toNum(lastTable.find('tr:nth-child(2) > td:nth-child(5)').html()),
        secondSellerPrice = toNum(lastTable.find('tr:nth-child(3) > td:nth-child(5)').html()),
        thirdSellerPrice = toNum(lastTable.find('tr:nth-child(4) > td:nth-child(5)').html()),
        sumVal = firstSellerVal + secondSellerVal + thirdSellerVal,
        averagePrice = ~~((firstSellerVal*firstSellerPrice + secondSellerVal*secondSellerPrice + thirdSellerVal*thirdSellerPrice)/sumVal),
        i,
        price,

        warehousesStr = `https://virtonomica.ru/olga/main/unit/view/6508065
,https://virtonomica.ru/olga/main/unit/view/6508095
,https://virtonomica.ru/olga/main/unit/view/6508096
,https://virtonomica.ru/olga/main/unit/view/6508097
,https://virtonomica.ru/olga/main/unit/view/7249195
,https://virtonomica.ru/olga/main/unit/view/7249198
,https://virtonomica.ru/olga/main/unit/view/7249199
,https://virtonomica.ru/olga/main/unit/view/7249200
,https://virtonomica.ru/olga/main/unit/view/6508098
,https://virtonomica.ru/olga/main/unit/view/6508099
,https://virtonomica.ru/olga/main/unit/view/6508100
,https://virtonomica.ru/olga/main/unit/view/6508101
,https://virtonomica.ru/olga/main/unit/view/6508102
,https://virtonomica.ru/olga/main/unit/view/7249203
,https://virtonomica.ru/olga/main/unit/view/6508103
,https://virtonomica.ru/olga/main/unit/view/6508104
,https://virtonomica.ru/olga/main/unit/view/7249224
,https://virtonomica.ru/olga/main/unit/view/7249226
,https://virtonomica.ru/olga/main/unit/view/6508082
,https://virtonomica.ru/olga/main/unit/view/7249228
,https://virtonomica.ru/olga/main/unit/view/7249231
,https://virtonomica.ru/olga/main/unit/view/6508083
,https://virtonomica.ru/olga/main/unit/view/7249235
,https://virtonomica.ru/olga/main/unit/view/6508085
,https://virtonomica.ru/olga/main/unit/view/6508086
,https://virtonomica.ru/olga/main/unit/view/6508087
,https://virtonomica.ru/olga/main/unit/view/6508089
,https://virtonomica.ru/olga/main/unit/view/7249237
,https://virtonomica.ru/olga/main/unit/view/7249238
,https://virtonomica.ru/olga/main/unit/view/7249239
,https://virtonomica.ru/olga/main/unit/view/6613108
,https://virtonomica.ru/olga/main/unit/view/6508091
,https://virtonomica.ru/olga/main/unit/view/6508090
,https://virtonomica.ru/olga/main/unit/view/6508093
,https://virtonomica.ru/olga/main/unit/view/7249245
,https://virtonomica.ru/olga/main/unit/view/7249246
,https://virtonomica.ru/olga/main/unit/view/6508094
,https://virtonomica.ru/olga/main/unit/view/6508072
,https://virtonomica.ru/olga/main/unit/view/6508073
,https://virtonomica.ru/olga/main/unit/view/6508074
,https://virtonomica.ru/olga/main/unit/view/6494216
,https://virtonomica.ru/olga/main/unit/view/7249345
,https://virtonomica.ru/olga/main/unit/view/7249346
,https://virtonomica.ru/olga/main/unit/view/7249348
,https://virtonomica.ru/olga/main/unit/view/7249349
,https://virtonomica.ru/olga/main/unit/view/6508075
,https://virtonomica.ru/olga/main/unit/view/6508076
,https://virtonomica.ru/olga/main/unit/view/7249350
,https://virtonomica.ru/olga/main/unit/view/7249351
,https://virtonomica.ru/olga/main/unit/view/6508078
,https://virtonomica.ru/olga/main/unit/view/6508079
,https://virtonomica.ru/olga/main/unit/view/7249352
,https://virtonomica.ru/olga/main/unit/view/7249354
,https://virtonomica.ru/olga/main/unit/view/7249356
,https://virtonomica.ru/olga/main/unit/view/6508080
,https://virtonomica.ru/olga/main/unit/view/7249357
,https://virtonomica.ru/olga/main/unit/view/6508081`,

        warehousesArr = warehousesStr.split('\n,');

    $('fieldset:nth-child(6) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)').append('<button>Поплыли...</button>').on('click', startPricing);

    function startPricing() {
        for (i=0; i<warehousesArr.length; i++) {
            $.ajax({
                url: warehousesArr[i],
                success: function (data) {
                    regionId = $(data).find('h1').html().match(/\d+/)[0];
                    maxQty = $('#region_' + regionId).prev().find('td:nth-child(2)').text().match(/\d+/)[0];
                    if ($('#region_' + regionId + ' > td:nth-child(3)').html() > maxQuality || toNum($('#region_' + regionId + ' > td:nth-child(4)').html())<averagePrice*0.95) return;
                    if ($('#region_' + regionId).prev().find('td:nth-child(5)').text().match(/\d+/)[0] === '0') {
                        price = toNum($('#region_' + regionId).prev().find('td:nth-child(4)').text())*0.98
                    }
                    else {
                        if ($('#region_' + regionId + '_0' + ' > td:nth-child(1)').text() === companyName) {
                            price = toNum($('#region_' + regionId + '_0' + ' > td:nth-child(3)').html()) * 1.02;
                        }
                        else {
                            price = toNum($('#region_' + regionId + '_0' + ' > td:nth-child(3)').html()) * 0.99;
                        }
                    }
                    if (price < averagePrice*0.95) return;
                    $.ajax({
                        url: this.url + '/sale',
                        type: "POST",
                        data: 'storageData[133/0][price]=' + price + '&storageData[133/0][max_qty]=' + maxQty + '&storageData[133/0][constraint]=7',
                        success: function () {
                            console.log(this.url);
                        }
                    });
                }
            })
        }
    }
})(window);