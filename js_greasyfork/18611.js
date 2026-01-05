// ==UserScript==
// @name         Open All Order Items
// @namespace    PXgamer
// @version      0.1
// @description  Open all order items
// @author       PXgamer
// @match        *caramel/orderitems*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18611/Open%20All%20Order%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/18611/Open%20All%20Order%20Items.meta.js
// ==/UserScript==

var url = "";

(function() {
    'use strict';

    $('div.pageHeader div.toolbar ul.horizontalList.buttons').append(
        '<li>' +
             '<a class="btn" id="openAllBtn">Open All</a>' +
        '</li>'
    );

    $('#openAllBtn').click(function () {
        $('table#list tbody tr').each(function () {
            url = $(this).attr('data-edit-href');
            open(url);
            console.log(url);
        });
    });
})();