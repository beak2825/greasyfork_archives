// ==UserScript==
// @name         ticketmaster-print
// @version      2024-10-01
// @description  Print mobile tickets from ticketmaster
// @author       Kasper Laudrup
// @namespace    stacktrace.dk
// @grant        none
// @license      MIT
// @include      https://www.ticketmaster.tld/user/order/*/view*
// @require      https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/511338/ticketmaster-print.user.js
// @updateURL https://update.greasyfork.org/scripts/511338/ticketmaster-print.meta.js
// ==/UserScript==

/* global $ */

(function() {
    'use strict';
    function print_ticket(title, contents) {
        var printWindow = window.open('', '', 'height=400,width=800');
        printWindow.document.write('<html><head><title>' + title + '</title>');
        printWindow.document.write('<style>span { display: block; }</style>');
        printWindow.document.write('</head><body><div style="width: 100%; text-align:center;">');
        printWindow.document.write('<h1>' + title + '</h1>');
        printWindow.document.write(contents);
        printWindow.document.write('</div></body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    $(document).ready(function() {
        $("#main-content").on('DOMSubtreeModified', "#tickets-tabpanel", function() {
            var title = $('h1').first().text();
            var $qrcode = $(this).find('img').first();
            var $contents = $qrcode.parent().parent().parent().clone();
            var $button = $('#print-ticket');
            if (!$button.length) {
                var $input = $('<input id="print-ticket" type="button" value="Print" style="background-color: white; border: 1px solid; padding: 10px; text-align: center;"/>');
                $input.appendTo($("#tickets-tabpanel"));
                $(document).on('click','#print-ticket',function() {
                    print_ticket(title, $contents.html());
                });
            }
        });
    });
})();
