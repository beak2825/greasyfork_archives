// ==UserScript==
// @name           Virtonomica: цена/качество
// @namespace      SemenovArt
// @description    Расчет соотношения цена/качество
// @include        http://virtonomic*.*/*/window/unit/supply/create/*/step2
// @version        0.1
// @downloadURL https://update.greasyfork.org/scripts/2761/Virtonomica%3A%20%D1%86%D0%B5%D0%BD%D0%B0%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/2761/Virtonomica%3A%20%D1%86%D0%B5%D0%BD%D0%B0%D0%BA%D0%B0%D1%87%D0%B5%D1%81%D1%82%D0%B2%D0%BE.meta.js
// ==/UserScript==


    



var run = function() {

    /////////CONFIG START\\\\\\\\\\\
    var sort_on_load = true; //сортировка после загрузки страницы
    var sorting = 'asc'; //направление сортировки по умолчанию: asc - по взрастанию, desc по убыванию
    //////////CONFIG END\\\\\\\\\\\\

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;


    var sorting_asc;
    var table = $("table[class='unit-list-2014']");
    var head = table.find("thead:first").find("tr:first"); //находим заголовок таблицы
    var arrows = '<th onmouseover="this.className = \'filter_light\'" onmouseout="this.className = \'\'" onclick="sort_by_price(\'asc\');" class="">';
    arrows +=   '<div class="field_title">Цена/кач'
    arrows +=   '<div class="asc" title="сортировка по возрастанию"><a href="#" onclick="sort_by_price(\'asc\');"><img id="asc_sort_price" src="/img/up_gr_sort.png"></a></div>'
    arrows +=   '<div class="desc" title="сортировка по убыванию"><a href="#" onclick="sort_by_price(\'asc\');"><img id="desc_sort_price" src="/img/down_gr_sort.png"></a></div>'
    arrows +=   '</div></th>'

    head.find("th:nth-child(4)").after(arrows);
    head.find('th').css('background', '#5bd65b');

    function row(id, price) {
        this.id = id;
        this.price = price;
    }
    
    var prices = [];

    table.find('tbody tr').each(function(i, val) {        
        if ($(this).attr('class') == 'ordered') { $(this).find("td:first").attr('colspan', '10'); } //зеленую полоску с информацией о заказе растягиваем и пропускаем
        if ($(this).attr('id') == undefined || $(this).attr('id')[0] != 'r') { return; }
        var cels = $('td', this);
        var price = parseFloat($(cels[5]).text().replace(/ /g, ''));
        var qual = parseFloat($(cels[6]).text().replace(/ /g, ''));
        var qp = 0.00;

        if (!isNaN(price) && !isNaN(qual))
            var qp = (price / qual).toFixed(2);


        $(cels[5]).after('<td class="digits">' + ((qp == 0) ? '---' : (qp + '$')) + '</td>'); //добавляем столбец в каждую строку

        prices[i] = new row($(this).attr('id'), qp); //будем хранить id строки продукта и цену, для дальнейшей сортировки
        });


    if (sort_on_load) sort_by_price(sorting);

    function sortFunc(a, b){
          return (b['price'] - a['price']) * sorting_asc
    }



    function sort_by_price(direction){
        var table = $("table[class='unit-list-2014']");
        sorting_asc = (direction == 'asc') ? 1 : -1;
        img = $('#' + direction + '_sort_price');

        $( "th[class='active_sort']" ).attr('class', '').attr('onmouseout', "this.className = ''"); 
        $( "img[src='/img/down_wh_sort.png']" ).attr('src', '/img/down_gr_sort.png'); 
        $( "img[src='/img/up_wh_sort.png']" ).attr('src', '/img/up_gr_sort.png');
        $( "div[class='desc hide_active']" ).attr('class', 'desc');  
        $( "div[class='asc hide_active']" ).attr('class', 'asc');  


        prices.sort(sortFunc);
        for (var i = prices.length - 1; i >= 0; i--) {
            if(prices[i] == null) continue;
            var row = $('#'+prices[i]['id']);
            //если строка с заказом то под нее добавляем зеленую строчку с информацией о заказе
            if(row.attr('class') == 'ordered_offer')
            {
                row.prev().appendTo(table);
                row.appendTo(table);
                $('#ordered'+(prices[i]['id']).substring(1)).appendTo(table);
                continue;
            }
            row.prev().appendTo(table);
            row.appendTo(table);
            //if ((i % 2) == 1) row.attr('class', 'odd'); //else $('#'+row['id']).css('background', '#ffffff');//перекрашиваем нечетные строки в серый
        };

    }

}

// Хак, что бы получить полноценный доступ к DOM
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);