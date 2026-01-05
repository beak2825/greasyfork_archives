// ==UserScript==
// @name           Virtonomica: списать и закупить
// @version        1.2
// @description    Добавляет в управление оборудованием\животными кнопку "Списать и закупить"
// @include        http://*virtonomic*.*/*/main/company/view/*/unit_list/*
// @namespace virtonomica
// @downloadURL https://update.greasyfork.org/scripts/20253/Virtonomica%3A%20%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D1%82%D1%8C%20%D0%B8%20%D0%B7%D0%B0%D0%BA%D1%83%D0%BF%D0%B8%D1%82%D1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/20253/Virtonomica%3A%20%D1%81%D0%BF%D0%B8%D1%81%D0%B0%D1%82%D1%8C%20%D0%B8%20%D0%B7%D0%B0%D0%BA%D1%83%D0%BF%D0%B8%D1%82%D1%8C.meta.js
// ==/UserScript==
var run = function() {

	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;


	$('input[type="button"][name="destroy"]').after('<input type="button" id="destroy_and_buy" value="Списать и закупить" class="button130">');
	$('input#destroy_and_buy').click(function(){
		var checkedBox = $('input[type="checkbox"][id*="unit_"]:checked');
		if (checkedBox.length == 0) {
			alert('Сначала выберите одно или несколько подразделений');
			return false;
		}
		if (!confirm('Вы действительно хотите списать?')) {
			return false;
		}
		//console.log("data = " + JSON.stringify(data));
		var svUrl = 'http://virtonomica.ru/olga/main_light/management_units/equipment/destroy';
		var form = $('form[name="unitsEquipmentRepair"]').first();
		form.action = svUrl;
		form.target = 'operationFrame';
		$.post( svUrl, form.serialize() )
			.done(function() {
			console.log( "success" );
			checkedBox.each(function() {
				var cbox = $(this);
				var row = cbox.parent().parent();
				$('input[name="qnt"]', row).val(0);
				cbox.trigger('click');
				cbox.trigger('click');
			});	
			alert('Теперь нажмите закупить');
		})
			.fail(function() {
			console.log( "error" );
		});
	});
}

if(window.top == window) {
	var script = document.createElement("script");
	script.textContent = '(' + run.toString() + ')();';
	document.documentElement.appendChild(script);
}