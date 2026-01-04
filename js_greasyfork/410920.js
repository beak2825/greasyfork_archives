// ==UserScript==
// @name         Xero Mobile Responsive Addon
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  notifies you as soon as there is a new ticket!
// @author       Swaight
// @match        https://xero.gg/neocortex/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/410920/Xero%20Mobile%20Responsive%20Addon.user.js
// @updateURL https://update.greasyfork.org/scripts/410920/Xero%20Mobile%20Responsive%20Addon.meta.js
// ==/UserScript==

(function() {
    'use strict';

function setResponsiveTable(){
    if($('.col-3').length > 0){
        return;
    }

    if($('.col-md-6').length == 2 && $(window).width() < 1428){
        $('.col-md-6')[1].className = 'col-sx-6';
        $('.col-md-6')[0].className = 'col-sx-6';
        
        $('.col-sx-6').each(function( index ) {
          if(index == 1){
            $(this).css("margin-top", "25px");
          }
        });

        $('.px-3').each(function( index ) {
          if($(this).text() == 'Name'){
            $(this).css("width", "250px");
          }
        });
    }
    else if($('.col-sx-6').length == 2 && $(window).width() >= 1428) {

        $('.col-sx-6').each(function( index ) {
          if(index == 1){
            $(this).css("margin-top", "");
          }
        });
        
        $('.col-sx-6')[1].className = 'col-md-6';
        $('.col-sx-6')[0].className = 'col-md-6';

        $('.px-3').each(function( index ) {
          if($(this).text() == 'Name'){
            $(this).css("width", "");
          }
        });
    }
}

setInterval(setResponsiveTable, 100);
})();