// ==UserScript==
// @name         Javbooks
// @namespace    http://tampermonkey.net/
// @version      1.0.0.1
// @description  try to take over the world!
// @author       Leo Chan
// @require      //ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js
// @match        *://*.javbooks.com/*
// @match        *://*.jmvbt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40720/Javbooks.user.js
// @updateURL https://update.greasyfork.org/scripts/40720/Javbooks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if( jQuery( '#PoShow_Box .Po_topic' ).length > 0 ){
       jQuery( '#PoShow_Box .Po_topic a' ).each( function(){
           jQuery( this ).attr( 'target', '_blank' );
       } );
    }
})();