// ==UserScript==
// @name         NoMoRickRoll
// @namespace    www.StuffBySpencer.com
// @version      0.3
// @description  Stop That Rickroll!
// @author       StuffBySpencer
// @include      https://www.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20997/NoMoRickRoll.user.js
// @updateURL https://update.greasyfork.org/scripts/20997/NoMoRickRoll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var linkList = document.getElementsByTagName( 'a' );
    
    for( var i = 0; i < linkList.length; i++ ){
        
        var link = linkList[ i ].href.toString();
    
        if( link.indexOf( 'dQw4w9WgXcQ' ) > -1 || link.indexOf( 'X9NOzYMLfmM' ) > -1 || link.indexOf( '6_b7RDuLwcI' ) > -1  || link.indexOf( 'm2ATf01v4hw' ) > -1  || link.indexOf( 'IC5YozmvPpM' ) > -1 || link.indexOf( 'IAISUDbjXj0' ) > -1 || link.indexOf( 'rZRb_JeBLus' ) > -1 || link.indexOf( '9NcPvmk4vfo' ) > -1 || link.indexOf( 'VzuDnbjIhbg' ) > -1 || link.indexOf( 'DLzxrzFCyOs' ) > -1 || link.indexOf( 'dQw4w9WgXcT' ) > -1 || link.indexOf( 'dQw4w9WgXcQ' ) > -1 || link.indexOf( 'dQw4w9WgXcR' ) > -1 ){
        
            linkList[ i ].innerHTML = linkList[ i ].innerHTML + '<p style="background-color: #333; color: #eee; font-weight: bold; font-size: 1.23em; font-style: italic; display: inline;" >!POSSIBLE RICKROLL!</p>';
        
        }else if( link.indexOf( 'TMjyJfqOlbI' ) > -1 ){
        
            linkList[ i ].innerHTML = linkList[ i ].innerHTML + '<p style="background-color: #eee; color: #333; font-weight: bold; font-size: 1.23em; font-style: italic; display: inline;" >!POSSIBLE DANK RICKETY-ROLLER!</p>';
        
        }else if( link.indexOf( 'S65ykNd9D7c' ) > -1 ){
        
            linkList[ i ].innerHTML = linkList[ i ].innerHTML + '<p style="background-color: #eee; color: #333; font-weight: bold; font-size: 1.23em; font-style: italic; display: inline;" >!POSSIBLE RICKROLL! [ but a live one ]</p>';
        
        }
        
    }
    
})();