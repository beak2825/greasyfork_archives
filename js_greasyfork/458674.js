// ==UserScript==
// @name			Direct Image Link Gelbooru
// @version			2024.11.04
// @description		Переработка переработки переработки Zendillo's Gelbooru Thumb to Image script. Показывает прямые ссылки под эскизами
// @match			https://gelbooru.com/*
// @icon			https://www.google.com/s2/favicons?domain=gelbooru.com
// @author			Rainbow-Spike
// @namespace		https://greasyfork.org/users/7568
// @homepage		https://greasyfork.org/ru/users/7568-dr-yukon
// @grant			none

// @downloadURL https://update.greasyfork.org/scripts/458674/Direct%20Image%20Link%20Gelbooru.user.js
// @updateURL https://update.greasyfork.org/scripts/458674/Direct%20Image%20Link%20Gelbooru.meta.js
// ==/UserScript==

if (typeof resizeTransition === "function" ) { resizeTransition() || ''; return false; } /* always full images */

var lever = 1,
	images = document . querySelectorAll ( ".thumbnail-preview img" ),
	topNode = document . querySelector ( '.navSubmenu' ),
	topInsert = document . createElement ( 'div' ),
	directLink,
	imgSrc = [ ], x;

function creLink ( i ) {
	directLink = document . createElement ( lever ? 'a' : 'span' );
	if ( lever ) directLink . setAttribute ( 'href', imgSrc [ i ] );
	directLink . innerHTML = imgSrc [ i ] + '\n';
	topInsert . appendChild ( directLink );
	topInsert . appendChild ( document . createElement ( 'br' ) );
};

for ( x = 0; x <= images . length; x++ ) {
	if ( images [ x ] != undefined ) {
		if ( lever ) {
			imgSrc [ 0 ] = images [ x ] . getAttribute ( 'src' ) . split ( '?' ) [ 0 ] . replace ( "thumbnails", "images" ) . replace ( "thumbnail_", "" );
			if ( images [ x ] . className == 'webm' ) {
				imgSrc [ 0 ] = imgSrc [ 0 ] . replace ( "img3", "video-cdn3" ) . replace ( ".jpg", ".mp4" ); creLink ( 0 );
			} else {
				if ( ! /animated_gif/ . test ( images [ x ] . title ) ) {
					imgSrc [ 1 ] = imgSrc [ 0 ] . replace ( ".jpg", ".png" ); creLink ( 1 );
					imgSrc [ 2 ] = imgSrc [ 0 ] . replace ( ".jpg", ".jpeg" ); creLink ( 2 );
				};
				imgSrc [ 0 ] = imgSrc [ 0 ] . replace ( ".jpg", ".gif" ); creLink ( 0 );
			};
		} else {
			imgSrc [0] = images [ x ] . getAttribute ( 'src' ) . split ( 'nail_' ) [ 1 ] . split ( '.' ) [ 0 ];
			creLink ( 0 );
		};
		imgSrc = [ ];
	};
};

topInsert . style = 'display: inline-block; column-gap: 3px; column-count: 7; font-size: 40%; line-height: .25em; max-height: 200px; overflow: auto;';
topNode . appendChild ( topInsert );

function selBlock ( name ) {
	var rng = document . createRange ( );
	rng . selectNode ( name );
	var sel = window . getSelection ( );
	sel . removeAllRanges ( );
	sel . addRange ( rng );
}
selBlock ( topInsert );