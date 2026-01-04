// ==UserScript==
// @name         Sokker - Office hide transfers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide transfers on the office page
// @author       BlueZero
// @match        https://sokker.org/office
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sokker.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480850/Sokker%20-%20Office%20hide%20transfers.user.js
// @updateURL https://update.greasyfork.org/scripts/480850/Sokker%20-%20Office%20hide%20transfers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var aHiddenTransfers = JSON.parse( localStorage.getItem("aHiddenTransfers") );
    if ( aHiddenTransfers == null ) aHiddenTransfers = {};
    $('div.h5.title-block-2.text-primary').each( function(){
        if ( $(this).text() == 'Outbid offers:' )
        {
            var oThis = this;
            while( $(oThis).next().length > 0 )
            {
                oThis = $(oThis).next();
                if ( $(oThis).find('.text-muted').length > 0 )
                {
                    var iPID = $(oThis).find('a[href^=player]').attr('href').split('player/PID/')[1];
                    $(oThis).find('.text-muted:last').append('<i class="fa-regular fa-circle-xmark hideTransfer" data-pid="'+iPID+'" style="cursor:pointer">&#9447;</i>');
                }
            }
        }
    } );
    $('.hideTransfer').click( function() {
        $(this).parents('.row').hide();
        aHiddenTransfers[ $(this).data('pid') ] = new Date();
        localStorage.setItem("aHiddenTransfers", JSON.stringify(aHiddenTransfers));
    } );

    var aExisting = [];
    $('.hideTransfer').each( function(){
        aExisting.push( $(this).data('pid') );
        if ( aHiddenTransfers[$(this).data('pid')] != null )
        {
            $(this).parents('.row').hide();
        }
    } );

    for ( var i in aHiddenTransfers )
    {
        if ( aExisting.indexOf() == -1 )
        {
            delete aHiddenTransfers[ i ];
        }
    }

})();