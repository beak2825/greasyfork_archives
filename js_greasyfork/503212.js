// ==UserScript==
// @name         Auction Market Spy
// @namespace    el_profesor
// @version      0.2
// @description  Know your auctions
// @author       el_profesor
// @match        https://www.torn.com/amarket.php*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      tornbay.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503212/Auction%20Market%20Spy.user.js
// @updateURL https://update.greasyfork.org/scripts/503212/Auction%20Market%20Spy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $( '<div class="info-msg-cont auction border-round m-top10 r5980"><div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round" role="alert" aria-live="assertive">Exported Auctions</div></div></div></div>' ).insertAfter('#auction-house-tabs');
    $( '.info-msg-cont.auction').hide();
    upload();

    window.onpopstate = function(event) {
     upload();
    };


})();

function addButton(){
     setTimeout(function() {
        $('<br /><div id="spy-enable-btn" class="torn-btn btn-big">Export Auctions</div>').insertAfter('#auction-house-tabs');

        $('#spy-enable-btn').click((e) => {
            upload();
        });
    }, 1000);
}

function upload(){

  $( '.info-msg-cont.auction').hide();
  setTimeout(function() {

    if ( $( ".items-list-wrap" ).length ) {
        let html = $('.items-list-wrap').html();
        let data = JSON.stringify ( {list_string: html} )
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://tornbay.com/apps/auctionstalking/index.php",
            data: data,
            headers:    {
                "Content-Type": "application/json"
            },
            onload: function(response) {
              console.log(response.responseText);
                $( '.info-msg-cont.auction').show();
            },
        });

    }
  }, 1000);
}