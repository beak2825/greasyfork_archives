// ==UserScript==
// @name         MySpecialZee
// @namespace    none
// @version      2019.07.16.2136
// @description  New layout for better view with filter
// @author       technical13
// @match        https://www.munzee.com/m/*/specials*
// @supportUTL   https://discord.me/TheShoeStore
// @downloadURL https://update.greasyfork.org/scripts/382154/MySpecialZee.user.js
// @updateURL https://update.greasyfork.org/scripts/382154/MySpecialZee.meta.js
// ==/UserScript==
// jshint esversion: 6
// Based on NewLayoutForSpecials by CzPeet - https://greasyfork.org/en/scripts/373789-newlayoutforspecials

var isDebug = false;
var intVerbosity = 0;
const ver = '2019.07.16.2136';
const scriptName = 'MySpecialZee v' + ver;

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

var specials = [];

function autocomplete( inp, arr ) {
    /* the autocomplete function takes two arguments, the text field element and an array of possible autocompleted values: */
    var currentFocus;
    /* execute a function when someone writes in the text field: */

    inp.addEventListener( 'input', function( e ) {
        var a, b, i, val = this.value;
        var idx = 0;
        /* close any already open lists of autocompleted values */
        closeAllLists();
        if ( !val ) { return false; }
        currentFocus = -1;
        /* create a DIV element that will contain the items (values): */
        a = document.createElement( 'div' );
        a.setAttribute( 'id', this.id + 'autocomplete-list' );
        a.setAttribute( 'class', 'autocomplete-items' );
        /* append the DIV element as a child of the autocomplete container: */
        this.parentNode.appendChild( a );
        /* for each item in the array... */
        for ( i = 0; i < arr.length; i++ ) {
            /* check if the item contains same letters as the text field value: */
            idx = arr[ i ].toUpperCase().indexOf( val.toUpperCase() );
            if ( idx >= 0 ) {
                /* create a DIV element for each matching element: */
                b = document.createElement( 'div' );
                /* make the matching letters bold: */
                b.innerHTML = arr[ i ];
                b.innerHTML = b.innerHTML.slice( 0, idx ) + '<strong>' + b.innerHTML.slice( idx, idx + val.length ) + '</strong>' + b.innerHTML.slice( idx + val.length );
                /* Prefix a checkbox that will hold the current array item's value and allow toggle: */
                //
                b.innerHTML = '<input type="checkbox" ' +
                    'onClick="var togIco=$(\'#specials-listing>li\').has(\'a[href$=&quot;/\'+this.name+\'/&quot;]\')[0];if(this.checked){togIco.removeAttribute(\'style\');}else{togIco.setAttribute(\'style\',\'display:none;\');}"'
                    + ' class="filter-toggle" name="' + encodeURIComponent( arr[ i ] ).replace( /'/g, '%27' ) + '" title="' + arr[ i ] + '" checked="checked"> ' + b.innerHTML;

                a.appendChild( b );
            }
        }

        updateIcons( val );
    } );

    function addActive( x ) {
        /* a function to classify an item as "active": */
        if ( !x ) return false;
        /* start by removing the "active" class on all items: */
        removeActive( x );
        if ( currentFocus >= x.length ) currentFocus = 0;
        if ( currentFocus < 0 ) currentFocus = ( x.length - 1 );
        /* add class "autocomplete-active": */
        x[ currentFocus ].classList.add( 'autocomplete-active' );
    }

    function removeActive( x ) {
        log( 4, 'log', 'Processing removeActive( \'%o\' )', x );
        /* a function to remove the "active" class from all autocomplete items: */
        for ( var i = 0; i < x.length; i++ ) {
            x[ i ].classList.remove( 'autocomplete-active' );
        }
    }

    function closeAllLists( elmnt ) {
        log( 4, 'log', 'Processing closeAllLists( \'%o\' )', elmnt );
        /* close all autocomplete lists in the document, except the one passed as an argument: */
        var x = document.getElementsByClassName( 'autocomplete-items' );
        for ( var i = 0; i < x.length; i++ ) {
            if ( elmnt != x[ i ] && elmnt != inp ) {
                x[ i ].parentNode.removeChild( x[ i ] );
            }
        }
    }

    function updateIcons( strName ) {
        log( 4, 'log', 'Processing updateIcons( \'%s\' )', strName );
        var IL_items = document.getElementById( 'specials-listing' ).getElementsByTagName( 'li' );
        for ( var i = 0; i < IL_items.length; i++ ) {
            if ( IL_items[ i ].innerText.toUpperCase().indexOf( strName.toUpperCase() ) < 0 ) {
                IL_items[ i ].setAttribute( 'style', 'display: none;' );
            }
            else {
            log( 4, 'log', 'Seeking `%o`: %o', IL_items[ i ].innerText, IL_items[ i ].innerText.toUpperCase().indexOf( strName.toUpperCase() ) );
                IL_items[ i ].removeAttribute( 'style' );
            }
        }
    }

    /* execute a function when someone clicks in the document:
    document.addEventListener( 'click', function( e ) {
        closeAllLists( e.target );
    } );//*/
}

function doitnow() {
    log( 0, 'info', 'Script loaded.' );

    //add inputbox
    $( '.page-header' ).append( '<input id="inputBox4Specials" placeholder="Type here (e.g.: flat)" type="text">' );

    //collect specials
    var UL_container = document.getElementById( 'specials-listing' );
    var IL_items = UL_container.getElementsByTagName( 'li' );

    for ( var sp = 0; sp < IL_items.length; sp++ ) {
        specials.push( IL_items[ sp ].children[ 1 ].children[ 2 ].innerText );
    }

    //create new design
    for ( var i = 0; i < IL_items.length; ++i ) {
        //OLD PART
        var oldIL = IL_items[i];
        var spanElement = oldIL.children[ 0 ].children[ 0 ];
        var imgElement = oldIL.children[ 1 ].children[ 0 ];
        var brElement = oldIL.children[ 1 ].children[ 1 ];
        var pElementText = oldIL.children[ 1 ].children[ 2 ].innerText;
        var href_x = oldIL.children[ 1 ].href;

        //NEW PART
        var newIL = document.createElement( 'li' );

        var textElement = document.createTextNode( ' - ' + pElementText );
        var pElement = document.createElement( 'p' );
        pElement.appendChild( spanElement );
        pElement.appendChild( textElement );

        var aElement = document.createElement( 'a' );
        aElement.href = href_x;
        aElement.appendChild( pElement );

        newIL.appendChild( imgElement );
        newIL.appendChild( brElement );
        newIL.appendChild( aElement );

        //REPLACE
        UL_container.replaceChild( newIL, oldIL );
    }

    //autocomplete
    autocomplete( document.getElementById( 'inputBox4Specials' ), specials );
}

//If page is loaded, we can create elements and collect the specials
doitnow();