// ==UserScript==
// @name         IBmiles
// @namespace    none
// @version      2018.12.11.1759
// @description  Show miles instead of meters on IB
// @author       technical13
// @supportURL   https://discord.me/TheShoeStore
// @match        https://itembrowser.com/finderbee.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375431/IBmiles.user.js
// @updateURL https://update.greasyfork.org/scripts/375431/IBmiles.meta.js
// ==/UserScript==
// jshint esversion: 6

var isDebug = false;
var intVerbosity = 0;
const ver = '2018.12.11.1759';
const scriptName = 'IBmiles v' + ver;

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
    } else if ( strParamName === 'debug' ) {
        isDebug = toBoolean( arrParam[ 1 ] );
        intVerbosity = 1;
    }
} );

log( 1, 'warn', 'Debug mode is on with verbosity level: %o', intVerbosity );
log( 1, 'groupCollapsed', 'Verbosity options: (click to expand)' );
log( 1, 'log', '1) Summary\n2) Parameters retrieved from URL\n3) Variables set to objParams\n4) Function returns\n9) ALL debugging info and this notice.' );
log( 1, 'groupEnd' );

( function() {
    'use strict';
    log( 0, 'info', 'Script loaded.' );

    if ( !location.hash ) {
        var btnScroll = document.createElement( 'input' );
        btnScroll.type = 'button'; btnScroll.value = 'Scroll';
        btnScroll.setAttribute( 'onClick', 'location.hash = \'#itemgroup\';' );
        $( 'p.completed' ).eq( 2 ).append( document.createTextNode( '  ' ) );
        $( 'p.completed' ).eq( 2 ).append( btnScroll );
    }

    var btnReload = document.createElement( 'input' );
    btnReload.type = 'button'; btnReload.value = 'Refresh';
    btnReload.setAttribute( 'onClick', 'location.reload();' );
    $( 'p.completed' ).eq( 2 ).append( document.createTextNode( '  ' ) );
    $( 'p.completed' ).eq( 2 ).append( btnReload );

    $( 'dd.cost' ).each( ( n, placeDist ) => {
        var dblMeters = placeDist.innerText.match( /.*\((\d*)M\)/i )[ 1 ];
        var dblMiles = ( Math.round( dblMeters * 0.000621371 * 100 ) / 100 );
        placeDist.innerText = placeDist.innerText.replace( dblMeters + 'M', dblMiles + 'mi' );
    } );
} )();