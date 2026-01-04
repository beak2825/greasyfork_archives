// ==UserScript==
// @name         dk+
// @namespace    none
// @version      2019.12.04.2331
// @description  Improve the look of munzee.dk a little
// @author       technical13
// @supportURL   https://discord.me/TheShoeStore
// @match        https://stats.munzee.dk/?*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/392371/dk%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/392371/dk%2B.meta.js
// ==/UserScript==
// jshint esversion: 6

var objDebug = ( GM_getValue( 'debug' ) || { isDebug: false, intVerbosity: 0 } );
var isDebug = objDebug.isDebug;
var intVerbosity = objDebug.intVerbosity;
const ver = '2019.12.04.2331';
const scriptName = 'dk+ v' + ver;
const REFRESH_MINUTES = 15;
var intRefreshSeconds = REFRESH_MINUTES * 60;

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

function countDown( intRawSeconds ) {
    var intSeconds = parseInt( intRawSeconds );
    var intHours = Math.floor( intSeconds / 3600 );
    intSeconds = intSeconds - ( intHours * 3600 );
    var intMinutes = Math.floor( intSeconds / 60 );
    intSeconds = intSeconds - ( intMinutes * 60 );
    var strCountDown = ( intHours > 0 ? intHours.toLocaleString() +
                        ' hour' + ( intHours === 1 ? '' : 's' ) : '' ) +
        ( intMinutes > 0 ? ( intHours > 0 ? ', ' : '' ) +
         intMinutes.toLocaleString() + ' minute' + ( intMinutes === 1 ? '' : 's' ) : '' ) +
        ( intSeconds > 0 ? ( intHours > 0 || intMinutes > 0 ? ', ' : '' ) +
         intSeconds.toLocaleString() + ' second' + ( intSeconds === 1 ? '' : 's' ) : '' );

    log( 4, 'log', 'countDown( %i ) is returning: %s', intRawSeconds, strCountDown );
    return strCountDown;
}

function levelLink( intLevel ) {
    var currLevel = parseInt( document.location.search.split( '&level=' )[ 1 ] );
    return '<a href="' + document.location.href.replace( /&level=\d/, '' ) + '&level=' + intLevel + '" style="color: #' + ( intLevel === currLevel ? '00FF00; font-size: larger' : 'FF0000' ) + ';">' + intLevel + '</a>';
}

const intMaxLevels = parseInt( $( 'div#tab-content0 table:first tbody tr:last td:first' ).text() );
const intParamsStart = ( document.URL.indexOf( '?' ) + 1 );
const strParams = document.URL.substr( intParamsStart );
const arrParamSets = strParams.split( '&' );
var arrHighlight = ( GM_getValue( 'arrHighlight' ) || [] );
arrParamSets.forEach( function( strParam ) {
    let arrParam = strParam.split( '=' );
    let strParamName = ( arrParam[ 0 ] || '' );
    let strParamValue = ( decodeURIComponent( arrParam[ 1 ] ) || false );
    log( 2, 'info', 'arrParamSets[] modified from URL with &%s=%s: %s', strParamName, arrParam[ 1 ], strParam );
    if ( strParamName.toLowerCase() === 'debug' ) {
        objDebug.isDebug = toBoolean( arrParam[ 1 ] || !objDebug.isDebug );
        objDebug.intVerbosity = ( objDebug.isDebug ? 9 : 0 );
        log( 2, 'info', 'objDebug filled from URL with &debug=%s: %o', strParamValue, objDebug );
        GM_setValue( 'debug', objDebug );
        log( 0, 'error', 'Debugging mode %s and verbosity level set to: %i', ( objDebug.isDebug ? 'ENABLED' : 'DISABLED' ), objDebug.intVerbosity );
        log( 0, 'error', 'RELOADING PAGE URL: %o', window.location.href.replace( '&' + strParam, '' ) );
        window.location = window.location.href.replace( '&' + strParam, '' );
    }
    else if ( strParamName.toLowerCase() === 'verbosity' ) {
        objDebug.isDebug = true;
        objDebug.intVerbosity = ( strParamValue ? ( parseInt( strParamValue ) < 0 ? 0 : ( parseInt( strParamValue ) > 9 ? 9 : parseInt( arrParam[ 1 ] ) ) ) : 9 );
        log( 2, 'info', 'objDebug filled from URL with &verbosity=%s: %o', strParamValue, objDebug );
        GM_setValue( 'debug', objDebug );
        log( 0, 'error', 'Debugging mode %s and verbosity level set to: %i', ( objDebug.isDebug ? 'ENABLED' : 'DISABLED' ), objDebug.intVerbosity );
        log( 0, 'error', 'RELOADING PAGE URL: %o', window.location.href.replace( '&' + strParam, '' ) );
        window.location = window.location.href.replace( '&' + strParam, '' );
    }
    else if ( strParamName === 'arrNames' ) {
        log( 2, 'info', 'Replacing arrHighlight with: %o', strParamValue );
        arrHighlight = strParamValue.replace( /[\[\]'" ]/g, '' ).split( ',' );
        log( 2, 'info', 'Replaced arrHighlight with: %o', arrHighlight );
        arrHighlight.sort();
        log( 2, 'info', 'Sorted array passed in: %o', ( arrHighlight.length - 1 ), arrHighlight );
        GM_setValue( 'arrHighlight', arrHighlight );
        log( 2, 'info', 'arrParamSets[] filled from URL with &arrNames=%s: %o', strParamValue, arrHighlight );
        log( 2, 'error', 'RELOADING PAGE URL: %o', window.location.href.replace( '&' + strParam, '' ) );
        window.location = window.location.href.replace( '&' + strParam, '' );
    }
    else if ( strParamName === 'addName' ) {
        log( 2, 'info', 'Adding index #%i: %s', arrHighlight.length, strParamValue );
        arrHighlight.push( strParamValue );
        log( 2, 'info', 'Added index #%i creating: %o', ( arrHighlight.length - 1 ), arrHighlight );
        arrHighlight.sort();
        log( 2, 'info', 'Resorted after adding index #%i: %o', ( arrHighlight.length - 1 ), arrHighlight );
        GM_setValue( 'arrHighlight', arrHighlight );
        log( 2, 'info', 'arrParamSets[] added name from URL with &addName=%s: %o', strParamValue, arrHighlight );
        log( 2, 'error', 'RELOADING PAGE URL: %o', window.location.href.replace( '&' + strParam, '' ) );
        window.location = window.location.href.replace( '&' + strParam, '' );
    }
    else if ( strParamName === 'removeName' ) {
        var intNdxToRemove = arrHighlight.indexOf( strParamValue );
        log( 2, 'info', 'Removing index #%i: %s', intNdxToRemove, arrHighlight[ intNdxToRemove ] );
        arrHighlight.splice( intNdxToRemove, 1 );
        log( 2, 'info', 'Removed index #%i leaving: %o', intNdxToRemove, arrHighlight );
        GM_setValue( 'arrHighlight', arrHighlight );
        log( 2, 'info', 'arrParamSets[] removed name from URL with &removeName=%s: %o', strParamValue, arrHighlight );
        log( 2, 'error', 'RELOADING PAGE URL: %o', window.location.href.replace( '&' + strParam, '' ) );
        window.location = window.location.href.replace( '&' + strParam, '' );
    }
    else if ( strParamName === 'getGM' ) {
        log( 0, 'info', '\n\tobjDebug: %o\n\tarrHighlight: %o', objDebug, arrHighlight );
        log( 2, 'error', 'RELOADING PAGE URL: %o', window.location.href.replace( '&' + strParam, '' ) );
        window.location = window.location.href.replace( '&' + strParam, '' );
    }
    else if ( strParamName === 'resetGM' && strParamValue === 'CONFIRM' ) {
        GM_setValue( 'debug', { isDebug: false, intVerbosity: 0 } );
        GM_setValue( 'arrHighlight', [] );
        log( 0, 'error', 'GM has been reset!\n\tobjDebug: %o\n\tarrHighlight: %o\nYou can restore your list of names with:\n%s&arrNames=["%s"]', objDebug, arrHighlight, window.location.href.replace( '&' + strParam, '' ), arrHighlight.join( '","' ) );
        log( 2, 'error', 'RELOADING PAGE URL: %o', window.location.href.replace( '&' + strParam, '' ) );
        window.location = window.location.href.replace( '&' + strParam, '' );}
    else if ( strParamName === 'clearGM' && strParamValue === 'C0NF1RM' ) {
        GM_deleteValue( 'debug' );
        GM_deleteValue( 'arrHighlight' );
        log( 0, 'error', 'GM has been completely cleared!\n\tobjDebug: %o\n\tarrHighlight: %o\nYou can restore your list of names with:\n%s&arrNames=["%s"]', objDebug, arrHighlight, window.location.href.replace( '&' + strParam, '' ), arrHighlight.join( '","' ) );
        log( 2, 'error', 'RELOADING PAGE URL: %o', window.location.href.replace( '&' + strParam, '' ) );
        window.location = window.location.href.replace( '&' + strParam, '' );
    }
    else if ( strParamName.toLowerCase() === 'level' ) {
        let intStartLevelTable = parseInt( strParamValue );
        if ( intStartLevelTable > intMaxLevels ) {
            log( 2, 'error', 'RELOADING PAGE URL: %o', window.location.href.replace( 'level=' + intStartLevelTable, 'level=' + intMaxLevels ) );
            window.location = window.location.href.replace( 'level=' + intStartLevelTable, 'level=' + intMaxLevels );
        }
        log( 2, 'info', 'intStartLevelTable is: %o', intStartLevelTable );
    }
} );

log( 1, 'warn', 'Debug mode is on with verbosity level: %o', intVerbosity );
log( 1, 'groupCollapsed', 'Verbosity options: (click to expand)' );
log( 1, 'log', '\n\t1) Summary\n\t2) Parameters retrieved from URL\n\t3) Variables set to objParams\n\t4) Function returns\n\t9) ALL debugging info and this notice.' );
log( 1, 'groupEnd' );

function classRows( tblRow, index, array ) {
    let strPlayerName = tblRow.querySelector( 'td' ).innerText;
    let strPlayerNameLC = ( strPlayerName.replace( strPlayerName.substr( 0, 1 ), strPlayerName.substr( 0, 1 ).toLowerCase() ) || '' );
    let lcPlayerName = strPlayerName.toLowerCase();
    if ( lcPlayerName !== 'username' && lcPlayerName !== 'total' && lcPlayerName.split( ' ' )[ 0 ] !== 'what' &&
        lcPlayerName !== 'level' && lcPlayerName !== 'clan rank' && isNaN( strPlayerName ) ) {
        $( tblRow ).addClass( 'playerRow ' + strPlayerName );
        tblRow.innerHTML = '<td style="text-align: center;"><a href="' + document.location.href + '&' +
            ( arrHighlight.indexOf( strPlayerName ) !== -1 || arrHighlight.indexOf( strPlayerNameLC ) !== -1 ? 'removeName' : 'addName' ) +
            '=' + strPlayerName + '" style="font-weight: bold; font-size: larger; color: #' +
            ( arrHighlight.indexOf( strPlayerName ) !== -1 || arrHighlight.indexOf( strPlayerNameLC ) !== -1 ? 'FF0000' : '00FF00' ) +
            ';">' +
            ( arrHighlight.indexOf( strPlayerName ) !== -1 || arrHighlight.indexOf( strPlayerNameLC ) !== -1 ? 'X' : '+' ) +
            '</a></td>' + tblRow.innerHTML;
    }
    else if ( lcPlayerName === 'total' ) {
        tblRow.className = 'totalRow';
        tblRow.innerHTML = '<td class="memberCount" style="text-align: center; font-weight: bold;">&nbsp;</td>' + tblRow.innerHTML;
    }
    else {
        tblRow.innerHTML = '<td>&nbsp;</td>' + tblRow.innerHTML;
    }
    if ( arrHighlight.indexOf( strPlayerName ) !== -1 || arrHighlight.indexOf( strPlayerNameLC ) !== -1 ) {
        $( tblRow ).addClass( 'highlight' );
        Array.from( tblRow.children ).forEach( rowCell => { rowCell.align = 'center'; } );
    }
}

$( 'head' )
    .append( '<style type="text/css">' +
            'table.tblRank { width: 95%; margin: 0px auto; text-align: center; }' +
            'td.empty { width: 20px; }' +
            'tr.highlight { font-size: larger; font-weight: bold; border: 2px solid rgb(0, 255, 0); }' +
            '</style>' );

( function() {
    'use strict';

    $( 'ul.tabs > li > div > table > tbody > tr > td > h2 > b > u' )
        .html( 'What the clan needs for level ' + levelLink( 1 ) + ' - ' + levelLink( 2 ) +
              ' - ' + levelLink( 3 ) + ' - ' + levelLink( 4 ) + ' - ' + levelLink( 5 ) +
              ( intMaxLevels > 5 ? ' - ' + levelLink( 6 ) : '' ) +
              ( intMaxLevels > 6 ? ' - ' + levelLink( 7 ) : '' ) +
              ( intMaxLevels > 7 ? ' - ' + levelLink( 8 ) : '' ) +
              ( intMaxLevels > 8 ? ' - ' + levelLink( 9 ) : '' ) +
              ( intMaxLevels > 9 ? ' - ' + levelLink( 10 ) : '' ) +
              ':' );

    $( 'div#tab-content' + intMaxLevels + ' table:last' ).nextUntil().remove();
    var strLastUpdate = $( 'div#tab-content' + intMaxLevels + ' table:last' )[ 0 ].nextSibling.data.trim();
    var objUpdated = ( new Date( $( 'div#tab-content' + intMaxLevels + ' table:last' )[ 0 ].nextSibling.data.trim().replace( /(Last update: |MHQ time)/g, '' ) ) ).valueOf();
    var intOffset = Math.floor( ( new Date( document.lastModified ).valueOf() - objUpdated ) / 60000 );
    intOffset = ( ( ( intOffset - ( intOffset % 60 ) ) / 60 ) * 60 ) * 60000;
    var intSecondsSinceUpdated = Math.floor( ( ( new Date() ).valueOf() - objUpdated - intOffset ) / 1000 );

    for ( var intLevelTable = 0; intLevelTable <= intMaxLevels; intLevelTable++ ) {
        $( 'div#tab-content' + intLevelTable + ' table:last' ).attr( 'id', 'tblRank' + intLevelTable ).addClass( 'tblRank' );
        if ( intLevelTable === 0 ) { $( 'table#tblRank0 tbody tr:first' ).remove(); }
        var tblRank = $( 'table#tblRank' + intLevelTable );
        tblRank.prev().remove();
        tblRank.nextUntil().remove();
        var strTableHTML = tblRank.html();
        var intCloseRow = strTableHTML.lastIndexOf( '</tr></tbody>' );
        strTableHTML = strTableHTML.substr( 0, intCloseRow ) + '<td class="empty">&nbsp;</td><td>' + strLastUpdate + '</td><td class="empty">&nbsp;</td><td class="lastUpdated">Refresh in: ' + countDown( intRefreshSeconds - intSecondsSinceUpdated ) + '</td></tr></tbody>';
        tblRank.html( strTableHTML );
        var lastUpdated = $( 'td.lastUpdated' );
        var intRefreshCellWidth = lastUpdated.width();
        lastUpdated.width = intRefreshCellWidth + 'px';
        tblRank[ 0 ].nextSibling.remove();
        var intRank = parseInt( $( 'table#tblRank' + intLevelTable + ' tbody tr td:eq( 1 )' ).text() );
        $( 'table#tblRank' + intLevelTable + ' tbody tr td:eq( 1 )' ).replaceWith( '<td class="empty">&nbsp;</td><td>' + intRank + '</td>' );

        Array.from( $( 'div#tab-content' + intLevelTable + ' table tbody tr' ) ).forEach( classRows );
        var intClanMembers = ( $( 'tr.playerRow' ).length / 11 );
        $( 'td.memberCount' ).text( intClanMembers );

        window.scrollTo( { top: window.screen.height, behavior: 'smooth' } );

    }

    setInterval( () => {
        intSecondsSinceUpdated = Math.floor( ( ( new Date() ).valueOf() - objUpdated - intOffset ) / 1000 );
        log( 5, 'log', '%i (%i:%i) < %i', intSecondsSinceUpdated, Math.floor( intSecondsSinceUpdated / 60 ), ( intSecondsSinceUpdated % 60 ), intRefreshSeconds );
        if ( intSecondsSinceUpdated < intRefreshSeconds ) {
            $( 'td.lastUpdated' ).text( 'Refresh in: ' + countDown( intRefreshSeconds - intSecondsSinceUpdated ) );
            if ( $( 'td.lastUpdated' ).width() > intRefreshCellWidth ) {
                intRefreshCellWidth = $( 'td.lastUpdated' ).width();
                $( 'td.lastUpdated' )[ 0 ].style.width = intRefreshCellWidth + 'px';
            }
        } else {
            $( 'td.lastUpdated' ).text( 'Reloading...' );
            window.location.reload();
        }
    }, 1000 );
} )();