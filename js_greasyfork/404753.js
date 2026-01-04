// ==UserScript==
// @namespace      virtonomica
// @name           Virtonomica: Rabinovich
// @description:en Quick installation prices of goods in the trading hall.
// @description:ru Быстрая установка цены товаров в торговом зале.
// @include        http://virtonomica*.*/*/main/unit/view/*/trading_hall
// @include        https://virtonomica.ru/*/main/unit/view/*/trading_hall
// @version        53
// @grant          A
// @description Quick installation prices of goods in the trading hall.
// @downloadURL https://update.greasyfork.org/scripts/404753/Virtonomica%3A%20Rabinovich.user.js
// @updateURL https://update.greasyfork.org/scripts/404753/Virtonomica%3A%20Rabinovich.meta.js
// ==/UserScript==

//setTimeout(function() {$("input[name='setprice']").click();}, 3000);
//https://virtonomica.ru/api/nika/main/unit/forecast?format=7179367
//?format
//$(window.location.href = 'supply').delay(10000).click();


var run = function () {
    var $tbody = $("table.grid:eq(0) > tbody:eq(0)");
    $tbody.parent().before("<div><input id='qps_costPrice' type='text' value='4'>Жесткость"
                           +"<br><input id='qps_avgPrice' type='text' value='100'>% Target price "
                           +"(<select id='qps_priceType'><option value='1'>item quality/city quality*city price</option><option value='1'>city price</option>                         </select>)"
                           +"<br><input id='qps_setGlobalBut' class='qps_button' type='button' value='установка цены'>"
                           +"<input id='qps_setGlobalBut1' class='qps_button' type='button' value='ОТ ЗАКУПКИ'></div>");



    var $qps_costPrice = $("#qps_costPrice");
    var $qps_avgPrice = $("#qps_avgPrice");
    var $qps_priceType = $("#qps_priceType");
    var $qps_setGlobalBut = $("#qps_setGlobalBut");
    console.log($qps_avgPrice+" кооф"); //актив
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

        //   var minPriceMultiplier = $qps_costPrice.val() * 0.01;
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
                    var $td6 = $tr.children("td:eq(2)"); // продано
                    var $td3 = $tr.children("td:eq(3)"); // Объём продаж
                    var $td4 = $tr.children("td:eq(4)"); // Куплено
                    var $td5 = $tr.children("td:eq(5)"); // На складе
                    var $td7 = $tr.children("td:eq(6)"); // item quality
                    var $td9 = $tr.children("td:eq(8)"); // item cost
                    var $td10 = $tr.children("td:eq(9)"); // price input
                    var $td20 = $td10.children("input:eq(0)");
                    var $td14 = $tr.children("td:eq(10)"); // dol
                    var $td12 = $tr.children("td:eq(11)"); // городская цена
                    var $td13 = $tr.children("td:eq(12)"); // city quality


                    var itemQuality = $td7.text().trim() - 0;
                    var itemCost = $td9.text().trim().replace(" ", "").replace(" ", "").replace("©", "").replace("$", "") - 0;
                    var cityPrice = $td12.text().trim().replace(" ", "").replace(" ", "").replace(" ", "").replace("©", "").replace("$", "") - 0;
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

                    console.log( kupl+" куплено" );
                    console.log( sale+" продано" );
                    console.log( sklad+" склад" );
                    console.log( price+" цена была");
                    console.log( sale/kupl+" кооф продаж");
                    if(price == "0"){price = Math.max((cityPrice * 1) * (1 + Math.log(itemQuality / cityQuality)), 0)}

                    if(kupl == 0 || ((kupl == sklad) && kupl > sale)){
                        price = price;
                    } else {
                        // var koo = sale/kupl;
                        price = price + price * (((sale/kupl)-1)/koof);
                        // console.log( price+" цена стала по формуле");
                    }
                    if(kupl == sklad && sklad >= sale){price = price * 1.05;} console.log( price+" если закуп равен складу то 1.05");
                    if(itemCost*1.2 > price){ price = itemCost * 1.2;} console.log( price+" если ниже чем сс *1,2");

                    $td10.children("input:eq(0)").val(price.toFixed(2)); // записывает цену в строку

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