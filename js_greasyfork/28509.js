// ==UserScript==
// @namespace      virtonomica
// @name           Virtonomica: Quick Price Set v2
// @description Quick installation prices of goods in the trading hall.
// @description:ru Быстрая установка цены товаров в торговом зале.
// @include        http*://*virtonomic*.*/*/main/unit/view/*/trading_hall*
// @version        57.0
// @description Quick installation prices of goods in the trading hall.
// @downloadURL https://update.greasyfork.org/scripts/28509/Virtonomica%3A%20Quick%20Price%20Set%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/28509/Virtonomica%3A%20Quick%20Price%20Set%20v2.meta.js
// ==/UserScript==
var run = function () {
  var minimal_price = {
    '17609': 5000, // апельсин
    '370080': 10000000, // внедорожник
    '423950': 0, // витамины 
    '359859': 799, // гормональные препараты
    '423160': 999, // косметические маски
    '359862': 1699, // лекарственные травы
    '423153': 499, // маточное молочко
    '422552': 1499, // медицинский антисептик
    '359856': 499, // медицинский инструментарий
    '422199': 799, // никотиновый пластырь
    '359861': 0, // природные лекарства
    '423483': 0, // рыбий жир
    '359860': 499, // синтетические лекарства
    '15336': 499, // спортивное питание
    '359863': 1499, // средства гигиены
    '422433': 6999 // электронные тонометры
  };
  var $tbody = $('table.grid:eq(0) > tbody:eq(0)');
  $tbody.parent().before('<div><input id=\'qps_costPrice\' type=\'text\' value=\'100\'>% Min Price (Cost)'
  + '<br><input id=\'qps_avgPrice\' type=\'text\' value=\'100\'>% Target price '
  + '(<select id=\'qps_priceType\'><option value=\'1\'>city price</option><option value=\'2\'>item quality/city quality*city price</option></select>)'
  + '<br><input id=\'qps_setGlobalBut\' class=\'qps_button_global\' type=\'button\' value=\'Автоматически\'>'
  + '<input id=\'qps_setGlobalBut_Elections1\' class=\'qps_button_global_elections\' type=\'button\' value=\'Как у местных! (x1)\'>'
  + '<input id=\'qps_setGlobalBut_Elections105\' class=\'qps_button_global_elections\' type=\'button\' value=\'x1.5\'>'
  + '<input id=\'qps_setGlobalBut_Elections2\' class=\'qps_button_global_elections\' type=\'button\' value=\'Аптека, Бакалея, ПП, Электроника (x2)\'>'
  + '<input id=\'qps_setGlobalBut_Elections25\' class=\'qps_button_global_elections\' type=\'button\' value=\'Аптека, Бакалея, ПП, Электроника (x2.5)\'>'
  + '<input id=\'qps_setGlobalBut_Elections3\' class=\'qps_button_global_elections\' type=\'button\' value=\'Аптека, Бакалея, ПП, ПТ, ТДД, Электроника (x3)\'>'
  + '<input id=\'qps_setGlobalBut_Elections4\' class=\'qps_button_global_elections\' type=\'button\' value=\'Бакалея, ПТ, ТДД (x4)\'>'
  + '<input id=\'qps_setGlobalBut_Elections5\' class=\'qps_button_global_elections\' type=\'button\' value=\'Авто, Дети, ТДД (x5)\'>'
  + '<input id=\'qps_setGlobalBut_Elections6\' class=\'qps_button_global_elections\' type=\'button\' value=\'Авто, Дети (x6)\'>'
  + '<input id=\'qps_setGlobalBut_Elections10\' class=\'qps_button_global_elections\' type=\'button\' value=\'Авто, Дети (x10)\'>'
  + '<input id=\'qps_setGlobalBut_Elections15\' class=\'qps_button_global_elections\' type=\'button\' value=\'Электрокар, Микроавтобус (x15)\'>'
  + '<input id=\'qps_setGlobalBut_Elections20\' class=\'qps_button_global_elections\' type=\'button\' value=\'Красный бензин (x20)\'>'
  + '<input id=\'qps_setGlobalBut_Elections30\' class=\'qps_button_global_elections\' type=\'button\' value=\'Ахтунг (x30)\'>'
  + '<input id=\'qps_setGlobalBut_ElectionsGuess\' class=\'qps_button_global_elections\' type=\'button\' value=\'Узнать коэффициенты\'>'
  + '<input id=\'qps_setGlobalBut_ElectionsMagic\' class=\'qps_button_global_electionsMagic\' type=\'button\' value=\'Выборы\'>'
  + '<input id=\'qps_setGlobalBut_ElectionsPolka\' class=\'qps_button_global_electionsPolka\' type=\'button\' value=\'Полка\'>'
  + '</div>');
  var $qps_costPrice = $('#qps_costPrice');
  var $qps_avgPrice = $('#qps_avgPrice');
  var $qps_priceType = $('#qps_priceType');
  var $qps_setGlobalBut = $('#qps_setGlobalBut');
  var $qps_setGlobalBut_Elections1 = $('#qps_setGlobalBut_Elections1');
  var $qps_setGlobalBut_Elections105 = $('#qps_setGlobalBut_Elections105');
  var $qps_setGlobalBut_Elections2 = $('#qps_setGlobalBut_Elections2');
  var $qps_setGlobalBut_Elections25 = $('#qps_setGlobalBut_Elections25');
  var $qps_setGlobalBut_Elections3 = $('#qps_setGlobalBut_Elections3');
  var $qps_setGlobalBut_Elections4 = $('#qps_setGlobalBut_Elections4');
  var $qps_setGlobalBut_Elections5 = $('#qps_setGlobalBut_Elections5');
  var $qps_setGlobalBut_Elections6 = $('#qps_setGlobalBut_Elections6');
  var $qps_setGlobalBut_Elections10 = $('#qps_setGlobalBut_Elections10');
  var $qps_setGlobalBut_Elections15 = $('#qps_setGlobalBut_Elections15');
  var $qps_setGlobalBut_Elections20 = $('#qps_setGlobalBut_Elections20');
  var $qps_setGlobalBut_Elections30 = $('#qps_setGlobalBut_Elections30');
  var $qps_setGlobalBut_ElectionsGuess = $('#qps_setGlobalBut_ElectionsGuess');
  var $qps_setGlobalBut_ElectionsMagic = $('#qps_setGlobalBut_ElectionsMagic');
  var $qps_setGlobalBut_ElectionsPolka = $('#qps_setGlobalBut_ElectionsPolka');
  var currentRealm = $('a[href*="by_trade_at_cities"]').attr('href').split('/') [3];
  var shopId = window.location.href.split('/') [7];
  var setPrice = function (group, item, election) {
    var regex = /^[0-9]*(\.[0-9]*)?$/;
    if (!regex.test($qps_costPrice.val())) {
      $qps_costPrice.val($qps_costPrice.val() + 'ERR!');
      return;
    }
    if (!regex.test($qps_avgPrice.val())) {
      $qps_avgPrice.val($qps_avgPrice.val() + 'ERR!');
      return;
    }
    var minPriceMultiplier = $qps_costPrice.val() * 0.01;
    var targetPriceMultiplier = $qps_avgPrice.val() * 0.01;
    var priceSetType = $qps_priceType.val();
    var groupId = 0;
    var itemId = 0;
    $tbody.children('tr').each(function () {
      var $tr = $(this);
      var $first_td = $tr.children('td:eq(0)');
      var handler;
      if ($tr.children('td').length === 1) {
        groupId++;
      } else if ($tr.children('td').length > 1) {
        itemId++;
        if ((group === - 1 || group === groupId) && (item === - 1 || item === itemId)) {
          var $td3 = $tr.children('td:eq(2)'); // image with link
          var $td4 = $tr.children('td:eq(3)'); // sold quantity
          var $td5 = $tr.children('td:eq(4)').children('a:eq(0)'); // ordered quantity
          var $td6 = $tr.children('td:eq(5)'); // on stock
          var $td7 = $tr.children('td:eq(6)'); // item quality
          var $td8 = $tr.children('td:eq(7)'); // item brand
          var $td9 = $tr.children('td:eq(8)'); // item cost
          var $td10 = $tr.children('td:eq(9)'); // price input
          var $td11 = $tr.children('td:eq(10)'); // % of market
          var $td12 = $tr.children('td:eq(11)'); // city price
          var $td13 = $tr.children('td:eq(12)'); // city quality
          var $td14 = $tr.children('td:eq(13)'); // city brand
          var itemQuality = $td7.text().trim() - 0;
          var itemBrand = $td8.text().trim() - 0;
          var itemCost = $td9.text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace('$', '').replace('©', '') - 0;
          var cityPrice = $td12.text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace('$', '').replace('©', '') - 0;
          var cityQuality = $td13.text().trim() - 0;
          var cityBrand = $td14.text().trim() - 0;
          var targetPrice = 0;
          var marketPortion = $td11.text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace('%', '') - 0;
          var currentPrice = $td10.children('input:eq(0)').val().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace('$', '').replace('©', '') - 0;
          var onStock = $td6.text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace('%', '') - 0;
          if (onStock > 100) onStock = Math.floor(onStock / 100) * 100;
          var ordered = $td5.text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace('[', '').replace(']', '') - 0;
          if (ordered > 100) ordered = Math.floor(ordered / 100) * 100;
          var sold = $td4.text().trim().replace(' ', '').replace(' ', '').replace(' ', '').replace('%', '') - 0;
          if (sold > 100) sold = Math.floor(sold / 100) * 100;
          //                    alert(itemCost);
          //exit;
          var incomeItem = currentPrice - itemCost;
          if (itemCost.toString() === 'NaN') {
            itemCost = cityPrice;
            itemQuality = cityQuality;
          }
          if (priceSetType == '1') {
            targetPrice = cityPrice * targetPriceMultiplier;
          } else if (priceSetType == '2') {
            targetPrice = itemQuality / cityQuality * cityPrice * targetPriceMultiplier;
          }
          if (targetPrice < itemCost * minPriceMultiplier) {
            targetPrice = itemCost * minPriceMultiplier;
          }
          var ratioPrice = 1;
          var ratioReserve = 1;
          var reserve = (onStock + ordered) / sold; // weeks
          //          alert(currentPrice +" | "+ reserve +" | "+itemCost);
          //          alert(marketPortion +" | "+ reserve + " | " + onStock + " | " + sold);
          if (sold > ordered)
          {
            // good sell
            var goodsell = 1;
            if (marketPortion >= 80) ratioPrice = 1.05;
            if (marketPortion < 80) ratioPrice = 1.03;
            if (marketPortion < 50) ratioPrice = 1.02;
            if (marketPortion < 30) ratioPrice = 1.01;
            if (marketPortion <= 20) ratioPrice = 1;
            if (reserve >= 50) ratioReserve = 0.93;
            if (reserve < 50) ratioReserve = 0.95;
            if (reserve < 30) ratioReserve = 0.97;
            if (reserve < 20) ratioReserve = 0.98;
            if (reserve < 15) ratioReserve = 0.99;
            if (reserve < 3) ratioReserve = 1;
          } else {
            // sell is not enough
            var goodsell = 0;
            if (marketPortion >= 80) ratioPrice = 1.06;
            if (marketPortion < 80) ratioPrice = 1.05;
            if (marketPortion < 50) ratioPrice = 1.04;
            if (marketPortion < 30) ratioPrice = 1.03;
            if (marketPortion <= 20) ratioPrice = 1.02;
            if (reserve >= 50) ratioReserve = 0.8;
            if (reserve < 50) ratioReserve = 0.85;
            if (reserve < 30) ratioReserve = 0.9;
            if (reserve < 10) ratioReserve = 0.95;
            if (reserve < 5) ratioReserve = 0.98;
            if (reserve < 3) ratioReserve = 0.99;
          }
          if (sold == ordered)
          {
            reserve = 1;
            ratioPrice = 1.2;
            ratioReserve = 1;
          }
          if (sold == ordered == onStock)
          {
            reserve = 1;
            ratioPrice = 1.2;
            ratioReserve = 1;
          }
          if (sold == ordered == onStock && onStock < 10)
          {
            reserve = 1;
            ratioPrice = 1;
            ratioReserve = 1;
          }
          incomeRatioPrice = incomeItem * ratioPrice * ratioReserve;
          targetRatioPrice = itemCost + incomeRatioPrice;

          //          alert(targetRatioPrice +" | "+ currentPrice +" | "+ ratioPrice +" | "+ ratioReserve +" | "+ reserve);
          //          exit;
          if (targetRatioPrice < itemCost)
          {
            targetPrice = itemCost;
          } else {
            targetPrice = targetRatioPrice;
          } // new product. unknown price. need to figure out.

          var some2 = cityPrice / ((cityQuality + cityBrand * 5) ^ (1 / 3));
          var some1 = some2 * ((itemQuality + itemBrand * 5) ^ (1 / 3));
          if (some1 > (4 * cityPrice)) some1 = 4 * cityPrice;
          //          targetPrice = Math.max(some1, targetRatioPrice);
          //          targetPrice = Math.max(targetPrice, itemCost);
          if (currentPrice == 0)
          { // new product
            targetPrice = some1;
          }
          targetPrice = Math.max(targetPrice, itemCost);
          if (marketPortion >= 90) targetPrice = targetPrice * 1.02;
          if (sold >= onStock) targetPrice = targetPrice * 1.01;
          if (targetPrice < (cityPrice * 0.8) && itemQuality > (cityQuality * 0.7)) targetPrice = cityPrice * 1.05;
          //          if(election = 0)
          //           {
          $td10.children('input:eq(0)').val(targetPrice.toFixed(2));
          //         }
          if (election > 0 && election < 1000)
          {
            var link = $td3.children('a:eq(0)').attr('href').split('?') [1];
            jQuery.ajaxSetup({
              async: false
            });
            var link = 'https://virtonomica.ru/api/' + currentRealm + '/main/marketing/report/retail/metrics?tpl=marketing%2Freport%2Fretail%2Fmetrics&app=adapter_vrt&format=json&' + link + '&wrap=0';
            $.get(link, function (data) {
              if (data.local_price == null) {
                var obj = JSON.parse(data);
                cityPrice = obj.local_price;
              } else {
                cityPrice = data.local_price;
              }
            });
            some1 = election * cityPrice;
            targetPrice = some1;
            $td10.children('input:eq(0)').val(targetPrice.toFixed(2));
          } // Magic sector

          if (election > 1000 && election < 2000)
          {
            var link = $td3.children('a:eq(0)').attr('href').split('?') [1];
            jQuery.ajaxSetup({
              async: false
            });
            var link = 'https://virtonomica.ru/api/' + currentRealm + '/main/marketing/report/retail/metrics?tpl=marketing%2Freport%2Fretail%2Fmetrics&app=adapter_vrt&format=json&' + link + '&wrap=0';
            $.get(link, function (data) {
              if (data.local_price == null) {
                var obj = JSON.parse(data);
                cityPrice = obj.local_price;
              } else {
                cityPrice = data.local_price;
              }
            });
            var multi1 = 1.2;
            var multi2 = 0;
            if (itemBrand > 4) multi1 = 1.8;
            //            if(itemQuality > 40) multi2 = 0.5;
            //            if(itemQuality > 80) multi2 = 1;
            //            console.log('multi1 = ' + multi1 + '; multi2 = ' + multi2);
            some1 = cityPrice * (multi1 + multi2);
            targetPrice = some1;
            $td10.children('input:eq(0)').val(targetPrice.toFixed(2));
          }
          if (election > 2000 && election < 3000) // polka
          {
            var product_id = $td3.children('a:eq(0)').attr('href').split('?') [1].split('&') [0].split('=') [1];
            var link = $td3.children('a:eq(0)').attr('href').split('?') [1];
            jQuery.ajaxSetup({
              async: false
            });
            //var link = 'https://virtonomica.ru/api/' + currentRealm + '/main/marketing/report/retail/metrics?tpl=marketing%2Freport%2Fretail%2Fmetrics&app=adapter_vrt&format=json&' + link + '&wrap=0';
            var link2 = 'https://virtonomica.ru/api/' + currentRealm + '/main/marketing/report/retail/shares?tpl=marketing%2Freport%2Fretail%2Fmetrics&app=adapter_vrt&format=json&' + link + '&wrap=0';
//            console.log(product_id + ' minimal price = ' + minimal_price[product_id]);
//            console.log(link2);
            var local_size = 0;
            $.get(link2, function (data) {
              //              local_size = data.filter(function (obj) {
              //                return obj.company_id === '-1';
              //              })[0].market_size;
              if (data.filter(function (obj) {
                return obj.company_id === '-1';
              }) [0] == null) {
                local_size = 0
              } else {
                local_size = data.filter(function (obj) {
                  return obj.company_id === '-1';
                }) [0].market_size;
              }
//              console.log('local_size = ' + local_size);
              var step = 10;
              if (currentPrice > 1000) step = 20;
              if (currentPrice > 1500) step = 50;
              if (currentPrice > 2000) step = 100;
              if (currentPrice > 4000) step = 200;
              if (currentPrice > 10000) step = 300;
              if (local_size == 0) {
                targetPrice = currentPrice + step;
              } else {
                targetPrice = currentPrice - step;
              }
              if(targetPrice < minimal_price[product_id]) targetPrice = minimal_price[product_id];
              if(targetPrice < (itemCost * 1.05)) targetPrice = itemCost * 1.05
//              console.log('step = '+step+' | currentPrice = '+currentPrice);
              $td10.children('input:eq(0)').val(targetPrice.toFixed(2));
            });
          } //          Выяснить текущий коэффициент цены относительно местных

          if (election < 0)
          {
            var link = $td3.children('a:eq(0)').attr('href').split('?') [1];
            jQuery.ajaxSetup({
              async: false
            });
            var link = 'https://virtonomica.ru/api/' + currentRealm + '/main/marketing/report/retail/metrics?tpl=marketing%2Freport%2Fretail%2Fmetrics&app=adapter_vrt&format=json&' + link + '&wrap=0';
            $.get(link, function (data) {
              if (data.local_price == null) {
                var obj = JSON.parse(data);
                cityPrice = obj.local_price;
              } else {
                cityPrice = data.local_price;
              }
            });
            some1 = currentPrice / cityPrice;
            targetPrice = some1;
            $td10.children('input:eq(0)').val(targetPrice.toFixed(2));
          } //          if(targetPrice === undefined || targetPrice.toString() == "NaN" || targetPrice < itemCost) targetPrice = itemCost;
          //          $td10.children('input:eq(0)').val(targetPrice.toFixed(2));

        }
      }
    });
  };
  var groupId = 0;
  var itemId = 0;
  $tbody.children('tr').each(function () {
    var $tr = $(this);
    if ($tr.children('td').length === 1) {
      (function (groupId) {
        $tr.append($('<input class=\'qps_button_group\' type=\'button\' value=\'Norm Group\'>')).click(function () {
          setPrice(groupId, - 1, 0);
        });
      }) (++groupId);
    } else if ($tr.children('td').length > 1) {
      var $td10 = $tr.children('td:eq(9)');
      (function (groupId, itemId) {
        $td10.append($('<input class=\'qps_button\' type=\'button\' value=\'Set\'>')).click(function () {
          setPrice(groupId, itemId, 0);
        });
      }) (groupId, ++itemId);
    }
  });
  $qps_setGlobalBut.click(function () {
    setPrice( - 1, - 1, 0);
  });
  $qps_setGlobalBut_Elections1.click(function () {
    setPrice( - 1, - 1, 1);
  });
  $qps_setGlobalBut_Elections105.click(function () {
    setPrice( - 1, - 1, 1.5);
  });
  $qps_setGlobalBut_Elections2.click(function () {
    setPrice( - 1, - 1, 2);
  });
  $qps_setGlobalBut_Elections25.click(function () {
    setPrice( - 1, - 1, 2.5);
  });
  $qps_setGlobalBut_Elections3.click(function () {
    setPrice( - 1, - 1, 3);
  });
  $qps_setGlobalBut_Elections4.click(function () {
    setPrice( - 1, - 1, 4);
  });
  $qps_setGlobalBut_Elections5.click(function () {
    setPrice( - 1, - 1, 5);
  });
  $qps_setGlobalBut_Elections6.click(function () {
    setPrice( - 1, - 1, 6);
  });
  $qps_setGlobalBut_Elections10.click(function () {
    setPrice( - 1, - 1, 10);
  });
  $qps_setGlobalBut_Elections15.click(function () {
    setPrice( - 1, - 1, 15);
  });
  $qps_setGlobalBut_Elections20.click(function () {
    setPrice( - 1, - 1, 20);
  });
  $qps_setGlobalBut_Elections30.click(function () {
    setPrice( - 1, - 1, 30);
  });
  $qps_setGlobalBut_ElectionsMagic.click(function () {
    setPrice( - 1, - 1, 1001);
  });
  $qps_setGlobalBut_ElectionsPolka.click(function () {
    setPrice( - 1, - 1, 2501);
  });
  $qps_setGlobalBut_ElectionsGuess.click(function () {
    setPrice( - 1, - 1, - 1);
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
