// ==UserScript==
// @name         MHQ ago
// @namespace    none
// @version      2021.08.13.0441
// @description  Show timestamps
// @supportURL   https://Discord.me/TheShoeStore
// @author       technical13
// @match        https://www.munzee.com/flows/*
// @match        https://www.munzee.com/m/*
// @match        https://www.munzee.com/referral/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374825/MHQ%20ago.user.js
// @updateURL https://update.greasyfork.org/scripts/374825/MHQ%20ago.meta.js
// ==/UserScript==
// jshint esversion: 6
// TO DO
// QRewZee doesn't work properly on individual Munzee pages
// MHQ ago breaks on /m/*/deploys/ if the "search" by name feature is used.

var isDebug = false;
var intVerbosity = 0;
const ver = '2021.08.13.0441';
const scriptName = 'MHQ ago v' + ver;

function log( intV, strConsole, strLog, ...arrArgs ) {
    if ( strConsole === undefined ) { strConsole = 'log'; }
    if ( strLog === undefined ) { strLog = '%o'; }
    if ( intVerbosity >= intV && ( strConsole === 'groupEnd' ) ) { console[ strConsole ](); }
    if ( intV === 0 || ( isDebug && intVerbosity >= intV ) ) { console[ strConsole ]( '[%i]: %s: ' + strLog, intV, scriptName, ...arrArgs ); }
}

function countDown( intRawSeconds ) {
    var intSeconds = parseInt( intRawSeconds );
    var intDays = Math.floor( intSeconds / 86400 );
    intSeconds = intSeconds - ( intDays * 86400 );
    var intHours = Math.floor( intSeconds / 3600 );
    intSeconds = intSeconds - ( intHours * 3600 );
    var intMinutes = Math.floor( intSeconds / 60 );
    intSeconds = intSeconds - ( intMinutes * 60 );
    var strCountDown = ( intDays > 0 ? intDays.toLocaleString() + ' day' + ( intDays === 1 ? '' : 's' ) : '' ) +
        ( intHours > 0 ? ( intDays > 0 ? ', ' : '' ) + intHours.toLocaleString() + ' hour' + ( intHours === 1 ? '' : 's' ) : '' ) +
        ( intMinutes > 0 ? ( intDays > 0 || intHours > 0 ? ', ' : '' ) + intMinutes.toLocaleString() + ' minute' + ( intMinutes === 1 ? '' : 's' ) : '' ) +
        ( intSeconds > 0 ? ( intDays > 0 || intHours > 0 || intMinutes > 0 ? ', ' : '' ) + intSeconds.toLocaleString() + ' second' + ( intSeconds === 1 ? '' : 's' ) : '' );

    log( 4, 'log', 'countDown( %i ) is returning: %s', intRawSeconds, strCountDown );
    return strCountDown;
}
function getDaysAgo( dateTS ) {
    if ( Object.prototype.toString.call( dateTS ) !== '[object Date]' ) {
        console.error( 'dateTS is not a valid date object, it\'s a %s: %o', typeof( dateTS ), dateTS );
        return 0;
    }

    return Math.ceil( ( ( new Date() ).valueOf() - dateTS.valueOf() ) / 1000 / 60 / 60 / 24 );
}
async function capsPerDay( intCaps, intDays ) {
    if ( Object.prototype.toString.call( intDays ) === '[object Date]' ) {
        // If it's a date, getDaysAgo()
        intDays = await getDaysAgo( intDays );
    }
    else if ( typeof( intDays ) === 'string' ) {
        // If it's a string, try to parseInt()
        intDays = parseInt( intDays.replace( ',', '' ) );
    }
    else if ( isNaN( intDays ) ) {
        // if we can't make it a number, error out
        console.error( 'intDays is not a valid date object or number, it\'s a %s: %o', typeof( intDays ), intDays );
        return 0;
    }
    if ( typeof( intCaps ) === 'string' ) {
        // If it's not a number, try to make it one with parseInt()
        intCaps = parseInt( intCaps.replace( ',', '' ) );
    }
    else if ( isNaN( intCaps ) ) {
        // if we can't make it a number, error out
        console.error( 'intCaps is not a number, it\'s a %s: %o', typeof( intCaps ), intCaps );
        return 0;
    }

    if ( intDays === 0 ) { return 0; }
    else { return ( Math.round( ( intCaps / intDays ) * 100 ) / 100 ); }
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
    }
    else if ( strParamName === 'debug' ) {
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

const objFullTimeStringHQ = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    timeZone: 'America/Chicago', timeZoneName: 'short', hour12: false };
const objShorTimeStringHQ = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    timeZone: 'America/Chicago', hour12: false };

var address = document.URL.replace( /https?:\/\/www\.munzee\.com\/?/i, '' ).split( '/' );
var isUserPage = false;
if ( address[ 0 ] === 'm' ) { isUserPage = true; address = address.slice( 1 ); }
const pageUserName = ( address[ 0 ] || undefined );
const subPage = ( address[ 1 ] || undefined );
const subSubPage = ( address[ 2 ] || undefined );
log( 1, 'info', 'pageUserName = %s\tsubPage = %s\tsubSubPage = %s', pageUserName, subPage, subSubPage );

const rxpMins = RegExp( '\\d+ minutes ago', 'i' );
const rxpHrs = RegExp( '\\d+ hours ago', 'i' );
const rxpDays = RegExp( '\\d+ days ago', 'i' );

( function() {
    'use strict';
    log( 0, 'info', 'Script loaded.' );

    $( 'div.col-lg-2.user-stat.stat-green').css( 'margin-top', '1px' );

    if ( isUserPage || subPage === 'feed' ) {
        $( 'div#munzee-holder section' ).css( { 'margin-top': '2px', 'margin-bottom': '2px' } );
    }

    var isDestinationType = ( new RegExp( '\/(deploys|undeploys)\/[0-9]+\/type\/([149]?70|2183)' ) ).test( window.location.pathname );
    if ( isDestinationType ) {
        $( 'section' ).each( ( ndx, section ) => {
            var destinationURL = $( section ).children( 'div.munzee-name.pull-left' ).children( 'a' )[ 1 ].href;
            var arrDestination = destinationURL.split( '/' );
            var idDestination = arrDestination[ arrDestination.length - 2 ] + '-' + arrDestination[ arrDestination.length - 1 ];
            var domVacancy = document.createElement( 'span' );
            domVacancy.id = idDestination;
            domVacancy.class = 'vacancies';
            domVacancy.innerText = '(querying room vacancies)';
            $( section ).children( 'div.munzee-name.pull-left' ).children( 'a' )[ 1 ].append( document.createElement( 'br' ), domVacancy );
            window.setTimeout( function() {
                $.ajax( { url: destinationURL, success: function( dataDestination ) {
                    var strRooms = $( dataDestination ).find( 'small#motel-rooms' ).text();
                    var intRooms = parseInt( strRooms.toLowerCase().trim() === 'no vacancy' ? 0 : strRooms.match( /(\d*) vacant rooms/i )[ 1 ] );
                    var strRoomHolder = $( dataDestination ).find('div#room-holder' ).text().trim();
                    domVacancy.innerHTML = '(' + ( strRoomHolder === 'All rooms vacant. Go get one!' ? 'empty' : ( intRooms === 0 ? 'full' : intRooms.toString() + ' available room' + ( intRooms === 1 ? '' : 's' ) ) ) + ')';
                }, error: function( failDestination ) {
                    domVacancy.innerHTML = '(trying again)';
                    window.setTimeout( function() {
                        $.ajax( { url: destinationURL, success: function( dataDestination ) {
                            var strRooms = $( dataDestination ).find( 'small#motel-rooms' ).text();
                            var intRooms = parseInt( strRooms.toLowerCase().trim() === 'no vacancy' ? 0 : strRooms.match( /(\d*) vacant rooms/i )[ 1 ] );
                            var strRoomHolder = $( dataDestination ).find('div#room-holder' ).text().trim();
                            domVacancy.innerHTML = '(' + ( strRoomHolder === 'All rooms vacant. Go get one!' ? 'empty' : ( intRooms === 0 ? 'full' : intRooms.toString() + ' available room' + ( intRooms === 1 ? '' : 's' ) ) ) + ')';
                        }, error: function( failFinalDestination ) {
                            console.error( 'failed to get vacancy data: %s: %o\nfailed to get vacancy data twice: %o', destinationURL, failDestination, failFinalDestination );
                            domVacancy.innerHTML = '(unknown vacancies)';
                        } } ) }, ( $( 'section' ).size() * 750 ) + ( ndx * 500 ) );
                } } ) }, ( ndx * 750 ) );
        } );
    }
    var isDestination = ( $( 'small#motel-rooms' ).length > 0 ? true : false );
    if ( isDestination ) {
        if ( $( 'span#vacancy' ).length === 0 ) {
            let intRooms = parseInt( $( 'small#motel-rooms' ).text().toLowerCase().trim() === 'no vacancy' ? 0 : $( 'small#motel-rooms' ).text().match( /(\d*) vacant rooms/i )[ 1 ] );
            let domVacancy = document.createElement( 'span' );
            domVacancy.id = 'vacancy';
            domVacancy.innerText = ' (' + ( $( 'div#room-holder' ).text().trim() === 'All rooms vacant. Go get one!' ? 'empty' : ( intRooms === 0 ? 'full' : intRooms.toString() + ' available room' + ( intRooms === 1 ? '' : 's' ) ) ) + ')';
            $( 'h3.munzee-name' ).append( domVacancy );
        }
    }

    $( '.expires-at' ).each( function( i, elem ) {
        if ( isDestination ) { elem.parentElement.id = 'room' +
            elem.parentElement.firstChild.nodeValue.match( /Room #(\d*) by/i )[ 1 ]; }
        var isTempVirt = ( $( 'div#munzee-name img.pin' ).attr( 'src' ).split( '/' )[ 5 ].split( '.' ) [ 0 ] === 'temporaryvirtual' ? true : false );
        var objExpires = new Date( $( elem ).attr( 'title' ) );
        var intSecondsUntilExpires = Math.floor( ( objExpires.valueOf() - ( new Date() ).valueOf() ) / 1000 );
        var objNudgeable = {}, strNewNudge = '', strNewExpires = '';
        if ( !isTempVirt && !isDestination ) {
            objNudgeable = new Date( $( elem ).attr( 'title' ) );
            objNudgeable = new Date( objNudgeable.setHours( objNudgeable.getHours() - 9 ) );
            var intSecondsUntilNudge = Math.floor( ( objNudgeable.valueOf() - ( new Date() ).valueOf() ) / 1000 );
            if ( intSecondsUntilNudge > 0 ) {
                strNewNudge = '<br /><span class="nudge-at" data-nudge-at="' + objNudgeable.valueOf() +
                    '" title="' + objNudgeable.toISOString() + '">Nudgeable ' +
                    objNudgeable.toLocaleDateString( 'en-US', objShorTimeStringHQ ) + ' (<span id="nudge-countdown">' +
                    countDown( intSecondsUntilNudge ) + '</span>)';
            }
            setInterval( function() {
                intSecondsUntilNudge = Math.floor( ( objNudgeable.valueOf() - ( new Date() ).valueOf() ) / 1000 );
                if ( intSecondsUntilNudge > 0 ) { $( 'span#nudge-countdown' ).text( countDown( intSecondsUntilNudge ) ); }
                else { $( 'span.nudge-at' ).remove(); }
            }, 1000 );
        }
        else if ( isDestination ) {
            strNewExpires = objExpires.toLocaleDateString( 'en-US', objShorTimeStringHQ ) +
                '<br />(<span id="expires-countdown-' + elem.parentElement.id + '">' + countDown( intSecondsUntilExpires ) + '</span>)</span>';
        }
        else {
            strNewExpires = objExpires.toLocaleDateString( 'en-US', objShorTimeStringHQ ) +
                ' (<span id="expires-countdown">' + countDown( intSecondsUntilExpires ) + '</span>)</span>';
        }
        $( elem ).html( strNewExpires + strNewNudge );
        setInterval( function() {
            intSecondsUntilExpires = Math.floor( ( objExpires.valueOf() - ( new Date() ).valueOf() ) / 1000 );
            if ( intSecondsUntilExpires > 0 ) {
                $( 'span#expires-countdown' + ( isDestination ? '-' + elem.parentElement.id : '' ) ).text( countDown( intSecondsUntilExpires ) );
            }
            else { location.reload(); }
        }, 1000 );
        var strType = $( 'img.pull-left.pin' )[ 0 ].src;
        setInterval( function() {
            $.get( document.location ).done( data => { if ( data.indexOf( strType ) === -1 ) { location.reload(); } } );
        }, 60000 );
    } );

    $( '.deployed-at' ).each( async function( i, elem ) {
        var arrStatBarPages = [ 'archived', 'captures', 'deploys', 'socials', 'kennel' ];
        var arrQRewZees = [ 'munzee', 'pinkdiamond', 'diamond', 'ruby', 'topaz', 'aquamarine', 'mace', 'longsword', 'battleaxe', 'hammer', 'mystery', 'firemystery', 'icemystery', 'earthmystery', 'watermystery', 'premium' ];
        var arrSleepZees = [ 'virtual' ];
        var objPinIcon = ( $( '.deployed-at' ).closest( 'section' ).length === 0 ? $( 'img.pin' ) : $( elem ).closest( 'section' ).find( 'img.pin' ) );
        var strPinType = objPinIcon.attr( 'src' ).replace( /https?:\/\/munzee\.global\.ssl\.fastly\.net\/images\/pins\//, '' ).split( '.' )[ 0 ];
        var dateDeployed = new Date( $( elem ).attr( 'data-deployed-at' ) );
        var intDaysAgo = await getDaysAgo( dateDeployed );
        var strCaptures = ( arrStatBarPages.indexOf( subPage ) === -1 ? $( 'div.col-lg-2.user-stat.stat-green' ).eq( 1 ).text() : $( elem ).parent().siblings( 0 ).text() ).match( /([\d,]*) [Cc]aptures?/ )[ 1 ].replace( ',', '' );
        var intCaptures = parseInt( strCaptures );
        var intCapsPerDay = await capsPerDay( intCaptures, intDaysAgo );
        var strRawAgo = $( elem ).text();
        var intSecondsAgo = Math.round( ( ( new Date() ).valueOf() - dateDeployed.valueOf() ) / 1000 );
        var strLastCap = new Date( $( $( elem ).closest( 'section' ).find( 'span.captured-at' ) ).attr( 'data-captured-at' ) );
        var intSecondsLastCap = Math.round( ( ( new Date() ).valueOf() - strLastCap.valueOf() ) / 1000 );
        if ( ( ( !intSecondsLastCap && intSecondsAgo >= 31557600 ) || intSecondsLastCap >= 31557600 ) && arrQRewZees.indexOf( strPinType ) !== -1 ) {
            objPinIcon.attr( 'src', 'https://munzee.global.ssl.fastly.net/images/pins/qrewzee.png' );
        }
        if ( ( ( !intSecondsLastCap && intSecondsAgo >= 31557600 ) || intSecondsLastCap >= 31557600 ) && arrSleepZees.indexOf( strPinType ) !== -1 ) {
            objPinIcon.attr( 'src', 'https://munzee.global.ssl.fastly.net/images/pins/sleepzee.png' );
        }/* uncomment for debugging types etc
        else {
            console.log( '%s : %s : %o', strPinType, $( elem ).closest( 'section').find( 'a.munzee-id' ).text(), intSecondsLastCap );
        }//*/
        if ( strRawAgo === 'seconds ago' || strRawAgo === 'a minute ago' ) {
            strRawAgo = intSecondsAgo + '&nbsp;seconds&nbsp;ago';
        } else if ( rxpMins.test( strRawAgo ) || strRawAgo === 'an hour ago' || strRawAgo === '2 hours ago' ) {
            strRawAgo = ( Math.round( ( intSecondsAgo / 60 ) * 10 ) / 10 ) + '&nbsp;minutes&nbsp;ago';
        } else if ( rxpHrs.test( strRawAgo ) || strRawAgo === 'a day ago' ) {
            strRawAgo = ( Math.round( ( intSecondsAgo / 60 / 60 ) * 100 ) / 100 ) + '&nbsp;hours&nbsp;ago';
        } else if ( rxpDays.test( strRawAgo ) ) {
            strRawAgo = ( Math.round( ( intSecondsAgo / 60 / 60 / 24 ) * 100 ) / 100 ) + '&nbsp;days&nbsp;ago';
        } else {
            strRawAgo = strRawAgo.replace( ' ', '&nbsp;' );
        }
        switch( subPage ) {
            case 'archived' :
                break;
            case 'captures' :
            case 'deploys' :
                $( 'div#munzee-holder section' ).css( { 'marginTop': '2px', 'marginBottom': '2px' } );
                $( elem ).html( strRawAgo + '<br />' + dateDeployed.toLocaleDateString( 'en-US', objShorTimeStringHQ ) );
                $( elem ).parent().siblings( 0 ).text(  $( elem ).parent().siblings( 0 ).text() + ' (' + intCapsPerDay + '/day)' );
                break;
            case 'socials' :
                if ( subSubPage === 'own' ) {
                    $( elem ).html( strRawAgo + '<br />' + dateDeployed.toLocaleDateString( 'en-US', objShorTimeStringHQ ) );
                }
                break;
            case 'kennel' :
                if ( subSubPage === 'transported' ) {
                    $( elem ).html( strRawAgo + '<br />' + dateDeployed.toLocaleDateString( 'en-US', objFullTimeStringHQ ) );
                }
                break;
            case 'blast' :
            case 'feed' :
            default:
                if ( !isNaN( subSubPage ) ) {
                    $( elem ).html( strRawAgo + '<br />' + dateDeployed.toLocaleDateString( 'en-US', objFullTimeStringHQ ) );
                } else {
                    $( elem ).html( dateDeployed.toLocaleDateString( 'en-US', objFullTimeStringHQ ) + ' &shy;(' + strRawAgo + ')' );
                }
                if ( arrStatBarPages.indexOf( subPage ) !== -1 && isUserPage && subPage && !subSubPage ) {
                    $( 'div.col-lg-2.user-stat.stat-green' ).eq( 1 ).find( 'a' ).append( ' (' + intCapsPerDay + '/day)' );
                }
        }
    } );

    $( '.captured-at' ).each( function( i, elem ) {
        var strCaptured = new Date( $( elem ).attr( 'data-captured-at' ) );
        var strRawAgo = $( elem ).text();
        var intSecondsAgo = Math.round( ( ( new Date() ).valueOf() - strCaptured.valueOf() ) / 1000 );
        if ( strRawAgo === 'seconds ago' || strRawAgo === 'a minute ago' ) {
            strRawAgo = intSecondsAgo + '&nbsp;seconds&nbsp;ago';
        } else if ( rxpMins.test( strRawAgo ) || strRawAgo === 'an hour ago' || strRawAgo === '2 hours ago' ) {
            strRawAgo = ( Math.round( ( intSecondsAgo / 60 ) * 10 ) / 10 ) + '&nbsp;minutes&nbsp;ago';
        } else if ( rxpHrs.test( strRawAgo ) || strRawAgo === 'a day ago' ) {
            strRawAgo = ( Math.round( ( intSecondsAgo / 60 / 60 ) * 100 ) / 100 ) + '&nbsp;hours&nbsp;ago';
        } else if ( rxpDays.test( strRawAgo ) ) {
            strRawAgo = ( Math.round( ( intSecondsAgo / 60 / 60 / 24 ) * 100 ) / 100 ) + '&nbsp;days&nbsp;ago';
        } else {
            strRawAgo = strRawAgo.replace( ' ', '&nbsp;' );
        }
        switch( subPage ) {
            case 'archived' :
            case 'captures' :
            case 'deploys' :
                $( 'div#munzee-holder section' ).css( { 'marginTop': '2px', 'marginBottom': '2px' } );
                $( elem ).html( strRawAgo + '<br />' + strCaptured.toLocaleDateString( 'en-US', objShorTimeStringHQ ) );
                break;
            case 'socials' :
                if ( subSubPage === 'own' ) {
                    $( elem ).html( strRawAgo + '<br />' + strCaptured.toLocaleDateString( 'en-US', objShorTimeStringHQ ) );
                }
                break;
            case 'kennel' :
                if ( subSubPage === 'transported' ) {
                    $( elem ).html( strRawAgo + '<br />' + strCaptured.toLocaleDateString( 'en-US', objFullTimeStringHQ ) );
                }
                break;
            case 'blast' :
            case 'feed' :
            default:
                $( elem ).html( strCaptured.toLocaleDateString( 'en-US', objFullTimeStringHQ ) + ' &shy;(' + strRawAgo + ')' );
        }
    } );

    $( '.blasted-at' ).each( function( i, elem ) {
        var strBlasted = new Date( $( elem ).attr( 'data-blasted-at' ) );
        $( elem ).append( '<p>' + strBlasted.toLocaleDateString( 'en-US', objFullTimeStringHQ ) + '</p>' );
    } );

    $( '.last-updated-at' ).each( function( i, elem ) {
        var strUpdated = new Date( $( elem ).attr( 'data-last-updated-at' ) );
        var strRawAgo = $( elem ).text();
        var intSecondsAgo = Math.round( ( ( new Date() ).valueOf() - strUpdated.valueOf() ) / 1000 );

        if ( strRawAgo === 'seconds ago' || strRawAgo === 'a minute ago' ) {
            strRawAgo = intSecondsAgo + '&nbsp;seconds&nbsp;ago';
        } else if ( rxpMins.test( strRawAgo ) || strRawAgo === 'an hour ago' || strRawAgo === '2 hours ago' ) {
            strRawAgo = ( Math.round( ( intSecondsAgo / 60 ) * 10 ) / 10 ) + '&nbsp;minutes&nbsp;ago';
        } else if ( rxpHrs.test( strRawAgo ) || strRawAgo === 'a day ago' ) {
            strRawAgo = ( Math.round( ( intSecondsAgo / 60 / 60 ) * 100 ) / 100 ) + '&nbsp;hours&nbsp;ago';
        } else if ( rxpDays.test( strRawAgo ) ) {
            strRawAgo = ( Math.round( ( intSecondsAgo / 60 / 60 / 24 ) * 100 ) / 100 ) + '&nbsp;days&nbsp;ago';
        } else {
            strRawAgo = strRawAgo.replace( ' ', '&nbsp;' );
        }console.log('%o',subPage);
        switch( subPage ) {
            case undefined :
                $( elem ).html( strRawAgo );
            default:
        }
    } );

    $( '.wrote-at' ).each( function( i, elem ) {
        var strWrote = new Date( $( elem ).attr( 'data-wrote-at' ) );
        var strRawAgo = $( elem ).text();
        var intSecondsAgo = Math.round( ( ( new Date() ).valueOf() - strWrote.valueOf() ) / 1000 );
        if ( strRawAgo === 'seconds ago' || strRawAgo === 'a minute ago' ) {
            strRawAgo = intSecondsAgo + '&nbsp;seconds&nbsp;ago';
        } else if ( rxpMins.test( strRawAgo ) || strRawAgo === 'an hour ago' || strRawAgo === '2 hours ago' ) {
            strRawAgo = ( Math.round( ( intSecondsAgo / 60 ) * 10 ) / 10 ) + '&nbsp;minutes&nbsp;ago';
        } else if ( rxpHrs.test( strRawAgo ) || strRawAgo === 'a day ago' ) {
            strRawAgo = ( Math.round( ( intSecondsAgo / 60 / 60 ) * 100 ) / 100 ) + '&nbsp;hours&nbsp;ago';
        } else if ( rxpDays.test( strRawAgo ) ) {
            strRawAgo = ( Math.round( ( intSecondsAgo / 60 / 60 / 24 ) * 100 ) / 100 ) + '&nbsp;days&nbsp;ago';
        } else {
            strRawAgo = strRawAgo.replace( ' ', '&nbsp;' );
        }
        $( elem ).html( strRawAgo );
    } );
} )();