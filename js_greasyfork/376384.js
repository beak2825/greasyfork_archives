// ==UserScript==
// @name         PouchBee+
// @namespace    none
// @version      2019.01.05.2304ß
// @description  Clean up the PouchBee UI
// @supportURL   https://Discord.me/TheShoeStore
// @author       technical13
// @match        https://itembrowser.com/pouchbee.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376384/PouchBee%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/376384/PouchBee%2B.meta.js
// ==/UserScript==
// jshint esversion: 6

var isDebug = true;
var intVerbosity = 9;
const ver = '2019.01.05.2304ß';
const scriptName = 'PouchBee+ v' + ver;

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

const intParamsStart = ( document.URL.indexOf( '?' ) + 1 );
const strParams = document.URL.substring( intParamsStart, ( document.URL.includes( '#' ) ? document.URL.indexOf( '#' ) : document.URL.length ) );
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

Function.prototype.swap = function ( dlItem ) {
    log( 4, 'log', 'Function.swap received: %o', dlItem );
    dlItem = $( 'dl#' + dlItem )[ 0 ];
    const domItemId = dlItem.children[ 0 ];
    const domItemSaved = domItemId.children[ 0 ];
    var strItemId = domItemId.innerHTML.substr( 0, domItemId.innerHTML.indexOf( ' ' ) );
    var strItemSaved = domItemSaved.innerHTML;

    domItemSaved.color = ( domItemSaved.color === 'red' ? 'green' : 'red' );
    log( 4, 'log', 'Function.swap toggled color from %o to %o', ( domItemSaved.color === 'red' ? 'green' : 'red' ), ( domItemSaved.color === 'red' ? 'green' : 'red' ) );

    domItemSaved.innerHTML = strItemId;
    log( 4, 'log', 'Function.swap set domItemSaved.innerHTML to: %o', strItemId );

    domItemId.innerHTML = domItemId.innerHTML.replace( strItemId, strItemSaved );
    log( 4, 'log', 'Function.swap replaced strItemId (%o) with strItemSaved (%o) giving: %o', strItemId, strItemSaved, domItemId.innerHTML );
};
Function.prototype.save = function ( dlItem ) {
    log( 4, 'log', 'Function.save received: %o', dlItem );

    $( 'input#' + dlItem ).prop( 'disabled', true );
    log( 4, 'log', 'Function.save disabled the [Save] button.' );

    dlItem = $( 'dl#' + dlItem )[ 0 ];
    const domItemId = dlItem.children[ 0 ];
    const domItemSaved = domItemId.children[ 0 ];
    var strItemId = domItemId.innerHTML.substr( 0, domItemId.innerHTML.indexOf( ' ' ) );

    domItemSaved.color = 'green';
    log( 4, 'log', 'Function.save set domItemSaved.color to: green' );

    domItemSaved.innerHTML = strItemId;
    log( 4, 'log', 'Function.save set domItemSaved.innerHTML to: %o', strItemId );

    domItemId.innerHTML = domItemId.innerHTML.replace( strItemId, '' );
    log( 4, 'log', 'Function.save cleared domItemId.innerHTML' );
};

( function() {
    log( 0, 'info', 'Script loaded.' );

    arrParamSets.forEach( function( strParam ) {
        let arrParam = strParam.split( '=' );
        let strParamName = ( arrParam[ 0 ].toLowerCase() || '' );
        if ( strParamName === 'debug' || strParamName === 'verbosity' ) { objParams.debug = isDebug; objParams.verbosity = intVerbosity; }
        switch ( strParamName ) {
            case 'uid' :
                log( 2, 'log', 'Got ?&uid= as: %s', arrParam[ 1 ] );
                objParams.uid = arrParam[ 1 ];
                log( 3, 'log', 'Set objParams.uid to: %s', objParams.uid );
                break;
            case 'cid' :
                log( 2, 'log', 'Got ?&cid= as: %s', arrParam[ 1 ] );
                objParams.cid = arrParam[ 1 ];
                log( 3, 'log', 'Set objParams.cid to: %s', objParams.cid );
                break;
            default:
        }
    } );

    $( 'form[action="pouchbee.php"]' ).find( 'input[type="submit"]' ).remove();

    var domGo = document.createElement( 'input' );
    domGo.type = 'submit';
    domGo.value = 'Go';

    var domSelf = document.createElement( 'input' );
    domSelf.type = 'submit';
    domSelf.value = 'Selfcheck';
    domSelf.setAttribute( 'onclick', '$( \'input[name="cid"]\' ).val( \'' + objParams.cid + '\' );$( \'form[action="pouchbee.php"]\' ).submit();' );

    $( 'input[name="cid"]' ).after( domSelf );
    $( 'input[name="cid"]' ).after( domGo );

    $( 'section#itemgroup dl' ).each( ( n, dlItem ) => {
        const domItemId = dlItem.children[ 0 ];
        const domItemSaved = domItemId.children[ 0 ];
        var intInPouch = parseInt( domItemId.innerHTML.substr( 0, domItemId.innerHTML.indexOf( ' ' ) ) );
        var intSaved = ( parseInt( domItemSaved.innerHTML.substr( 0, domItemSaved.innerHTML.indexOf( ' ' ) ) ) || 0 );

        var strItem = dlItem.children[ dlItem.childElementCount - 1 ].innerText.replace( / /g, '' ) + intInPouch;
        dlItem.id = strItem;

        if ( intSaved === 0 ) {
            domItemSaved.color = 'red';
            domItemSaved.innerHTML = '&nbsp;MISSING&nbsp;';
        } else {
            domItemSaved.innerText = domItemSaved.innerText.replace( ' saved by ' + objParams.cid, '' );
        }

        var domSaveSwapButtonDt = document.createElement( 'dt' );
        var domSaveSwapBr = document.createElement( 'br' );
        var domSaveSwapButton = document.createElement( 'input' );
        domSaveSwapButton.type = 'button';
        domSaveSwapButton.id = strItem;
        domSaveSwapButton.value = ( intSaved > 0 ? 'Swap' : 'Save' );
        domSaveSwapButton.setAttribute( 'onclick', 'Function.' + ( intSaved > 0 ? 'swap' : 'save' ) + '( \'' + strItem + '\' );' );

        domSaveSwapButtonDt.append( domSaveSwapBr );domSaveSwapButtonDt.append( domSaveSwapButton );
        dlItem.children[ dlItem.childElementCount - 1 ].after( domSaveSwapButtonDt );
    } );
} )();