// ==UserScript==
// @name         Geston TN DB Plus Minus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Expand the range of search in the DB.
// @author       BlueZero
// @match        https://geston.smallhost.pl/sokker/transfers_db.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smallhost.pl
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481082/Geston%20TN%20DB%20Plus%20Minus.user.js
// @updateURL https://update.greasyfork.org/scripts/481082/Geston%20TN%20DB%20Plus%20Minus.meta.js
// ==/UserScript==

function parseQuery(queryString) {
    var query = {};
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
    }
    return query;
}

function bz_changeRange( iAdd, sItem = null )
{
    //console.log( document.location );
    var aGet = parseQuery( document.location.search );
    //console.log( aGet );
    var sURL = document.location.origin + document.location.pathname + '?';
    for ( var i in aGet )
    {
        if ( sItem !== null && i.indexOf(sItem) === -1 )
        {
            sURL += '&'+i+'='+aGet[i];
            continue;
        }
        if ( i.indexOf('min') !== -1 )
        {
            aGet[i] = parseInt( aGet[i] );
            aGet[i] += -iAdd;
        }
        else if ( i.indexOf('max') !== -1 )
        {
            aGet[i] = parseInt( aGet[i] );
            aGet[i] += iAdd;
        }
        sURL += '&'+i+'='+aGet[i];
    }
    document.location = sURL;
}

(function() {
    'use strict';

    $('#results_tab').css('position','relative');
    $('#results_tab').append( '<div style="position:absolute;top:0;right:0"><span class="bzMinus" style="cursor:pointer">-</span> / <span class="bzPlus" style="cursor:pointer"> + </span></div>' );

    if ( $('#results_tab table').length > 0 )
    {
        $('#results_tab table th:eq(2)').append( '<br /><span class="bzMinusOne" data-item="age" style="cursor:pointer">-</span> / <span class="bzPlusOne" data-item="age" style="cursor:pointer"> + </span>' );
        $('#results_tab table th:eq(5)').append( '<br /><span class="bzMinusOne" data-item="sta" style="cursor:pointer">-</span> / <span class="bzPlusOne" data-item="sta" style="cursor:pointer"> + </span>' );
        $('#results_tab table th:eq(6)').append( '<br /><span class="bzMinusOne" data-item="pac" style="cursor:pointer">-</span> / <span class="bzPlusOne" data-item="pac" style="cursor:pointer"> + </span>' );
        $('#results_tab table th:eq(7)').append( '<br /><span class="bzMinusOne" data-item="tec" style="cursor:pointer">-</span> / <span class="bzPlusOne" data-item="tec" style="cursor:pointer"> + </span>' );
        $('#results_tab table th:eq(8)').append( '<br /><span class="bzMinusOne" data-item="pas" style="cursor:pointer">-</span> / <span class="bzPlusOne" data-item="pas" style="cursor:pointer"> + </span>' );
        $('#results_tab table th:eq(9)').append( '<br /><span class="bzMinusOne" data-item="kee" style="cursor:pointer">-</span> / <span class="bzPlusOne" data-item="kee" style="cursor:pointer"> + </span>' );
        $('#results_tab table th:eq(10)').append( '<br /><span class="bzMinusOne" data-item="def" style="cursor:pointer">-</span> / <span class="bzPlusOne" data-item="def" style="cursor:pointer"> + </span>' );
        $('#results_tab table th:eq(11)').append( '<br /><span class="bzMinusOne" data-item="mid" style="cursor:pointer">-</span> / <span class="bzPlusOne" data-item="mid" style="cursor:pointer"> + </span>' );
        $('#results_tab table th:eq(12)').append( '<br /><span class="bzMinusOne" data-item="att" style="cursor:pointer">-</span> / <span class="bzPlusOne" data-item="att" style="cursor:pointer"> + </span>' );
    }

    $('.bzMinus').click( function(){
        bz_changeRange( -1 );
    } );
    $('.bzPlus').click( function(){
        bz_changeRange( +1 );
    } );

    $('.bzMinusOne').click( function(){
        bz_changeRange( -1, $(this).data('item') );
        return false;
    } );
    $('.bzPlusOne').click( function(){
        bz_changeRange( +1, $(this).data('item') );
        return false;
    } );
})();