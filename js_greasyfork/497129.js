// ==UserScript==
// @name         Propertymarket Spy
// @namespace    el_profesor
// @version      0.4
// @description  Know your properties
// @author       el_profesor
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      tornbay.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497129/Propertymarket%20Spy.user.js
// @updateURL https://update.greasyfork.org/scripts/497129/Propertymarket%20Spy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addButton();

    window.onpopstate = function(event) {
     addButton();
    };


})();

function addButton(){
     setTimeout(function() {
        $('<br /><div id="spy-enable-btn" class="torn-btn btn-big">Spy</div>').insertBefore('.market-table');

        $('#spy-enable-btn').click((e) => {
            upload();
        });
    }, 1000);
}

function upload(){

    if ( $( ".users-list" ).length ) {
       let page = new URL(location.href).searchParams.get('step');
        let html = $('.users-list').html();
        let data = JSON.stringify ( {page:page, list_string: html} )
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://tornbay.com/apps/estatestalking/index.php",
            data: data,
            headers:    {
                "Content-Type": "application/json"
            },
            onload: function(response) {
              //console.log(response.responseText);
            },
        });
        $( '<div class="info-msg-cont  border-round m-top10 r5980"><div class="info-msg border-round"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round" role="alert" aria-live="assertive">Exported properties</div></div></div></div>' ).insertAfter( ".info-msg-cont" );

    }
}

