// ==UserScript==
// @name        Transalvador Improver
// @namespace   none
// @version     1.0.16
// @author	Roger Pestana (rogerlima@outlook.com)
// @grant       none
// @license	GNU General Public License v3.0
// @description Adiciona a quantidade de horários e a frequência média entre as linhas no site da Transalvador; possibilita a busca pelas linhas apertando ENTER; faz com que apareça o número das linhas filhas ao exibir o resultado da pesquisa; corrige acentuação no nome das linhas ao abrir o quadro de horários.
// @include	*http://www.transalvadorantigo.salvador.ba.gov.br/*
// @date	29/mar/2014
// @rewrite	16/apr/2016
// @update	24/oct/2021
// @downloadURL https://update.greasyfork.org/scripts/20979/Transalvador%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/20979/Transalvador%20Improver.meta.js
// ==/UserScript==

/* jshint expr: true, laxbreak: true, esversion: 6, multistr: true */
/* global $, buscar_linha, buscar_codigo, change_busca */

( function() {
'use strict';

// CSS
$qs( 'head' ).innerHTML += '<style>\
	.schedule_float { float: right; }\
	.schedule_padding { padding: 0px 5px 0px 0px; }\
	#schedule_amount, #schedule_average { font-weight: bold; font-family: Tahoma; }\
</style>';

// Format the hours
// @param {number} Time in seconds
// @return {string}
function format_time( time ) {
	let hour = Math.floor( time / 60 ),
		minutes = Math.floor( time % 60 );

	return ( `${ ( hour < 10 && '0' ) + hour }h` ) + ( `${ ( minutes < 10 && '0' ) + minutes }m` );
}

// document.querySelector reduction
function $qs( el ) {
	return document.querySelector( el );
}

// document.querySelectorAll reduction
function $qsa( el ) {
	return document.querySelectorAll( el );
}

// Shows the number of trips and the averages between them
// @return {undefined}
function schedule_features( route_name ) {
	let hour_part, prev_minutes, current_minutes, average_increment,
		hours_day = 0,
		hours_afternoon = 0,
		hours_night = 0,
		hours_total = 0,
		average_day = 0,
		average_afternoon = 0,
		average_night = 0,
		average_total = 0;

	if ( route_name )
		document.querySelectorAll( '.tit01 .tit02' )[ 0 ].innerHTML = route_name;

	if ( !$qsa( '#schedule_amount' ).length ) {
		$qsa( '.tit02' )[ 0 ].innerHTML += '<div id="schedule_amount" class="schedule_float schedule_padding">Quantidade de viagens</div>';

		$qsa( '.tit02' )[ 1 ].innerHTML +=
			'<div id="schedule_amount_total_text" class="schedule_float schedule_padding"> - Total: <div id="schedule_amount_total" class="schedule_float"></div></div>\
			 <div id="schedule_amount_night_text" class="schedule_float"> - Noite: <div id="schedule_amount_night" class="schedule_float"></div></div>\
			 <div id="schedule_amount_afternoon_text" class="schedule_float"> - Tarde: <div id="schedule_amount_afternoon" class="schedule_float"></div></div>\
			 <div id="schedule_amount_day_text" class="schedule_float">Manhã: <div id="schedule_amount_day" class="schedule_float"></div></div>';

		$qsa( '.tit02' )[ 1 ].parentNode.parentNode.nextElementSibling.innerHTML =
			'<div id="schedule_average" class="schedule_float schedule_padding">Intervalo médio entre as saídas</div><br />\
			<div id="schedule_average_total_text" class="schedule_float schedule_padding"> - Geral: <div id="schedule_average_total" class="schedule_float"></div></div>\
			<div id="schedule_average_night_text" class="schedule_float"> - Noite: <div id="schedule_average_night" class="schedule_float"></div></div>\
			<div id="schedule_average_afternoon_text" class="schedule_float"> - Tarde: <div id="schedule_average_afternoon" class="schedule_float"></div></div>\
			<div id="schedule_average_day_text" class="schedule_float">Manhã: <div id="schedule_average_day" class="schedule_float"></div></div>';
	}

	// Gets the data
	$qsa( '#content table' )[ 0 ].querySelectorAll( 'td div' ).forEach( function( currentEl, i ) {
		if ( currentEl.innerHTML.search( /\d{2}:\d{2}/ ) === -1 )
			return;

		hour_part = currentEl.innerHTML.split( ':' );
		current_minutes = parseInt( hour_part[ 0 ] ) * 60 + parseInt( hour_part[ 1 ] );

		if ( i === 3 || !prev_minutes )
			prev_minutes = current_minutes;

		if ( i > 3 ) {
			average_increment = current_minutes < prev_minutes ? 60 - hour_part[ 1 ] + current_minutes : current_minutes - prev_minutes;
			prev_minutes = current_minutes;

			if ( currentEl.parentNode.getAttribute( 'bgcolor' ) === '#6699CC' )
				average_day += average_increment;
			else if ( currentEl.parentNode.getAttribute( 'bgcolor' ) === '#eaedf4' )
				average_afternoon += average_increment;
			else
				average_night += average_increment;
		}

		if ( currentEl.parentNode.getAttribute( 'bgcolor' ) === '#6699CC' )
			hours_day++;
		else if ( currentEl.parentNode.getAttribute( 'bgcolor' ) === '#eaedf4' )
			hours_afternoon++;
		else
			hours_night++;
	} );

	// Sets the averages
	hours_total = ( hours_day + hours_afternoon + hours_night );
	average_total = average_day + average_afternoon + average_night;
	average_total = ( hours_total > 2 ) ? average_total / ( hours_total - 1 ) : average_total;
	average_day = ( hours_day > 2 ) ? average_day / ( hours_day - 1 ) : average_day;
	average_afternoon = ( hours_afternoon > 2 ) ? average_afternoon / hours_afternoon : ( ( average_afternoon === average_total ) ? average_afternoon : average_afternoon / 2 );
	average_night = ( hours_night > 2 ) ? average_night / hours_night : ( ( average_night === average_total ) ? average_night : average_night / 2 );

	// Shows the data on screen
	$qs( '#schedule_amount_day' ).innerHTML = hours_day;
	$qs( '#schedule_amount_afternoon' ).innerHTML = hours_afternoon;
	$qs( '#schedule_amount_night' ).innerHTML = hours_night;
	$qs( '#schedule_amount_total' ).innerHTML = hours_total < 0 ? 0 : hours_total;
	$qs( '#schedule_average_day' ).innerHTML = format_time( average_day );
	$qs( '#schedule_average_afternoon' ).innerHTML = format_time( average_afternoon );
	$qs( '#schedule_average_night' ).innerHTML = format_time( average_night );
	$qs( '#schedule_average_total' ).innerHTML = format_time( average_total );
}

// Puts the child track number in data callback
// @return {undefined}
function child_set() {
	let $this, childcode;

	// Waits the data loads
	setInterval( function() {
		$( '#dados tbody tr' ).each( function( index ) {
			if ( index > 0 ) {
				$this = $( this ).find( 'td' )[ 0 ];
				childcode = /\'(\d{2})\'/.exec( $( this ).html() )[ 1 ];
				$this.textContent = $this.textContent.substr( 0, 4 ) + ( childcode !== '00' ? '-' + childcode : '' );
			}
		} );
	}, 10 );
}

// Main function
// @return {undefined}
function main() {
	let wait_load, wait_modal_load, route_name;

	// Enables search with ENTER button
	$( '#itemBusca' ).change( function() {
		child_set();

		if ( $( this ).val() == '3' ) {
			$( document ).on( 'keydown click', '#codigoBusca, #consulta_linha img', function( event ) {
				if ( ( event.type === 'keydown' && event.key === "Enter" )
					|| ( event.type === 'click' && event.target.tagName === 'IMG' )
				) {
					event.preventDefault();
					buscar_codigo( '3' );
				}
			} );
		}

		if ( $( this ).val() == '4' ) {
			$( document ).on( 'keydown', '#linhaBusca', function( event ) {
				if ( ( event.type === 'keydown' && event.key === "Enter" )
					|| ( event.type === 'click' && event.target.tagName === 'IMG' )
				) {
					event.preventDefault();
					buscar_linha();
				}
			} );
		}
	} );

	$( document ).on( 'click', 'img[alt="Horário"]', function() {
		route_name = $( this ).parent().parent().parent().find( 'td' ).eq( 1 ).text();
		wait_load = setInterval( function() {
			if ( !!$( '#cboxContent #content' ).length ) {
				clearInterval( wait_load );
				schedule_features( route_name );
			}
		}, 10 );
	} );

	$( document ).on( 'click', '#frmHorario img[height="20"]', function() {
		route_name = $( this ).parent().parent().parent().find( 'td' ).eq( 1 ).text();
		wait_modal_load = setInterval( function() {
			if ( !$( 'img[src="images/load.gif"]' ).length ) {
				clearInterval( wait_modal_load );
				schedule_features( route_name );
			}
		}, 10 );
	} );

	$( '#itemBusca' ).find( 'option[value="3"]' ).attr( 'selected', true ).trigger( 'change' );
	change_busca();
}

// Inits
if ( location.href === 'http://www.transalvadorantigo.salvador.ba.gov.br/homologacao/?pagina=onibus/onibus' )
	window.onload = main;
else
	window.onload = schedule_features;

}() );