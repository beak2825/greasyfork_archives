// ==UserScript==
// @name			PrimPogoda Humidex
// @version			2020.10.23
// @description		Баллы Humidex для Gismeteo
// @include			http*://*primpogoda.ru/*.now
// @icon			https://www.google.com/s2/favicons?domain=primpogoda.ru
// @author			Rainbow-Spike
// @namespace		https://greasyfork.org/users/7568
// @homepage		https://greasyfork.org/ru/users/7568-dr-yukon
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/405301/PrimPogoda%20Humidex.user.js
// @updateURL https://update.greasyfork.org/scripts/405301/PrimPogoda%20Humidex.meta.js
// ==/UserScript==

var cells = document.querySelectorAll ( '.forecast .columns' ),
	temp = cells [ 4 ].querySelector ( 'p' ).innerHTML.split ( '°' ) [ 0 ].replace ( '+', '' ).replace ( '−', '-' ) * 1,
	humd = cells [ 6 ].querySelector ( 'p' ).innerHTML.replace ( '%', '' ) * 1,
	humidex = Math.round ( temp + 5 / 9 * ( ( 6.112 * Math.pow ( 10, 7.5 * temp / ( 237.7 + temp ) ) * humd / 100 ) - 10 ) ),
	color,
	text;

function paint ( h ) {
	switch ( true ) {
		case h <= 0:
			color = 'violet';
			text = 'Нет дискомфорта';
			break;
		case h <= 10:
			color = 'blue';
			text = 'Нет дискомфорта';
			break;
		case h <= 20:
			color = 'darkturquoise';
			text = 'Нет дискомфорта';
			break;
		case h <= 30:
			color = 'green';
			text = 'Нет дискомфорта';
			break;
		case h <= 40:
			color = 'gold';
			text = 'Некоторый дискомфорт';
			break;
		case h <= 45:
			color = 'orange';
			text = 'Большой дискомфорт; избегать усилий';
			break;
		case h < 54:
			color = 'red';
			text = 'Опасно; возможен тепловой удар';
			break;
		case h >= 54:
			color = 'darkred';
			text = 'Опасно; возможен тепловой удар';
			break;
		default:
			color = 'black';
			text = '-';
			break;
	}
}

paint ( humidex );
cells [ 5 ].querySelector ( 'p' ).innerHTML = '<span style = "font-weight: bold; color: ' + color + '" title = "' + text + '">' + humidex + '</span> баллов Humidex';
