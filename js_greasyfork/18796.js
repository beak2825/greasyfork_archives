// ==UserScript==
// @name         Quick Caramel - Releases
// @namespace    PXgamer
// @version      0.1
// @description  Some quick buttons for order items sorting
// @author       PXgamer
// @match        *caramel/releases*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18796/Quick%20Caramel%20-%20Releases.user.js
// @updateURL https://update.greasyfork.org/scripts/18796/Quick%20Caramel%20-%20Releases.meta.js
// ==/UserScript==

var dataInfoQuery = "";

(function() {
    'use strict';

    $('div.pageHeader div.toolbar ul.horizontalList.buttons').append(
        '<li class="borderLeft">' +
             '<a class="btn btn-info quickCaramelBtn" style="padding: 0 2px; min-width: 0px;" data-info-query="releaseTimeFrame=1+day(s)">R 1D</a>' +
        '</li>' +
        '<li>' +
             '<a class="btn btn-info quickCaramelBtn" style="padding: 0 2px; min-width: 0px;" data-info-query="releaseTimeFrame=1+week(s)">R 1W</a>' +
        '</li>' +
        '<li>' +
             '<a class="btn btn-info quickCaramelBtn" style="padding: 0 2px; min-width: 0px;" data-info-query="releaseTimeFrame=1+month(s)">R 1M</a>' +
        '</li>' +
        '<li>' +
             '<a class="btn btn-info quickCaramelBtn" style="padding: 0 2px; min-width: 0px;" data-info-query="releaseTimeFrame=1+year(s)">R 1Y</a>' +
        '</li>'
    );

    $('.quickCaramelBtn').click(function () {
        dataInfoQuery = $(this).attr('data-info-query');
        window.location = "http://caramel/releases?" + dataInfoQuery;
    });
})();