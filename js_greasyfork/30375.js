// ==UserScript==
// @name        virtasementHelper
// @namespace   virtonomica
// @version     0.07
// @include        http*://*virtonomic*.*/*/main/unit/view/*/virtasement
// @include        http*://*virtonomic*.*/*/main/company/view/*/sales_report/by_brand_sales
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @author  chippa
// @description:en wah!
// @description wah!
// @downloadURL https://update.greasyfork.org/scripts/30375/virtasementHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/30375/virtasementHelper.meta.js
// ==/UserScript==
var run = function () {
  //  alert('dfdfg');
  var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  function ToStorage(name, val)
  {
    try {
      window.localStorage.setItem(name, JSON.stringify(val));
    } catch (e) {
      out = 'Ошибка добавления в локальное хранилище';
      console.log(out);
    }
  }
  if($("#media_managment").length) {exit;};
  
  var currentRealm = $('a[href*="by_trade_at_cities"]').attr('href').split('/') [3];
  var $tbody = $('table.list:eq(0) > tbody:eq(0)');
  $tbody.children('tr').each(function () {
    var $tr = $(this);
 //   alert('dd');
    var CityName = $tr.children('td:eq(0)').children('b').text().trim();
    var productsToSave = JSON.parse( window.localStorage.getItem('virtasement-' + currentRealm + '-' + CityName) );
    $tr.children('td:eq(1)').children('img').each(function () {
      $img = $(this);
      var prodCode = $img.attr('src').split('/').pop().replace('.gif', '');
      if (productsToSave.indexOf(prodCode) != - 1)
      {
        // element found
        $img.css('border', 'solid 1px lime');
        productsToSave.splice(productsToSave.indexOf(prodCode), 1);
      } else {
        $img.css('border', 'dotted 2px orange');
      }
    });
    $.each(productsToSave, function (key, value) {
      if (value == 'pbp') {
        value = 'vera/brand/16/0909/pbp.gif';
      } else {
        value = '16/' + value + '.gif';
      }
      $tr.children('td:eq(1)').append('<img src="/img/products/' + value + '" align="middle" alt= "" title= "" style="border: solid 2px red" />');
    });
  });
  var shopId = window.location.href.split('/') [7];
  var $tbody = $('table.grid:eq(0) > tbody:eq(0)');
 
  $tbody.children('tr').each(function () {
    var $tr = $(this);

  if ($tr.children('td').length > 1) {
      var cities = $tr.children('td:eq(1)').text().trim().split(', '); // list of cities
      
            $.each(cities, function (key, value) {
        var productsToSave = [];
        ToStorage('virtasement-' + currentRealm + '-' + value, productsToSave);
      });
    }
  });
                             
  $tbody.children('tr').each(function () {
    var $tr = $(this);

      if ($tr.children('td').length > 1) {
      var productCode = $tr.children('td:eq(0)').children('img').attr('src').split('/').pop().replace('.gif', ''); // product image 
      var cities = $tr.children('td:eq(1)').text().trim().split(', '); // list of cities
      
      $.each(cities, function (key, value) {
//        console.log('virtasement-' + currentRealm + '-' + value);
        //          var productsToSave = [];
        productsToSave = JSON.parse(window.localStorage.getItem('virtasement-' + currentRealm + '-' + value));
        if (productsToSave instanceof Array) {
          productsToSave.push(productCode);
        } else {
          productsToSave = [
          ];
          productsToSave.push(productCode);
        }  

        var productsToSave = productsToSave.reduce(function (a, b) {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, [
        ]);
        ToStorage('virtasement-' + currentRealm + '-' + value, productsToSave);
      });
    }
  });
}
if (window.top == window) {
  var script = document.createElement('script');
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}
