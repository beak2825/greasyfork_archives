// ==UserScript==
// @name           Virtonomica: управление предприятиями + Free + Electro
// @namespace      virtonomica
// @version 	   1.80
// @description    Добавление нового функционала к управлению предприятиями
// @include        https://*virtonomic*.*/*/main/company/view/*/unit_list
// @include        https://*virtonomic*.*/*/main/company/view/*
// @downloadURL https://update.greasyfork.org/scripts/28505/Virtonomica%3A%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D1%8F%D0%BC%D0%B8%20%2B%20Free%20%2B%20Electro.user.js
// @updateURL https://update.greasyfork.org/scripts/28505/Virtonomica%3A%20%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D1%8F%D0%BC%D0%B8%20%2B%20Free%20%2B%20Electro.meta.js
// ==/UserScript==
var run = function () {
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  // поиск эффективности и подсевтка красным всего что не 100%
  $('td.prod').each(function () {
    // эффективность
    ef = parseInt($(this).text());
    if (ef < 100) {
      $(this).css('color', 'red');
    }
  });
  function getStyle()
  {
    var out = '<style>';
    out += '.tchk {';
    out += 'padding: 0px; background: #D8D8D8; float:left; height: 6px; width: 6px; margin: 1px;';
    out += '}';
    out += '.geocombo {';
    out += 'background-position: 2px 50%; background-repeat: no-repeat; padding-left: 20px;';
    out += '}';
    out += '</style>';
    return out;
  }
  function getSizeHtml(size)
  {
    var out = '<div>';
    for (var i = 0; i < size; i++) {
      out += '<div class=tchk >&nbsp;</div>';
      if (i == 2) out += '<div style=\'clear:both\'></div>';
    }
    out += '</div>';
    return out;
  } // сокращенный размер для размеров подразделений

  $('table.unit-top').append(getStyle());
  /*
   $("td.size").each(function(){
	$(this).html( getSizeHtml( $("img", this).length) );
   });
*/
  var title = $('div.field_title').eq(3);
  //console.log( title.text() );
  title.html(title.html().replace('Размер', 'Р.')).attr('title', 'размер подраздления (от 1 до 6)');
  // Перекрашиваем заголовок
  //$("th").css('background', 'none repeat scroll 0 0 #CED8F6').css('color', 'grey');
  // Перемещаем создать подразделение в одну строку с типа подразделений
  var type_toolbar = $('td.u-l');
  //var el = type_toolbar.parent().next();
  var el = $('img.img_button').parent();
  //console.log( "len = " + el.length);
  //console.log( el.html() );
  var ttt = $('img', el);
  //console.log( ttt.attr('src') );
  var create_img = '<a href=' + el.attr('href') + ' title=\'Создать подразделение\'><img src=' + ttt.attr('src') + '></a>';
  //console.log( create_img );
  type_toolbar.append(create_img);
  //$("a", el).parent().hide();
  el.hide();
  var url = /^https:\/\/virtonomic[as]\.(\w+)\/\w+\//.exec(location.href) [0];
  // Список с ячейками, содержащими названия подразделений
  var list = $('td.info');
  var input_group = $('<select>');
  input_group.append('<option value="">Без группы</option>');
  var list_of_groups = [
  ];
  list.each(function () {
    //	console.log( $(this).find('a').text() );
    //       exit;
    var hh = $(this).find('a').text().split('|');
    if (typeof hh[1] === 'undefined') {
      // not in group
    } 
    else {
      // in group
      hh[1] = hh[1].trim();
      if (list_of_groups.indexOf(hh[1]) < 0) {
        list_of_groups.push(hh[1]);
      } //      console.log(hh[1]);

      var str = $(this).html();
      var n = str.indexOf('<br>');
      if (n == - 1) return;
      str = str.substr(0, n);
    }
    $(this).html(str);
  });
  input_group.change(function () {
    var needle = input_group.val();
    $('#text_search').val(needle).trigger('change');
  });
  list_of_groups.sort();
  list_of_groups.forEach(function (element) {
    console.log(element);
    input_group.append('<option value="' + element + '">' + element + '</option>');
    //input_group.append('<option value="фабрика">фабрика</option>');
  });
  var input_ef = $('<select>').append('<option value=-1>Все</option>').append('<option value=-2>Не работают</option>').append('<option value=-14>В отпуске</option>').append('<option value=-3>Плохой кач оборудования</option>').append('<option value=-4>Затоваривание склада</option>').append('<option value=-5>Подшефное предприятие</option>').append('<option value=-6>Недостаточно сырья</option>').append('<option value=-17>Возможная недостача сырья</option>').append('<option value=-7>На обучении</option>').append('<option value=-8>Ниже или около себестоимости</option>').append('<option value=-15>Не выставлены цены</option>').append('<option value=-9>Распродажа</option>').append('<option value=-10>Убыточное подразделение</option>').append('<option value=-11>Неполный уровень загрузки предприятия</option>').append('<option value=-12>Предприятие на расширении</option>').append('<option value=-13>Уровень сервиса в магазине не максимален</option>').append('<option value=-16>Предприятие выставлено на продажу</option>').append('<option value=-18>Размещена заявка на лицензию</option>').append('<option value=10>&lt; 100%</option>').append('<option value=100>100%</option>').append('<option value=0>0%</option>').change(function () {
    var find_count = 0;
    list.each(function () {
      var needle = input_ef.val();
      // поиск эффективности
      //           var eg = $(this).next().next().next().next().next().find('img[src*="unit_is_under_research"]');
      //           console.log(eg);
      //           exit;
      if (needle == '-2' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="no_workers_or_equipment"]').length > 0) var ef = - 2;
      if (needle == '-3' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="unit_equipment_quality_req"]').length > 0) var ef = - 3;
      if (needle == '-4' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="storage_is_full"]').length > 0) var ef = - 4;
      if (needle == '-5' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="unit_is_under_research"]').length > 0) var ef = - 5;
      if (needle == '-6' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="unit_insufficient_supply_material"]').length > 0) var ef = - 6;
      if (needle == '-7' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="workers_on_training"]').length > 0) var ef = - 7;
      if (needle == '-8' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="unit_sale_price"]').length > 0) var ef = - 8;
      if (needle == '-9' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="shop_sale_out"]').length > 0) var ef = - 9;
      if (needle == '-10' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="shop_unprofitable"]').length > 0) var ef = - 10;
      if (needle == '-11' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="unit_loading_not_full"]').length > 0) var ef = - 11;
      if (needle == '-12' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="unit_upgrade"]').length > 0) var ef = - 12;
      if (needle == '-13' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="shop_service_no_max"]').length > 0) var ef = - 13;
      if (needle == '-14' && typeof ef === 'undefined' && $(this).next().next().next().next().find('img[src*="workers_in_holiday"]').length > 0) var ef = - 14;
      if (needle == '-15' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="shop_no_price"]').length > 0) var ef = - 15;
      if (needle == '-16' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="unit_on_market"]').length > 0) var ef = - 16;
      if (needle == '-17' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="unit_possible_shortage_material"]').length > 0) var ef = - 17;
      if (needle == '-18' && typeof ef === 'undefined' && $(this).next().next().next().next().next().find('img[src*="unit_license_bid"]').length > 0) var ef = - 18;
      if (typeof ef === 'undefined') var ef = parseInt($(this).next().next().next().next().text());
      if (ef == '') ef = 0;
      var find = - 1;
      switch (needle) {
        case '10':
          {
            if ((ef > 0) && (ef != 100)) find = 1;
            break;
          }
        case '100':
          {
            if (ef == 100) find = 1;
            break;
          }
        case '0':
          {
            if (ef == 0) find = 1;
            break;
          }
        case '-1':
          {
            find = 1;
            break;
          }
        case '-2':
          {
            if (ef == - 2) {
              find = 1;
            }
            break;
          }
        case '-3':
          {
            if (ef == - 3) {
              find = 1;
            }
            break;
          }
        case '-4':
          {
            if (ef == - 4) {
              find = 1;
            }
            break;
          }
        case '-5':
          {
            if (ef == - 5) {
              find = 1;
            }
            break;
          }
        case '-6':
          {
            if (ef == - 6) {
              find = 1;
            }
            break;
          }
        case '-7':
          {
            if (ef == - 7) {
              find = 1;
            }
            break;
          }
        case '-8':
          {
            if (ef == - 8) {
              find = 1;
            }
            break;
          }
        case '-9':
          {
            if (ef == - 9) {
              find = 1;
            }
            break;
          }
        case '-10':
          {
            if (ef == - 10) {
              find = 1;
            }
            break;
          }
        case '-11':
          {
            if (ef == - 11) {
              find = 1;
            }
            break;
          }
        case '-12':
          {
            if (ef == - 12) {
              find = 1;
            }
            break;
          }
        case '-13':
          {
            if (ef == - 13) {
              find = 1;
            }
            break;
          }
        case '-14':
          {
            if (ef == - 14) {
              find = 1;
            }
            break;
          }
        case '-15':
          {
            if (ef == - 15) {
              find = 1;
            }
            break;
          }
        case '-16':
          {
            if (ef == - 16) {
              find = 1;
            }
            break;
          }
        case '-17':
          {
            if (ef == - 17) {
              find = 1;
            }
            break;
          }
        case '-18':
          {
            if (ef == - 18) {
              find = 1;
            }
            break;
          }
      } // заметки

      var find_notes = 0;
      if (($(this).parent().next().prop('class') == 'u-z') || ($(this).parent().next().prop('class') == 'u-z ozz')
      ) {
        find_notes = 1;
    }
    if (find == - 1) {
      $(this).parent().hide();
      if (find_notes == 1) $(this).parent().next().hide();
  } else {
    $(this).parent().show();
    find_count++
    if (find_notes == 1) $(this).parent().next().show();
}
});
if (find_count == 0) $('#ef_info').html('&nbsp;'); 
else $('#ef_info').html('(' + find_count + ')');
}); // Клик по эффективности
$(list).next().next().next().next().css('cursor', 'pointer').prop('title', 'Узнать прогноз эффективности').click(function () {
var td = $(this);
td.empty().append($('<img>').attr({
'src': 'https://virtonomica.ru/img/reward/braz_auc_1.gif',
'height': 16,
'width': 16
}).css('padding-right', '20px'));
var el = $('td.unit_id', $(this).parent());
var id = el.text();
// IT centers
if (td.parent().find('.i-cellular').length > 0)
{
//alert('IT');
var html2 = '? млн/раб';
jQuery.ajaxSetup({
  async: false
});
$.get(url + 'main/unit/view/' + id, function (data) {
  // var empleff2 = $('td:contains(Цена) + td td:eq(1)', data).text().replace('за минуту разговора ($', '').replace(")", "").replace(" ", "").replace("", "").trim();
  var sales = parseFloat($('td:contains(Цена) + td:eq(1)', data).text().split('за минуту разговора') [1].trim().replace('(', '').replace(')', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', ''));
  var empl = $('td:contains(Количество сотрудников) + td', data).text().trim().split('(требуется');
  var empl_total = parseInt(empl[0].replace(' ', '').trim());
  //  console.log(sales + ' - ' + empl_total);
  html2 = parseInt((sales / empl_total) / 100000) / 10;
  //exit;
});
$.get(url + 'window/unit/productivity_info/' + id, function (data) {
  var percent = $('td:contains(Эффективность работы) + td td:eq(1)', data).text().replace('%', '').trim();
  //    console.log(percent);
  var color = (percent == '100.00' ? 'green' : 'red');
  var html = percent + '<i>%</i>';
  td.css('color', color).html(html);
  td.prev().html('Выхлоп: ' + html2 + ' млн/раб');
});
} // shops

if (td.parent().find('.i-shop').length > 0)
{
var html2 = '? млн/раб';
jQuery.ajaxSetup({
  async: false
});
var empl_total = 0;
var sales = 0;
var sales_prev = 0;
var income = 0;
var income_prev = 0;
var supply_percent = 0;
var haveStock = 0;
var itemId = 0;
$.get(url + 'main/unit/view/' + id, function (data) {
  // var empleff2 = $('td:contains(Цена) + td td:eq(1)', data).text().replace('за минуту разговора ($', '').replace(")", "").replace(" ", "").replace("", "").trim();
  //  var sales = parseFloat($('td:contains(Цена) + td:eq(1)', data).text().split('за минуту разговора') [1].trim().replace('(', '').replace(')', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', ''));
  var empl = $('td:contains(Количество сотрудников) + td', data).text().trim().split('(требуется');
  empl_total = parseInt(empl[0].replace(' ', '').replace(' ', '').trim());
  // html2 = parseInt((sales/empl_total)/100000)/10;
  //exit;
});
// finance stats
$.get(url + 'window/unit/view/' + id + '/finans_report/by_item', function (data) {
//  sales = parseFloat($('td.nowrap:eq(0)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
  sales_prev = parseFloat($('td.nowrap:eq(1)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
//  income = parseFloat($('td.nowrap:eq(95)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
  income_prev = parseFloat($('td.nowrap:eq(96)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
      sales = parseFloat($('td.nowrap:eq(0):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));
  income = parseFloat($('td.nowrap:eq(2):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));

  //  console.log(sales_prev);
  //  console.log(income_prev);
});
// supply stats
$.get(url + 'window/unit/view/' + id + '/supply', function (data) {
  supply_percent = $('table.infoblock td:eq(1)', data).text().trim().replace(' с учётом оценки запасов)', '').replace('считалось по изменившимся ценам', '').replace('$', '').replace('| ', '').replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').trim().split('(');
//  console.log(supply_percent);
  if (supply_percent.length == 1) {
    if (supply_percent[0] == '') {
      supply_percent = 0;
    } else {
      supply_percent = 100;
    }
  } else {
    supply_percent = parseInt(1000 * supply_percent[1] / supply_percent[0]) / 10;
  } //  sales_prev = parseFloat($('td.nowrap:eq(1)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
  //  income = parseFloat($('td.nowrap:eq(95)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
  //  income_prev = parseFloat($('td.nowrap:eq(96)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
  //  console.log(income_prev);

});
    // product emptyness
$.get(url + 'window/unit/view/' + id + '/trading_hall', function (data) {
var $tbody = $('table.grid:eq(0) > tbody:eq(0)', data);

        $tbody.children('tr').each(function () {
      var $tr = $(this);
      if ($tr.children('td').length === 1) {
      } else if ($tr.children('td').length > 1) {
        itemId++;
         var $td6 = $tr.children('td:eq(5)'); // on stock
          var onStock = $td6.text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace('%', '') - 0;
          if(onStock > 0) haveStock++;

      }
        });

});

$.get(url + 'window/unit/productivity_info/' + id, function (data) {
  var percent = $('td:contains(Эффективность работы) + td td:eq(1)', data).text().replace('%', '').trim();
  var visitors = parseInt($('td:contains(Количество посетителей) + td', data).text().replace('в неделю', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').trim());
  var advert = parseFloat($('td:contains(Расходы на рекламу) + td', data).text().replace('в неделю', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', '').replace(' ', '').replace(' ', '').trim());
  var color = (percent == '100.00' ? 'green' : 'red');
  var html = percent + '<i>%</i>';
  var sales_per_worker = parseInt((sales / empl_total) / 100000) / 10;
  var sales_per_visitor = parseInt((sales / visitors) / 100) / 10;
  var visual_sales = parseInt((sales) / 100000) / 10;
  var income_per_worker = parseInt((income / empl_total) / 100000) / 10;
  var color_income_per_worker = 'black';
  if (income_per_worker <= 3) color_income_per_worker = 'green';
  if (income_per_worker < 1) color_income_per_worker = 'orange';
  if (income_per_worker < 0.5) color_income_per_worker = 'red';
  if (income_per_worker > 3) color_income_per_worker = 'lime';
  //  console.log(income_per_worker +' | '+ color_income_per_worker);
  var income_per_visitor = parseInt((income / visitors) / 100) / 10;
  var visual_income = parseInt((income) / 100000) / 10;
  var cho = sales - income;
  var income_percent = parseInt((income / cho) * 100);
  var income_percent_prev = parseInt((income_prev / (sales_prev - income_prev)) * 100);
  //  console.log(income_percent +' | '+income_percent_prev);
  td.css('color', color).html(html);
  var color_income = 'black';
  if (income_percent > income_percent_prev) color_income = 'green';
  if (income_percent < income_percent_prev) color_income = 'red';
  var color_supply = 'black';
  if (supply_percent < 80) color_supply = 'orange';
  if (supply_percent < 50) color_supply = 'red';

    var color_goods = 'black';
  if(haveStock < itemId) color_goods = 'orange';
  if(haveStock < itemId * 0.8) color_goods = 'red';
  if(haveStock < itemId / 2) color_goods = 'brown';

  var html2 = 'Продажи: &nbsp;' + visual_sales + ' млн | ' + sales_per_worker + ' млн/раб | ' + sales_per_visitor + ' к/пос';
  html2 += '<br>Прибыль: ' + visual_income + ' млн | <span style="color:' + color_income_per_worker + ';">' + income_per_worker + '</span> млн/раб | ' + income_per_visitor + ' к/пос';
  html2 += '<br>Рентабельность: <span style="color:' + color_income + ';">' + income_percent + '%</span> | Снабжение: <span style="color:' + color_supply + ';">' + supply_percent + '%</span> | Товаров: <span style="color:' + color_goods + ';">' + haveStock + ' / '+ itemId + '</span>';
  td.prev().html(html2);
});
}

    // fuel

if (td.parent().find('.i-fuel').length > 0)
{
var html2 = '? млн/раб';
jQuery.ajaxSetup({
  async: false
});
var empl_total = 0;
var sales = 0;
var income = 0;
var visitors = 0;
$.get(url + 'main/unit/view/' + id, function (data) {
  // var empleff2 = $('td:contains(Цена) + td td:eq(1)', data).text().replace('за минуту разговора ($', '').replace(")", "").replace(" ", "").replace("", "").trim();
  //  var sales = parseFloat($('td:contains(Цена) + td:eq(1)', data).text().split('за минуту разговора') [1].trim().replace('(', '').replace(')', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', ''));
  var empl = $('td:contains(Количество сотрудников) + td', data).text().trim().split('(требуется');
  empl_total = parseInt(empl[0].replace(' ', '').replace(' ', '').trim());
  visitors = parseInt($('td:contains(Количество посетителей) + td', data).text().replace('машин в час', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').trim());
  console.log(visitors);
  // html2 = parseInt((sales/empl_total)/100000)/10;
  //exit;
});
// finance stats
$.get(url + 'window/unit/view/' + id + '/finans_report/by_item', function (data) {
//  sales = parseFloat($('td.nowrap:eq(0)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
//  income = parseFloat($('td.nowrap:eq(95)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
      sales = parseFloat($('td.nowrap:eq(0):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));
  income = parseFloat($('td.nowrap:eq(2):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));

  //  console.log(sales);
  //  console.log(income);
});
$.get(url + 'window/unit/productivity_info/' + id, function (data) {
  var percent = $('td:contains(Эффективность работы) + td td:eq(1)', data).text().replace('%', '').trim();
  var advert = parseFloat($('td:contains(Расходы на рекламу) + td', data).text().replace('в неделю', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', '').replace(' ', '').replace(' ', '').trim());
  var color = (percent == '100.00' ? 'green' : 'red');
  var html = percent + '<i>%</i>';
  var sales_per_worker = parseInt((sales / empl_total) / 100000) / 10;
  var sales_per_visitor = parseInt((sales / visitors) / 100) / 10;
  var visual_sales = parseInt((sales) / 100000) / 10;
  var income_per_worker = parseInt((income / empl_total) / 100000) / 10;
  var income_per_visitor = parseInt((income / visitors) / 100) / 10;
  var visual_income = parseInt((income) / 100000) / 10;
  var cho = sales - income;
  var income_percent = parseInt((income / cho) * 100);
  td.css('color', color).html(html);
  var html2 = 'Продажи: &nbsp;' + visual_sales + ' млн | ' + sales_per_worker + ' млн/раб | ' + sales_per_visitor + ' к/пос';
  html2 += '<br>Прибыль: ' + visual_income + ' млн | ' + income_per_worker + ' млн/раб | ' + income_per_visitor + ' к/пос';
  html2 += '<br>Рентабельность: ' + income_percent + '%';
  td.prev().html(html2);
});
} // restaurant

if (td.parent().find('.i-restaurant').length > 0)
{
var html2 = '? млн/раб';
jQuery.ajaxSetup({
  async: false
});
var empl_total = 0;
var sales = 0;
var income = 0;
var visitors = 0;
var max_visitors = 0;
$.get(url + 'main/unit/view/' + id, function (data) {
  // var empleff2 = $('td:contains(Цена) + td td:eq(1)', data).text().replace('за минуту разговора ($', '').replace(")", "").replace(" ", "").replace("", "").trim();
  //  var sales = parseFloat($('td:contains(Цена) + td:eq(1)', data).text().split('за минуту разговора') [1].trim().replace('(', '').replace(')', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', ''));
  var empl = $('td:contains(Количество сотрудников) + td', data).text().trim().split('(требуется');
  empl_total = parseInt(empl[0].replace(' ', '').replace(' ', '').trim());
  visitors = parseInt($('td:contains(Количество посетителей) + td', data).text().replace('в неделю', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').trim());
  max_visitors = parseInt($('td:contains(Количество посетителей) + td', data).text().split('макс.: ') [1].replace(' ', '').replace(' ', '').trim());
  //  console.log(visitors);
  //  console.log(cho);
  // html2 = parseInt((sales/empl_total)/100000)/10;
  //exit;
});
// finance stats
$.get(url + 'window/unit/view/' + id + '/finans_report/by_item', function (data) {
  sales = parseFloat($('td.nowrap:eq(0):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));
  income = parseFloat($('td.nowrap:eq(2):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));
});
$.get(url + 'window/unit/productivity_info/' + id, function (data) {
  var percent = $('td:contains(Эффективность работы) + td td:eq(1)', data).text().replace('%', '').trim();
  var advert = parseFloat($('td:contains(Расходы на рекламу) + td', data).text().replace('в неделю', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', '').replace(' ', '').replace(' ', '').trim());
  var color = (percent == '100.00' ? 'green' : 'red');
  var html = percent + '<i>%</i>';
  var sales_per_worker = parseInt((sales / empl_total) / 100000) / 10;
  var sales_per_visitor = parseInt((sales / visitors) / 100) / 10;
  var visual_sales = parseInt((sales) / 100000) / 10;
  var income_per_worker = parseInt((income / empl_total) / 100000) / 10;
  var income_per_visitor = parseInt((income / visitors) / 100) / 10;
  var visual_income = parseInt((income) / 100000) / 10;
  var cho = sales - income;
  var income_percent = parseInt((income / cho) * 100);
  var visual_load = Math.round((visitors / max_visitors) * 10000) / 100;
  var visual_load_color = 'red';
  if (visual_load > 30) visual_load_color = 'orange';
  if (visual_load > 60) visual_load_color = 'olive';
  if (visual_load > 90) visual_load_color = 'green';
  if (visual_load > 95) visual_load_color = 'lime';
  td.css('color', color).html(html);
  var html2 = 'Продажи: &nbsp;' + visual_sales + ' млн | ' + sales_per_worker + ' млн/раб | ' + sales_per_visitor + ' к/пос';
  html2 += '<br>Прибыль: ' + visual_income + ' млн | ' + income_per_worker + ' млн/раб | ' + income_per_visitor + ' к/пос';
  html2 += '<br>Рентабельность: ' + income_percent + '% | Загрузка: <span style="color:' + visual_load_color + ';">' + visual_load + '%</span>';
  td.prev().html(html2);
});
} // repair

if (td.parent().find('.i-repair').length > 0)
{
var html2 = '? млн/раб';
jQuery.ajaxSetup({
  async: false
});
var empl_total = 0;
var sales = 0;
var income = 0;
var visitors = 0;
var max_visitors = 0;
$.get(url + 'main/unit/view/' + id, function (data) {
  // var empleff2 = $('td:contains(Цена) + td td:eq(1)', data).text().replace('за минуту разговора ($', '').replace(")", "").replace(" ", "").replace("", "").trim();
  //  var sales = parseFloat($('td:contains(Цена) + td:eq(1)', data).text().split('за минуту разговора') [1].trim().replace('(', '').replace(')', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', ''));
  var empl = $('td:contains(Количество сотрудников) + td', data).text().trim().split('(требуется');
  empl_total = parseInt(empl[0].replace(' ', '').replace(' ', '').trim());
  visitors = parseInt($('td:contains(Количество посетителей) + td', data).text().replace('в неделю', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').trim());
  max_visitors = parseInt($('td:contains(Количество посетителей) + td', data).text().split('макс.: ') [1].replace(' ', '').replace(' ', '').trim());
  //  console.log(visitors);
  //  console.log(cho);
  // html2 = parseInt((sales/empl_total)/100000)/10;
  //exit;
});
// finance stats
$.get(url + 'window/unit/view/' + id + '/finans_report/by_item', function (data) {
//  sales = parseFloat($('td.nowrap:eq(0)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
//  income = parseFloat($('td.nowrap:eq(95)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
      sales = parseFloat($('td.nowrap:eq(0):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));
  income = parseFloat($('td.nowrap:eq(2):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));

  //  console.log(sales);
  //  console.log(income);
});
$.get(url + 'window/unit/productivity_info/' + id, function (data) {
  var percent = $('td:contains(Эффективность работы) + td td:eq(1)', data).text().replace('%', '').trim();
  var advert = parseFloat($('td:contains(Расходы на рекламу) + td', data).text().replace('в неделю', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', '').replace(' ', '').replace(' ', '').trim());
  var color = (percent == '100.00' ? 'green' : 'red');
  var html = percent + '<i>%</i>';
  var sales_per_worker = parseInt((sales / empl_total) / 100000) / 10;
  var sales_per_visitor = parseInt((sales / visitors) / 100) / 10;
  var visual_sales = parseInt((sales) / 100000) / 10;
  var income_per_worker = parseInt((income / empl_total) / 100000) / 10;
  var income_per_visitor = parseInt((income / visitors) / 100) / 10;
  var visual_income = parseInt((income) / 100000) / 10;
  var cho = sales - income;
  var income_percent = parseInt((income / cho) * 100);
  var visual_load = Math.round((visitors / max_visitors) * 10000) / 100;
  var visual_load_color = 'red';
  if (visual_load > 30) visual_load_color = 'orange';
  if (visual_load > 60) visual_load_color = 'olive';
  if (visual_load > 90) visual_load_color = 'green';
  if (visual_load > 95) visual_load_color = 'lime';
  td.css('color', color).html(html);
  var html2 = 'Продажи: &nbsp;' + visual_sales + ' млн | ' + sales_per_worker + ' млн/раб | ' + sales_per_visitor + ' к/пос';
  html2 += '<br>Прибыль: ' + visual_income + ' млн | ' + income_per_worker + ' млн/раб | ' + income_per_visitor + ' к/пос';
  html2 += '<br>Рентабельность: ' + income_percent + '% | Загрузка: <span style="color:' + visual_load_color + ';">' + visual_load + '%</span>';
  td.prev().html(html2);
});
} // kindergarten

if (td.parent().find('.i-kindergarten').length > 0)
{
var html2 = '? млн/раб';
jQuery.ajaxSetup({
  async: false
});
var empl_total = 0;
var sales = 0;
var income = 0;
var visitors = 0;
var max_visitors = 0;
$.get(url + 'main/unit/view/' + id, function (data) {
  // var empleff2 = $('td:contains(Цена) + td td:eq(1)', data).text().replace('за минуту разговора ($', '').replace(")", "").replace(" ", "").replace("", "").trim();
  //  var sales = parseFloat($('td:contains(Цена) + td:eq(1)', data).text().split('за минуту разговора') [1].trim().replace('(', '').replace(')', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', ''));
  var empl = $('td:contains(Количество сотрудников) + td', data).text().trim().split('(требуется');
  empl_total = parseInt(empl[0].replace(' ', '').replace(' ', '').trim());
  visitors = parseInt($('td:contains(Количество посетителей) + td', data).text().replace('в неделю', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').trim());
  max_visitors = parseInt($('td:contains(Количество посетителей) + td', data).text().split('макс.: ') [1].replace(' ', '').replace(' ', '').trim());
  //  console.log(visitors);
  //  console.log(cho);
  // html2 = parseInt((sales/empl_total)/100000)/10;
  //exit;
});
// finance stats
$.get(url + 'window/unit/view/' + id + '/finans_report/by_item', function (data) {
//  sales = parseFloat($('td.nowrap:eq(0)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
//  income = parseFloat($('td.nowrap:eq(95)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
      sales = parseFloat($('td.nowrap:eq(0):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));
  income = parseFloat($('td.nowrap:eq(2):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));

  //  console.log(sales);
  //  console.log(income);
});
$.get(url + 'window/unit/productivity_info/' + id, function (data) {
  var percent = $('td:contains(Эффективность работы) + td td:eq(1)', data).text().replace('%', '').trim();
  var advert = parseFloat($('td:contains(Расходы на рекламу) + td', data).text().replace('в неделю', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', '').replace(' ', '').replace(' ', '').trim());
  var color = (percent == '100.00' ? 'green' : 'red');
  var html = percent + '<i>%</i>';
  var sales_per_worker = parseInt((sales / empl_total) / 100000) / 10;
  var sales_per_visitor = parseInt((sales / visitors) / 100) / 10;
  var visual_sales = parseInt((sales) / 100000) / 10;
  var income_per_worker = parseInt((income / empl_total) / 100000) / 10;
  var income_per_visitor = parseInt((income / visitors) / 100) / 10;
  var visual_income = parseInt((income) / 100000) / 10;
  var cho = sales - income;
  var income_percent = parseInt((income / cho) * 100);
  var visual_load = Math.round((visitors / max_visitors) * 10000) / 100;
  var visual_load_color = 'red';
  if (visual_load > 30) visual_load_color = 'orange';
  if (visual_load > 60) visual_load_color = 'olive';
  if (visual_load > 90) visual_load_color = 'green';
  if (visual_load > 95) visual_load_color = 'lime';
  td.css('color', color).html(html);
  var html2 = 'Продажи: &nbsp;' + visual_sales + ' млн | ' + sales_per_worker + ' млн/раб | ' + sales_per_visitor + ' к/пос';
  html2 += '<br>Прибыль: ' + visual_income + ' млн | ' + income_per_worker + ' млн/раб | ' + income_per_visitor + ' к/пос';
  html2 += '<br>Рентабельность: ' + income_percent + '% | Загрузка: <span style="color:' + visual_load_color + ';">' + visual_load + '%</span>';
  td.prev().html(html2);
});
} // medicine

if (td.parent().find('.i-medicine').length > 0)
{
var html2 = '? млн/раб';
jQuery.ajaxSetup({
  async: false
});
var empl_total = 0;
var sales = 0;
var income = 0;
var visitors = 0;
var max_visitors = 0;
$.get(url + 'main/unit/view/' + id, function (data) {
  // var empleff2 = $('td:contains(Цена) + td td:eq(1)', data).text().replace('за минуту разговора ($', '').replace(")", "").replace(" ", "").replace("", "").trim();
  //  var sales = parseFloat($('td:contains(Цена) + td:eq(1)', data).text().split('за минуту разговора') [1].trim().replace('(', '').replace(')', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', ''));
  var empl = $('td:contains(Количество сотрудников) + td', data).text().trim().split('(требуется');
  empl_total = parseInt(empl[0].replace(' ', '').replace(' ', '').trim());
  visitors = parseInt($('td:contains(Количество посетителей) + td', data).text().replace('в неделю', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').trim());
  max_visitors = parseInt($('td:contains(Количество посетителей) + td', data).text().split('макс.: ') [1].replace(' ', '').replace(' ', '').trim());
  //  console.log(visitors);
  //  console.log(cho);
  // html2 = parseInt((sales/empl_total)/100000)/10;
  //exit;
});
// finance stats
$.get(url + 'window/unit/view/' + id + '/finans_report/by_item', function (data) {
//  sales = parseFloat($('td.nowrap:eq(0)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
//  income = parseFloat($('td.nowrap:eq(95)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
      sales = parseFloat($('td.nowrap:eq(0):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));
  income = parseFloat($('td.nowrap:eq(2):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));

  //  console.log(sales);
  //  console.log(income);
});
$.get(url + 'window/unit/productivity_info/' + id, function (data) {
  var percent = $('td:contains(Эффективность работы) + td td:eq(1)', data).text().replace('%', '').trim();
  var advert = parseFloat($('td:contains(Расходы на рекламу) + td', data).text().replace('в неделю', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', '').replace(' ', '').replace(' ', '').trim());
  var color = (percent == '100.00' ? 'green' : 'red');
  var html = percent + '<i>%</i>';
  var sales_per_worker = parseInt((sales / empl_total) / 100000) / 10;
  var sales_per_visitor = parseInt((sales / visitors) / 100) / 10;
  var visual_sales = parseInt((sales) / 100000) / 10;
  var income_per_worker = parseInt((income / empl_total) / 100000) / 10;
  var income_per_visitor = parseInt((income / visitors) / 100) / 10;
  var visual_income = parseInt((income) / 100000) / 10;
  var cho = sales - income;
  var income_percent = parseInt((income / cho) * 100);
  var visual_load = Math.round((visitors / max_visitors) * 10000) / 100;
  var visual_load_color = 'red';
  if (visual_load > 30) visual_load_color = 'orange';
  if (visual_load > 60) visual_load_color = 'olive';
  if (visual_load > 90) visual_load_color = 'green';
  if (visual_load > 95) visual_load_color = 'lime';
  td.css('color', color).html(html);
  var html2 = 'Продажи: &nbsp;' + visual_sales + ' млн | ' + sales_per_worker + ' млн/раб | ' + sales_per_visitor + ' к/пос';
  html2 += '<br>Прибыль: ' + visual_income + ' млн | ' + income_per_worker + ' млн/раб | ' + income_per_visitor + ' к/пос';
  html2 += '<br>Рентабельность: ' + income_percent + '% | Загрузка: <span style="color:' + visual_load_color + ';">' + visual_load + '%</span>';
  td.prev().html(html2);
});
} // power

if (td.parent().find('.i-incinerator_power').length > 0 || td.parent().find('.i-sun_power').length > 0 || td.parent().find('.i-oil_power').length > 0 || td.parent().find('.i-coal_power').length > 0)
{
var html2 = '? млн/раб';
jQuery.ajaxSetup({
  async: false
});
var empl_total = 0;
var sales = 0;
var income = 0;
var visitors = 0;
var max_visitors = 0;
$.get(url + 'main/unit/view/' + id, function (data) {
  // var empleff2 = $('td:contains(Цена) + td td:eq(1)', data).text().replace('за минуту разговора ($', '').replace(")", "").replace(" ", "").replace("", "").trim();
  //  var sales = parseFloat($('td:contains(Цена) + td:eq(1)', data).text().split('за минуту разговора') [1].trim().replace('(', '').replace(')', '').replace(' ', '').replace(' ', '').replace(' ', '').replace('$', ''));
  var empl = $('td:contains(Количество рабочих) + td', data).text().trim().split('(требуется');
  empl_total = parseInt(empl[0].replace(' ', '').replace(' ', '').trim());
  //    visitors = parseInt($('td:contains(Количество посетителей) + td', data).text().replace('в неделю', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').trim());
  //  max_visitors = parseInt($('td:contains(Количество посетителей) + td', data).text().split('макс.: ')[1].replace(' ', '').replace(' ', '').trim());
  //  console.log(visitors);
  //  console.log(cho);
  // html2 = parseInt((sales/empl_total)/100000)/10;
  //exit;
});
// finance stats
$.get(url + 'window/unit/view/' + id + '/finans_report/by_item', function (data) {
//  sales = parseFloat($('td.nowrap:eq(0)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
//  income = parseFloat($('td.nowrap:eq(95)', data).text().trim().replace('$', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
      sales = parseFloat($('td.nowrap:eq(0):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));
  income = parseFloat($('td.nowrap:eq(2):parent:last-child', data).text().trim().replace('$', '').replace(/\u00A0/g, ''));

  //  console.log(sales);
  //  console.log(income);
});
$.get(url + 'window/unit/productivity_info/' + id, function (data) {
  var percent = $('td:contains(Эффективность работы) + td td:eq(1)', data).text().replace('%', '').trim();
  var color = (percent == '100.00' ? 'green' : 'red');
  var html = percent + '<i>%</i>';
  var sales_per_worker = parseInt((sales / empl_total) / 100000) / 10;
  var visual_sales = parseInt((sales) / 100000) / 10;
  var income_per_worker = parseInt((income / empl_total) / 100000) / 10;
  var visual_income = parseInt((income) / 100000) / 10;
  var cho = sales - income;
  var income_percent = parseInt((income / cho) * 100);
  td.css('color', color).html(html);
  var html2 = 'Продажи: &nbsp;' + visual_sales + ' млн';
  html2 += '<br>Прибыль: ' + visual_income + ' млн';
  html2 += '<br>Рентабельность: ' + income_percent + '%';
  td.prev().html(html2);
});
} // offices

if (td.parent().find('.i-office').length > 0)
{
$.get(url + 'window/unit/productivity_info/' + id, function (data) {
//  var empl = $('td:contains(Количество сотрудников) + td', data).text().replace('%', '').trim().split('(требуется ~');
//  empl_total = empl[0].replace(' ', '').trim();
//  empl_need = empl[1].replace(' ', '').replace('раб.)', '').trim();
  //alert('|'+empl_total+'|'+empl_need+'|');
//  empl_free = empl_total - empl_need; // свободно рабов
  var percent = $('td:contains(Эффективность работы) + td td:eq(1)', data).text().replace('%', '').trim();
  var color = (percent == '100.00' ? 'green' : 'red');
  var html = percent + '<i>%</i>';
  var percent2 = $('td:contains(Уровень управленческой нагрузки) + td td:eq(1)', data).text().replace('%', '').trim();
  var color2 = (percent2 == '100.00' ? 'green' : 'red');
  var html2 = percent2 + '<i>%</i>';
  //exit;
  td.css('color', color).html(html);
  td.prev().prev().prev().prev().append(' / ' + html2);
});
$.get(url + 'window/unit/view/' + id + '/energy', function (data) {
  korpa_total = 0;
  var mwth = $('th:contains(Расходы) + td + td', data).text().replace('= ', '').replace(' МВт*ч', '').replace(' ', '').replace(' ', '').replace(' ', '').trim();
  mwth = Math.round(mwth);
  var price = $('th:contains(Расходы) + td + td + td + td', data).text().replace('$', '').replace(' ', '').trim();
  var summ = Math.round(mwth * price);
  var region = td.prev().prev().prev().prev().prev().attr('title');
  var korpo = $('td:contains(энергосеть)', data);
  $('td:contains(энергосеть)', data).each(function (key) {
    var kk = $(this).text().split('Корпоративная энергосеть:');
    kk = kk[1].split('x') [0].trim().replace(' ', '').trim() * 1;
    korpa_total += kk;
  });
  korpa_total = Math.round(korpa_total);
  sum2 = Math.round((mwth - korpa_total) * price);
  var oppa = '<tr><td>' + region + '</td><td>' + mwth + '</td><td>' + korpa_total + '</td><td>' + (mwth - korpa_total) + '</td><td>' + price + '</td><td>' + sum2 + '</td></tr>';
  $('#electro_panel').append(oppa);
});
}
});
var container = $('td.u-l').parent().parent();
var input = $('<input>').attr({
type: 'text',
value: '',
id: 'text_search'
}).change(function () {
//alert( list.length );
//var needle = new RegExp('^\\s*' + input.val(), 'i');
var needle = new RegExp('.*' + input.val() + '.*', 'i');
var find_count = 0;
list.each(function () {
// если фильтр не задан, то показать все что есть
if (needle.length == 0) {
  $(this).parent().show();
  return;
} // заметки

var find_notes = 0;
if (($(this).parent().next().prop('class') == 'u-z') || ($(this).parent().next().prop('class') == 'u-z ozz')
) {
  find_notes = 1;
} // применить фильтр

if ($(this).text().search(needle) == - 1) {
  $(this).parent().hide();
  if (find_notes == 1) $(this).parent().next().hide();
} else {
  $(this).parent().show();
  find_count++;
  if (find_notes == 1) $(this).parent().next().show();
}
});
if (find_count == 0) $('#find_info').html('&nbsp;');
 else $('#find_info').html('(' + find_count + ')');
}); // Поиск id
// Не забыть убрать
var input_id = $(' <button>id</button>').click(function () {
out = '';
var el = $('td.unit_id');
for (i = 0; i < el.length; i++) {
if (!el.eq(i).is(':visible')) continue;
id = el.eq(i).text();
out += id + ', ';
} //===================
//out = '';
//supply_id = JSON.parse( window.localStorage.getItem('supply_id') );
//for (key in supply_id){
//	out+= key + ", ";
//}

alert(out);
}); // фильтр по регионам
var flags = $('td.geo');
var list_region = new Object();
var list_flags = new Object();
for (i = 0; i < flags.length; i++) {
var reg = flags.eq(i).attr('title');
//console.log(reg);		
if (list_region[reg] != null) {
list_region[reg]++;
} else {
list_region[reg] = 1;
}
list_flags[reg] = flags.eq(i).attr('class').replace('geo', 'geocombo');
} // сортировка объекта как строки

function sortObj(arr) {
// Setup Arrays
var sortedKeys = new Array();
var sortedObj = {
};
// Separate keys and sort them
for (var i in arr) {
sortedKeys.push(i);
}
sortedKeys.sort();
// Reconstruct sorted obj based on keys
for (var i in sortedKeys) {
sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
}
return sortedObj;
}
list_region = sortObj(list_region);
var Filter_region = $(' <select style=\'max-width:140px;\'>').append('<option value=0>&nbsp;</option>').change(function () {
search = $(this).val();
var el = $('td.geo').each(function () {
// если фильтр не задан, то показать все что есть
if (search == 0) {
  $(this).parent().show();
  return;
}
var reg = $.trim($(this).attr('title'));
//console.log( reg + "[" + search +"]");
// применить фильтр
if (reg.search(search) == - 1) {
  $(this).parent().hide();
} else {
  $(this).parent().show();
}
});
});
for (name in list_region) {
str = '<option class="' + list_flags[name] + '" value="' + name + '">' + name;
if (list_region[name] > 1) str += ' (' + list_region[name] + ')';
str += '</option>';
Filter_region.append(str);
} // Фильтр по городу

var input_city = $('<input>').attr({
type: 'text',
value: ''
}).change(function () {
var needle = new RegExp('^\\s*' + input_city.val(), 'i');
console.log(needle);
var find_count = 0;
var el = $('td.geo').each(function () {
// если фильтр не задан, то показать все что есть
if (needle.length == 0) {
  $(this).parent().show();
  return;
} // применить фильтр

if ($(this).text().search(needle) == - 1) {
  $(this).parent().hide();
} else {
  $(this).parent().show();
  find_count++;
}
if (find_count == 0) $('#city_info').html('&nbsp;');
 else $('#city_info').html('(' + find_count + ')');
});
});
var ext_panel = $('#extension_panel');
if (ext_panel.length == 0) {
// если панели еще нет, то доабвить её
var panel = '<div style=\'padding: 2px; border: 1px solid #0184D0; border-radius: 4px 4px 4px 4px; float:left; white-space:nowrap; color:#0184D0; display:none;\'  id=extension_panel></div>';
container.append('<tr><td>' + panel);
var panel2 = '<table style=\'padding: 2px; border: 1px solid #0184D0; border-radius: 4px 4px 4px 4px; float:left; white-space:nowrap; color:#0184D0; display:none;\' id=electro_panel><tr><th>Регион</th><th>Потребление</th><th>Корпа</th><th>Еще можно</th><th>по цене</th><th>на сумму</th></tr></table>';
$('body').append('<tr><td>' + panel2 + '</td></tr>');
}
$('#extension_panel').append(Filter_region);
$('#extension_panel').append(' Город: ').append('<span id=city_info>&nbsp;</span> ').append(input_city);
$('#extension_panel').append(' Название: ').append('<span id=find_info>&nbsp;</span> ').append(input);
$('#extension_panel').append('<br>');
$('#extension_panel').append('Группа: ').append('<span id=group_info>&nbsp;</span> ').append(input_group);
$('#extension_panel').append('&nbsp;&nbsp;').append('Эффективность: ').append('<span id=ef_info>&nbsp;</span> ').append(input_ef); // Не забыть убрать
$('#extension_panel').append('&nbsp;').append(input_id);
$('#extension_panel').append('&nbsp;').append($('<span style="font-size:75%;margin:1px; padding:1px; border:1px solid #2222ff; border-radius:3px; cursor:pointer" onClick=\'$(".prod").click();\'>Эффективность</span>'));
$('#extension_panel').show();
$('#electro_panel').show();
}
if (window.top == window) {
var script = document.createElement('script');
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
}
