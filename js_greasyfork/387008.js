// ==UserScript==
// @name           Virtonomica: балансир расходников в МЦ, ресторанах, автомастерских и детсадах
// @namespace      virtonomica
// @description    Исправленая версия, не работало в tampermonkey под firefox
// @include	   http*://*virtonomic*.*/*/main/unit/view/*/supply*
// @version        0.50
// @downloadURL https://update.greasyfork.org/scripts/387008/Virtonomica%3A%20%D0%B1%D0%B0%D0%BB%D0%B0%D0%BD%D1%81%D0%B8%D1%80%20%D1%80%D0%B0%D1%81%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B2%20%D0%9C%D0%A6%2C%20%D1%80%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D0%B0%D1%85%2C%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%81%D1%82%D0%B5%D1%80%D1%81%D0%BA%D0%B8%D1%85%20%D0%B8%20%D0%B4%D0%B5%D1%82%D1%81%D0%B0%D0%B4%D0%B0%D1%85.user.js
// @updateURL https://update.greasyfork.org/scripts/387008/Virtonomica%3A%20%D0%B1%D0%B0%D0%BB%D0%B0%D0%BD%D1%81%D0%B8%D1%80%20%D1%80%D0%B0%D1%81%D1%85%D0%BE%D0%B4%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B2%20%D0%9C%D0%A6%2C%20%D1%80%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD%D0%B0%D1%85%2C%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%81%D1%82%D0%B5%D1%80%D1%81%D0%BA%D0%B8%D1%85%20%D0%B8%20%D0%B4%D0%B5%D1%82%D1%81%D0%B0%D0%B4%D0%B0%D1%85.meta.js
// ==/UserScript==

var run = function()
{

    var tcolor = "green";
    var pos=100;

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    //console.log('start');
    var iterator=5;
    $('table.list>tbody>tr>td>table>tbody tr:contains("Расход")').each(function(){
        //console.log(iterator);
        //console.log($( 'td:eq(1)', this )[0]);
        //console.log($( 'td:eq(1)', this )[0].textContent);
        var ras = $( 'td:eq(1)', this )[0].textContent.replace(' ', '').replace(' ', '').replace(' ', '').trim();
        //console.log(ras);
        var total_ras = parseInt(ras);
        var $table2 = $( ':parent', this ).parent().parent().parent().parent().parent();
        var ostatok = $('tr:eq(6)', $table2).text().replace('Количество', '').replace(' ', '').replace(' ', '').replace(' ', '').trim();
        //console.log(ostatok);

        ostatok = parseInt(ostatok);
        var zapas = ostatok / total_ras;
        var chpok = 3;
        var pimp = (total_ras * chpok - ostatok) / chpok;
        var	order = total_ras + (pimp / 6);
        order = parseInt(order);
        $('input:eq(1)', $table2).attr('class', 'iterator'+iterator);
        //console.log(order);

        var text='<tr> <td nowrap="" style="color: '+tcolor+'" class="iterators" onClick="$(\'.iterator'+iterator+'\').val('+order+')">' +  'Расход'+'</td>'+'<td align="right" nowrap="">'+total_ras+' </td></tr> '
        //console.log(text);

        $(text).insertBefore($(this));
        iterator++;
    })
    //console.log('zavod');
    // для заводов:
    $('table.list>tbody>tr>td>table>tbody tr:contains("Требуется")').each(function(){
        //console.log("2");
        var ras = $( "td:eq(1)", this ).attr("textContent").replace(' ', '').replace(' ', '').replace(' ', '').trim();
        //console.log(ras);

        var total_ras = parseInt(ras);
        var $table2 = $( ':parent', this ).parent().parent().parent().parent().parent();
        var ostatok = $('tr:eq(4)', $table2).text().replace('Количество', '').replace(' ', '').replace(' ', '').replace(' ', '').trim();

        ostatok = parseInt(ostatok);
        var zapas = ostatok / total_ras;
        var chpok = 2;
        var pimp = (total_ras * chpok - ostatok) / chpok;
        var	order = total_ras + (pimp / 10);
        order = parseInt(order);
        //console.log(total_ras+'|'+zapas+'|'+order);
        $('input', $table2).attr('class', 'iterator'+iterator);

        var text='<tr> <td nowrap="" style="color: '+tcolor+'" class="iterators" onClick="$(\'.iterator'+iterator+'\').val('+order+')">' +  'Расход'+'</td>'+'<td align="right" nowrap="">'+total_ras+' </td></tr> '

        $(text).insertBefore($(this));
        iterator++;
    })


    var $tbody = $("table.list:eq(0) > tbody:eq(0)");
    //console.log('end');
    $tbody.append($("<input class='mega_iterator' type='button' value='Сбалансировать'>")).click(function() {
        $('.iterators').click();
    });
}

var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
