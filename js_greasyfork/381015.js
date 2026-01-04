// ==UserScript==
// @name         Torn Extensions - Stock Order
// @namespace    TornExtensions
// @version      1.1
// @description  Helps to order stock for your company.
// @author       Mathias [XID 1918010]
// @match        https://www.torn.com/companies.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381015/Torn%20Extensions%20-%20Stock%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/381015/Torn%20Extensions%20-%20Stock%20Order.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    let APIKey = "YOUR API HERE";
    let targetNode = document.getElementById('stock');
    let config = { childList: true };
    let onItsWay = 0;
    let callback = function(mutationsList, observer) {
        $(".total-price.bold").after("<div class=\"total-stock-container bold\">Total stock:</span> <span class=\"total-stock\"></span></div><br />");
        $(".total-stock-container").css("padding", "10px 10px 0");
        $(".input-money").change(() => {
            calcStock();
        });
        calcStock();
        let API = `https://api.torn.com/company/?selections=stock&key=${APIKey}`;
        fetch(API)
          .then((res) => res.json())
          .then((res) => {
            console.log(API);
            let stockstr = "";
            stockstr += "<br /><br /><h4>Torn Extensions - Stock Order</h4><table><tr><th>Product</th><th>In stock</th><th>Sold yesterday</th></tr>";
            $.each(res.company_stock, (k, v) => {
                onItsWay += v.on_order;
                stockstr += `<tr><td>${k}</td><td>${v.in_stock.toLocaleString("en-US")}(${(v.in_stock + v.on_order).toLocaleString("en-US")})</td><td>${v.sold_amount.toLocaleString("en-US")}</td></tr>`;
            });
            $(".clear-all.t-blue.h.m-left10.c-pointer").after(stockstr + "</table>");
            $("table,th,td").css("border", "1px solid black").css("border-collapse", "collapse");
            $("th,td").css("padding", "5px");
            $(".total-stock").text((parseInt($(".total-stock").text().replace(",", "")) + onItsWay).toLocaleString("en-US"));
        });
    };

    let observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    function calcStock() {
        $(".total-stock").text((parseInt($(".quantity.bold").text().replace(/,/g, "")) + parseInt($(".stock.bold").text().replace(/,/g, "")) + onItsWay).toLocaleString("en-US"));
    }
})();