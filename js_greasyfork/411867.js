// ==UserScript==
// @name			AliExpress TimeCounter
// @version			2020.09.25
// @description		Counting the time between operations
// @description:ru	Отсчёт времени между операциями
// @match			http*://track.aliexpress.com/logisticsdetail.htm?tradeId=*
// @author			Rainbow-Spike
// @namespace		https://greasyfork.org/users/7568
// @homepage		https://greasyfork.org/ru/users/7568-dr-yukon
// @icon			https://www.google.com/s2/favicons?domain=track.aliexpress.com
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/411867/AliExpress%20TimeCounter.user.js
// @updateURL https://update.greasyfork.org/scripts/411867/AliExpress%20TimeCounter.meta.js
// ==/UserScript==

// I am not a very well-fed unemployed person and will not refuse a little financial help. Webmoney Z655896854317 R666641168455, big thanks in advance

var line = document.querySelectorAll ( '.ship-steps .time' ),
	first = document.querySelector ( '.recevier-info-con' ),
	addr = first.firstChild,
	now = document.createElement ( 'div' ),
	vdate = [],
	ru = ( headerConfig.locale == 'ru_RU' ? 1 : 0 ),
	weektext = '',
	i, j, k, day, week, hour, min, text;

now.style = 'width: 184px; text-align: right;';
addr.style.marginLeft= '15px';
first.insertBefore ( now, addr );

function action ( ) {
	vdate.push ( Math.floor ( Date.now ( ) / 60000 ) );
	for ( i = 0; i < line.length; i++ ) vdate.push ( Date.parse ( line [ i ].innerHTML ) / 60000 );
	for ( j = 0; j < line.length; j++ ) {
		vdate [ j ] = vdate [ j ] - vdate [ j + 1 ];
		day = Math.floor ( vdate [ j ] / 1440 );
		week = Math.floor ( day / 7 );
		hour = Math.floor ( vdate [ j ] / 60 - day * 24 );
		min = Math.floor ( vdate [ j ] % 60 );
		text = '<br><br><b>'
			+ ( ( day != 0 ) ? ( day + ' ' + ( ru ? 'д' : 'd' ) + ' ' ) : '' )
			+ ( ( hour != 0 ) ? ( hour + ' ' + ( ru ? 'ч' : 'h' ) + ' ' ) : '' )
			+ ( ( min != 0 ) ? ( min + ' ' + ( ru ? 'м' : 'm' ) + ' ' ) : '' )
			+ ( ( vdate [ j ] == 0 ) ? ( '🡅🡅' ) : '' );
		if ( j == 0 ) {
			for ( k = 0; k < week; k++ ) weektext += '❗';
			now.innerHTML += text + weektext + '</b>';
		} else {
			line [ j - 1 ].innerHTML += text + '🡅</b>';
		}
	}
}
setTimeout ( action, 100 );
