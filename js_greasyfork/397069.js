// ==UserScript==
// @name         mobile.de remove advert cars
// @namespace    https://suchen.mobile.de/
// @version      0.1
// @description  on mobile.de this script will remove the advert car to provide a clean search result
// @author       angelo.ndira@gmail.com
// @match        https://suchen.mobile.de/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/397069/mobilede%20remove%20advert%20cars.user.js
// @updateURL https://update.greasyfork.org/scripts/397069/mobilede%20remove%20advert%20cars.meta.js
// ==/UserScript==
/*global window jQuery $ console*/

(function() {
    'use strict';

    $(document).find('div.cBox-body--eyeCatcher').each(function () {
        var rowNode = $(this);
        rowNode.remove();
    });

    $(document).find('div.eyeCatcher').each(function () {
        var rowNode = $(this);
        rowNode.remove();
    });

    $(document).find('hr.eyeCatcher').each(function () {
        var rowNode = $(this);
        rowNode.remove();
    });
})();