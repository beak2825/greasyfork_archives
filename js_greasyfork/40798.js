// ==UserScript==
// @name           Victory: расширятор
// @version        1.00
// @namespace      victory_rash
// @description    Удобное расширение
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @exclude        http*://*virtonomic*.*/*/main/unit/view/*/*
// @downloadURL https://update.greasyfork.org/scripts/40798/Victory%3A%20%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D1%8F%D1%82%D0%BE%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/40798/Victory%3A%20%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D1%8F%D1%82%D0%BE%D1%80.meta.js
// ==/UserScript==

var run = function() {
	function sendBlocks(unitID,blocks){
		$.ajax({
				url: 'https://virtonomica.ru/olga/window/unit/upgrade/' + unitID,
				async: false,
				type: 'post',
				data: 'upgrade[delta]=' + blocks
		});
	}
	var unitID = location.href.match(/\d+/g)[0];
	var blocks;
	var button = $('<button>').append('Расширение магов').click( function() {
		var blocksToBuild = -100;
		while (blocksToBuild != 0){
			blocks = blocksToBuild;
			if (blocksToBuild >= 1000)
			{
				blocks = 1000;
			}
			if (blocksToBuild <= -1000)
			{
				blocks = -1000;
			}
			blocksToBuild = blocksToBuild - blocks;
			sendBlocks(unitID,blocks);
		}
		location.reload();
	});
	$("#childMenu").after(button);
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);