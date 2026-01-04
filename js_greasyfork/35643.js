// ==UserScript==
// @name           Victory: городские проекты
// @version        1.00
// @namespace      virtonomica
// @description    Горпроекты
// @include        http*://*virtonomic*.*/*/main/politics/mayor/*
// @downloadURL https://update.greasyfork.org/scripts/35643/Victory%3A%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%B8%D0%B5%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/35643/Victory%3A%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D1%81%D0%BA%D0%B8%D0%B5%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B.meta.js
// ==/UserScript==

var run = function() {
	var but1 = $('<li>').append('<a>ЗП+размер</a>').click( function() {
		var cityID = window.location.href.match(/\d+/)['0'];
		
		//ЗП
		$.ajax({
			url: 'https://virtonomica.ru/olga/main/politics/money_project/' + cityID + '/3',
			type: "get",
			async: true
		});
		//Размер
		$.ajax({
			url: 'https://virtonomica.ru/olga/main/politics/money_project/' + cityID + '/5',
			type: "get",
			async: true
		});
		
		location.reload();
	});
	var but2 = $('<li>').append('<a>ЗП+размер+ИО</a>').click( function() {
		var cityID = window.location.href.match(/\d+/)['0'];
		
		//Образованность
		$.ajax({
			url: 'https://virtonomica.ru/olga/main/politics/money_project/' + cityID + '/2',
			type: "get",
			async: true
		});
		//ЗП
		$.ajax({
			url: 'https://virtonomica.ru/olga/main/politics/money_project/' + cityID + '/3',
			type: "get",
			async: true
		});
		//Размер
		$.ajax({
			url: 'https://virtonomica.ru/olga/main/politics/money_project/' + cityID + '/5',
			type: "get",
			async: true
		});
		
		location.reload();
	});
	
	$('[class="sel sub"]').after(but2).after(but1);

	
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);