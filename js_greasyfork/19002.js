// ==UserScript==
// @name           Virtonomica: выделить все позиции товара в снабжении
// @version        1.6
// @include        http*://*virtonomic*.*/*/main/unit/view/*/supply
// @description    Добавляет чекбокс "выделить все" для каждого товара в снабжении
// @author         cobra3125
// @namespace      virtonomica
// @downloadURL https://update.greasyfork.org/scripts/19002/Virtonomica%3A%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D0%B8%D1%82%D1%8C%20%D0%B2%D1%81%D0%B5%20%D0%BF%D0%BE%D0%B7%D0%B8%D1%86%D0%B8%D0%B8%20%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D0%B0%20%D0%B2%20%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/19002/Virtonomica%3A%20%D0%B2%D1%8B%D0%B4%D0%B5%D0%BB%D0%B8%D1%82%D1%8C%20%D0%B2%D1%81%D0%B5%20%D0%BF%D0%BE%D0%B7%D0%B8%D1%86%D0%B8%D0%B8%20%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D0%B0%20%D0%B2%20%D1%81%D0%BD%D0%B0%D0%B1%D0%B6%D0%B5%D0%BD%D0%B8%D0%B8.meta.js
// ==/UserScript==

var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;
	
	var cbs = $('table.list > tbody > tr > td:nth-child(1) > input[type="checkbox"]');
	if(cbs.length > 0){
		var box = $('<input type="checkbox" style="float:left;">').click(function(){
			var row = $(this).closest('tr');
			var checked = $(this).is(':checked');
			var next = row.next();
			while (next.length > 0 && !next.hasClass('p_title')) {
				$('> td:nth-child(1) > input[type="checkbox"]', next).attr('checked', checked);
				next = next.next();
			}
		});
		$('a:has(img[src="/img/supplier_add.gif"])').after(box);
	}
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}