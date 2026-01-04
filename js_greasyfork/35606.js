// ==UserScript==
// @name        virtonomica:auctions by ctsigma
// @namespace   virtonomica
// @description auction shows mine parameters and price
// @include     *virtonomic*.*/*/main/auction/list/unit
// @version     1.01
// @author      ctsigma
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35606/virtonomica%3Aauctions%20by%20ctsigma.user.js
// @updateURL https://update.greasyfork.org/scripts/35606/virtonomica%3Aauctions%20by%20ctsigma.meta.js
// ==/UserScript==
var run = function () {
    var arr_spec = {
        'Добыча алмазов': 1460,
        'Добыча хрома': 7088,
        'Добыча руды': 1464,
        'Добыча минералов': 1468,
        'Добыча марганца': 7089,
        'Добыча бокситов': 1461,
        'Добыча золота': 1465,
        'Добыча угля': 1469,
        'Добыча меди': 370070,
        'Добыча глины': 1462,
        'Добыча кремния': 1466,
        'Добыча титановой руды': 380050,
        'Добыча нефти': 1467,
        'Добыча полиметаллической руды': 423268
    };
    var arr_villa = {
        'Сарай': {'size':1,'price':1},
        'Палатка': {'size':2,'price':10},
        'Квартира': {'size':3,'price':50},
        'Дом': {'size':4,'price':125},
        'Вилла': {'size':5,'price':250},
        'Особняк': {'size':6,'price':500},
        'Дворец': {'size':7,'price':1000}
    };
    var arr_farm = {
        1: {100: 7,500: 30,1000: 50,5000: 200,10000: 350},
        2: {100: 10,500: 40,1000: 75,5000: 300,10000: 500},
        3: {100: 15,500: 65,1000: 110,5000: 500,10000: 750},
        4: {100: 25,500: 110,1000: 200,5000: 800,10000: 1250},
        5: {100: 40,500: 175,1000: 300,5000: 1250,10000: 2000}
    };
    var arr_sawmill = {
        1: {100: 3,250: 6,500: 9,1000: 15,2500: 30},
        2: {100: 6,250: 9,500: 15,1000: 24,2500: 45},
        3: {100: 9,250: 15,500: 21,1000: 30,2500: 60},
        4: {100: 15,250: 21,500: 30,1000: 45,2500: 90},
        5: {100: 21,250: 30,500: 45,1000: 75,2500: 150}
    };
    var arr_fishbase = {
        1: {100:5,250:10,500:15,1000:25,2500:50},
        2: {100:10,250:15,500:25,1000:40,2500:75},
        3: {100:15,250:25,500:35,1000:50,2500:100},
        4: {100:25,250:35,500:50,1000:75,2500:150},
        5: {100:35,250:50,500:75,1000:125,2500:250}
    };
    $('.unit-list-2014 th:eq(5)').attr("colspan","2");
    $('.unit-list-2014 th:contains("Текущая цена")').after($('<th>цена</th>'));
    $('.unit-list-2014>tbody>tr').each(function () {
        $('td:eq(6)',this)
            .after($('<td align="center">').append($('<a>').append($("<img>").attr({src: "/img/icon/make_bid.gif", title:'Внести предложение', border:'0'}).css({cursor:'pointer'}).click(function(){bet(this);}))))
            .after($('<td style="FONT-WEIGHT: bold;" align="right">'));
    });
    var button = $('<img style="cursor:pointer;vertical-align:middle;" width="16" src="/img/unit_indicator/unit_loading_not_full.gif" title="Показать стоимость">').click(function () {show_auction_price(true);});
    $('.tabsub tr:eq(0)').prepend(button);
    show_auction_price(false);

    function format(ppp,n) {
        var ppp_t='$';
        if (ppp > 400){ppp = ppp/1000;ppp_t="K";}
        if (ppp > 400){ppp = ppp/1000;ppp_t="M";}
        if (ppp > 400){ppp = ppp/1000;ppp_t="B";}
        if (ppp > 400){ppp = ppp/1000;ppp_t="T";}
        return ppp.toFixed(n) + ppp_t;
    }

    function numberFormat (number) {
        number += '';
        var parts = number.split('.');
        var int = parts[0];
        var dec = parts.length > 1 ? '.' + parts[1] : '';
        var regexp = /(\d+)(\d{3}(\s|$))/;
        while (regexp.test(int)) {
            int = int.replace(regexp, '$1 $2');
        }
        return int + dec;
    }

    function bet(e){
        var url = $(e).closest('tr').find('td:eq(1)>').attr('href');
        $.ajax({
            type:"GET",
            async: false,
            url:url,
            success:function(data){
                var p = $('input[name="bidData[price]"]',data).val();
                if (confirm("Ставка по цене "+numberFormat(p))) {
                    var form = $('form[name="bidCreateForm"]',data);
                    var action = form.attr('action');
                    var button = form.find('input[type="submit"]');
                    var name = button.attr('name');
                    var val = button.attr('value');
                    var save = (name !== undefined)?'&'+name+'='+val:'';
                    form.find('input[name="bidData[price]"]').attr('value',p);
                    form.find('#accept_conditions').attr('checked',true);
                    var bid = form.serialize()+ save;
                    console.log(bid);
                    $.ajax({
                        type: 'POST',
                        async: false,
                        url: action,
                        data: bid,
                        success:function(){alert('done');}
                    });
                }
            }
        });
    }

    function show_auction_price(calc){
        $('.unit-list-2014>tbody>tr').each(function () {
            var obj_type = /.+\/(.+)$/.exec($('[src*="/img/unit_types"]',this).prop('src'))[1];
            switch (obj_type)
            {
                case ('mine.gif') : obj_type = 'mine'; break;
                case ('oilpump.gif') : obj_type = 'mine'; break;
                case ('orchard.gif') : obj_type = 'farm'; break;
                case ('villa.gif') : obj_type = 'villa'; break;
                case ('farm.gif') : obj_type = 'farm'; break;
                case ('sawmill.gif') : obj_type = 'sawmill'; break;
                case ('fishingbase.gif') : obj_type = 'fishingbase'; break;
            }
            var auction_id = $('td:eq(0)',this).text().replace(/\s+/g, '');
            var quantity = parseInt($('td:eq(6) div:eq(2)',this).text().replace(/[^\d\.]/g, ''));
            var virts = readCookie('auction_'+auction_id);
            if (virts === null) {
                if (!calc) return true; //continue
                virts = get_auction_price(this,obj_type,auction_id);
                var d = new Date();
                d.setDate(d.getDate()+10);
                setCookie('auction_'+auction_id,virts,d);
            }
            var full_price = parseInt($('td:eq(6)>div:eq(0)',this).text().replace(/[^\d\.]/g, ''));
            if (virts==0) virts = 1 / 10000; //чтобы избежать ошибок деления на 0
            var price = '<div>'+virts + '</div><div>(' + format(full_price / virts,1) + ')</div>';
            if (obj_type == 'mine') price = price + '<div>' + format(full_price / quantity,1) + '</div>'; // price per piece
            $(this).find('td:eq(7)').empty().append($(price));
        });
    }

    function get_auction_price(context,obj_type){
        var realm = readCookie('last_realm');
        var obj_href = $('td:eq(4) a:eq(0)',context).prop('href').replace('/main/', '/window/');
        var quality = 0;    // качество
        var quantity = 0; // количество
        var size = 0;       // размер
        var virts = 0;
        switch (obj_type){
            case ('mine') : //шахты
                var complexity = 0; // сложность добычи (для шахт)
                var deposit = 0;
                $.ajax({ // запрос параметров шахты
                    type: 'GET',
                    url: obj_href,
                    async: false,
                    success: function (data) {
                        quantity = parseInt($('.title:contains("Запасы месторождения")', data).next().text().replace(/[^\d\.]/g, ''));
                        complexity = parseInt($('.title:contains("Сложность добычи")', data).next().text().replace(/[^\d\.]/g, ''));
                        quality = parseFloat($('.title:contains("Базовое качество добываемого сырья")', data).next().text().replace(/[^\d\.]/g, ''));
                        var resource_id = arr_spec[$('.title:contains("Специализация")', data).next().text()];
                        while (virts < 100) {
                            virts++;
                            $.ajax({
                                url: location.origin+'/'+realm+'/ajax/unit/mine_deposit_by_cost',
                                data: {
                                    cost: virts,
                                    quality: quality,
                                    complexity: complexity,
                                    resource_id: resource_id
                                },
                                type: 'GET',
                                async: false,
                                dataType: 'json',
                                success: function (j) {
                                    deposit = j.deposit;
                                }
                            });
                            if (deposit >= quantity) break;
                        }
                    }
                });
                virts = (virts * quantity / deposit).toFixed(3);
                break;
            case ('villa') :
                size = $('td:eq(4) div:eq(2)',context).text().trim();
                virts = arr_villa[size].price;
                break;
            case ('farm') :
                size = parseInt($('td:eq(4) div:eq(2)',context).text().match(/\d+/));
                quality = parseInt($('td:eq(5)',context).text().match(/\((\d{0,}\.?\d{0,})\)/)[1]);
                virts = arr_farm[quality][size];
                break;
            case ('sawmill') :
                size = parseInt($('td:eq(4) div:eq(2)',context).text().match(/\d+/));
                quality = parseInt($('td:eq(5)',context).text().match(/\((\d{0,}\.?\d{0,})\)/)[1]);
                virts = arr_sawmill[quality][size];
                break;
            case ('fishingbase') :
                size = parseInt($('td:eq(4) div:eq(2)',context).text().match(/\d+/));
                quality = parseInt($('td:eq(5)',context).text().match(/\((\d{0,}\.?\d{0,})\)/)[1]);
                virts = arr_fishbase[quality][size];
                break;
        }
        return virts;
    }
};
if (window.top == window) {
    var script = document.createElement('script');
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}
