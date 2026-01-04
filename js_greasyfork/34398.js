// ==UserScript==
// @name        Price/Quality new
// @namespace   virtonomica
// @description Price/Quality on supply page + sorting
// @include     *virtonomic*.*/*/window/unit/supply/create/*/step2
// @version     1.01
// @author      ctsigma
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34398/PriceQuality%20new.user.js
// @updateURL https://update.greasyfork.org/scripts/34398/PriceQuality%20new.meta.js
// ==/UserScript==
var run = function () {
  //    var sorting = 'asc'; //направление сортировки по умолчанию: asc - по взрастанию, desc по убыванию
  var sorting_asc;
  function row(id, price) {
    this.id = id;
    this.price = price;
  }
  function sortFunc(a, b) {
    return (b.price - a.price) * sorting_asc;
  }
  function sort_by_price(direction) {
    sorting_asc = (direction == 'asc') ? 1 : - 1;
    prices.sort(sortFunc);
    for (var i = prices.length - 1; i >= 0; i--) {
      var row = prices[i];
      if (row === null) continue;
      //если строка с заказом то под нее добавляем зеленую строчку с информацией о заказе
      if ($('#' + row.id).attr('class') == 'ordered_offer')
      {
        $('#' + row.id).appendTo($('.unit-list-2014'));
        $('#ordered' + (row.id).substring(1)).appendTo($('.unit-list-2014'));
        continue;
      }
      $('#' + row.id).appendTo($('.unit-list-2014'));
      //           if ((i % 2) == 1) $('#'+row['id']).attr('class', 'even'); else $('#'+row['id']).attr('class', 'odd');//перекрашиваем нечетные строки в серый
    }
    $('.active_sort:eq(0)').attr('onmouseout',"this.className = ''").attr('class',"");
    $('.asc.hide_active:eq(0)').attr('class',"asc").find('img').attr('src','/img/up_gr_sort.png');
    $('.desc.hide_active:eq(0)').attr('class',"desc").find('img').attr('src','/img/down_gr_sort.png');
    col_head.attr('class','active_sort').attr('onmouseout',"this.className = 'active_sort'");
    switch (direction) {
      case 'asc':
        $('.asc',col_head).attr('class','asc hide_active').find('img').attr('src','/img/up_wh_sort.png');
        $('.desc',col_head).attr('class','desc').find('img').attr('src','/img/down_gr_sort.png');
        break;
      case 'desc':
        $('.asc',col_head).attr('class','asc').find('img').attr('src','/img/up_gr_sort.png');
        $('.desc',col_head).attr('class','desc hide_active').find('img').attr('src','/img/down_wh_sort.png');
        break;
    }
  }
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  var col_head = $('.unit-list-2014 th:contains("Качество")').after('<th><div class="field_title">P/Q ratio '+
  '<div class="asc" title="сортировка по возрастанию"><a><img src="/img/up_gr_sort.png" id="sort_price_asc_btn"></a></div>'+
  '<div class="desc" title="сортировка по убыванию"><a><img src="/img/down_gr_sort.png" id="sort_price_desc_btn"></a></div>'+
  '</div></th>');
  col_head = col_head.next().attr('onmouseout',"this.className = ''").attr('onmouseover',"this.className = 'filter_light'");
  //col_head.click(function() {if ( $('.asc.hide_active').length > 0 ) sort_by_price('desc'); else sort_by_price('asc'); });
  $('#sort_price_asc_btn').click(function () {sort_by_price('asc');});
  $('#sort_price_desc_btn').click(function () {sort_by_price('desc');});
  $('.ordered').find("td:first").attr('colspan', '13'); //растягиваем строку с заказом и форму заказа на 13 столбцов(вместо 12)
  $('#orderForm').find("td:first").attr('colspan', '13');
  var prices = [];
  $('.unit-list-2014 .choose').parent().each(function () {
    var l = $('td', this).length;
    var P = parseFloat($('td:eq(' + (5) + ')', this).text().replace(/[^\d\.]/g,''));
    var Q = parseFloat($('td:eq(' + (6) + ')', this).text().replace(/[^\d\.]/g,''));
    var qp = (P / Q).toFixed(2);
    $('td:eq(' + (6) + ')', this).after('<td class="supply_data" style="color:red">' + qp + '</td>');
    //    $('td:eq('+(l-3)+')',this).after('<td style="color:red">' + l + '</td>');
    prices[prices.length] = new row($(this).attr('id'), qp);
    //будем хранить id строки продукта и цену, для дальнейшей сортировки;
  });
};
// Хак, что бы получить полноценный доступ к DOM

var script = document.createElement('script');
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
