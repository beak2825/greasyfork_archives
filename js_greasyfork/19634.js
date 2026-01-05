// ==UserScript==
// @name         New Cheevos Notification
// @namespace    pxgamer
// @version      0.1
// @description  Notify when a new cheevo is added.
// @author       pxgamer
// @include      *kat.cr*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/19634/New%20Cheevos%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/19634/New%20Cheevos%20Notification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentCount;
    var newCount;
    var returnedData = [];
    var re = /<span class=\"achBadge/ig, matches, ret = [];

    $.ajax({
        type: "GET",
        url: "/achievements/",
        async: false,
        success: function (data) {
            while (matches = re.exec(data.html)) {
                returnedData.push(matches[1]);
            }
        },
        returnData: "json"
    });

    currentCount = GM_getValue("cheevoCurrentCount", returnedData.length);
    GM_setValue("cheevoCurrentCount", returnedData.length);

    if (currentCount < returnedData.length) {
        GM_notification("A new cheevo has been added!",
                        "New Cheevo", "https://kastatic.com/images/achMedal_bronze.jpg",
                        function () { window.location.href = "https://kat.cr/achievements/"; }
                       );
    }
})();
