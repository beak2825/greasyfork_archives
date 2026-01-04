// ==UserScript==
// @name         dtf goto comments
// @namespace    http://tampermonkey.net/
// @version      0.2
// @icon         
// @homepageURL  https://dtf.ru/u/39402
// @description  Кнопка прыжка к комментам
// @author       AX
// @match        https://dtf.ru/*
// @run-at       document-start
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license Don't use it
// @downloadURL https://update.greasyfork.org/scripts/481894/dtf%20goto%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/481894/dtf%20goto%20comments.meta.js
// ==/UserScript==
 
$( document ).ready(function() {
  
  setInterval(function() {
    if ( $( '.content--full' ).length > 0 ){
      if ( $( '.content-footer-clone' ).length == 0 ){
        if ( $( '.content-footer:not(.content-footer-clone)' ).find( ':visible' ).length > 0 ){
          $( '.content--full div, .content--full figure' ).first().after( $( '.content-footer:not(.content-footer-clone)' ).clone().addClass( 'content-footer-clone' ) );
        }
      }
    }
  }, 1500);
 
});