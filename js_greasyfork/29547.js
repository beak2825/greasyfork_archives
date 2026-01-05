// ==UserScript==
// @name           Victory: шагрень
// @version        1.03
// @namespace      Victory
// @description    Парсер шагрени
// @include        http*://*virtonomic*.*/*/main/olla/*
// @downloadURL https://update.greasyfork.org/scripts/29547/Victory%3A%20%D1%88%D0%B0%D0%B3%D1%80%D0%B5%D0%BD%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/29547/Victory%3A%20%D1%88%D0%B0%D0%B3%D1%80%D0%B5%D0%BD%D1%8C.meta.js
// ==/UserScript==

var run = function() {
	var btnShagreen = document.createElement('li');
    btnShagreen.innerHTML = '<a>Считать шагрень</a>';
	btnShagreen.onclick = function() {
		$('.sel').append('<div id="store" style="display: none;"></div>');
		resultTable = document.createElement('table');
		resultTable.innerHTML = '<tr><td>Место</td><td>Участник</td><td>Выручка всего</td><td>Инновации</td><td>Расположение</td><td>Посетителей</td><td>Сервис</td><td>Известность</td><td>Цена</td></tr>';
		$('#mainContent').before(resultTable);
		var storage;

		var ind = 2;
		$('body > #wrapper > #mainContent > table > tbody > tr').each(function(i) {
			if (i === 0) return;
			var storeUrl = $('td:nth-child(5) > a', this).attr('href');
			$.ajax({
			  url: storeUrl,
			  async: false,
			  success: function(html){
				storage = $(html);
				artf = '';
				storage.find('div.artf_slots > img').each(function() {
					var artfInst = $(this).attr('Title');
					artfInst = artfInst.slice(-(artfInst.length-artfInst.indexOf('/ ')-2));
					artf = artf + artfInst.trim() + '\n';
				});

				price = 0;
				storage.find('table.grid > tbody > tr').each(function() {
					if ($('td:nth-child(1) > img', this).eq(0).attr('alt') == 'Шагрень') {
						price = String(parseFloat($('td:nth-child(5)', this)[0].textContent.replace(/[^0-9.]/g, ""))).replace(/\./,',');
					}
				});

				if (price === 0) {
					artf = '';
					place = '';
					popularity = '';
					clients = '';
					service = '';
					price = '';
				}
				else {
					place = storage.find('table.infoblock > tbody > tr:nth-child(2) > td:nth-child(2)')[0].innerText;
					popularity = storage.find('table.infoblock > tbody > tr:nth-child(5) > td:nth-child(2)')[0].innerText.replace(/\./,',');
					clients = storage.find('table.infoblock > tbody > tr:nth-child(6) > td:nth-child(2)')[0].innerText;
					service = storage.find('table.infoblock > tbody > tr:nth-child(7) > td:nth-child(2)')[0].innerText;
				}

				var companyName = $('body > #wrapper > #mainContent > table > tbody > tr:nth-child('+(i+1)+') > td:nth-child(3) > a')[0].textContent;
				var moneyValue = String(parseFloat($('body > #wrapper > #mainContent > table > tbody > tr:nth-child('+(i+1)+') > td:nth-child(5)')[0].textContent.replace(/[^0-9.]/g, ""))).replace(/\./,',');
				//ind = ind+1;

				resultTable.innerHTML = resultTable.innerHTML + '<tr><td>' + i + '</td><td>' + companyName + '</td><td>' + moneyValue + '</td><td>' + artf + '</td><td>' + place + '</td><td>' + clients + '</td><td>' + service + '</td><td>' + popularity + '</td><td>' + price + '</td></tr>';
			  },
              error: function(xhr, ajaxOptions, thrownError){
				if(xhr.status==404) {
					artf = '';
					place = '';
					popularity = '';
					clients = '';
					service = '';
					price = '';
					var companyName = $('body > #wrapper > #mainContent > table > tbody > tr:nth-child('+(i+1)+') > td:nth-child(3) > a')[0].textContent;
					var moneyValue = String(parseFloat($('body > #wrapper > #mainContent > table > tbody > tr:nth-child('+(i+1)+') > td:nth-child(5)')[0].textContent.replace(/[^0-9.]/g, ""))).replace(/\./,',');
					//ind = ind+1;

					resultTable.innerHTML = resultTable.innerHTML + '<tr><td>' + i + '</td><td>' + companyName + '</td><td>' + moneyValue + '</td><td>' + artf + '</td><td>' + place + '</td><td>' + clients + '</td><td>' + service + '</td><td>' + popularity + '</td><td>' + price + '</td></tr>';
				}
			  }
			});
		});
	};
	$("body > #wrapper > ul > li:nth-child(6)").after(btnShagreen);
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);