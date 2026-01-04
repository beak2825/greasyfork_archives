// ==UserScript==
// @name         Refresher
// @namespace    none
// @version      2020.07.16.1823
// @description  Automatically reload the page at ?interval=
// @author       technical13
// @supportURL   https://Discord.me/TheShoeStore
// @match        https://www.munzee.com/m/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407206/Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/407206/Refresher.meta.js
// ==/UserScript==
// jshint esversion: 6

var isDebug = false;
var intVerbosity = 0;
const ver = '2020.07.16.1823';
const scriptName = 'Refresher v' + ver;

function toBoolean( val ) {
	const arrTrue = [ undefined, null, '', true, 'true', 1, '1', 'on', 'yes' ];
	val = ( typeof( val ) === 'string' ? val.toLowerCase() : val );

	log( 4, 'log', 'toBoolean() is returning: %o', ( arrTrue.indexOf( val ) !== -1 ? true : false ) );
	return ( arrTrue.indexOf( val ) !== -1 ? true : false );
}
function log( intV, strConsole, strLog, ...arrArgs ) {
	if ( strConsole === undefined ) { strConsole = 'log'; }
	if ( strLog === undefined ) { strLog = '%o'; }
	if ( intVerbosity >= intV && ( strConsole === 'groupEnd' ) ) { console[ strConsole ](); }
	if ( intV === 0 || ( isDebug && intVerbosity >= intV ) ) { console[ strConsole ]( '[%i]: %s: ' + strLog, intV, scriptName, ...arrArgs ); }
}
const intParamsStart = ( document.URL.indexOf( '?' ) + 1 );
const strParams = document.URL.substr( intParamsStart );
const arrParamSets = strParams.split( '&' );
var objParams = {};
arrParamSets.forEach( function( strParam ) {
	let arrParam = strParam.split( '=' );
	let strParamName = ( arrParam[ 0 ].toLowerCase() || '' );
	if ( strParamName === 'verbosity' ) {
		isDebug = true;
		intVerbosity = ( arrParam[ 1 ] ? ( parseInt( arrParam[ 1 ] ) < 0 ? 0 : ( parseInt( arrParam[ 1 ] ) > 9 ? 9 : parseInt( arrParam[ 1 ] ) ) ) : 9 );
		log( 2, 'info', 'Found parameter `%s` with a value of: %o', strParamName, objParams[ strParamName ] );
	}
	else if ( strParamName === 'debug' ) {
		isDebug = toBoolean( arrParam[ 1 ] );
		intVerbosity = 1;
		log( 2, 'info', 'Found parameter `%s` with a value of: %o', strParamName, objParams[ strParamName ] );
	}
	else if ( strParamName === 'refresh' || strParamName === 'interval' ) {
		objParams.interval = parseInt( arrParam[ 1 ] );
		log( 2, 'info', 'Found parameter `%s` with a value of: %o', strParamName, objParams.interval );
	}
	else {
		log( 2, 'info', 'Found parameter `%s` with a value of: %o', strParamName, arrParam[ 1 ] );
	}
} );

log( 1, 'warn', 'Debug mode is on with verbosity level: %o', intVerbosity );
log( 1, 'groupCollapsed', 'Verbosity options: (click to expand)' );
log( 1, 'log', '1) Summary\n2) Parameters retrieved from URL\n3) Variables set to objParams\n4) Function returns\n9) ALL debugging info and this notice.' );
log( 1, 'groupEnd' );

function createFogOfWar( options = {} ) {
	if ( !options.color ) { options.color = '#000000'; }
	if ( !options.opacity ) { options.opacity = '67%'; }
	if ( !options.zIndex && !options[ 'z-index' ] ) { options.zIndex = '100'; }

	var fogOfWar = document.createElement( 'div' );
	fogOfWar.id = 'fog-of-war';
	fogOfWar.style.width = '100%';
	fogOfWar.style.height = '100%';
	fogOfWar.style.position = 'fixed';
	fogOfWar.style.top = '0px';
	fogOfWar.style.backgroundColor = options.color;
	fogOfWar.style.opacity = options.opacity;
	fogOfWar.style.zIndex = options.zIndex;
	$( 'body' ).append( fogOfWar );
}
function doConfig() {
	createFogOfWar();

	var closeButton = document.createElement( 'button' );
	closeButton.style.padding = '2px 6px';
	closeButton.classList = 'btn btn-danger';
	closeButton.addEventListener( 'click', () => { $( 'div#fog-of-war' ).remove(); configBox.remove(); } );
	closeButton.innerText = 'Cancel';

	var goButton = document.createElement( 'button' );
	goButton.style.padding = '2px 6px';
	goButton.classList = 'btn green';
	goButton.addEventListener( 'click', () => {
		if ( window.location.search === '' ) {
			window.location.assign( window.location.href + '?interval=' + getInterval.value );
		} else {
			window.location.assign( window.location.href.replace( window.location.search, '?interval=' + getInterval.value ) );
		}
	} );
	goButton.innerText = 'Refresh!';

	var getInterval = document.createElement( 'input' );
	getInterval.type = 'number';
	getInterval.style.width = '50px';
	getInterval.style.color = '#000000';
	getInterval.style.textAlign = 'right';
	getInterval.style.paddingRight = '2px';
	getInterval.min = 3;
	getInterval.max = 300;
	getInterval.value = 7;

	var getIntervalBox = document.createElement( 'div' );
	getIntervalBox.style.width = '100%';
	getIntervalBox.style.padding = '10px';
	getIntervalBox.append(
		document.createTextNode( 'Refresh page every ' ), getInterval, document.createTextNode( ' seconds ' ),
		document.createElement( 'br' ), document.createElement( 'br' ),
		goButton, document.createTextNode( ' 	 ' ), closeButton
	);

	var configBox = document.createElement( 'div' );
	configBox.style.width = '320px';
	configBox.style.top = '20%';
	configBox.style.right = '20%';
	configBox.style.position = 'fixed';
	configBox.style.textAlign = 'center';
	configBox.style.fontWeight = 'bold';
	configBox.style.fontSize = 'larger';
	configBox.style.color = '#71B33C';
	configBox.style.backgroundColor = '#000000';
	configBox.style.border = '1px solid #FF00FF';
	configBox.style.zIndex = '250';

	configBox.append( getIntervalBox );

	$( 'body' ).append( configBox );
}

function favTitle( pinImage ) {
	if ( ( new RegExp( '(skyland|treehouse)' ) ).test( pinImage ) ) {
		var intUnicorns = parseInt( pinImage.split( '/' ).pop().split( '.' )[ 0 ].replace( /(skyland|treehouse)/, '0' ) );
		$( 'title' ).text( '(' + intUnicorns + ') ' + $( 'title' ).text() );
	}
	var link = ( document.querySelector( "link[rel*='icon']" ) || document.createElement( 'link' ) );
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = pinImage;
    document.getElementsByTagName( 'head' )[ 0 ].appendChild( link );
}

( function() {
	'use strict';
	log( 0, 'info', 'Script loaded.' );

	favTitle( $( 'img.pin' ).attr( 'src' ) );

	var reloadButton = document.createElement( 'button' );
	reloadButton.classList = 'btn green pull-right';
	reloadButton.style.marginBottom = '10px';
	reloadButton.title = 'Click to reload now!';
	reloadButton.addEventListener( 'click', () => { window.location.reload(); } );

	if ( $.isNumeric( objParams.interval ) ) {
		$( 'p.status-date' )[ 0 ].style.color = '#000000';
		$( 'p.status-date' )[ 0 ].style.fontWeight = 'bold';

		reloadButton.id = 'Refresher-' + objParams.interval;
		reloadButton.style.margin = '0px 3px 10px 0px';
		reloadButton.innerText = 'Reloading in: ' + ( objParams.interval - 1 ) + ' second' + ( objParams.interval === 1 ? '' : 's' );

		var stopButton = document.createElement( 'button' );
		stopButton.id = 'Refresher-stop';
		stopButton.classList = 'btn btn-danger pull-right';
		stopButton.style.margin = '0px 0px 10px 3px';
		stopButton.title = 'Click to stop reloading!';
		stopButton.addEventListener( 'click', () => {
			window.location.assign( window.location.href.replace( window.location.search, '' ) );
		} );
		stopButton.innerText = '×';

		$( 'div#munzee-name' ).prepend( stopButton, reloadButton );

		var doReload = objParams.interval;
		window.setInterval( () => {
			if ( reloadButton.innerText !== 'Reloading now!' ) {
				var strLastSecond = reloadButton.innerText.match( /Reloading in: ([\d]+) seconds?/i )[ 1 ];
				var intLastSecond = parseInt( strLastSecond );
				var intNextSecond = intLastSecond - 1; doReload = intNextSecond;
				if ( intNextSecond === 0 ) { reloadButton.innerText = 'Reloading now!'; }
				else if ( intNextSecond === 1 ) { reloadButton.innerText = 'Reloading in: 1 second'; }
				else { reloadButton.innerText = reloadButton.innerText.replace( strLastSecond, intNextSecond ); }
			}
			else if ( doReload <= 0 ) { window.location.reload(); }
		}, 1000 );
	}
	else {
		reloadButton.style.margin = '0px 0px 10px 3px';
		reloadButton.style.color = '#000000';
		reloadButton.style.fontWeight = 'bolder';
		reloadButton.innerText = '⟳';

		var configButton = document.createElement( 'button' );
		configButton.id = 'Refresher-Config';
		configButton.classList = 'btn btn-warning pull-right';
		configButton.style.color = '#000000';
		configButton.style.fontWeight = 'bold';
		configButton.style.margin = '0px 3px 10px 0px';
		configButton.title = 'Click to start automatic refresh of this page!';
		configButton.addEventListener( 'click', () => { doConfig(); } );
		configButton.innerText = 'Refresher!?';

		$( 'div#munzee-name' ).prepend( reloadButton, configButton );
	}
} )();