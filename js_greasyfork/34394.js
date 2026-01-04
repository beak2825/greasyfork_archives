// ==UserScript==
// @name           Market_analitics by ctsigma
// @namespace      virtonomica
// @description  считаем разные цифры для рынка города
// @description    v1.2 - Добавлен показ штук товара у каждого продавца
// @description    v1.1 - Исправлена ошибка в определнии доли местных, если они не на первом месте в списке
// @description    v1.03 - показ числа едениц товара, проданных игроками
// @version        1.22
// @include       http*://*virtonomic*.*/*/main/globalreport/marketing/by_trade_at_cities*
// @include       http*://*virtonomic*.*/*/window/globalreport/marketing/by_trade_at_cities*
// @include       http*://*virtonomic*.*/*/main/globalreport/marketing/by_service*
// @include       http*://*virtonomic*.*/*/window/globalreport/marketing/by_service*
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/34394/Market_analitics%20by%20ctsigma.user.js
// @updateURL https://update.greasyfork.org/scripts/34394/Market_analitics%20by%20ctsigma.meta.js
// ==/UserScript==
var run = function (type) {
    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
    var report = [];

    function numberFormat(number) {
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

    function sort_col(direction,list){
        var order = (direction == 'asc') ? 1 : - 1;
        var sortFunc = function(a,b){return (b.vol - a.vol) * order;};
        report.sort(sortFunc);
        for (var i = report.length - 1; i >= 0; i--) {
            var row = report[i];
            if (row === null) continue;
            $('#' + row.id).appendTo(list);
        }
        $('.asc').find('img').attr('src','/img/up_'+(direction=='asc'?'wh':'gr')+'_sort.png');
        $('.desc').find('img').attr('src','/img/down_'+(direction=='desc'?'wh':'gr')+'_sort.png');
        $('tr.odd,tr.even',list).each(function(i,item){
            var cl = $(this).attr('class');
            $(this).attr('class',i%2==0?'even':'odd');
            var cl_new = $(this).attr('class');
            var event = $(this).attr('onmouseout').replace(cl,cl_new);
            $(this).attr('onmouseout',event);
        });
    }

    function by_trade() {
        // Отчет "Анализ рынка сферы услуг"
        var val = $('table th:contains(\'Местные поставщики\')').parent().parent();
        // Цена
        var pr = $('th:contains(\'Цена\')', val).parent();
        // ищем первый td
        var local_price = $('td:first', pr); // цена местных
        var fl_local_price = /([\D]+)*([\d\s]+\.*\d*)/.exec(local_price.text()) [2].replace(/\s+/g, '');
        var avg_price = $('td:last', pr); // средняя цена всех магазинов
        var fl_avg_price = /([\D]+)*([\d\s]+\.*\d*)/.exec(avg_price.text()) [2].replace(/\s+/g, '');
        var val2 = $('td:contains(\'Местные поставщики\')').eq(1).next().next();
        //var local_value = $("td", val2).eq(4); // Доля местных
        var local_value = $('td:contains(\'Местные поставщики\')').eq(1).next().next();
        //alert( "["+local_value.text() + "]");
        // Фикс на отсутстиве местных
        var fl_local_value=0;
        if (local_value.text() != '') {
            fl_local_value = /([\d\s]+\.*\d*)/.exec(local_value.text()) [1];
            //alert( fl_local_value );
        }
        var market_value = $('td:contains(\'Объем рынка:\')').parent();
        var out = $('td', market_value).eq(4);
        var fl_market_value = /([\D]+)*([\d\s]+\.*\d*)/.exec(out.text()) [2].replace(/\s+/g, '');
        //alert(fl_market_value);
        $('td', market_value).eq(3).append('<br>').append('Емкость рынка:');
        //alert(out.html() );
        var str = fl_market_value * fl_local_price;
        out.append('<br>').append('<i><b>' + numberFormat(Math.round(str)) + ' </b></i>$');
        if (fl_local_value >= 100) return;
        // цена игроков
        var pl_price = (fl_avg_price - fl_local_value * fl_local_price / 100) / (100 - fl_local_value) * 100;
        pl_price = Math.round(pl_price * 100) / 100;
        $('td', market_value).eq(5).append('<br>').append('Цена игроков:').append('<br>').append('Емкость игроков:').append('<br><br>').append('Доля:');
        var pl_size = Math.round(fl_market_value * (100 - fl_local_value) * pl_price / 100);
        var pl_count = Math.round(fl_market_value * (100 - fl_local_value) / 100);
        var z = Math.round(100 * pl_size / str) / 100;
        $('td', market_value).eq(6).append('<br>').append('<i>' + pl_price + '</i> $').append('<br>').append('<b>' + numberFormat(pl_size) + '</b> $<br> (' + numberFormat(pl_count) + ' ед.)').append('<br>').append('<b>' + numberFormat(z) + '</b>');
        //alert( pl_price );
        // показ штук у игроков
        var dat = $('table.grid ~ table');
        var pl_dat = $('table', dat).eq(0);
        var table = $('td', pl_dat);
        var index = 0;
        table.each(function () {
            if (index % 6 == 4) {
                fl_str_value = /([\d\s]+\.*\d*)/.exec($(this).text()) [1];
                //alert( $(this).html() );
                str_count = Math.round(fl_market_value * fl_str_value / 100);
                //alert( str_count );
                $(this).css('font-weight', 'bold');
                $(this).parent().append('<td> <font color=grey>' + numberFormat(str_count) + '</font>');
            }
            index++;
        });
        by_service();
    }

    function by_service() {
        // Отчет "Анализ рынка сферы услуг"
        var list = $('.list').get().reverse()[0];
        var asc_btn = $('<div class="asc" title="сортировка по возрастанию"><a><img src="/img/up_gr_sort.png" style="cursor: pointer; display: table-row" id="sort_asc_btn"></a></div>').click(function () {sort_col('asc',list);});
        var desc_btn = $('<div class="desc" title="сортировка по убыванию"><a><img src="/img/down_gr_sort.png" style="cursor: pointer; display: table-row" id="sort_desc_btn"></a></div>').click(function () {sort_col('desc',list);});
        var v=0;
        var p=0;
        var tr=0;
        $('tr:has("th")',list).each(function(j){
            $('th',this).each(function(i){
                var n=$(this).text().trim();
                switch(n){
                    case 'Объем продаж':v=i;tr=j;break;
                    case 'Цена':p=i;tr=j;break;
                }
            });
        });
        $('tr:eq('+tr+') th:eq('+p+')',list).after($('<th>')).next()
            .append($('<div style="display: table-row">').append($('<div>Емкость</div>')).append($('<div style="display: table-cell">').append(asc_btn).append(desc_btn)));
        $('tr:not(:has("th"))', list).each(function (id) {
            var vl = parseInt($('td:eq('+v+')', this).text().replace(/\s+/g, '').match(/[.\d]+/g));
            var pr = parseFloat($('td:eq('+p+')', this).text().replace(/\s+/g, '').match(/[.\d]+/g));
            var vol = vl * pr;
            $('td:eq('+p+')', this).after('<td align="right">$' + vol.toFixed(0).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ') + '</td>');
            $(this).attr('id',id);
            report[report.length] = {id:id,vol:vol};
        });
    }

    switch (type) {
        case 'by_trade'  : by_trade(); break;
        case 'by_service': by_service(); break;
    }
};
var handlers = [
    { regex: /globalreport\/marketing\/by_trade_at_cities/, handler: 'by_trade' },
    { regex: /globalreport\/marketing\/by_service/, handler: 'by_service' },
];
for (var i = 0; i < handlers.length; i++) {
    if (handlers[i].regex.test(location.href)) {
        // Хак, что бы получить полноценный доступ к DOM >:]
        var script = document.createElement('script');
        script.textContent = '(' + run.toString() + ')("' + handlers[i].handler + '");';
        document.getElementsByTagName('head') [0].appendChild(script);
        break;
    }
}
