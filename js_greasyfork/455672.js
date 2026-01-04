// ==UserScript==
// @name           Virtonomica: autosupply for shops from warehouse
// @namespace      virtonomica
// @version        1.0
// @description    Автовыбор поставщиков в магазинах. Только свои склады. Без ТМок
// @include        https://virtonomic*.*/*/window/unit/supply/create/*/step2
// @include        https://virtonomic*.*/*/main/unit/view/*/supply
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/455672/Virtonomica%3A%20autosupply%20for%20shops%20from%20warehouse.user.js
// @updateURL https://update.greasyfork.org/scripts/455672/Virtonomica%3A%20autosupply%20for%20shops%20from%20warehouse.meta.js
// ==/UserScript==
var run = function () {
  var price_q = {
  };
  price_q.car_suv = 5;
  price_q.scooter = 3;
  price_q.motorcycle = 4;
  price_q.ecar = 5;
  price_q.cigar = 3;
  price_q.caviar = 3;
  price_q.babycarr = 5;
  price_q.crib = 5;
  price_q.lego = 5;
  price_q.carpet = 4;
    price_q.petrol_premium = 10;

  function getVal(spName) {
    return JSON.parse(window.localStorage.getItem(spName));
  }
  function setVal(spName, pValue) {
    window.localStorage.setItem(spName, JSON.stringify(pValue));
    //   console.log(JSON.stringify(pValue));
  }
  function delVal(spName) {
    window.localStorage.removeItem(spName);
  }
  function fillArray(id, cen) {
    this.id = id;
    this.cen = cen;
  }
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  var txt = [
  ];
  $ = win.$;
  i = 0;
  if (location.href.includes('step2')) {
    var cooki = getVal('shop_auto_contract_selector');
    //if(cooki.contains(location.href.split('\/')[10])) alert ('ok');
    var local_price = parseFloat($('div.supply_addition_info>table>tbody tr:eq(1) th:eq(0)').prop('textContent').replace('Цена = $', '').replace('Цена = ©', '').replace(' ', '').replace(' ', '').replace(' ', ''));
    var local_quality = parseFloat($('div.supply_addition_info>table>tbody tr:eq(1) th:eq(1)').prop('textContent').replace('Качество = ', '').replace(' ', '').replace(' ', '').replace(' ', ''));
    var productCode = $('div#supply_header>img').attr('src').split('/').pop().replace('.gif', '');
//    alert(productCode);
    //    div id = supply_header
    //    img src
    var price_quantifier = 2;
    if (price_q[productCode] > 0) price_quantifier = price_q[productCode];
//    alert(price_quantifier);
    var quality_quantifier = 1;
    var good_price = price_quantifier * local_price;
    var good_quality = local_quality * quality_quantifier;
    $('#supply_content table tr').each(function () {
      var temp = $(this).attr('id');
      if (!isNaN(temp)) {
        return;
      }
      var cels1 = $('th', this);
      $(cels1[3]).after('<th><div class="field_title">ЦК<div class="asc" title="сортировка по возрастанию"><a id="qpasc" href="#"><img src="/img/up_gr_sort.png"></a></div><div class="desc" title="сортировка по убыванию"><a id="qpdesc" href="#"><img src="/img/down_gr_sort.png"></a></div></div></th>');
      var cels = $('td', this);
      var price = parseFloat($(cels[5]).text().replace('$', '').replace('©', '').replace(/ /g, ''));
      var qual = parseFloat($(cels[6]).text().replace(/ /g, ''));
      if (isNaN(price) || isNaN(qual)) {
        return;
      }

        if (price < good_price && qual > good_quality && cels.parent().hasClass('myself')) {
        $(cels[8]).css('background-color', '#ccffcc');
        $(cels[8]).click();
        $('#amountInput').val(1);
        $('#submitLink').click();
        setTimeout(function () {
          $('div.close').click();
        }, 240000);
        exit;
      }
      var qp = (price / qual).toFixed(2);
      i++;
      $(cels[5]).after('<td class="supply_data" id="td_s' + i + '" style="color: #f00">' + qp + '</td>');
      txt[i] = new fillArray(i, parseFloat($('#td_s' + i).text()));
    });
    setTimeout(function () {
      $('div.close').click();
    }, 240000);
    //   exit;
    total = i;
    function sort_table(type) {
      for (i = 0; i <= total; i++) {
        for (j = 1; j < total - i; j++) {
          if (type == 'asc') {
            if (txt[j]['cen'] > txt[j + 1]['cen']) {
              var tmp = txt[j]['cen'];
              txt[j]['cen'] = txt[j + 1]['cen'];
              txt[j + 1]['cen'] = tmp;
              tmp = txt[j]['id'];
              txt[j]['id'] = txt[j + 1]['id'];
              txt[j + 1]['id'] = tmp;
            }
          }
          if (type == 'desc') {
            if (txt[j]['cen'] < txt[j + 1]['cen']) {
              var tmp = txt[j]['cen'];
              txt[j]['cen'] = txt[j + 1]['cen'];
              txt[j + 1]['cen'] = tmp;
              tmp = txt[j]['id'];
              txt[j]['id'] = txt[j + 1]['id'];
              txt[j + 1]['id'] = tmp;
            }
          }
        }
      }
      for (i = total; i > 1; i--) {
        id_rod = $('#td_s' + txt[i]['id']).closest('tr');
        id_rod1 = $('#td_s' + txt[i - 1]['id']).closest('tr');
        if (id_rod1.next().hasClass('ordered')) {
          var n = id_rod1.next();
          id_rod.before(id_rod1).before(n);
        } else
        id_rod.before(id_rod1);
      }
      return false;
    }
    $('#qpasc').click(function () {
      sort_table('asc');
      return false;
    });
    $('#qpdesc').click(function () {
      sort_table('desc');
      return false;
    });
  }
  if (location.href.includes('supply')) {
    //alert('supply');
    $('<input class=\'mega_iterator\' type=\'button\' value=\'Создать кучу контрактов\'>').appendTo('#mainContent');
    $('.mega_iterator').click(function () {
      var product_ids = [
      ];
      $('#productsHereDiv a').each(function () {
        var product_id = $(this).attr('href').replace('javascript:selectSupplyProduct(', '').replace(')', '');
        var uri = location.href.replace('/main/unit/', '/window/unit/').replace('supply', 'step1/') + product_id;
        uri = uri.replace('/view/', '/supply/create/');
        //     window.open(uri, '_blank');
        product_ids.push(uri);
      });
      setVal('shop_auto_contract_selector', product_ids);
      console.log(product_ids);
      //window.open(product_ids[0]);
      product_ids.forEach(function (element, i) {
        setTimeout(function () {
          window.open(element, '_blank');
        }, 5000 * i);
      });
    });
  }
} // Хак, что бы получить полноценный доступ к DOM >:]

var script = document.createElement('script');
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
