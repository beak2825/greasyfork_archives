// ==UserScript==
// @name         zeeMailBuddy
// @namespace    none
// @version      2019.12.19.1223
// @description  Draw more attention to waiting messages!
// @author       technical13
// @supportURL   https://discord.me/TheShoeStore
// @match        https://www.munzee.com/*
// @exclude      https://www.munzee.com/print/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393920/zeeMailBuddy.user.js
// @updateURL https://update.greasyfork.org/scripts/393920/zeeMailBuddy.meta.js
// ==/UserScript==
// jshint esversion: 6

var isDebug = false;
var intVerbosity = 0;
const ver = '2019.12.19.1223';
const scriptName = 'zeeMailBuddy v' + ver;

function log( intV, strConsole, strLog, ...arrArgs ) {
    if ( strConsole === undefined ) { strConsole = 'log'; }
    if ( strLog === undefined ) { strLog = '%o'; }
    if ( intVerbosity >= intV && ( strConsole === 'groupEnd' ) ) { console[ strConsole ](); }
    if ( intV === 0 || ( isDebug && intVerbosity >= intV ) ) { console[ strConsole ]( '[%i]: %s: ' + strLog, intV, scriptName, ...arrArgs ); }
}

var address = document.URL.replace( /https?:\/\/www\.munzee\.com\/?/i, '' ).split( '/' );
var isUserPage = false;
if ( address[ 0 ] === 'm' ) {
    isUserPage = true;
    address = address.slice( 1 );
}
const pageUserName = ( address[ 0 ] || undefined );
const subPage = ( address[ 1 ] || undefined );
const subSubPage = ( address[ 2 ] || undefined );
log( 0, 'info', 'pageUserName = %s\tsubPage = %s\tsubSubPage = %s', pageUserName, subPage, subSubPage );
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
    } else if ( strParamName === 'report' ) {
        objParams.report = decodeURIComponent( arrParam[ 1 ] );
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
    log( 0, 'info', 'Script loaded.' );

    try {
        if ( pageUserName === 'flows' && objParams.report ) {
            $( 'textarea#message' ).val( objParams.report );
        } else {
            $( 'head' ).append( '<style type="text/css">' +
                               '.navbar-nav .fa.message-indicator { color: transparent; }' +
                               '.message-indicator:before {' +
                               'display: block;' +
                               'width: 10px;' +
                               'height: 10px;' +
                               'border-radius: 50%;' +
                               'background-color: rgba( 197, 62, 62, .8 );' +
                               'cursor: pointer;' +
                               'animation: pulse-red 2s infinite;' +
                               '}' +
                               '.message-indicator:hover::before {' +
                               'background-color: rgba( 141, 197, 62, .8 );' +
                               'animation: pulse-green 2s infinite;' +
                               '}' +
                               '@keyframes pulse-red { 0% {' +
                               '-moz-box-shadow: 0 0 0 0 rgba( 197, 62, 62, .8 );' +
                               'box-shadow: 0 0 0 0 rgba( 197, 62, 62, .8 );' +
                               '} 70% {' +
                               '-moz-box-shadow: 0 0 0 30px rgba( 197, 62, 62, 0 );' +
                               'box-shadow: 0 0 0 30px rgba( 197, 62, 62, 0 );' +
                               '} 100% {' +
                               '-moz-box-shadow: 0 0 0 0 rgba( 197, 62, 62, 0 );' +
                               'box-shadow: 0 0 0 0 rgba( 197, 62, 62, 0 );' +
                               '}}' +
                               '@keyframes pulse-green { 0% {' +
                               '-moz-box-shadow: 0 0 0 0 rgba( 141, 197, 62, .8 );' +
                               'box-shadow: 0 0 0 0 rgba( 141, 197, 62, .8 );' +
                               '} 70% {' +
                               '-moz-box-shadow: 0 0 0 30px rgba( 141, 197, 62, 0 );' +
                               'box-shadow: 0 0 0 30px rgba( 141, 197, 62, 0 );' +
                               '} 100% {' +
                               '-moz-box-shadow: 0 0 0 0 rgba( 141, 197, 62, 0 );' +
                               'box-shadow: 0 0 0 0 rgba( 141, 197, 62, 0 );' +
                               '}}' +
                               '</style>' );
        }
    } catch ( errScript ) {
        log( 0, 'error', 'Encountered an error: %o', errScript );
        var notifyAuthor = confirm( scriptName + '\n\tERROR!\t\t(details in console)\n\tPlease press [Cancel] and update the script\n\t\tbefore pressing [OK] to notify the author\n\t\tas there may already be a fix!\n\n\t\t\t\tThanks!' );
        if ( notifyAuthor ) {
            window.location.href = 'https://www.munzee.com/flows/?username=technical13&report=' + encodeURIComponent( scriptName + ': ' + window.location.href + '\n' + errScript );
        }
    }
} )();