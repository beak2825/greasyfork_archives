// ==UserScript==
// @name         Clan Rankings
// @namespace    none
// @version      α2018.12.03.2054
// @description  Want to see where you rank on the clans page? (αlpha version - DO NOT SHARE)
// @author       technical13
// @supportURL   https://discord.me/TheShoeStore
// @match        https://www.munzee.com/clans/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375140/Clan%20Rankings.user.js
// @updateURL https://update.greasyfork.org/scripts/375140/Clan%20Rankings.meta.js
// ==/UserScript==
// jshint esversion: 6

var isDebug = false;
var intVerbosity = 0;
const ver = 'α2018.12.03.2054';
const scriptName = 'Clan Rankings v' + ver;

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

function toBoolean( val ) {
    const arrTrue = [ undefined, null, '', true, 'true', 1, '1', 'on', 'yes' ];
    val = ( typeof( val ) === 'string' ? val.toLowerCase() : val );

    log( 4, 'log', 'toBoolean() is returning: %o', ( arrTrue.indexOf( val ) !== -1 ? true : false ) );
    return ( arrTrue.indexOf( val ) !== -1 ? true : false );
}

const myClan = $( 'div.current-clan a' )[ 0 ].href.replace( 'https://www.munzee.com/clans/', '' ).split( '/' )[ 0 ];
var CR = ( JSON.parse( localStorage.getItem( 'ClanRankings' ) ) || { topClans: -1, myClans: [ ], myRanks: [ ] } );
if ( CR.myClans.length === 0 ) {
    CR.myClans.push( myClan );
    CR.myRanks.push( $( 'div.current-rank h2' )[ 0 ].childNodes[ 2 ].data.match( /#(\d*) \/ \d*/ )[ 1 ] );
    localStorage.setItem( 'ClanRankings', JSON.stringify( CR ) );
}

function filterTable ( intShowTop ) {
    $( 'div.panel table.table > tbody > tr' ).each( function ( i, row ) {
        row.id = $( row ).children( 'td' ).eq( 2 ).children( 'a' )[ 0 ].href.replace( 'https://www.munzee.com/clans/', '' ).split( '/' )[ 0 ];
        /*
///*        Currently failing attempt to add a checkbox to the front of each row
///*        that when checked will add the clan to the localStorage JSON
///*        and when unchecked will remove the clan from the localStorage JSON

        var toggleMyClanInput = document.createElement( 'input' );
        toggleMyClanInput.className = 'clanToggle';
        toggleMyClanInput.type = 'checkbox';
//        toggleMyClanInput.setAttribute( 'style', 'display: none;' );
        toggleMyClanInput.setAttribute( 'onChange', "console.log( 'Checkbox Changed!' );" );
        $( row ).children( 'td' ).eq( 0 )[ 0 ].innerHTML = toggleMyClanInput + $( row ).children( 'td' ).eq( 0 )[ 0 ].innerText;
        */

        if ( CR.myClans.indexOf( row.id ) !== -1 ) {// Followed row
            row.setAttribute( 'style', 'background-color: #CCFFCC;' );// Set background color to light green
            var intCurrentRank = ( i + 1 );
            var intLastRank = CR.myRanks[ CR.myClans.indexOf( row.id ) ];
            var intRankDiff = ( intLastRank - intCurrentRank );// Show change since last visit
            $( row ).children( 'td' ).eq( 0 )[ 0 ].innerText += ( intRankDiff === 0 ? '' : ( intRankDiff > 0 ? ' (+' : ' (-' ) + Math.abs( intRankDiff ) + ')' );
            CR.myRanks[ CR.myClans.indexOf( row.id ) ] = intCurrentRank;
            localStorage.setItem( 'ClanRankings', JSON.stringify( CR ) );
        }

        if ( intShowTop >= 0 && ( i > ( intShowTop - 1 ) && CR.myClans.indexOf( row.id ) === -1 ) ) {
            $( row ).hide();
        }
        else {
            $( row ).show();
        }
    } );
}

( function() {
    'use strict';
    log( 0, 'info', 'Script loaded.' );
    var intShowTop = CR.topClans;

    // Define consts
    //const
    var arrTopDropOptions = [ 0, 3, 5, 10, 20, 100, -1 ];

    // Create elements
    var domTopDropOptionsUL = document.createElement( 'ul' );
    for ( var option in arrTopDropOptions ) {
        var domAddOptionAnchor = document.createElement( 'a' );
        var domAddOptionLI = document.createElement( 'li' );

        domAddOptionAnchor.appendChild( document.createTextNode( arrTopDropOptions[ option ] <= 0 ? ( arrTopDropOptions[ option ] === 0 ? '... only self' : '... all' ) : '... top ' + arrTopDropOptions[ option ].toString() ) );
        if ( arrTopDropOptions[ option ] === intShowTop ) { domAddOptionAnchor.style = 'font-weight: bold;'; }
        domAddOptionAnchor.setAttribute( 'onClick', "localStorage.setItem( 'ClanRankings', " + JSON.stringify( '{"topClans":' + arrTopDropOptions[ option ] + ',"myClans":["' + CR.myClans.join( '","' ) + '"],"myRanks":["' + CR.myRanks.join( '","' ) + '"]}' ) + " );location.reload();" );// Add the click event action
        domAddOptionLI.appendChild( domAddOptionAnchor );
        domTopDropOptionsUL.appendChild( domAddOptionLI );
    }
    var domAddOptionConfigCog = document.createElement( 'b' );
    var domAddOptionConfigAnchor = document.createElement( 'a' );
    var domAddOptionConfigLI = document.createElement( 'li' );
    var domDropdownCaret = document.createElement( 'b' );
    var domTopOptionLink = document.createElement( 'a' );
    var domTopDropdown = document.createElement( 'li' );

    // Set attributes
    domTopDropOptionsUL.className = 'dropdown-menu';
    domAddOptionConfigCog.className = 'fa fa-cog';
    domAddOptionConfigAnchor.setAttribute( 'onClick', "console.warn( 'WIP: Not ready yet.' );" );
    domDropdownCaret.className = 'caret';
    domTopOptionLink.className = 'dropdown-toggle';
    domTopOptionLink.setAttribute( 'data-toggle', 'dropdown' );
    domTopOptionLink.href = '#';
    domTopDropdown.className = 'dropdown';

    // Append children to parents
    domAddOptionConfigAnchor.appendChild( domAddOptionConfigCog );
    domAddOptionConfigAnchor.appendChild( document.createTextNode( ' config' ) );
    domAddOptionConfigLI.appendChild( domAddOptionConfigAnchor );
    domTopDropOptionsUL.appendChild( domAddOptionConfigLI );
    domTopOptionLink.appendChild( document.createTextNode( 'Show Top...' ) );
    domTopOptionLink.appendChild( domDropdownCaret );
    domTopDropdown.appendChild( domTopOptionLink );
    domTopDropdown.appendChild( domTopDropOptionsUL );

    $( 'ul.nav.navbar-nav.pull-left' ).append( domTopDropdown );

    filterTable( intShowTop );

    window.scrollBy( 0, 1 );
} )();