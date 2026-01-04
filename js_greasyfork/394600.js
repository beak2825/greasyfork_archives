// ==UserScript==
// @name         MVGP++
// @namespace    none
// @version      2020.01.03.1618
// @description  Add fine tuned garden rotation, custom garden sizes, and show/hide buttons for toolbox/type box!
// @author       technical13
// @supportURL   https://discord.me/TheShoeStore
// @match        http://gardenpainter.ide.sk/paint.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394600/MVGP%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/394600/MVGP%2B%2B.meta.js
// ==/UserScript==
// jshint esversion: 6

var isDebug = false;
var intVerbosity = 0;
const ver = '2020.01.03.1618';
const scriptName = 'MVGP++ v' + ver;

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

    document.getElementById( 'permalinktext' ).align = 'right';

    var toggleToolbox = document.createElement( 'input' );
    toggleToolbox.id = 'toggleToolbox';
    toggleToolbox.type = 'button';
    toggleToolbox.setAttribute( 'class', 'btnToggle' );
    toggleToolbox.title = 'Toggle display of types box.';
    toggleToolbox.value = 'Hide Toolbox';
    toggleToolbox.style = 'float: left;';

    var toggleTypes = document.createElement( 'input' );
    toggleTypes.id = 'toggleTypes';
    toggleTypes.type = 'button';
    toggleTypes.setAttribute( 'class', 'btnToggle' );
    toggleTypes.title = 'Toggle display of types box.';
    toggleTypes.value = 'Hide Types';
    toggleTypes.style = 'float: right;';

    var toggleButtons = document.createElement( 'div' );
    toggleButtons.id = 'toggleButtons';
    toggleButtons.append( toggleToolbox );
    toggleButtons.append( toggleTypes );

    document.getElementById( 'maptiles' ).append( toggleButtons );

    var arrToggleBtns = document.getElementsByClassName( 'btnToggle' );
    for ( var i = 0; i < arrToggleBtns.length; i++ ) {
        arrToggleBtns[ i ].addEventListener( 'click', function ( event ) {
            var isHideShow = event.target.value.split( ' ' )[ 0 ];
            var forBtn = event.target.value.split( ' ' )[ 1 ];
            try {
                var doHideShow = ( isHideShow === 'Hide' ? 'Show' : 'Hide' );
                event.target.value = doHideShow + ' ' + forBtn;
                if ( forBtn === 'Toolbox' ) {
                    document.getElementById( 'toolbox' ).style.display = ( isHideShow === 'Hide' ? 'none' : 'inline-block' );
                } else if ( forBtn === 'Types' ) {
                    document.getElementById( 'munzee-types' ).style.display = ( isHideShow === 'Hide' ? 'none' : 'inherit' );
                }
            } catch ( errToggle ) {
                log( 0, 'error', 'Failed while attempting to %s %o\n\t: %o', isHideShow, forBtn, errToggle );
            }
        } );
    }

    var customGrid = document.createElement( 'img' );
    customGrid.id = 'customGrid';
    customGrid.setAttribute( 'class', 'btn' );
    customGrid.width = '50'; customGrid.height = '50';
    customGrid.title = 'Grid size ? × ?';
    customGrid.src = 'https://cdn.discordapp.com/attachments/662752932151820308/662772347174125568/MVGP_Custom_Size.png';
    document.querySelectorAll( 'div#toolbox img.btn' )[ 8 ].after( customGrid );

    document.getElementById( 'customGrid' ).addEventListener( 'click', function ( event ) {
        var askSize = prompt( 'Grids must have matching widths and heights.\nGrids larger than 120×120 may not load well.\n\n\tWhat size would you like your grid?', 120 );
        n = parseInt( askSize );
        if ( isNaN( n ) ) {
            alert( '"' + askSize + '" is not a number. Please try again and enter a single number.' );
        } else if ( n > 120 ) {
            var amSure = confirm( '"' + n + '×' + n + '" is greater than 120×120.\nGrids larger than 120×120 are more likely to crash your browser.\n\n\tARE YOU SURE YOU WANT TO TRY?' );
            if ( amSure ) {
                setupCrosses();
                setupPins();
                setGridSize( n );
            }
        } else {
            setupCrosses();
            setupPins();
            setGridSize( n );
        }
    } );//*/

    var rotateRightOne = document.createElement( 'img' );
    rotateRightOne.id = 'rotateRightOne';
    rotateRightOne.setAttribute( 'class', 'btn' );
    rotateRightOne.title = 'Rotate the grid right by 1 degree.';
    rotateRightOne.src = 'https://cdn.discordapp.com/attachments/662752932151820308/662753267276841035/grid_rotate4.png';
    rotateRightOne.setAttribute( 'onclick', 'rotateGridRight(1)' );
    document.querySelectorAll( 'div#toolbox img.btn' )[ 5 ].after( rotateRightOne );

    var rotateLeftOne = document.createElement( 'img' );
    rotateLeftOne.id = 'rotateLeftOne';
    rotateLeftOne.setAttribute( 'class', 'btn' );
    rotateLeftOne.title = 'Rotate the grid left by 1 degree.';
    rotateLeftOne.src = 'https://cdn.discordapp.com/attachments/662752932151820308/662753258221076490/grid_rotate3.png';
    rotateLeftOne.setAttribute( 'onclick', 'rotateGridLeft(1)' );
    document.querySelectorAll( 'div#toolbox img.btn' )[ 4 ].before( rotateLeftOne );
} )();