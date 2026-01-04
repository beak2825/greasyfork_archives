// ==UserScript==
// @namespace      virtonomica
// @name           Virtonomica: PriceNikaStepanov
// @description:en Quick installation prices of goods in the trading hall.
// @description:ru Быстрая установка цены товаров в торговом зале.
// @include        http://virtonomica*.*/nika/main/unit/view/*/trading_hall
// @include        https://virtonomica.ru/nika/main/unit/view/*/trading_hall

// @version        0.03
// @grant          A
// @description Quick installation prices of goods in the trading hall.
// @downloadURL https://update.greasyfork.org/scripts/375350/Virtonomica%3A%20PriceNikaStepanov.user.js
// @updateURL https://update.greasyfork.org/scripts/375350/Virtonomica%3A%20PriceNikaStepanov.meta.js
// ==/UserScript==

//setTimeout(function() {$("input[name='setprice']").click();}, 3000);
//https://virtonomica.ru/api/nika/main/unit/forecast?format=7179367
//?format
//$(window.location.href = 'supply').delay(10000).click();


var run = function () {
  var $tbody = $("table.grid:eq(0) > tbody:eq(0)");
  $tbody.parent().before("<div><input id='qps_costPrice' type='text' value='10'>доля рынка"
                        +"<br><input id='qps_avgPrice'"
                        +"<br><input id='qps_setGlobalBut' class='qps_button' type='button' value='установка цены'></div>");



  var $qps_costPrice = $("#qps_costPrice");
  var $qps_avgPrice = $("#qps_avgPrice");
  var $qps_priceType = $("#qps_priceType");
  var $qps_setGlobalBut = $("#qps_setGlobalBut");

  var setPrice = function(group, item) {
    var regex = /^[0-9]*(\.[0-9]*)?$/;
    if (!regex.test($qps_costPrice.val())) {
      $qps_costPrice.val($qps_costPrice.val() + "ERR!");
      return;
    }
    if (!regex.test($qps_avgPrice.val())) {
      $qps_avgPrice.val($qps_avgPrice.val() + "ERR!");
      return;
    }


    var targetPriceMultiplier = $qps_avgPrice.val() * 0.01;
    var priceSetType = $qps_priceType.val();

    var groupId = 0;
    var itemId = 0;
    $tbody.children("tr").each(function() {
      var $tr = $(this);
      var $first_td = $tr.children("td:eq(0)");
      var handler;

      if ($tr.children("td").length === 1) {
        groupId++;
      } else if ($tr.children("td").length > 1) {
        itemId++;
        if ((group === -1 || group === groupId) && (item === -1 || item === itemId)) {
          var $td6 = $tr.children("td:eq(2)");
          var $td3 = $tr.children("td:eq(3)");
          var $td4 = $tr.children("td:eq(4)");
          var $td5 = $tr.children("td:eq(5)"); 
          var $td7 = $tr.children("td:eq(6)"); 
          var $td9 = $tr.children("td:eq(8)"); 
          var $td10 = $tr.children("td:eq(9)"); 
          var $td20 = $td10.children("input:eq(0)");
          var $td14 = $tr.children("td:eq(10)"); 
          var $td12 = $tr.children("td:eq(11)"); 
          var $td13 = $tr.children("td:eq(12)"); 


          var itemQuality = $td7.text().trim() - 0;
          var itemCost = $td9.text().trim().replace(" ", "").replace(" ", "").replace("©", "") - 0;
          var cityPrice = $td12.text().trim().replace(" ", "").replace(" ", "").replace(" ", "").replace("©", "") - 0;
          var cityQuality = $td13.text().trim() - 0;
          var dol = $td14.text().trim().replace(" ", "").replace("%", "") - 0;
          var price1 = $td20.val().trim().replace(" ", "").replace(" ", "") - 0;
          var It = $td6.attr("title").replace(" (кликните для просмотра подробного маркетингового отчёта)", "");
          var kupl1 = $td4.text().indexOf('[');
          var kupl =  $td4.text().substr(kupl1+1).replace(" ", "").replace(" ", "").replace(" ", "").replace(" ", "").replace(']', "") - 0;
          var sale = $td3.text().trim().replace(" ", "") - 0; // Продано
          var sklad = $td5.text().trim().replace(" ", "") - 0; // на складе
          var price = price1;
          var koof = ($qps_costPrice).val();
          var share1 = (koof - dol) / 2
          if(price == "0"){price = Math.max((cityPrice * 1) * (1 + Math.log(itemQuality / cityQuality)), 0)}
          price = price - (price * share1/100);
          if(itemCost > price){ price = itemCost * 1.1;}


       // округляем до 0.1
       if ( price < 20) price = Math.round( price*10 ) /10;
       // округляем до целого
       else if ( price < 200 ) price = Math.round( price );
       // округляем до 5
       else if ( price < 1000 ) price = Math.round( price/5 )*5;
       // округляем до 10
       else if  (price < 2000 ) price = Math.round( price/10 ) *10;
       // округляем до 20
       else if  (price < 3000 ) price = Math.round( price/20 ) *20;
       else if  (price < 8000 ) price = Math.round( price/50 ) *50;
       else if  (price < 20000 ) price = Math.round( price/100 ) *100;
       else if  (price < 30000 ) price = Math.round( price/200 ) *200;
       else if  (price < 45000 ) price = Math.round( price/500 ) *500;
       else if  (price < 100000 ) price = Math.round( price/1000 ) *1000;
       else if  (price < 500000 ) price = Math.round( price/2000 ) *2000;
       else if  (price < 500000 ) price = Math.round( price/2000 ) *2000;
       else if  (price < 1000000 )price = Math.round( price/10000 ) *10000;
       else if  (price < 10000000 )price = Math.round( price/100000 ) *100000;
       else if  (price > 10000000 )price = Math.round( price/1000000 ) *1000000;


                  $td10.children("input:eq(0)").val(price.toFixed(2)); 

        }
        }
      }


    );

//$("input[name='setprice']").click(); // нажимает сохранить





//  $("input[name='setprice']").click();
//$(window.location.href = 'supply').delay(1000).click();

//setTimeout(function(){ $(window.location.href = 'supply');}, 1000);


//setTimeout($("input[name='setprice']").click().delay(3000), $(window.location.href = 'supply').click(), 3000);



  };

  var groupId = 0;
  var itemId = 0;
  $tbody.children("tr").each(function() {
    var $tr = $(this);

    if ($tr.children("td").length === 1) {
      (function(groupId) {
        $tr.append($("<input class='qps_button' type='button' value='группа'>")).click(function() {
          setPrice(groupId, -1);
        });
      })(++groupId);
    }
      else if ($tr.children("td").length > 1) {
      var $td10 = $tr.children("td:eq(9)");
      (function(groupId, itemId) {
        $td10.append($("<input class='qps_button' type='button' value='цена'>")).click(function() {
          setPrice(groupId, itemId);
        });
      })(groupId, ++itemId);
    }
  });

  $qps_setGlobalBut.click(function() {
    setPrice(-1, -1);
  });
};

if(window.top == window) {
  var style = document.createElement("style");
  style.textContent = ".qps_button {background-color: gold}";
  document.documentElement.appendChild(style);

  var script = document.createElement("script");
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}