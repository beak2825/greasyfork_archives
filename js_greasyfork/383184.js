// ==UserScript==
// @name         Eeznum Dark
// @namespace    none
// @version      2019.05.17.1142
// @description  A dark theme for Eeznum
// @author       technical13
// @supportURL   https://discord.me/TheShoeStore
// @match        http://eeznum.co.uk/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/383184/Eeznum%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/383184/Eeznum%20Dark.meta.js
// ==/UserScript==
// jshint esversion: 6

var isDebug = false;
var intVerbosity = 0;
const ver = '2019.05.17.1142';
const scriptName = 'Eeznum Dark v' + ver;

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
        isDebug = toBoolean( arrParam[ 1 ] );
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

function toBoolean( val ) {
    const arrTrue = [ undefined, null, '', true, 'true', 1, '1', 'on', 'yes' ];
    val = ( typeof( val ) === 'string' ? val.toLowerCase() : val );

    log( 4, 'log', 'toBoolean() is returning: %o', ( arrTrue.indexOf( val ) !== -1 ? true : false ) );
    return ( arrTrue.indexOf( val ) !== -1 ? true : false );
}

( function() {
    'use strict';
    log( 0, 'info', 'Loaded jQuery ver:%o', jQuery().jquery );
    log( 0, 'info', 'Script loaded.' );

    $( 'body' ).css( {
        'background-color': '#194910',
        'color': '#000000'
    } );
    $( 'h3' ).css(
        'color', '#000000'
    );
    $( '#wrapper' ).css( {
        'background-color': '#295920',
        'color': '#000000'
    } );
    $( '.bodytext' ).css(
        'color', '#000000'
    );
    $( 'A:link' ).css(
        'color', '#000000'
    );
    $( 'tr.row_hosting, tr.row_hosting a' ).css( {
        'background-color': '#194910',
        'color': '#E0F2E0'
    } );
    $( 'p > img' ).css(
        'border', '5px solid #FFFFFF'
    );
} )();