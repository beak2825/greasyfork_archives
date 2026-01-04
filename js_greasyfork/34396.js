// ==UserScript==
// @name        trading_hall by ctsigma
// @namespace   virtonomica
// @include     *virtonomic*.*/*/trading_hall
// @description info in shop trading hall
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34396/trading_hall%20by%20ctsigma.user.js
// @updateURL https://update.greasyfork.org/scripts/34396/trading_hall%20by%20ctsigma.meta.js
// ==/UserScript==

var run = function() {
var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
$=win.$;

$('.grid th:contains("Цена продажи")').after('<th rowspan="2">Доходность</th>');
$('.grid tr input[type="text"]').each( function() {
var sell = parseFloat($(this).val().replace(/[^\d\.]/g,''));
var buy = parseFloat($(this).parent().prev().text().trim().replace(/[^\d\.]/g,''));
var margin = ((sell - buy) / buy * 100).toFixed(2);

var new_col = $(this).parent().after('<td class="nowrap" align="right">' + margin + '%</td>').next();
if (margin<=0) new_col.css('background',"#ff9999");
})



}

var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);