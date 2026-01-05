// ==UserScript==
// @name        Virtonomica:Обзор рынка технологий
// @namespace   virtonomica
// @description Сокращаем показ технологий (показываем только те, где в первых технах суммарная цена продажи выше 200 млн)
// @include     https://virtonomica.ru/vera/main/globalreport/technology_market/total
// @version     0.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25624/Virtonomica%3A%D0%9E%D0%B1%D0%B7%D0%BE%D1%80%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B0%20%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/25624/Virtonomica%3A%D0%9E%D0%B1%D0%B7%D0%BE%D1%80%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B0%20%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D0%B8%D0%B9.meta.js
// ==/UserScript==
var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    var Technology_Limit = 4;
    var Money_Limit = 200000;

    var table = $("table.list");
    var tr = $("tr", table);

    var th = $("th", tr.eq(1) ); 
    for( var j=0; j<th.length - Technology_Limit; j++){
          th.eq(j).hide();
    } 
    th.eq(th.length - Technology_Limit).html("");

    for(var i=2; i<tr.length; i++){
        var row = tr.eq(i);

        var td = $("td", row);
        for( var j=0; j<td.length - Technology_Limit + 1 ; j++){
            td.eq(j).hide();
        } 

        // проверяем цены
        var all_price = 0;
        for( var j=td.length - Technology_Limit + 1; j<td.length; j++){
	     var txt = td.eq(j).text().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '');

             all_price += parseInt(txt);
        }
        if ( all_price < Money_Limit ) {
            row.hide();
        } 
  
    }

    //console.log("table===" + table.length );

    console.log('end of List technology....');
}

// Хак, что бы получить полноценный доступ к DOM >:]
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
} 
