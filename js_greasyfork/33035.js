// ==UserScript==
// @name           Victory: вывоз всех позиций
// @version        1.00
// @namespace      Victory
// @description    Вывоз всех позиций
// @include        http*://*virtonomic*.*/*/window/unit/view/*/product_move_to_warehouse/*/0
// @downloadURL https://update.greasyfork.org/scripts/33035/Victory%3A%20%D0%B2%D1%8B%D0%B2%D0%BE%D0%B7%20%D0%B2%D1%81%D0%B5%D1%85%20%D0%BF%D0%BE%D0%B7%D0%B8%D1%86%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/33035/Victory%3A%20%D0%B2%D1%8B%D0%B2%D0%BE%D0%B7%20%D0%B2%D1%81%D0%B5%D1%85%20%D0%BF%D0%BE%D0%B7%D0%B8%D1%86%D0%B8%D0%B9.meta.js
// ==/UserScript==

var run = function() {
	var but = $('<input value="Вывезти все позиции" class="button115" type="button">').click(function() {
		unitDestination = $('input[type="radio"]:checked').val();
		unitID = window.location.href.match(/\d+/)['0'];
		var storage;
		$('input[id="qty"]')['0'].value = 0;
		
		$.ajax({
			url: 'https://virtonomica.ru/olga/main/unit/view/' + unitID + '/consume',
			async: false,
			success: function(html){
				storage = $(html);
				if (storage.find('a[href*="product_move_to_warehouse"][style="visibility: visible"]').length !== 0) {
					storage.find('a[href*="product_move_to_warehouse"][style="visibility: visible"]').each(function() {
						var link = this.href;
						$.ajax({
							url: link,
							async: false,
							type: 'post',
							data: 'qty=1000000000&unit=' + unitDestination + '&doit=Ok'
						});
					});
				}
				else {
					$.ajax({
						url: 'https://virtonomica.ru/olga/main/unit/view/' + unitID + '/trading_hall',
						async: false,
						success: function(html){
							storage = $(html);
							storage.find('a[href*="product_move_to_warehouse"]').each(function() {
								var link = this.href;
								$.ajax({
									url: link,
									async: false,
									type: 'post',
									data: 'qty=1000000000&unit=' + unitDestination + '&doit=Ok'
								});
							});
						}
					});
				}
			}
		});
		$('input[name="doit"]').click();
	});
	$('input[value = "Пересчитать"]').after(but);
	
};
			
// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);