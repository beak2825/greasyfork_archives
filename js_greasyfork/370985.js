// ==UserScript==
// @name           Victory: удаление предприятий
// @version        1.00
// @namespace      victory_unit_delete
// @description    Из названия уже всё ясно
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @exclude        http*://*virtonomic*.*/*/main/unit/view/*/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/370985/Victory%3A%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/370985/Victory%3A%20%D1%83%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D0%B9.meta.js
// ==/UserScript==

(function () {
	function funcUnitID(){
		return window.location.href.match(/\d+/)['0'];
	}
	
	function funcCloseUnit(unitID){
		$.ajax({
			url: 'https://virtonomica.ru/olga/window/unit/close/' + unitID,
			async: false,
			type: 'post',
			data: 'close_unit=Закрыть+предприятие'
		});
		location.reload();
	}
	
	var button = $('<button>').append('Удалить').click( function() {
		var unitID = funcUnitID();
		funcCloseUnit(unitID);
	});
	
	$("#childMenu").after(button);
	
})(unsafeWindow);