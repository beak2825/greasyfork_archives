// ==UserScript==
// @name        Virtonomica: Городской отдел статистики
// @namespace   Virtonomica
// @description    Подсчет числа рабочих в городе
// @version        1.01
// @include     http://igra.aup.ru/*/main/politics/mayor/*/units
// @include     https://*virtonomic*.*/*/main/politics/mayor/*/units
// @downloadURL https://update.greasyfork.org/scripts/1543/Virtonomica%3A%20%D0%93%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%BE%D0%B9%20%D0%BE%D1%82%D0%B4%D0%B5%D0%BB%20%D1%81%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/1543/Virtonomica%3A%20%D0%93%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%BE%D0%B9%20%D0%BE%D1%82%D0%B4%D0%B5%D0%BB%20%D1%81%D1%82%D0%B0%D1%82%D0%B8%D1%81%D1%82%D0%B8%D0%BA%D0%B8.meta.js
// ==/UserScript==
var run = function() {

var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;

function numberFormat (number) {
          number += '';
          var parts = number.split('.');
          var int = parts[0];
          var dec = parts.length > 1 ? '.' + parts[1] : '';
          var regexp = /(\d+)(\d{3}(\s|$))/;
          while (regexp.test(int)) {
          int = int.replace(regexp, '$1 $2');
          }
          return int + dec;
}

	var table = $("table.unit-list");
	var td = $("td.u-d + td");


	all = 0;
	for (var i=0; i<td.length; i++){
		works = td.eq(i).text().replace(" ", '').replace(" ", '').replace(" ", '').replace(" ", '');
		works = parseInt( works );
		all+= works;
	}

	var container = $("table.unit-top");

	container.after("<div>Всего рабочих: " + numberFormat(all) +"</div>");

	console.log("End");
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
} 