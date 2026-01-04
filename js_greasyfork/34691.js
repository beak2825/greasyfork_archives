// ==UserScript==
// @name           Victory: БиоХрен-н-Престон трафик
// @version        1.00
// @namespace      virtonomica
// @description    Траф
// @include        http*://*virtonomic*.*/*/main/unit/view/*/sale
// @downloadURL https://update.greasyfork.org/scripts/34691/Victory%3A%20%D0%91%D0%B8%D0%BE%D0%A5%D1%80%D0%B5%D0%BD-%D0%BD-%D0%9F%D1%80%D0%B5%D1%81%D1%82%D0%BE%D0%BD%20%D1%82%D1%80%D0%B0%D1%84%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/34691/Victory%3A%20%D0%91%D0%B8%D0%BE%D0%A5%D1%80%D0%B5%D0%BD-%D0%BD-%D0%9F%D1%80%D0%B5%D1%81%D1%82%D0%BE%D0%BD%20%D1%82%D1%80%D0%B0%D1%84%D0%B8%D0%BA.meta.js
// ==/UserScript==

var run = function() {
	$( document ).ready(function() {
		//Считываем тип предприятия
		var img =  $('.bg-image').attr('class');
		img = img.substring(16,img.length-16);
		
		//Запускаем только в магазинах
		if(img == 'network') {
			
			var but = $('<li>').append('<a>Траф</a>').click( function() {
				var url = document.location.href;
				$.ajax({
					url: url,
					async: false,
					type: "post",
					data: 'storageData[price]=10&storageData[max_qty]=&storageData[constraint]=2&storageData[company][]=4345151&storageData[company][]=6287963'
				});
				location.reload()
			})
			
			$("li:contains('Сбыт')").after(but);
		}
	})
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);