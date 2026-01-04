// ==UserScript==
// @name        Moovit Improver
// @namespace   none
// @version     1.0.0
// @author	Roger Pestana (rogerlima@outlook.com)
// @grant       none
// @license	GNU General Public License v3.0
// @description Adiciona a quantidade de horários e a frequência média entre as viagens ao buscar linhas no Moovit (https://moovitapp.com). Baseado no script Transalvador Improver.
// @include	*moovitapp.com/index/pt-br/transporte_p*time*
// @date	14/jan/2024
// @downloadURL https://update.greasyfork.org/scripts/484869/Moovit%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/484869/Moovit%20Improver.meta.js
// ==/UserScript==

/* jshint laxbreak: true, esversion: 6 */

( function( window ) {
'use strict';

function $qsa( el ) {
	return document.querySelectorAll( el );
}

function format_time( time ) {
	let hour = Math.floor( time / 60 ),
		minutes = Math.floor( time % 60 );

	return ( time < 60 ) ? parseInt( time ) + 'm' : ( `${ ( hour < 10 && '0' ) + hour }h` ) + ( `${ ( minutes < 10 && '0' ) + minutes }m` );
}

// Main function
// @return {undefined}
function moovit_improver() {
	let i, j, hour_diff, hour_part,
		trips = new Map();
	const HOURS_TBODY = '.table-wrapper table tbody td';
	const HOURS_THEAD = '.table-wrapper table thead th';

	for ( i = 0; i < $qsa( HOURS_THEAD ).length; i++ )
		trips.set( i, { list: [], average: [], average_sum: 0 } );
	
	const HOURS_THEAD_COUNT = trips.size;

	// Gets the data
	$qsa( HOURS_TBODY ).forEach( ( hour, index ) => {
		if ( hour.textContent === '-' )
			return;
		
		hour_part = hour.textContent.split( ':' );
		trips.get( index % HOURS_THEAD_COUNT ).list.push( parseInt( hour_part[ 0 ] ) + ( parseInt( hour_part[ 1 ] ) / 60 ) );
	} );

	// Gets the average between trips
	for ( i = 0; i < trips.size; i++ ) {
		for ( j = 0; j < trips.get( i ).list.length - 1; j++ ) {
			hour_diff = parseFloat( parseFloat( ( trips.get( i ).list[ j + 1 ] - trips.get( i ).list[ j ] ) * 60 ).toPrecision( 4 ) );
			trips.get( i ).average_sum += hour_diff;
			trips.get( i ).average.push( hour_diff );
		}

		trips.get( i ).average_sum = trips.get( i ).average_sum / trips.get( i ).average.length;
	}

	// Shows the data
	$qsa( HOURS_THEAD ).forEach(
		( hour_block, index ) => hour_block.innerHTML +=
			`<br /><small>Viagens: ${ trips.get( ( index % HOURS_THEAD_COUNT ) ).list.length }`
			+ `<br />Média entre as viagens: ${ format_time( trips.get( ( index % HOURS_THEAD_COUNT ) ).average_sum ) }</small>`
	);
}

// Inits
if ( location.href.indexOf( 'https://moovitapp.com/index/pt-br/transporte_p%C3%BAblico-time-' ) !== -1 )
	window.onload = moovit_improver;
}( window ) );