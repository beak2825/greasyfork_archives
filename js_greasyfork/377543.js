// ==UserScript==
// @name         SpecialZee+
// @namespace    none
// @description  Some handy improvements to the Munzee Specials map.
// @supportURL   https://discord.me/TheShoeStore
// @include      https://www.munzee.com*
// @version      2019.02.08.0859
// @author       technical13
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377543/SpecialZee%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/377543/SpecialZee%2B.meta.js
// ==/UserScript==
// jshint esversion: 6

var isDebug = false;
var intVerbosity = 0;
const ver = '2019.02.08.0859';
const scriptName = 'SpecialZee+ v' + ver;

const intAlertWidth = 760;

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

function countDown( intRawSeconds, boolShort = false ) {
    var intSeconds = parseInt( intRawSeconds );
    var intHours = Math.floor( intSeconds / 3600 );
    intSeconds = intSeconds - ( intHours * 3600 );
    var intMinutes = Math.floor( intSeconds / 60 );
    intSeconds = intSeconds - ( intMinutes * 60 );
    var strCountDown = '';
    if ( boolShort ) {
        strCountDown = ( intHours.toLocaleString() <= 9 ? '0' : '' ) + intHours.toLocaleString() + ':' +
            ( intMinutes.toLocaleString() <= 9 ? '0' : '' ) + intMinutes.toLocaleString() + ':' +
            ( intSeconds.toLocaleString() <= 9 ? '0' : '' ) + intSeconds.toLocaleString();
    } else {
        strCountDown = ( intHours > 0 ? intHours.toLocaleString() +
                        ' hour' + ( intHours === 1 ? '' : 's' ) : '' ) +
            ( intMinutes > 0 ? ( intHours > 0 ? ', ' : '' ) +
             intMinutes.toLocaleString() + ' minute' + ( intMinutes === 1 ? '' : 's' ) : '' ) +
            ( intSeconds > 0 ? ( intHours > 0 || intMinutes > 0 ? ', ' : '' ) +
             intSeconds.toLocaleString() + ' second' + ( intSeconds === 1 ? '' : 's' ) : '' );
    }

    log( 4, 'log', 'countDown( %i ) is returning: %s', intRawSeconds, strCountDown );
    return strCountDown;
}
function nudge( bouncerURL ) {
    var csrfToken = $( 'ul.user-menu.pull-right.dropdown-menu.dropdown-yellow.dropdown-caret.dropdown-close li' ).last()[ 0 ].firstChild.href.split( '?' )[ 1 ].split( '&' )[ 0 ].split( '=' )[ 1 ];
    $.post( bouncerURL.data.mythURL, { csrf_token: csrfToken, nudge: 1 }, function( result ) {
        log( 0, 'info', 'nudge() result: %o', result );
        location.reload();
    } );
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

const address = document.URL.replace( /https?:\/\/www\.munzee\.com\//i, '' ).split( '/' );
const subPage = ( address[ 0 ] || undefined );
log( 1, 'info', 'subPage = %s', subPage );

( function() {
    'use strict';
    log( 0, 'info', 'Script loaded.' );

    // Add the hotlink -- Should be redone with element builder
    $( '.navbar-right' ).append( ' <li class="nav-short tooltip-helper" data-toggle="tooltip" data-placement="bottom" title="Specials"><a href="/specials/"><i class="fa fa-drupal"></i><span class="visible-xs">Specials</span></a></li>' );

    if ( subPage === 'specials' && $( 'div.alert.alert-info' ) && typeof( $( '.expires-at' )[ 0 ] ) !== 'undefined' ) {

        $( 'div.alert.alert-info' )[ 0 ].id = 'alertInfo';
        $( 'div#alertInfo' ).css( { 'top': '70px', 'right': '10px', 'width': intAlertWidth + 'px', 'cursor': 'move', 'position': 'fixed', 'z-index': '49' } );
        $( 'div#alertInfo a' ).css( 'background-color', '#FFCCCC' );
        $( 'div#alertInfo' ).html( $( 'div#alertInfo' ).html().replace( ' is currently at ', ' is at ' ) );
        $( 'div#alertInfo' )[ 0 ].childNodes[ 6 ].textContent = '';

        //Make alert.alert-info draggagle:
        dragElement( document.getElementById( 'alertInfo' ) );
        function dragElement( aI ) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            aI.onmousedown = dragMouseDown;

            function dragMouseDown( e ) {
                e = ( e || window.event );
                e.preventDefault();
                // get the mouse cursor position at startup:
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                // call a function whenever the cursor moves:
                document.onmousemove = elementDrag;
            }

            function elementDrag( e ) {
                e = ( e || window.event );
                e.preventDefault();
                // calculate the new cursor position:
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // set the element's new position:
                aI.style.top = ( aI.offsetTop - pos2 ) + 'px';
                aI.style.left = ( aI.offsetLeft - pos1 ) + 'px';
            }

            function closeDragElement() {
                /* stop moving when mouse button is released:*/
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        var mythURL = $( 'div#alertInfo > a' )[ 0 ].href.replace( 'http://', 'https://' );
        var expiresAt = new Date( $( '.expires-at' )[ 0 ].title );
        var intSecondsUntilExpires = Math.floor( ( expiresAt.valueOf() - ( new Date() ).valueOf() ) / 1000 );
        var strNewExpires = 'in <span id="expires-countdown">' + countDown( intSecondsUntilExpires, true ) + '</span>';
        $( '.expires-at' ).html( strNewExpires );
        var strNudgeButton = '<input id="nudge-button" class="btn btn-danger" type="button" style="padding: 0px 8px !important;" disabled="true" value="Nudge!" /> &nbsp; ';
        $( 'div#alertInfo' ).prepend( strNudgeButton );
        $( 'input#nudge-button' ).on( 'click', { mythURL: mythURL }, nudge );

        setInterval( function() {
            intSecondsUntilExpires = Math.floor( ( expiresAt.valueOf() - ( new Date() ).valueOf() ) / 1000 );

            if ( intSecondsUntilExpires >= 32400 ) {
                $( 'input#nudge-button' ).val( countDown( ( intSecondsUntilExpires - 32400 ), true ) );
            } else if ( intSecondsUntilExpires > 0 && intSecondsUntilExpires < 32400 ) {
                $( 'input#nudge-button' ).prop( 'disabled', false );
                $( 'input#nudge-button' ).removeClass( 'btn-danger' ).addClass( 'green' );
                $( 'input#nudge-button' ).val( 'Nudge!' );
            }

            if ( intSecondsUntilExpires > 0 ) {
                $( 'span#expires-countdown' ).text( countDown( intSecondsUntilExpires, true ) );
            } else {
                location.reload();
            }
        }, 1000 );

        // $( 'div.mapboxgl-popup-content' )[ 0 ].children[ 5 ].href.split( '/' )[ 4 ];// Creature owner name
    } else if ( subPage === 'specials' && $( 'div.alert.alert-info' ) && typeof( $( '.expires-at' )[ 0 ] ) === 'undefined' ) {
        console.warn( 'Bouncer not on the map.' );
        setTimeout( function() {
            location.reload();
        }, 10000 );
    }
} )();