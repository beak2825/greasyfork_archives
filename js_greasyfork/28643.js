// ==UserScript==
// @name         WalMart
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Walmart order page improved
// @author       You
// @match        https://seller.walmart.com/order-management/details
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28643/WalMart.user.js
// @updateURL https://update.greasyfork.org/scripts/28643/WalMart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanUp(text) {
        var wrapped = $("<div>" + text + "</div>");
        wrapped.find('.wm-polines-table-status-messages').remove();
        wrapped.find('img').remove();
        wrapped.find('a').remove();
        wrapped.find('.details-price-container').remove();

        var items = [7, 7, 7, 7, 7, 5, 3, 0];
        for(var i in items) {
            wrapped.find('.ui-grid-header:last .ui-grid-header-cell-row div[class*="ui-grid-coluiGrid-"]').eq(items[i]).remove();
        }

        /* */
        items = [0, 3, 5, 7, 8, 9, 10, 11];
        var cells = wrapped.find('.ui-grid-viewport:last .ui-grid-row div[class*="ui-grid-coluiGrid-"]');
        var length = wrapped.find('.ui-grid-viewport .ui-grid-row').length;
        for(i = 0; i < length; i++) {
            for(var j in items) {
                cells.eq(items[j] + 12 * i).remove();
            }
        }

        var html = wrapped.html();
        //console.log(html)
        return html;
    }

    function openWindow() {
        var output = cleanUp($('.wm-dashboard-details-modal')[0].outerHTML);
        output += '<link rel="stylesheet" type="text/css" href="https://seller.walmart.com/dist/1489620113632/app/css/app.css" />';
        output += '<style>.grid-loader {background: inherit;} .wm-dashboard-details-modal .ui-grid-cell-contents .product-details {vertical-align: baseline; margin-top: 0; line-height: inherit;}</style>';
        var win = window.open();
        win.document.write(output);
        setTimeout(function() { win.print(); }, 500);
    }

    var isOpened = false, interval;
    function checkOrderPanelOpened() {
        var h3 = $('h3');
        if((h3.length == 7) && (h3[6].outerText == 'Order Details')) {
            isOpened = true;
        }
        else {
            isOpened = false;
        }

        if(isOpened) {
            clearInterval(interval);
            $('.wm-modal-btn-container .progress-btn').before('<button id="MyPrint" class="wm-btn-primary">Print</button>');
            $('#MyPrint').click(function() { openWindow(); });
            $('span.icon-wm-close-noborder:first').click(function() {
                interval = setInterval(checkOrderPanelOpened, 1000);
            });
        }
    }

    interval = setInterval(checkOrderPanelOpened, 1000);
})();