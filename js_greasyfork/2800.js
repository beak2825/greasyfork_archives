// ==UserScript==
// @name        Virtonomica:SaveNovgorod
// @namespace   virtonomica
// @description сохранять данные по розничным рынкам Новогорода (аптеки)
// @include     http://virtonomica.ru/vera/main/globalreport/marketing/by_trade_at_cities/*/2931/331858/331866
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2800/Virtonomica%3ASaveNovgorod.user.js
// @updateURL https://update.greasyfork.org/scripts/2800/Virtonomica%3ASaveNovgorod.meta.js
// ==/UserScript==
var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

// https://script.google.com/macros/s/AKfycby9DoFAAQKXSzPks1acy5SoN8RaQcDlcNJBYAkeH4yFkErRiQSQ/exec

  var sel = $("select");
  var city = $("option:selected", sel.eq(3) ).text();
  var city_long_id = $("option:selected", sel.eq(3) ).val();
  var nsymbol = city_long_id.lastIndexOf('/');
  var city_id = city_long_id.substr(nsymbol +1);
  console.log( city );

  //ищем ИД товра
  var key = 'by_trade_at_cities';
  var href = location.href;
  var ns1 = href.lastIndexOf( key );
  var goods = href.substr(ns1+ key.length +1);
  var ns2 = goods.indexOf('/');
  var goods_id = goods.substr(0, ns2);

  var wc_save = $("<td style='cursor:pointer;'><img title='Передать данные розничного рынка в Гугл' alt='Передать данные розничного рынка в Гугл' src='http://www.iconsearch.ru/uploads/icons/gnomeicontheme/32x32/emblem-marketing.png' >&nbsp;").click( function() {

    var cal = $("#calendar_m");
    var date = $.trim( cal.text() );
    //console.log( date );

    var val = $("table.grid").eq(1);
    // Цена
    var pr = $("th:contains('Цена')", val).parent();
    // ищем первый td
    var local_price = $("td:first", pr); // цена местных
    var fl_local_price = /([\D]+)*([\d\s]+\.*\d*)/.exec(local_price.text())[2].replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(".", ",");
    //console.log (fl_local_price );

    // Качество
    pr = $("th:contains('Качество')", val).parent();
    // ищем первый td
    var local_qv = $("td:first", pr); // качество местных
    var fl_local_qv = /([\D]+)*([\d\s]+\.*\d*)/.exec(local_qv.text())[2].replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(".", ",");
    //console.log (fl_local_qv );

    var val = $("td:contains('Объем рынка')").next().text();
    ns1 = val.indexOf( ' ед.' );
    var value = val.substr(0, ns1).replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "");

    Murl = "https://script.google.com/macros/s/AKfycby9DoFAAQKXSzPks1acy5SoN8RaQcDlcNJBYAkeH4yFkErRiQSQ/exec?city=" + city_id 
          + "&date=" + date  
          + "&goods=" + goods_id
          + "&price=" + fl_local_price
          + "&qv=" + fl_local_qv
          + "&value=" + value
;
    // Отправляем данные в гугл
    $('#out_text_sn').text(Murl);
    $.get(Murl,function(data){		
        $('#out_text_sn').html( data );
    });


  });

  // Добавить кнопку в меню
  var table = $("table.tabsub");
  $("td:eq(0)", table).before(wc_save);
  table.before('<div id=out_text_sn style="float:left"></div>');

  console.log("Virtonomica:SaveNovgorod");
}

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);