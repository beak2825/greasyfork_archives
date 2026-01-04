// ==UserScript==
// @name        Diyacom_2
// @namespace   Violentmonkey Scripts
// @include       http*://virtonomica.ru/*/window/unit/supply/create/*/step2
// @grant       none
// @version     1.0
// @author      -
// @description Цена/качество местных
// @downloadURL https://update.greasyfork.org/scripts/392430/Diyacom_2.user.js
// @updateURL https://update.greasyfork.org/scripts/392430/Diyacom_2.meta.js
// ==/UserScript==
var run = function() {
  var href = location.href;

  var price = $("#supply_header > div.supply_addition_info > table > tbody > tr:nth-child(2) > th:nth-child(2)");
  price = price[0].innerHTML.replace('Цена = $','').replace(' ','');

  var quality = $("#supply_header > div.supply_addition_info > table > tbody > tr:nth-child(2) > th:nth-child(3)");
  quality = quality[0].innerHTML.replace('Качество = ','');
//    inp_sale = $("td:nth-child(3) > a");
  var PQ = price / quality;
  document.querySelector("#supply_header > div.supply_addition_info > table > tbody > tr:nth-child(2) > th:nth-child(4)").innerHTML = 'Ц/К = '+PQ.toFixed(2);
    console.log(price);
}
// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);