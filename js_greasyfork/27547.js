// ==UserScript==
// @name        Promo Reviews @MySKU.ru
// @description Adds "promo" class to promo review "div" elements
// @namespace   https://sourceforge.net/u/van-de-bugger/
// @include     http://mysku.ru/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27547/Promo%20Reviews%20%40MySKUru.user.js
// @updateURL https://update.greasyfork.org/scripts/27547/Promo%20Reviews%20%40MySKUru.meta.js
// ==/UserScript==

/**
    Calls func for each element of the list. list can be either array or NodeList object (which is
    array-like but does not have forEach method). The func is called with 3 arguments: element,
    index, and list.
**/
function forEach( list, func ) {
    if ( list != null ) {
        for ( var i = 0; i < list.length; ++ i ) {
            func( list[ i ], i, list );
        };
    };
};

var topics = document.getElementsByClassName( "topic" );
forEach( topics, function ( topic ) {
    var promo = topic.querySelectorAll( "ul.category-list a.list-item-link[href$=\"promo-reviews\"]" );
    if ( promo.length > 0 ) {
        topic.classList.add( "promo" );
    };
} );

/* end of file */