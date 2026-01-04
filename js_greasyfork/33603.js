// ==UserScript==
// @name           Victory: тендерозаправщик
// @version        1.03
// @namespace      Victory
// @description    Тендерозаправщик
// @include        http*://*virtonomic*.*/*/main/unit/view/*/trading_hall
// @downloadURL https://update.greasyfork.org/scripts/33603/Victory%3A%20%D1%82%D0%B5%D0%BD%D0%B4%D0%B5%D1%80%D0%BE%D0%B7%D0%B0%D0%BF%D1%80%D0%B0%D0%B2%D1%89%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/33603/Victory%3A%20%D1%82%D0%B5%D0%BD%D0%B4%D0%B5%D1%80%D0%BE%D0%B7%D0%B0%D0%BF%D1%80%D0%B0%D0%B2%D1%89%D0%B8%D0%BA.meta.js
// ==/UserScript==

var run = function() {
	$( document ).ready(function() {
		var img =  $('.bg-image').attr('class');
		img = img.substring(16,img.length-16);
		
		if (img == 'fuel') {
			var button = $('<button type="submit">Заправочка</button>').click(function() {
				var modifier = 0;
				$('#mainContent > form > table.grid > tbody > tr').each(function(i) {
					if (i > 1) {
						switch(i)
						{
							case(2)://80
								modifier = 2;
								break;
							case(3)://95
								modifier = 4.5;
								break;
							case(4)://92
								modifier = 2.25;
								break;
							case(5)://Био
								modifier = 3;
								break;
							case(6)://Дизель
								modifier = 1.9;
								break;
						}

						var marketReportPage = $('a[href*="by_trade_at_cities"]', this)["0"].href;
						var localPrice;
						var storage;

						$.ajax({
							url: marketReportPage,
							async: false,
							success: function(html){
								storage = $(html);
								localPrice = parseFloat(storage.find('th:contains("Местные поставщики")').parent().next()['0'].children['1'].innerHTML.replace(/[^0-9.]/g, ""));
							}
						});

						var priceChanged = modifier * localPrice;
						if (parseInt($('td:nth-child(6)', this)['0'].innerHTML.replace(/\s/g,'')) > 0) {
							$('td:nth-child(10) > input', this).attr('value', priceChanged.toFixed(0));
						}
					}
				});
				$("input[name*='setprice']").click();
				return false;
			});
			$("input[name*='setprice']").before(button);
		}
	})
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);