// ==UserScript==
// @name        groupAdvertiseHelper
// @namespace   virtonomica
// @version     0.06
// @include        http*://*virtonomic*.*/*/main/unit/view/*/virtasement
// @require http://code.jquery.com/jquery-latest.js
// @author  chippa
// @description:en wah!
// @description wah!
// @downloadURL https://update.greasyfork.org/scripts/33839/groupAdvertiseHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/33839/groupAdvertiseHelper.meta.js
// ==/UserScript==
var run = function () {
  //  alert('dfdfg');
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  var currentRealm = $('a[href*="by_trade_at_cities"]').attr('href').split('/') [3];
  var $tbody = $('table.grid:eq(0) > tbody:eq(0)');
  listofavailable = [
  ];
  var iterator = 1;
  $tbody.children('tr').each(function () {
    var $tr = $(this);
    //    exit;
    if ($tr.children('td').length > 1) {
      //      var productCode = $tr.children('td:eq(0)').children('img').attr('src').split('/').pop().replace('.gif', ''); // product image 
      productid = $tr.children('td:eq(0)').attr('onclick').split('virtasement') [1].replace('\'', '').replace(')', '');
      $tr.append('<td><input type="checkbox" class="destroy" value="' + productid + '" name="multipleC[]" onclick="" chippa="' + iterator + '" /></td>');
      listofavailable.push(productid);
    } else {
      iterator++;
      $tr.append('<td></td><td><input type="checkbox" class="destroy" name="grupen[]" onclick="$(\'[chippa=' + iterator + ']\').click();" /></td>');
    }
  });
  var link = window.location.href + listofavailable[0];
  $.get(link, function (data) {
    var $tbody4 = $(data).find('table.list:eq(0) >tbody:eq(0)');
    $tbody4.children('tr').each(function () {
      CityName = $(this).children('td:eq(1)').text().trim();
      CityCode = $(this).children('td:eq(0)').children('input').val();
      if (CityName.length > 1) {
        //        console.log(CityName + ' = ' + CityCode);
        $tbody.append('<tr><td>' + CityName + '</td><td><input type="checkbox" class="destroy" value="' + CityCode + '" name="citycodes[]" onclick="" /></td></tr>');
      }
    });
  });
  //  console.log(listofavailable);
  $tbody.parent().after('<div id=\'group_log\'>Журнал : </div>');
  //  $tbody.parent().after('');
  $tbody.parent().after('<span>Сумма рекламы : </span><input id=\'group_advertise_summ\' type=\'text\' value=\'1\'><input id=\'btn_group_go\' type=\'button\' value=\'Настроить\'>');
  var $btn_group_go = $('#btn_group_go');
  var selectedCities = [
  ];
  var selectedGoods = [
  ];
  $btn_group_go.click(function () {
    $('input[name="citycodes[]"]:checked').each(function () {
      selectedCities.push($(this).val());
    });
    $('input[name="multipleC[]"]:checked').each(function () {
      selectedGoods.push($(this).val());
    });
    //    console.log(selectedCities);
    //    console.log(selectedGoods);
    var advertData = {
    };
    advertData['city'] = selectedCities;
    advertData['type'] = [
      '2264'
    ]; // TV
    advertData['contactCost'] = '$0.41';
    advertData['minCost'] = '$400+000';
    advertData['population'] = '199+234+456';
    advertData['contactCount'] = '199+234+456';
    advertData['totalCost'] = $('#group_advertise_summ').val();
    advertData['productivity'] = '100 %';
    var parameters = {
      'advertData': advertData,
      accept: 'Начать+рекламную+кампанию'
    };
    var num = 0;
    var total = selectedGoods.length;
    selectedGoods.forEach(function (element) {
      // combine and do post-request here:
      $url = window.location.href + element;
      //      console.log($url);
      //      console.log(parameters);
      $.post($url, parameters
      ).done(function (data, statusText) {
        num++;
        $('#group_log').html(num + ' / ' + total + ' (' + parseInt((num * 100) / total) + '%)');
        if (num == total) {
          $('#group_log').html(' готово! ');
        }        // This block is optional, fires when the ajax call is complete

      });
    });
    selectedCities = [
    ];
    selectedGoods = [
    ];
  });
}
if (window.top == window) {
  var script = document.createElement('script');
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}
