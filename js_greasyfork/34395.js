// ==UserScript==
// @name        supply PQR
// @namespace   virtonomica
// @include     *virtonomic*.*/*/supply
// @description Price/Quallity on supply page
// @description sorting by PQR in warehouse
// @version     1.11
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34395/supply%20PQR.user.js
// @updateURL https://update.greasyfork.org/scripts/34395/supply%20PQR.meta.js
// ==/UserScript==
var run = function () {
    function getType() {
        var type = '';
        $('script').each(function () {
            var cl = $(this).text().match(/\.addClass\(\'bg-page-unit-header-(.+)\'\);/);
            if (cl != null) type = (cl[1]);
        });
        return type==''?'unknown':type;
    } //end getType()

    function sort_col(direction,cat){
        var order = (direction == 'asc') ? 1 : -1;
        var sortFunc = function(a,b){return (b.val - a.val) * order;};
        warehouse[cat].sort(sortFunc);
        for (var i = 0; i < warehouse[cat].length; i++) {
            var row = warehouse[cat][i];
            if (row === null) continue;
            $('#'+cat).after($('#' + row.id));
        }
        $('#'+cat+' .asc').find('img').attr('src','/img/up_'+(direction=='asc'?'wh':'gr')+'_sort.png');
        $('#'+cat+' .desc').find('img').attr('src','/img/down_'+(direction=='desc'?'wh':'gr')+'_sort.png');
        $('[id^="'+cat+'-"]').each(function(i,item){
            $(this).attr('class',i%2==0?'even':'odd');
        });
    }

    var type = getType();
    switch (type){
        case 'warehouse': //склад
            var row = function(id, val) {this.id = id;this.val = val;};
            $('.list th:contains("Качество")').after('<th width="55">P/Q ratio</th>');
            var cat=0;
            var id=0;
            var group='';
            var item='';
            var warehouse = [];
            $('.list>tbody>tr:gt(0)').each(function () {
                var price = parseFloat($('>td:eq(3)', this).text().trim().replace(/[^\d\.]/g,''));
                var qual = parseFloat($('>td:eq(5)', this).text().trim().replace(/[^\d\.]/g,''));
                var PQR = (qual==0)?0:(price / qual).toFixed(2);
                var newcol = $('>td:eq(5)', this).after('<td class="num" style="color:red;">').next();

                if ($(this).attr('class')=='p_title'){
                    cat++;
                    group =  'sort-'+cat;
                    warehouse[group] = [];
                    id=0;
                    var asc_btn = $('<div class="asc" title="сортировка по возрастанию"><a><img src="/img/up_gr_sort.png" style="cursor: pointer; display: table-row" id="sort_asc_btn"></a></div>').click(function () {sort_col('asc',$(this).closest('.p_title').attr('id'));});
                    var desc_btn = $('<div class="desc" title="сортировка по убыванию"><a><img src="/img/down_gr_sort.png" style="cursor: pointer; display: table-row" id="sort_desc_btn"></a></div>').click(function () {sort_col('desc',$(this).closest('.p_title').attr('id'));});
                    newcol.append(
                        $('<div style="display: table-row; float:right">')
                        .append($('<div style="display:table-cell">').append(PQR))
                        .append($('<div style="display:table-cell">').append(asc_btn).append(desc_btn))
                    );
                    newcol.parent().attr('id',group);
                } else {
                    item = group+'-'+id;
                    newcol.append(PQR).parent().attr('id',item);
                    warehouse[group][warehouse[group].length] = new row(item, PQR);
                    id++;
                }
            });
            break;
        default: //завод
            $('td[id^="totalPrice_"]').each(function () {
                var price = parseFloat($('td:contains("Цена")', this).parent().find('td:last').text().trim().replace(/[^\d\.]/g,''));
                var qual = parseFloat($('td:contains("Качество")', this).parent().find('td:last').text().trim().replace(/[^\d\.]/g,''));
                var PQR = (qual==0)?0:(price / qual).toFixed(2);
                $('tr:last', this).after('<tr><td nowrap="nowrap">PQR</td><td> </td><td nowrap="nowrap" align="right" style="color:red">' + PQR + '</td></tr>');
            });
            break;
    }
};
var script = document.createElement('script');
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
