// ==UserScript==
// @name           Victory: тендерное снабжение с/у
// @version        1.03
// @author         Agor71
// @description    Снабжение под тендеры
// @include        http*://*virtonomic*.*/*/main/unit/view/*/supply

// @namespace https://greasyfork.org/users/10556
// @downloadURL https://update.greasyfork.org/scripts/33029/Victory%3A%20%D1%82%D0%B5%D0%BD%D0%B4%D0%B5%D1%80%D0%BD%D0%BE%D0%B5%20%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/33029/Victory%3A%20%D1%82%D0%B5%D0%BD%D0%B4%D0%B5%D1%80%D0%BD%D0%BE%D0%B5%20%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%81%D1%83.meta.js
// ==/UserScript==

var run = function() {
		function main(k,i) {
			unitID = window.location.href.match(/\d+/);
			var storage;
			var maxSales;
			var valueShablon = 0;
			
			$.ajax({
				url: 'https://virtonomica.ru/olga/main/unit/view/' + unitID,
				async: false,
				success: function(html){
					storage = $(html);
					maxSales = storage.find("td:contains('макс.: ')")[1].childNodes[0].data.replace(/\s/g,'').replace(/\n/g,'').match(/\d+/g)[1];
					if (i == 1) {
						var spec = storage.find("td.title:contains('Специализация')").next().text();
						switch(spec)
						{
							case('Чайная'): valueShablon = 20000; break;
							case('Авторемонтная мастерская'): valueShablon = 10000; break;
							case('Кузовные работы'): valueShablon = 5000; break;
							case('Салон автосигнализаций'): valueShablon = 25000; break;
							case('Косметологический центр'): valueShablon = 6000; break;
							case('Кафе-кондитерская'): valueShablon = 20000; break;
							case('Шиномонтаж'): valueShablon = 13000; break;
							case('Станция сезонного ремонта'): valueShablon = 2000; break;
							case('Ресторан мексиканской кухни'): valueShablon = 15000; break;
							case('Больница'): valueShablon = 250; break;
							case('Устричный ресторан'): valueShablon = 10000; break;
							case('Диагностический центр'): valueShablon = 10000; break;
							case('Ресторан итальянской кухни'): valueShablon = 20000; break;
							case('Студия детского творчества'): valueShablon = 300; break;
							case('Станция профилактики'): valueShablon = 40000; break;
							case('Fish and chips'): valueShablon = 30000; break;
							case('Кофейня'): valueShablon = 30000; break;
							case('Стейк ресторан'): valueShablon = 22500; break;
						}
					}
				}
			});
			
			$('tr[id*="product_row_"]').each(function() {
				var quantityPerVis = $('td:contains("Расх. на клиента")', this).next()[1].childNodes[0].data;
				var newQuantity = k * quantityPerVis * maxSales + valueShablon * quantityPerVis;
				$('input[type = "type"]', this).attr('value', newQuantity);
			});
			$("input[value='Изменить']").click();
		};
		
		$( document ).ready(function() {
			//Запускаем выполнение только в с/у
			var img = $('.bg-image').attr('class');
			img = img.substring(16,img.length-16);
			
			if (img == 'medicine' || img == 'restaurant' || img == 'repair' || img == 'educational') {
				var x0 = $('<button type="submit">x0</button>').click(function() {
					var k = 0;
					var i = 0;
					main(k,i);
				});
				var x1 = $('<button type="submit">x1</button>').click(function() {
					var k = 1;
					var i = 0;
					main(k,i);
				});
				var x2 = $('<button type="submit">x2</button>').click(function() {
					var k = 2;
					var i = 0;
					main(k,i);
				});
				var x3 = $('<button type="submit">x3</button>').click(function() {
					var k = 3;
					var i = 0;
					main(k,i);
				});
				var x4 = $('<button type="submit">x4</button>').click(function() {
					var k = 4;
					var i = 0;
					main(k,i);
				});
				var shablon = $('<button type="submit">Шаблон</button>').click(function() {
					var k = 0;
					var i = 1;
					main(k,i);
				});
				
				$('#childMenu').after(shablon).after(x4).after(x3).after(x2).after(x1).after(x0);
			}
		});
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);