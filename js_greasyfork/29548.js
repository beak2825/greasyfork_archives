// ==UserScript==
// @name           Victory: регулировка магазинов
// @version        1.02
// @namespace      Victory
// @description    Регулирование цены в магазинах
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @downloadURL https://update.greasyfork.org/scripts/29548/Victory%3A%20%D1%80%D0%B5%D0%B3%D1%83%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/29548/Victory%3A%20%D1%80%D0%B5%D0%B3%D1%83%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%BE%D0%B2.meta.js
// ==/UserScript==

var run = function() {
	$( document ).ready(function() {
		//Запускаем выполнение только в магазинах
		var img = $('.bg-image').attr('class');
		img = img.substring(16,img.length-16);
		
		if (img == 'shop') {
			//Считываем, сколько приехало товара
			//supplyFact = $('td:nth-child(5)', this).text().match(/\d[.\s\d]*(?=)/g);
			//if (supplyFact) supplyFact = +supplyFact[1].replace(/[^\d\.]/g,'');
			
			//Считываем продажи
			//saleFact = +($('td:nth-child(4)', this).text().replace(/[^\d\.]/g,''));
			
			
			var x11 = $('<button type="submit">x1.1</button>').click(function() {
				$('#mainContent > form > table.grid > tbody > tr').each(function() {
					//Считываем цену
					var priceFact = $('td:nth-child(10) > input', this).attr('value');
					
					//Задаём цену
					var priceChanged = 1.1*priceFact;
					if (priceChanged) { $('td:nth-child(10) > input', this).attr('value', priceChanged.toFixed(0)) };
				});
				$("input[name*='setprice']").click();
				return false;
			});
			var x12 = $('<button type="submit">x1.2</button>').click(function() {
				$('#mainContent > form > table.grid > tbody > tr').each(function() {
					//Считываем цену
					var priceFact = $('td:nth-child(10) > input', this).attr('value');
					
					//Задаём цену
					var priceChanged = 1.2*priceFact;
					if (priceChanged) { $('td:nth-child(10) > input', this).attr('value', priceChanged.toFixed(0)) };
				});
				$("input[name*='setprice']").click();
				return false;
			});
			var x13 = $('<button type="submit">x1.3</button>').click(function() {
				$('#mainContent > form > table.grid > tbody > tr').each(function() {
					//Считываем цену
					var priceFact = $('td:nth-child(10) > input', this).attr('value');
					
					//Задаём цену
					var priceChanged = 1.3*priceFact;
					if (priceChanged) { $('td:nth-child(10) > input', this).attr('value', priceChanged.toFixed(0)) };
				});
				$("input[name*='setprice']").click();
				return false;
			});
			var x14 = $('<button type="submit">x1.4</button>').click(function() {
				$('#mainContent > form > table.grid > tbody > tr').each(function() {
					//Считываем цену
					var priceFact = $('td:nth-child(10) > input', this).attr('value');
					
					//Задаём цену
					var priceChanged = 1.4*priceFact;
					if (priceChanged) { $('td:nth-child(10) > input', this).attr('value', priceChanged.toFixed(0)) };
				});
				$("input[name*='setprice']").click();
				return false;
			});
			var x15 = $('<button type="submit">x1.5</button>').click(function() {
				$('#mainContent > form > table.grid > tbody > tr').each(function() {
					//Считываем цену
					var priceFact = $('td:nth-child(10) > input', this).attr('value');
					
					//Задаём цену
					var priceChanged = 1.5*priceFact;
					if (priceChanged) { $('td:nth-child(10) > input', this).attr('value', priceChanged.toFixed(0)) };
				});
				$("input[name*='setprice']").click();
				return false;
			});
			$("input[name*='setprice']").after(x15).after(x14).after(x13).after(x12).after(x11);
		}
	})
};	

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);