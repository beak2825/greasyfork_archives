// ==UserScript==
// @name           Victory: глобальный анализатор
// @version        1.00
// @namespace      virtonomica
// @description    Анализатор
// @include        http*://*virtonomic*.*/*/main/*
// @downloadURL https://update.greasyfork.org/scripts/35203/Victory%3A%20%D0%B3%D0%BB%D0%BE%D0%B1%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/35203/Victory%3A%20%D0%B3%D0%BB%D0%BE%D0%B1%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9%20%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D0%B7%D0%B0%D1%82%D0%BE%D1%80.meta.js
// ==/UserScript==

var run = function() {
	var but = $('<li>').append('А').click( function() {
		$('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.5;" />').height($(window).height()).width($(window).width()).prependTo('body');
		$('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 12pt; text-align: center;" ><table id="myTable"></table></div>').width($(window).width()).prependTo('body');

		$.ajax({
			url: 'https://virtonomica.ru/olga/main/common/util/setpaging/usermain/topRating/10000',
			async: false,
		});

		var storage;
		var links = `https://virtonomica.ru/olga/main/company/toplist/retail
		https://virtonomica.ru/olga/main/company/toplist/fuel
		https://virtonomica.ru/olga/main/company/toplist/service/422825
		https://virtonomica.ru/olga/main/company/toplist/service/359926
		https://virtonomica.ru/olga/main/company/toplist/service/423795
		https://virtonomica.ru/olga/main/company/toplist/service/373245
		https://virtonomica.ru/olga/main/company/toplist/service/373255
		https://virtonomica.ru/olga/main/company/toplist/service/423707
		https://virtonomica.ru/olga/main/company/toplist/service/373265
		https://virtonomica.ru/olga/main/company/toplist/service/348207`;
		var links2 = links.split('\n');
		var k, obor;
        var oborRoz = 0;
        var oborUsl = 0;
        var sumSumObor = 0;
		var oborMas = [];
		for(var i = 0; i < links2.length; i++){
			var oborSum = 0;
			$.ajax({
				url: links2[i],
				async: false,
				success: function(html){
					storage = $(html);
					k = 0;
					storage.find('#mainContent > table > tbody > tr').each(function(j) {
						if (j === 0) { k = $('th:contains("Оборот")')['0'].cellIndex; }
						obor = +$('td', this).eq(k).text().replace(/[^0-9.]/g, "");
						oborSum += obor;
					});
					//console.log(i);
					if (i === 0 || i == 1) { oborRoz += oborSum; }
					else { oborUsl += oborSum; }
					sumSumObor += oborSum;
					oborMas[i] = oborSum;
				}
			});
		}

		$('#myTable').html('<tr><td>Розница</td><td>Заправки</td><td>Мастерские</td><td>Больницы</td><td>Айти</td><td>Парикмахерские</td><td>Прачки</td><td>Детсады</td><td>Рестораны</td><td>Фитнесы</td><td>Розница всего</td><td>Услуги всего</td><td>Суммарно</td></tr><tr><td>' + oborMas[0] + '</td><td>' + oborMas[1] + '</td><td>' + oborMas[2] + '</td><td>' + oborMas[3] + '</td><td>' + oborMas[4] + '</td><td>' + oborMas[5] + '</td><td>' + oborMas[6] + '</td><td>' + oborMas[7] + '</td><td>' + oborMas[8] + '</td><td>' + oborMas[9] + '</td><td>' + oborRoz + '</td><td>' + oborUsl + '</td><td>' + sumSumObor + '</td></tr>');

		//$('#myTable')['0'].innerHTML = $('#myTable').innerHTML + '<tr><td>' + oborMas[1] + '</td><td>' + oborMas[2] + '</td><td>' + oborMas[3] + '</td><td>' + oborMas[4] + '</td><td>' + oborMas[5] + '</td><td>' + oborMas[6] + '</td><td>' + oborMas[7] + '</td><td>' + oborMas[8] + '</td><td>' + oborMas[9] + '</td><td>' + oborRoz + '</td><td>' + oborUsl + '</td><td>' + sumSumObor + '</td></tr>';




	});
	$('li.right').before(but);

	/*
	https://virtonomica.ru/olga/main/common/util/setpaging/usermain/topRating/200
	https://virtonomica.ru/olga/main/company/toplist/retail
	https://virtonomica.ru/olga/main/company/toplist/fuel
	https://virtonomica.ru/olga/main/company/toplist/service/422825 - мастерские
	https://virtonomica.ru/olga/main/company/toplist/service/359926 - больницы
	https://virtonomica.ru/olga/main/company/toplist/service/423795 - айти
	https://virtonomica.ru/olga/main/company/toplist/service/373245 - парикмахерские
	https://virtonomica.ru/olga/main/company/toplist/service/373255 - прачки
	https://virtonomica.ru/olga/main/company/toplist/service/423707 - детсады
	https://virtonomica.ru/olga/main/company/toplist/service/373265 - рестораны
	https://virtonomica.ru/olga/main/company/toplist/service/348207 - фитнесы
	*/
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);