// ==UserScript==
// @name        virtonomica: mayor helper
// @namespace   virtonomica
// @description Помощь мэру
// @include     http*://*virtonomic*.*/*/main/politics/mayor
// @version     0.02
// @grant       none
// @author       chippa
// @downloadURL https://update.greasyfork.org/scripts/421207/virtonomica%3A%20mayor%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/421207/virtonomica%3A%20mayor%20helper.meta.js
// ==/UserScript==
var run = function () {
 //   alert('dfdfg');
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  var currentRealm = $('a[href*="by_trade_at_cities"]').attr('href').split('/') [3];
  var $tbody = $('table.list:eq(0) > tbody:eq(0)');
  listofavailable = [
  ];
  var iterator = 1;
  $tbody.children('tr').each(function () {
    var $tr = $(this);
    //    exit;
    if ($tr.children('td').length > 1) {
      //      var productCode = $tr.children('td:eq(0)').children('img').attr('src').split('/').pop().replace('.gif', ''); // product image
 //       console.log($tr.children('td:eq(0)'));
      cityid = $tr.children('td:eq(0)').children('div:eq(0)').children('a:eq(0)').attr('href').split('/')[7]; //.split('virtasement') [1].replace('\'', '').replace(')', '');
 //       console.log(cityid);
      $tr.append('<td>'+
                 '<img src="https://virtonomica.ru/img/politics/project_1.gif" class="qps_button" alt="Городской фестиваль" width="24" height=24 onclick="$.get(\'https://virtonomica.ru/vera/main/politics/money_project/'+cityid+'/1\')" />'+
                 '<img src="https://virtonomica.ru/img/politics/project_3.gif" class="qps_button" alt="Дотации населению" width="24" height=24 onclick="$.get(\'https://virtonomica.ru/vera/main/politics/money_project/'+cityid+'/3\')" />'+
                 '<img src="https://virtonomica.ru/img/politics/project_5.gif" class="qps_button" alt="Доступное жилье" width="24" height=24 onclick="$.get(\'https://virtonomica.ru/vera/main/politics/money_project/'+cityid+'/5\')" />'+
                 '<img src="https://virtonomica.ru/img/politics/project_8.gif" class="qps_button" alt="Новый микрорайон" width="24" height=24 onclick="$.get(\'https://virtonomica.ru/vera/main/politics/money_project/'+cityid+'/8\')" />'+
                 '<img src="https://virtonomica.ru/img/politics/project_12.gif" class="qps_button" alt="Мусор" width="24" height=24 onclick="$.get(\'https://virtonomica.ru/vera/main/politics/money_project/'+cityid+'/12\')" />'+
                 '<img src="https://virtonomica.ru/img/politics/project_13.gif" class="qps_button" alt="Развязка" width="24" height=24 onclick="$.get(\'https://virtonomica.ru/vera/main/politics/money_project/'+cityid+'/13\')" />'+
                 '<img src="https://virtonomica.ru/img/politics/project_14.gif" class="qps_button" alt="Очистные" width="24" height=24 onclick="$.get(\'https://virtonomica.ru/vera/main/politics/money_project/'+cityid+'/14\')" />'+
                 '<img src="https://virtonomica.ru/img/politics/project_15.gif" class="qps_button" alt="Электростанции" width="24" height=24 onclick="$.get(\'https://virtonomica.ru/vera/main/politics/money_project/'+cityid+'/15\')" />'+
                 '</td>');
//      listofavailable.push(productid);
    } else {
//      iterator++;
      $tr.append('<td><input type="button" onclick="$(\'.qps_button\').click();" value="Start"/></td>');
    }
  });
  var link = window.location.href + listofavailable[0];

// $('.qps_button').click();
}
if (window.top == window) {
  var script = document.createElement('script');
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}