// ==UserScript==
// @namespace      virtonomica
// @name           Virtonomica: Show manufacturer
// @description:en Show manufacturer in the trading hall.
// @description:ru Отображение производителя/производителей товаров в торговом зале.
// @include        http*://*virtonomic*.*/*/main/unit/view/*/trading_hall*
// @version        0.001
// @description Show manufacturer in the trading hall.
// @downloadURL https://update.greasyfork.org/scripts/40053/Virtonomica%3A%20Show%20manufacturer.user.js
// @updateURL https://update.greasyfork.org/scripts/40053/Virtonomica%3A%20Show%20manufacturer.meta.js
// ==/UserScript==
var run = function () {
  function getVal(spName) {
    return JSON.parse(window.localStorage.getItem(spName));
  }
  function setVal(spName, pValue) {
    window.localStorage.setItem(spName, JSON.stringify(pValue));
    console.log(spName);
    console.log(JSON.stringify(pValue));
  }
  function delVal(spName) {
    window.localStorage.removeItem(spName);
  }
  var currentRealm = $('a[href*="by_trade_at_cities"]').attr('href').split('/') [3];
  var shopId = window.location.href.split('/') [7];
  var companyId = $('a[href*="dashboard"]').attr('href').split('/') [7];
  var storage_name = currentRealm + '_' + companyId + '_shop_assortment';
  //  delVal(storage_name);
  var data_from_storage = getVal(storage_name);
  //  console.log('data_from_storage = ' + data_from_storage);
  if (data_from_storage == null || (data_from_storage[0] + 3600000) < new Date().getTime())
  {
    console.log('no data or old data');
    var assortment = 'https://virtonomica.ru/' + currentRealm + '/main/company/view/' + companyId + '/marketing_report/by_shop_assortment';
    //     console.log(assortment);
    $.get(assortment, function (data) {
      var myTableArray = {
      };
      var productCodes = [
      ];
      $('table.list tr', data).each(function () {
        var arrayOfThisRow = [
        ];
        var tableData = $(this).find('td');
        var shopId2 = $('a[href*="view"]', this).attr('href');
        if (typeof shopId2 !== 'undefined')
        {
          shopId2 = shopId2.split('/') [7];
          //       console.log(shopId2);
          if (tableData.length > 0) {
            tableData.each(function (index) {
              //            arrayOfThisRow.push($(this).text());
              var divs = $(this).find('div');
              var cmps = [
              ];
              divs.each(function () {
                var cmpname = 'unknown';
                try {
                  cmpname = $(this).attr('class').split(' - ') [0];
                } catch (e) {
                }
                var cmpvolume = 1;
                try {
                  cmpvolume = $(this).attr('class').split(' - ') [1].replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '');
                } catch (e) {
                }
                cmps.push(cmpname + ';' + cmpvolume);
              });
              var cmps2 = cmps.join('|');
              if (cmps.length > 0)
              {
                //                myTableArray.push(shopId2 + '_' + productCodes[index] + ':' + cmps2);
                myTableArray[shopId2 + '_' + productCodes[index]] = cmps2;
              }
            });
          }
        } else {
          // first row of table - need to save avatars
          $(this).find('th').each(function () {
            if (typeof $(this).attr('title') !== 'undefined')
            {
              productCodes.push($(this).find('img').attr('src').split('/').pop().replace('.gif', ''));
            }
          });
        }
      });
      var d = new Date();
      setVal(storage_name, [
        d.getTime(),
        myTableArray
      ]);
    });
  }
  data_from_storage = getVal(storage_name);
  var rawdata = data_from_storage[1];
  console.log(rawdata);
  var $tbody = $('table.grid:eq(0) > tbody:eq(0)');
  $tbody.children('tr').each(function (index) {
    var $tr = $(this);
    if ($tr.children('td').length > 1) {
      var $td6 = $tr.children('td:eq(5)'); // on stock
      var onStock = $td6.text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace('%', '') - 0;
      var gif = $tr.children('td:eq(2)').find('img').attr('src').split('/').pop().replace('.gif', '');
      if (onStock > 0) {
        try{
        $d = rawdata[shopId + '_' + gif];
        var $td3 = $tr.children('td:eq(0)'); // yellow truck on button
        $d = $d.split('|').join('<br>').split(';').join(' - ');
        console.log($d);
          $td3.append($d);
        }catch(e){}
      } //      console.log(gif);

    }
  });
};
if (window.top == window) {
  var style = document.createElement('style');
  style.textContent = '.qps_button {background-color: gold}';
  document.documentElement.appendChild(style);
  var script = document.createElement('script');
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}
