// ==UserScript==
// @name         Quick Caramel - Order Items
// @namespace    PXgamer
// @version      0.4
// @description  Some quick buttons for order items sorting
// @author       PXgamer
// @match        *caramel/orderitems*
// @match        *caramel/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18954/Quick%20Caramel%20-%20Order%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/18954/Quick%20Caramel%20-%20Order%20Items.meta.js
// ==/UserScript==

var dataInfoQuery = "";

(function() {
    'use strict';

    $('div.pageHeader div.toolbar ul.horizontalList.buttons').append(
        '<li class="borderLeft">' +
             '<a class="btn btn-info quickCaramelBtn" style="padding: 0 2px; min-width: 0px;" data-info-query="statuses=1">RS</a>' +
        '</li>' +
        '<li>' +
             '<a class="btn btn-info quickCaramelBtn" style="padding: 0 2px; min-width: 0px;" data-info-query="statuses=2">RD</a>' +
        '</li>' +
        '<li>' +
             '<a class="btn btn-info quickCaramelBtn" style="padding: 0 2px; min-width: 0px;" data-info-query="statuses=3">ID</a>' +
        '</li>' +
        '<li>' +
             '<a class="btn btn-info quickCaramelBtn" style="padding: 0 2px; min-width: 0px;" data-info-query="statuses=4">RC</a>' +
        '</li>' +
        '<li class="borderLeft">' +
             '<a class="btn btn-warning quickCaramelBtn" style="padding: 0 2px; min-width: 0px;" data-info-query="deliveringIn=1+week(s)">D 1W</a>' +
        '</li>' +
        '<li>' +
             '<a class="btn btn-warning quickCaramelBtn" style="padding: 0 2px; min-width: 0px;" data-info-query="deliveringIn=1+month(s)">D 1M</a>' +
        '</li>' +
        '<li>' +
             '<a class="btn btn-primary quickCaramelBtn" style="padding: 0 2px; min-width: 0px;" data-info-query="expiringIn=1+week(s)">E 1W</a>' +
        '</li>' +
        '<li>' +
             '<a class="btn btn-primary quickCaramelBtn" style="padding: 0 2px; min-width: 0px;" data-info-query="expiringIn=1+month(s)">E 1M</a>' +
        '</li>'
    );

    $('.quickCaramelBtn').click(function () {
        dataInfoQuery = $(this).attr('data-info-query');
        window.location = "http://caramel/orderitems?" + dataInfoQuery;
    });
})();