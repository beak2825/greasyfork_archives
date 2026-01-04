// ==UserScript==
// @name           warehouse_balance
// @namespace      Virtonomica
// @description    Баланс товарных остатков на складе
// @include        https://virtonomic*.*/*/main/unit/view/*
// @exclude        https://virtonomic*.*/*/main/unit/view/*/*
// @version        1.03
// @downloadURL https://update.greasyfork.org/scripts/34401/warehouse_balance.user.js
// @updateURL https://update.greasyfork.org/scripts/34401/warehouse_balance.meta.js
// ==/UserScript==
var run = function (){
    function getType(data) {
        var type = '';
        $('script').each(function () {
            var cl = $(this).text().match(/\.addClass\(\'bg-page-unit-header-(.+)\'\);/);
            if (cl != null) type = (cl[1]);
        });
        return type==''?'unknown':type;
    } //end getType()

    function sort_col(direction){
        var order = (direction == 'asc') ? 1 : - 1;
        var sortFunc = function(a,b){return (b.val - a.val) * order;};
        warehouse.sort(sortFunc);
        for (var i = warehouse.length - 1; i >= 0; i--) {
            var row = warehouse[i];
            if (row === null) continue;
            $('#' + row.id).appendTo($('.grid'));
        }
        $('.asc').find('img').attr('src','/img/up_'+(direction=='asc'?'wh':'gr')+'_sort.png');
        $('.desc').find('img').attr('src','/img/down_'+(direction=='desc'?'wh':'gr')+'_sort.png');
        $('tr.odd,tr.even','.grid').each(function(i,item){
            var cl = $(this).attr('class');
            $(this).attr('class',i%2==0?'even':'odd');
            var cl_new = $(this).attr('class');
            var event = $(this).attr('onmouseout').replace(cl,cl_new);
            $(this).attr('onmouseout',event);
        });
    }

    function NumFormat(N) {
        N += '';
        var parts = N.split('.');
        var int = parts[0];
        var dec = parts.length > 1 ? '.' + parts[1] : '';
        var regexp = /(\d+)(\d{3}(\s|$))/;
        while (regexp.test(int)) {
            int = int.replace(regexp, '$1 $2');
        }
        return int + dec;
    }

    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
    // сперва надо убедиться, что мы на странице склада
    if (getType($)!='warehouse') return;
    var warehouse = [];
    var asc_btn = $('<div class="asc" title="сортировка по возрастанию"><a><img src="/img/up_gr_sort.png" style="cursor: pointer; display: table-row" id="sort_asc_btn"></a></div>').click(function () {sort_col('asc');});
    var desc_btn = $('<div class="desc" title="сортировка по убыванию"><a><img src="/img/down_gr_sort.png" style="cursor: pointer; display: table-row" id="sort_desc_btn"></a></div>').click(function () {sort_col('desc');});
    var cell = $('.grid th:eq(9)');
    var header = cell.html();
    cell.empty().append($('<div style="display: table-row">').append(header).append($('<div style="display: table-cell">').append(asc_btn).append(desc_btn)));
    $('tr.even, tr.odd').each(function (id){
        var cells = $('td', this);
        // всего на складе
        var total = parseInt($(cells[1]).text().replace(/\s+/g,''));
        // отгрузки по контракту
        var kont = parseInt($(cells[5]).text().replace(/\s+/g,''));
        // закуплено
        var zak = parseInt($(cells[7]).text().replace(/\s+/g,''));
        // отгружено
        var otgr = parseInt($(cells[8]).text().replace(/\s+/g,''));
        // доля склада
        var part = parseFloat($(cells[9]).text().replace(/\s+/g,''));
        $(this).attr('id',id);
        warehouse[warehouse.length] = {id:id,val:part};
        if (kont > zak)
        {
            var days = Math.floor((total - kont) / (kont - zak));
            if (days < 0)
                days = 0;
            cells[2].innerHTML = '<table width="100%"><tr><td width="10" style="color:red; font-weight:bold; text-align:right">' + days.toString() +
                '</td><td width="*" style="text-align:right">' + cells[2].innerHTML + '</td></tr></table>';
        }
        var balans = zak - otgr;
        if (balans < 0)
            cells[1].innerHTML = cells[1].innerHTML + '<br/><font color="red">' + NumFormat( - balans) + '</font>';
        else
            cells[1].innerHTML = cells[1].innerHTML + '<br/><font color="green">' + NumFormat(balans) + '</font>';
    });
};
var script = document.createElement('script');
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
