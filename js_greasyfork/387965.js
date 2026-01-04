// ==UserScript==
// @name         TempZee
// @namespace    none
// @version      2019.12.19.1223
// @description  Give a warning when you have undeployed temporary virtual Munzees, so they don't expire before deployed
// @supportURL   https://discord.me/TheShoeStore
// @author       technical13
// @match        https://www.munzee.com/*
// @exclude      https://www.munzee.com/print/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387965/TempZee.user.js
// @updateURL https://update.greasyfork.org/scripts/387965/TempZee.meta.js
// ==/UserScript==
// jshint esversion: 6

const ver = '2019.12.19.1223';
var isDebug = false;
var intVerbosity = 0;
const scriptName = 'TempZee v' + ver;

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
var objParams = { unknownParams: [] };
arrParamSets.forEach( function( strParam ) {
    let arrParam = strParam.split( '=' );
    let strParamName = ( arrParam[ 0 ].toLowerCase() || '' );
    if ( strParamName === 'verbosity' ) {
        isDebug = true;
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

const bypassCORsURL = 'https://cors-anywhere.herokuapp.com/';

function createLoader( intTemporaries ) {
    $( 'head' ).append( '<style type="text/css">' +
                       '@keyframes animate {' +
                       '    0% { box-shadow: 0 0 0 0 rgba( 109, 255, 74, .7 ), 0 0 0 0 rgba( 255, 109, 74, .7 ); }' +
                       '   40% { box-shadow: 0 0 0 0 rgba( 109, 255, 74, .7 ), 0 0 0 25px rgba( 255, 109, 74, 0 ); }' +
                       '   80% { box-shadow: 0 0 0 30px rgba( 109, 255, 74, 0 ), 0 0 0 25px rgba( 255, 109, 74, 0 ); }' +
                       '  100% { box-shadow: 0 0 0 30px rgba( 109, 255, 74, 0 ), 0 0 0 0 rgba( 255, 109, 74, 0 ); }' +
                       '}' +
                       'div#loader {' +// 'border: 1px solid #00F;' +
                       '  margin: 1em auto;' +
                       '  width: 50px;' +
                       '  height: 50px;' +
                       '  background-color: transparent;' +
                       '}' +
                       'div#pulse {' +// 'border: 1px solid #0F0;' +
                       '  width: 50px;' +
                       '  height: 50px;' +
                       '  background-color: transparent;' +// '  background-color: #FF0000;' +
                       //'  border-radius: 50%' +
                       '  text-align: center;' +
                       '  line-height: 25px;' +
                       '  animation: animate 2s linear infinite;' +
                       '}' +
                       '</style>' );

    var objLoading = document.createElement( 'div' );
    objLoading.setAttribute( 'id', 'loader' );
    var objPulse = document.createElement( 'div' );
    objPulse.setAttribute( 'id', 'pulse' );
    var objImage = document.createElement( 'img' );
    objImage.setAttribute( 'src', 'http://munzee.global.ssl.fastly.net/images/pins/eventindicator.png' );
    objImage.setAttribute( 'style', 'width: 50px; height: 50px;' );
    objPulse.append( objImage );
    objLoading.append( objPulse );
    $( 'ul.pager:last()' ).after( objLoading );
}

( function() {
    'use strict';
    log( 0, 'info', 'Script loaded.' );

    var username = '',
        isPremium = false,
        isLoggedIn = false;
    try { isLoggedIn = ( user_id ? true : false ); } catch ( isNotLoggedIn ) { isLoggedIn = false; }

    try {
        if ( pageUserName === 'flows' && objParams.report ) {
            $( 'textarea#message' ).val( objParams.report );
        } else if ( isLoggedIn ) {
            username = $( 'li.user > ul.user-menu > li > a' )[ 0 ].href.split( '/' )[ 4 ];
            isPremium = ( $( 'div.premium' )[0].outerText === 'Become Premium' ? false : true );
            if ( isPremium ) {
                var undeployedTemporariesURL = 'https://www.munzee.com/m/' + username + '/undeploys/0/type/1245';
                $.ajax( { url: undeployedTemporariesURL, success: function( data ) {
                    var intTemporaries = $( data ).find( '#munzee-holder' ).children().length;console.log('createLoader( %i );',intTemporaries);createLoader( intTemporaries );
                    if ( intTemporaries > 0 && document.URL !== undeployedTemporariesURL ) {
                        $( 'div.navbar-fixed-top' ).after( '<div id="tempNotice" class="alert alert-warning" style="position: ' +
                                                          ( navigator.vendor.startsWith( 'Apple' ) ? '-webkit-sticky' : 'sticky' ) +
                                                          '; top: 68px; left: 7.5%; width: 85%; z-index: 49; text-align: center;" role="alert">' +
                                                          '<div style="float: right; cursor: url(\'http://icons.iconarchive.com/icons/custom-icon-design/mono-general-4/32/trash-icon.png\'), auto;" onclick="document.getElementById(\'tempNotice\').style.display=\'none\'">&#10006</div>' +
                                                          'I found ' + intTemporaries + ' undeployed temporary virtuals! <wbr>' +
                                                          '<a href="' + undeployedTemporariesURL + '" target="_blank">' +
                                                          'Open your undeployed temporary virtual list in a new tab.</a></div>' );
                    }
                    else if ( intTemporaries > 0 && document.URL === undeployedTemporariesURL ) {
                        console.log('createLoader( %i );',intTemporaries);createLoader( intTemporaries );
                        var arrCurrEvents = [];
                        var objCurrEvents = {};
                        $.ajax( { url: bypassCORsURL + 'https://calendar.munzee.com/', success: function( events ) {
                            var domHTML = $( events )[ 42 ].innerHTML;
                            var intStart = ( domHTML.indexOf( 'events: ' ) + 8 );
                            var objFullCal = domHTML.substr( intStart, ( domHTML.indexOf( 'eventRender:' ) - intStart ) )
                            .replace( /,\s+\],\s+$/, ']' ).replace( /([\n\r\t]|\s{2,})/g, '' ).replace( /''/g, '""' )
                            .replace( /([^\\])'/g, '$1"' ).replace( /\\'/g, "'" ).replace( /id:/, '"id":' )
                            .replace( /([,\{] ?)(id|title|start|end|url|className|location|time|attendants):/g, '$1"$2":' );
                            var objEvents = JSON.parse( objFullCal );
                            arrCurrEvents = objEvents.filter( event => {
                                let intStartIn = ( new Date( event.start ) ).valueOf() - Date.now();
                                let intEndIn = ( new Date( event.end ) ).valueOf() - Date.now();
                                if ( intStartIn >= 0 && intStartIn <= 2592000000 ) { return event; }
                            } );
                            arrCurrEvents = arrCurrEvents.sort( ( a, b ) => { return ( ( parseInt( a.attendants ) < parseInt( b.attendants ) ) ? 1 : -1 ); } );
                            var strCurrEventTable = '<table class="table" style="text-align: center;"><tr><th style="min-width: 125px; text-align: center;">Date</th><th style="text-align: center;">Title</th><th style="text-align: center;">Location</th><th style="text-align: center;">Attendants</th></tr>';
                            arrCurrEvents.forEach( event => {
                                let id = parseInt( event.id );
                                let start = ( new Date( event.start ) );
                                let end = ( new Date( event.end ) );
                                let attendants = parseInt( event.attendants );
                                let eventURL = 'https://calendar.munzee.com' + event.url;
                                objCurrEvents[ id ] = { id: id, start: start, time: event.time, end: end, title: event.title, location: event.location, url: eventURL, className: event.className, attendants: attendants };
                                strCurrEventTable += '<tr>' +
                                    '<td>' + start.toLocaleDateString( 'en-US', { year: 'numeric', month: 'short', day: 'numeric' } ) + '</td>' +
                                    '<td><a href="' + eventURL + '" title="Calendar event listing">' + event.title + '</a></td>' +
                                    '<td id="location' + event.id + '">' + event.location + '</td>' +
                                    '<td>' + attendants + '</td>' +
                                    '</tr>';
                            } );
                            strCurrEventTable += '</table>';
                            $( 'div#loader' ).replaceWith( strCurrEventTable ).change();
                        } } ).then( () => {
                            arrCurrEvents.forEach( event => {
                                let objEvent = objCurrEvents[ event.id ];
                                $.ajax( { url: bypassCORsURL + objEvent.url, success: function( eventPage ) {
                                    let intStartEventIndicator = $( eventPage )[ 42 ].innerHTML.indexOf( 'https://www.munzee.com/m/EventIndicator/' );
                                    if ( intStartEventIndicator >= 0 ) {
                                        intStartEventIndicator += 40;
                                        let intEndEventIndicator = $( eventPage )[ 42 ].innerHTML.indexOf( '/', intStartEventIndicator );
                                        let strEventIndicatorURL = 'https://www.munzee.com/m/EventIndicator/' + $( eventPage )[ 42 ].innerHTML.substring( intStartEventIndicator, intEndEventIndicator ) + '/';
                                        $( '#location' + objEvent.id ).html( '<a href="' + strEventIndicatorURL + '" title="' + strEventIndicatorURL + '">' + objEvent.location + '</a>' );
                                        objEvent.eventIndicatorURL = strEventIndicatorURL;
                                    } else {
                                        $( '#location' + objEvent.id ).html( '<span title="No event indicator pin is available yet.">' + objEvent.location + '</span>' );
                                        objEvent.eventIndicatorURL = undefined;
                                    }
                                } } );
                            } )
                        } ).then( () => {
                            console.log( 'objCurrEvents: %o', objCurrEvents );
                        } ).fail( errGetEvents => {
                            var divFailed = document.createElement( 'div' );
                            divFailed.classList.add( ...[ 'alert', 'alert-danger' ] );
                            divFailed.append( document.createTextNode( 'Error attempting to get event listing.' ) );
                            $( 'div#loader' ).replaceWith( divFailed );
                            console.error( 'Failed to get event listing: %o', errGetEvents );
                        } );//*/
                        /*                    window.setTimeout( () => {
                        var divFailed = document.createElement( 'div' );
                        divFailed.classList.add( ...[ 'alert', 'alert-danger' ] );
                        divFailed.append( document.createTextNode( 'Error attempting to get event listing.' ) );
                        $( 'div.loader' ).replaceWith( divFailed );
                    }, 5000 );//*/
                    }
                } } );
            }
        }
    } catch ( errScript ) {
        log( 0, 'error', 'Encountered an error: %o', errScript );
        var notifyAuthor = confirm( scriptName + '\n\tERROR!\t\t(details in console)\n\tPlease press [Cancel] and update the script\n\t\tbefore pressing [OK] to notify the author\n\t\tas there may already be a fix!\n\n\t\t\t\tThanks!' );
        if ( notifyAuthor ) {
            window.location.href = 'https://www.munzee.com/flows/?username=technical13&report=' + encodeURIComponent( scriptName + ': ' + window.location.href + '\n' + errScript );
        }
    }
} )();