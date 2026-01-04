// ==UserScript==
// @name         zeeTreehouses + rabe85 MOD
// @namespace    https://greasyfork.org/users/156194
// @version      2021.09.24.0118 + rabe85 MOD v1.2
// @description  More details of myths currently hosted in treehouses. Expiry times powered by sohcah's CuppaZee
// @author       technical13
// @supportURL   https://discord.me/TheShoeStore
// @match        https://www.munzee.com/m/*/*
// @match        https://www.munzee.com/flows/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393918/zeeTreehouses%20%2B%20rabe85%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/393918/zeeTreehouses%20%2B%20rabe85%20MOD.meta.js
// ==/UserScript==
// jshint esversion: 6

var isDebug = false;
var intVerbosity = 0;
const ver = '2021.09.24.0118_rabe85_1.2';
const scriptName = 'zeeTreehouses v' + ver;

const apiPrimaryURL = 'https://server.cuppazee.app/munzee/bouncers/v1';//?munzee_id=

const thisDate = ( new Date() );
const objValueOfDateTimeMHQ = Date.parse( thisDate.toLocaleString( 'en-US', { timeZone: 'America/Chicago' } ) );
const objValueOfDateTimeLocal = thisDate.valueOf();
const intMsOffsetMHQ = ( Math.round( ( objValueOfDateTimeMHQ - objValueOfDateTimeLocal ) / 10000 ) * 10000 );
const thenMidnight = new Date( thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), 0, 0, 0 );
const intLastMidnight = objValueOfDateTimeLocal - ( ( thisDate.getTime() - thenMidnight.getTime() ) + intMsOffsetMHQ );
const intMidnightBefore = intLastMidnight - ( 86400000 );
const intMidnightThree = intMidnightBefore - ( 86400000 );
log( 1, 'log', '\n\tlastMidnight: %o\n\tmidnightBefore: %o\n\tmidnightThree: %o',
    ( new Date( intLastMidnight ) ), ( new Date( intMidnightBefore ) ), ( new Date( intMidnightThree ) ) );
const objFullTimeStringHQ = {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    timeZone: 'America/Chicago', timeZoneName: 'short', hour12: false };
const objShorTimeStringHQ = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    timeZone: 'America/Chicago', hour12: false };
const objrabe85TimeStringHQ = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZone: 'Europe/Berlin', hour12: false };

function log( intV, strConsole, strLog, ...arrArgs ) {
    if ( strConsole === undefined ) { strConsole = 'log'; }
    if ( strLog === undefined ) { strLog = '%o'; }
    if ( intVerbosity >= intV && ( strConsole === 'groupEnd' ) ) { console[ strConsole ](); }
    if ( intV === 0 || ( isDebug && intVerbosity >= intV ) ) { console[ strConsole ]( '[%i]: %s: ' + strLog, intV, scriptName, ...arrArgs ); }
}
function toBoolean( val ) {
    const arrTrue = [ undefined, null, '', true, 'true', 1, '1', 'on', 'yes' ];
    val = ( typeof( val ) === 'string' ? val.toLowerCase() : val );

    log( 4, 'log', 'toBoolean() is returning: %o', ( arrTrue.indexOf( val ) !== -1 ? true : false ) );
    return ( arrTrue.indexOf( val ) !== -1 ? true : false );
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
const isErrorPage = ( $( 'div#error' ).length === 0 ? false : true );
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
    else if ( strParamName === 'report' ) {
        objParams.report = decodeURIComponent( arrParam[ 1 ] );
    }
} );

log( 1, 'warn', 'Debug mode is on with verbosity level: %o', intVerbosity );
log( 1, 'groupCollapsed', 'Verbosity options: (click to expand)' );
log( 1, 'log', '1) Summary\n2) Parameters retrieved from URL\n3) Variables set to objParams\n4) Function returns\n5) Repetitive function returns\n9) ALL debugging info and this notice.' );
log( 1, 'groupEnd' );

var arrUndefinedTypes = [
    'akvamariin', 'ametust', 'oniks', 'smaragd', 'teemant', 'topaas', 'rubiin', 'safiir', 'roosa', 'tsitriin', 'vikerkaar',//   // Funfinity Stones
    'banshee', 'harpybanshee', 'gorgon', 'retiredbanshee', 'witchbanshee',//                                                    // Banshee
    'cyclops', 'balorcyclops', 'minotaurcyclops', 'ogre', 'retiredcyclops',//                                                   // Cyclops
    'cherub',//                                                                                                                 // Cherub
    'chinesedragon', 'wyverndragon',//                                                                                          // Dragon
    'dryadfairy', 'fairy', 'fairygodmother', 'retiredfairy', 'wildfirefairy',//                                                 // Fairy
    'centaurfaun', 'krampusfaun',//                                                                                             // Faun
    'chimera', 'cthulhuhydra', 'cerberushydra',//                                                                               // Hydra
    'dwarfleprechaun', 'goblinleprechaun',//                                                                                    // Leprechaun
    'magnetus',//                                                                                                               // Magnetus
    'mitmegu', 'rohimegu', 'jootmegu', 'lokemegu',//                                                                            // Mitmegu
    'melusinemermaid',//                                                                                                        // Mermaid
    'elfnymph', 'nymph', 'vampirenymph',//                                                                                      // Nymph
    'alicornpegasus', 'firepegasus', 'griffinpegasus',//                                                                        // Pegasus
    'pimedus',//                                                                                                                // Pimedus
    'poseidon', 'aphrodite',//                                                                                                  // Modern Myths
    'hadavale', 'motherearth',//                                                                                                // SOBs
    'trojanunicorn'//                                                                                                           // Temp types
];
var objEvolutionTypes = {
    1240: [ 'tuli', 'tulimber', 'tuliferno' ],
    1370: [ 'vesi', 'vesial', 'vesisaur' ],
    1638: [ 'muru', 'muruchi', 'murutain' ],
    2240: [ 'puffle', 'pufrain', 'puflawn' ],
    2407: [ 'elekter', 'elekjoul', 'elektrivool' ]
};
var arrLimitTypes = [//  Auto-archive after 10 captures or 42 days.
    'limebutterfly', 'monarchbutterfly', 'morphobutterfly',//                                                                   // Butterly
    'poisondartfrog', 'tomatofrog', 'treefrog',//                                                                               // Frog
    'boxjellyfish', 'goldenjellyfish', 'pb&jellyfish',//                                                                        // Jellyfish
    'seaturtle', 'snappingturtle', 'taekwondotortoise',//                                                                       // Turtles
];
arrUndefinedTypes = arrUndefinedTypes.concat( arrLimitTypes );

var arrEvolutionNames = [];
Object.values( objEvolutionTypes ).forEach( ( arrEvoType, ndx ) => {
    let thisKey = Object.keys( objEvolutionTypes )[ ndx ];
    arrEvolutionNames = arrEvolutionNames.concat( objEvolutionTypes[ thisKey ] );
} );

function countDown( intRawSeconds ) {
    var intSeconds = parseInt( intRawSeconds );
    var intHours = Math.floor( intSeconds / 3600 );
    intSeconds = intSeconds - ( intHours * 3600 );
    var intMinutes = Math.floor( intSeconds / 60 );
    intSeconds = intSeconds - ( intMinutes * 60 );
    var strCountDown = '';
    //    if ( window.screen.width < 1200 ) {
    strCountDown = ( intHours.toLocaleString() <= 9 ? '0' : '' ) + intHours.toLocaleString() +
        ':' + ( intMinutes.toLocaleString() <= 9 ? '0' : '' ) + intMinutes.toLocaleString() +
        ':' + ( intSeconds.toLocaleString() <= 9 ? '0' : '' ) + intSeconds.toLocaleString();
    /*    } else {
        strCountDown = ( intHours > 0 ? intHours.toLocaleString() +
                        ' hour' + ( intHours === 1 ? '' : 's' ) : '' ) +
            ( intMinutes > 0 ? ( intHours > 0 ? ', ' : '' ) +
             intMinutes.toLocaleString() + ' minute' + ( intMinutes === 1 ? '' : 's' ) : '' ) +
            ( intSeconds > 0 ? ( intHours > 0 || intMinutes > 0 ? ', ' : '' ) +
             intSeconds.toLocaleString() + ' second' + ( intSeconds === 1 ? '' : 's' ) : '' );
    }*/

    log( 5, 'log', 'countDown( %i ) is returning: %s', intRawSeconds, strCountDown );
    return strCountDown;
}
async function getBouncerData( strTempPOB ) {
    var objStats = {};
    await $.ajax( { url: strTempPOB } ).done( function( tmpPobData ) {
        var statGreen = $( tmpPobData ).find( 'div.user-stat.stat-green > a' );
        statGreen.each( ( intRow, statData ) => {
            var arrStat = $( statData ).text().trim().split( ' ' );
            if ( arrStat.length === 2 ) {
                var strKey = arrStat[ 1 ][ 0 ].toLowerCase() + arrStat[ 1 ].slice( 1 ) + ( arrStat[ 1 ].slice( -1 ) === 's' ? '' : 's' )
                objStats[ strKey ] = parseInt( arrStat[ 0 ] );
            }
        } );
        objStats.deployed = ( new Date( $( tmpPobData ).find( 'p.status-date > span.deployed-at' )[ 0 ].dataset.deployedAt ) );
        var intAge = ( new Date() ).valueOf() - objStats.deployed.valueOf();
        objStats.ageDays = Math.ceil( intAge / 1000 / 60 / 60 / 24 );
    } );
    log( 4, 'log', 'getBouncerData( %s ) is returning: %o', strTempPOB, objStats );
    return objStats;
}
async function getTempDays( strTempPOB ) {
    var tempStats = await getBouncerData( strTempPOB );
    var strTempDays = '<img src="https://munzee.global.ssl.fastly.net/images/pins/temporaryvirtual.png" style="width: 24px; height: 24px;"' +
        ' title="This temporary bouncer will auto-archive in:\n\t' +
        ( 42 - tempStats.ageDays ) + ' of 42 day' + ( ( 42 - tempStats.ageDays ) === 1 ? '' : 's' ) + '\n\t' +
        ( 10 - tempStats.captures ) + ' of 10 capture' + ( ( 10 - tempStats.captures ) === 1 ? '' : 's' ) + '" />'
    log( 4, 'log', 'getTempDays( %s ) is returning: %s', strTempPOB, strTempDays );
    return strTempDays;
}
async function getPouchDays( strPouchURL ) {
    var isCappedToday = false, wasCappedYesterday = false, wasCappedDayBefore = false;
    await $.ajax( { url: strPouchURL } ).done( function( capData ) {
        var logSections = $( capData ).find( 'div#munzee-holder > section:not( .entry-holder )' );
        logSections.each( ( logNumber, logSection ) => {
            var strEntryDateTime = $( logSection ).find( 'span.captured-at' ).attr( 'title' );
            var objDate = ( new Date( strEntryDateTime ) );
            var intLogDate = objDate.valueOf();
            var intCapToday = ( intLogDate - intLastMidnight - 86400000 ),
                intCapYesterday = ( intLogDate - intMidnightBefore - 86400000 ),
                intCapDayBefore = ( intLogDate - intMidnightThree - 86400000 );
            log( 1, 'log', '\n\t%o: %o (%o):\n\t%o|%o|%o\n\t(%o|%o|%o)\n\t(%o|%o|%o)\n' +
                '\tisCappedToday[ %o ]: %o\n\twasCappedYesterday[ %o ]: %o\n\twasCappedDayBefore[ %o ]: %o',
                logNumber, objDate.toLocaleString(), intLogDate,
                isCappedToday, wasCappedYesterday, wasCappedDayBefore,
                intLogDate - intLastMidnight - 86400000,
                intLogDate - intMidnightBefore - 86400000,
                intLogDate - intMidnightThree - 86400000,
                intLastMidnight, intMidnightBefore, intMidnightThree,
                logNumber, ( intCapToday > -86400000 && intCapToday <= 0 ? true : false ),
                logNumber, ( intCapYesterday > -86400000 && intCapYesterday <= 0 ? true : false ),
                logNumber, ( intCapDayBefore > -86400000 && intCapDayBefore <= 0 ? true : false )
               );
            isCappedToday = ( isCappedToday ? true : ( intCapToday > -86400000 && intCapToday <= 0 ? true : false ) );
            wasCappedYesterday = ( wasCappedYesterday ? true : ( intCapYesterday > -86400000 && intCapYesterday <= 0 ? true : false ) );
            wasCappedDayBefore = ( wasCappedDayBefore ? true : ( intCapDayBefore > -86400000 && intCapDayBefore <= 0 ? true : false ) );
        } );
    } );
    var pouchStat = '';
    if ( isCappedToday && wasCappedYesterday && wasCappedDayBefore ) {
        pouchStat = ' <abbr title="Capped today, streak day: 3+" style="color: #008000">✓✓✓</abbr> '; }
    else if ( isCappedToday && wasCappedYesterday && !wasCappedDayBefore ) {
        pouchStat = ' <abbr title="Capped today, streak day: 2" style="color: #008000">✓✓</abbr> '; }
    else if ( isCappedToday && !wasCappedYesterday ) {
        pouchStat = ' <abbr title="Capped today, streak day: 1" style="color: #008000">✓</abbr> '; }
    else if ( !isCappedToday && !wasCappedYesterday && !wasCappedDayBefore ) {
        pouchStat = ' <abbr title="Uncapped in 3+ days." style="color: #FF00FF">☹</abbr> '; }
    else if ( !isCappedToday && !wasCappedYesterday && wasCappedDayBefore ) {
        pouchStat = ' <abbr title="Uncapped in 2 days." style="color: #FF00FF">☹</abbr> '; }
    else if ( !isCappedToday && wasCappedYesterday && wasCappedDayBefore ) {
        pouchStat = ' <abbr title="Needs to be capped!"><span style="color: #FF0000">✗</span><span style="color: #008000">✓✓</span></abbr> '; }
    else if ( !isCappedToday && wasCappedYesterday ) {
        pouchStat = ' <abbr title="Needs to be capped!"><span style="color: #FF0000">✗</span><span style="color: #008000">✓</span></abbr> '; }
    else { pouchStat = ' <abbr title="unknown streak status" style="color: #FF0000">؟</abbr> '; }
    log( 4, 'log', 'getPouchDays( %s ) is returning: %s', strPouchURL, pouchStat );
    return pouchStat;
}

( function() {
    'use strict';
    log( 0, 'info', 'Script loaded.' );

    try {
        log( 3, 'info', '\npageUserName: %s\nobjParams.report: %o\n!isNaN( parseInt( subPage ) ): %o\nsubPage: %o\n!isErrorPage: %o',
            pageUserName, objParams.report, !isNaN( parseInt( subPage ) ), subPage, !isErrorPage );
        if ( pageUserName === 'flows' && objParams.report ) {
            log( 1, 'log', 'Do error report...' );
            $( 'textarea#message' ).val( objParams.report );
        }
        else if ( !isNaN( parseInt( subPage ) ) && subPage !== undefined && pageUserName !== 'flows' && !isErrorPage ) {
            log( 1, 'log', 'Process main script.' );
            const pinSrc = $( 'div#munzee-name > a > img.pin' ).attr( 'src' );
            const arrPinSrc = pinSrc.split( '/' );
            const isTreehouse = ( arrPinSrc[ ( arrPinSrc.length - 1 ) ].split( '.' )[ 0 ].slice( 0, 9 ) === 'treehouse' ? true : false );
            const isSkyland = ( arrPinSrc[ ( arrPinSrc.length - 1 ) ].split( '.' )[ 0 ].slice( 0, 7 ) === 'skyland' ? true : false );
            const intHosting = parseInt( ( isTreehouse || isSkyland ? arrPinSrc[ ( arrPinSrc.length - 1 ) ].split( '.' )[ 0 ].slice( 9 ) : 1 ) === '' ? 0 : ( isTreehouse || isSkyland ? arrPinSrc[ ( arrPinSrc.length - 1 ) ].split( '.' )[ 0 ].slice( 9 ) : 1 ) );
            log( 3, 'info', '\npinSrc: %o\narrPinSrc: %o\nisTreehouse: %o\nisSkyland: %o\nintHosting', pinSrc, arrPinSrc, isTreehouse, isSkyland, intHosting );

            if ( isTreehouse || isSkyland ) {
                //                $( 'head' ).append( '<style type="text/css">div.unicorn { margin: 5px; font-size: 16px; font-weight: bold; }</style>' );
                $.get( apiPrimaryURL + '?munzee_id=' + munzee_id + '&from=zeetreehouses_' + encodeURI( ver ) )
                    .done( cuppaZee => {
                    log( 8, 'info', 'Response from: %s : %o',
                        apiPrimaryURL + '?munzee=' + subPage + '&username=' + pageUserName, cuppaZee );
                    $( 'div.unicorn' ).each( async ( ndx, unicorn ) => {
                        let isPouch = false;

                        let bouncer = cuppaZee.data[ ndx ];
                        var objExpires = new Date( moment( bouncer.good_until * 1000 ).format() );
                        var intSecondsUntilExpires = Math.floor( ( objExpires.valueOf() - ( new Date() ).valueOf() ) / 1000 );
                        var strNewExpires = '! <span style="font-size: 15px;";>(Expires in <span id="expires-countdown-treehouse' + ( ndx + 1 ) + '" title="' + objExpires.toLocaleDateString( 'de-DE', objrabe85TimeStringHQ ) + '">' + countDown( intSecondsUntilExpires ) + '</span>)</span>';
                        if ( arrUndefinedTypes.indexOf( bouncer.mythological_type ) !== -1 ) {
                            $( unicorn ).find( 'img' ).attr( 'src', bouncer.munzee_logo.replace( bouncer.mythological_type, bouncer.mythological_type + ( isTreehouse ? '_physical' : '_virtual' ) ) );
                        }
                        if ( Object.keys( objEvolutionTypes ).indexOf( bouncer.mythological_capture_type.toString() ) !== -1 ) {
                            isPouch = true;
                            $( unicorn ).find( 'img' ).attr( 'src', bouncer.munzee_logo.replace( bouncer.mythological_type, objEvolutionTypes[ bouncer.mythological_capture_type ][ bouncer.unicorn_munzee.evolution - 1 ] ) );
                        }
                        $( unicorn ).html( $( unicorn ).html().replace( 'This Munzee is c', 'C' ) );
                        $( unicorn ).html( $( unicorn ).html().replace( '!', '' ) );
                        let thisUnicorn = $( unicorn ).find( 'a' );
                        let thisUnicornURL = thisUnicorn.attr( 'href' ).replace( 'http://', 'https://' );
                        let owner = thisUnicornURL.split( /https?:\/\/www\.munzee\.com\/m\//i )[ 1 ].split( '/' )[ 0 ];
                        thisUnicorn.before( '<a href="https://www.munzee.com/m/' + owner + '/">' + owner + '</a>\'s ' );
                        thisUnicorn.after( strNewExpires );
                        if ( isPouch ) {
                            var pouchStatus = await getPouchDays( thisUnicornURL );
                            log( 3, 'log', 'pouchStatus: %o', pouchStatus );
                            thisUnicorn.after( pouchStatus );
                        }
                        if ( arrLimitTypes.indexOf( bouncer.mythological_type ) !== -1 ) {
                            var tempStatus = await getTempDays( thisUnicornURL );
                            log( 3, 'log', 'tempStatus: %o', tempStatus );
                            thisUnicorn.before( tempStatus );
                        }

                        setInterval( function() {
                            intSecondsUntilExpires = Math.floor( ( objExpires.valueOf() - ( new Date() ).valueOf() ) / 1000 );
                            if ( intSecondsUntilExpires > 0 ) {
                                $( 'span#expires-countdown-treehouse' + ( ndx + 1 ) + '' ).text( countDown( intSecondsUntilExpires ) );
                            } else { location.reload(); }
                        }, 1000 );
                    } );
                } ).fail( errCuppaZee => {
                    log( 0, 'error', 'Failed to get response from: %s : %o',
                        apiPrimaryURL + '?munzee=' + subPage + '&username=' + pageUserName, errCuppaZee );
                    var notifyCZ = confirm( scriptName + '\n\tERROR!\t(details in console)\n\tFailed to get bouncer from: ' + apiPrimaryURL + '\n\tPlease press [Cancel] and update the script\n\t\tbefore pressing [OK] to notify the API author\n\t\tas there may already be a fix!\n\n\t\t\t\tThanks!' );
                    if ( notifyCZ ) {
                        window.location.href = 'https://www.munzee.com/flows/?username=sohcah&report=' + encodeURIComponent( 'Version: ' + scriptName + '\nPage: ' + window.location.href + '\nUserAgent: ' + navigator.userAgent + '\nError: ' + errCuppaZee + 'Request: https://flame.cuppazee.uk/munzee/bouncers/v1?munzee=' + subPage + '&username=' + pageUserName + '\n Reporter comments: none' );
                    }
                } );
            } else {
                var expires = document.getElementById('munzee-name').getElementsByClassName('expires-at')[0];
                if(expires) {
                    var expires_time = expires.getAttribute('data-expires-at');
                    var objExpires = new Date(parseInt(expires_time));
                    var intSecondsUntilExpires = Math.floor((expires_time - (new Date()).valueOf()) / 1000);
                    var hosting_special = document.getElementsByClassName('unicorn')[0];
                    if(hosting_special) {
                        var special_link = hosting_special.getElementsByTagName('a')[0];
                        var special_owner = special_link.getAttribute('href').split( /https?:\/\/www\.munzee\.com\/m\//i )[1].split('/')[0];
                        var special_icon = hosting_special.getElementsByTagName('img')[0];
                        special_icon.setAttribute('alt', special_link.innerHTML);
                        special_icon.setAttribute('title', special_link.innerHTML);
                        hosting_special.innerHTML = 'Currently hosting <a href="https://www.munzee.com/m/' + special_owner + '/">' + special_owner + '</a>\'s ' + special_link.outerHTML + '! <span style="font-size: 15px;";>(Expires in <span id="expires-countdown-special" title="' + objExpires.toLocaleDateString( 'de-DE', objrabe85TimeStringHQ ) + '">' + countDown( intSecondsUntilExpires ) + '</span>)</span>' + special_icon.outerHTML;
                    } else {
                        // Zeile nachbilden
                        var special_munzee_icon = '';
                        var type = document.getElementsByClassName('pull-left pin')[0];
                        if(type) {
                            var type_src = document.getElementsByClassName('pull-left pin')[0].getAttribute('src');
                            var current_pin_name = type_src.split("/")[type_src.split("/").length - 1].replace(/_/g," ");
                            var current_pin_name_formatted = current_pin_name.substr(0, current_pin_name.length-4).charAt(0).toUpperCase() + current_pin_name.substr(0, current_pin_name.length-4).slice(1);
                            special_munzee_icon = '<img class="pull-right" src="' + type_src + '" alt="' + current_pin_name_formatted + '" title="' + current_pin_name_formatted + '">';
                        }
                        var special_munzee_info = '<div class="unicorn">Currently hosting a special munzee! <span style="font-size: 15px;";>(Expires in <span id="expires-countdown-special" title="' + objExpires.toLocaleDateString( 'de-DE', objrabe85TimeStringHQ ) + '">' + countDown( intSecondsUntilExpires ) + '</span>)</span>' + special_munzee_icon + '</div>';
                        var page_header = document.getElementsByClassName('page-header')[0];
                        if(page_header) {
                            page_header.insertAdjacentHTML('beforebegin', special_munzee_info);
                        } else {
                            var munzee_map = document.getElementById('munzee-map');
                            if(munzee_map) {
                                munzee_map.insertAdjacentHTML('beforebegin', special_munzee_info);
                            }
                        }
                    }

                    setInterval( function() {
                        intSecondsUntilExpires = Math.floor((expires_time - (new Date()).valueOf()) / 1000);
                        if(intSecondsUntilExpires > 0) {
                            $('span#expires-countdown-special').text(countDown(intSecondsUntilExpires));
                        } else { location.reload(); }
                    }, 1000 );

                }
            }
        }
    } catch ( errScript ) {
        log( 0, 'error', 'Encountered an error: %o', errScript );
        var notifyAuthor = confirm( scriptName + '\n\tERROR!\t\t(details in console)\n\tPlease press [Cancel] and update the script\n\t\tbefore pressing [OK] to notify the author\n\t\tas there may already be a fix!\n\n\t\t\t\tThanks!' );
        if ( notifyAuthor ) {
            window.location.href = 'https://www.munzee.com/flows/?username=technical13&report=' + encodeURIComponent( 'Version: ' + scriptName + '\nPage: ' + window.location.href + '\nUserAgent: ' + navigator.userAgent + '\nError: ' + errScript + '\n Reporter comments: none' );
        }
    }
}) ();