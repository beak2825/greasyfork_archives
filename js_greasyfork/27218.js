// ==UserScript==
// @name         [BitoEX] exchange differences
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  add exchange differences in BitoEX
// @author       SSARCandy
// @match        https://www.bitoex.com/charts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27218/%5BBitoEX%5D%20exchange%20differences.user.js
// @updateURL https://update.greasyfork.org/scripts/27218/%5BBitoEX%5D%20exchange%20differences.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $( document ).ajaxComplete(function( event, xhr, settings ) {
        if (xhr.responseJSON.length === 4) {
            const [buy, sell] = xhr.responseJSON.slice(0, 2).map(x => Number(x.replace(/,/g, '')));

            if (!$('#buy-sell').length){
                const html = `<div class="buy col-xs-12 col-md-3 col-lg-3"><h4 class="sync_rate_buy" id="buy-sell"><span>${(buy-sell).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></h4><p>差價 (TWD)</p></div>`;
                $('body > div.container.content > div.rate_row.clearfix.fadeIn.animated').prepend(html);
            } else {
                $('#buy-sell')[0].innerText = (buy-sell).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }
    });
    $('.cal').attr('style','margin-left:0 !important');
})();