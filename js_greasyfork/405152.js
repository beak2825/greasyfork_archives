// ==UserScript==
// @name			GisMeteo Humidex & WindCold
// @version			2021.10.02
// @description		Баллы Humidex и ветрохолода для Gismeteo
// @include			http*://*gismeteo.*
// @icon			https://www.google.com/s2/favicons?domain=gismeteo.ru
// @author			Rainbow-Spike
// @namespace		https://greasyfork.org/users/7568
// @homepage		https://greasyfork.org/ru/users/7568-dr-yukon
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/405152/GisMeteo%20Humidex%20%20WindCold.user.js
// @updateURL https://update.greasyfork.org/scripts/405152/GisMeteo%20Humidex%20%20WindCold.meta.js
// ==/UserScript==

var t = document . querySelectorAll ( '.w_temperature .value > .unit_temperature_c' ),
	t3 = Array . prototype . slice . call ( document . querySelectorAll ( '.page-3-days .chart__temperatureByDay .value > .unit_temperature_c' ) ) . slice ( 0, 12 ),
	tmax = document . querySelectorAll ( '.w_temperature .maxt .unit_temperature_c' ),
	tmin = document . querySelectorAll ( '.w_temperature .mint .unit_temperature_c' ),
	tmid = document . querySelectorAll ( '.w_temperature-avg .unit_temperature_c' ),
	hums = document . querySelectorAll ( 'div[data-widget-id = humidity] .w-humidity' ),
	speeds = document . querySelectorAll ( '.widget__row_wind .w_wind span.unit_wind_km_h' ),
	temp_txt, temp, hum, speed, hdex, wcold,
	digit = 1;

function on_screen ( par ) {
	return ( par > 0 ? '+' : '' ) + par . toFixed ( digit ) . replace ( '-', '−' ) . replace ( '.', ',' );
}

function work ( temps ) {
	for ( var i = 0; i < temps . length; i++ ) {
		temp_txt = ( temps [ i ] !== undefined ) ? temps [ i ] . innerHTML : '0';
		temp = temp_txt . replace ( '+', '' ) . replace ( '−', '-' ) * 1;
		hum = ( hums [ i ] !== undefined ) ? hums [ i ] . innerHTML * 1 : 0;
		speed = ( speeds [ i ] !== undefined ) ? Math . pow ( speeds [ i ] . innerHTML, 0.16 ) : 0;
		hdex = ( 5 / 9 * ( ( 0.06112 * hum * Math . pow ( 10, ( 7.5 * temp / ( 237.7 + temp ) ) ) ) - 10 ) + temp );
		wcold = ( ( 13.12 + 0.6215 * temp - 11.37 * speed + 0.3965 * temp * speed ) - temp );
		if ( temps [ i ] . innerHTML != null ) temps [ i ] . innerHTML += '<span class = "adds">H' + on_screen ( hdex ) + ' W' + ( speed !== 0 ? on_screen ( wcold ) : temp_txt ) + '</span>';
	}
}

work ( t );
work ( t3 );
work ( tmax );
work ( tmin );
work ( tmid );