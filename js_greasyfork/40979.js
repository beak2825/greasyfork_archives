// ==UserScript==
// @name           consolidation
// @namespace      virtonomica
// @author         ctsigma
// @description    Сортировка для объединения предприятий
// @include        *virtonomica.*/*/window/unit/upgrade/*/consolidation
// @version        1.01
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/40979/consolidation.user.js
// @updateURL https://update.greasyfork.org/scripts/40979/consolidation.meta.js
// ==/UserScript==
var run = function (){

    function sort_col(direction){
        var order = (direction == 'asc') ? 1 : - 1;
        var sortFunc = function(a,b){return (b.val - a.val) * order;};
        units.sort(sortFunc);
        for (var i = units.length - 1; i >= 0; i--) {
            var row = units[i];
            if (row === null) continue;
            $('#' + row.id).appendTo($('.unit-list-2014'));
        }
        $('.asc').find('img').attr('src','/img/up_'+(direction=='asc'?'wh':'gr')+'_sort.png');
        $('.desc').find('img').attr('src','/img/down_'+(direction=='desc'?'wh':'gr')+'_sort.png');
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
    var $ = win.$;

    var asc_btn = $('<div class="asc" title="сортировка по возрастанию"><a><img src="/img/up_gr_sort.png" style="cursor: pointer; display: table-row" id="sort_asc_btn"></a></div>').click(function () {sort_col('asc');});
    var desc_btn = $('<div class="desc" title="сортировка по убыванию"><a><img src="/img/down_gr_sort.png" style="cursor: pointer; display: table-row" id="sort_desc_btn"></a></div>').click(function () {sort_col('desc');});
    var cell = $('.unit-list-2014 th:eq(2)');
    var header = cell.html();
    cell.before($('<th></th>'));
    cell.empty().append($('<div style="display: table-row">').append(header).append($('<div style="display: table-cell">').append(asc_btn).append(desc_btn)));
    var units = [];
    $('.required_employee').after($('<div class="new_required_employee"></div>').css({'color':'red', 'position':'absolute', 'right':'90px', 'top':'35px'}));
    /\/(.+?)\/.+?(\d+)/.exec(location.pathname);
    var unit_id = RegExp.$2;
    var realm = RegExp.$1;
    var apiSummaryUrl = location.origin + '/api/%realm%/main/unit/summary'.replace('%realm%',realm);
    var summary = {};
    var list = {};
    $.ajax({
        url: apiSummaryUrl,
        dataType: 'json',
        async: false,
        data: {id:unit_id},
        success: function(data){
            summary = data;
            if (summary.company_id != null){
                var apiListUrl = location.origin + '/api/%realm%/main/company/units'.replace('%realm%',realm);
                $.ajax({
                    url: apiListUrl,
                    dataType: 'json',
                    async: false,
                    data: {id:summary.company_id, unit_type_id:summary.unit_type_id, pagesize:'9999'},
                    success: function(data){list = data.data;}
                });
            }
        }
    });

    $('.unit-list-2014 input[name*="consolidation"]').closest('tr').each(function (id){
        var cells = $('td', this);
        var size = parseInt($(cells[2]).text().replace(/\D+/g,''));
        // подготовим сортировку
        $(this).attr('id',id);
        units[units.length] = {id:id,val:size};
        // отобразим индикатор отпуска
        var unit_id = $('.info a:eq(0)',this).attr('href').replace(/\D+/g,'');
        var icon = $('<td>');
        if (typeof(list[unit_id]) != 'undefined') {
            if (list[unit_id].productivity == 0) icon = $(icon).append($('<img src="/img/unit_indicator/workers_in_holiday.gif" title="Персонал предприятия в отпуске">'));
        }
        $('td:eq(1)',this).after(icon);
        // подготовим расчет ожидаемого размера
        $('input[name*="consolidation"]',this).change(function() {
            var total = 0;
            $('.unit-list-2014 input[name*="consolidation"]:checked').closest('tr').each(function(){
                var cells = $('td', this);
                total = total + parseInt($(cells[3]).text().replace(/\D+/g,''));
            });
            var new_size = $('.new_required_employee').empty();
            if (total > 0) {
                total = total + parseInt($('.required_employee').text().replace(/\D+/g,''));
                new_size.text('Ожидаемый размер: ' + NumFormat(total));
            }
        });
    });
};
var script = document.createElement('script');
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
